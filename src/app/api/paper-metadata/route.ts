import { NextResponse } from "next/server";
import { PaperMetadata } from "@/types";

const XAI_API_KEY = process.env.XAI_API_KEY;

// In-memory cache for metadata
const metadataCache = new Map<string, { data: PaperMetadata; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function getCachedMetadata(paperId: string): PaperMetadata | null {
  const cached = metadataCache.get(paperId);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCachedMetadata(paperId: string, data: PaperMetadata) {
  metadataCache.set(paperId, { data, timestamp: Date.now() });
}

function generateFallbackMetadata(title: string, abstract: string | null): PaperMetadata {
  const titleLower = title.toLowerCase();
  const abstractLower = (abstract || "").toLowerCase();
  const combined = titleLower + " " + abstractLower;

  // Basic heuristic classification
  let studyType = "Original Research";
  let rigorLevel: "high" | "medium" | "low" = "medium";
  let claimType: PaperMetadata["claimType"] = "unknown";
  const badges: string[] = [];

  // Detect study type from keywords
  if (combined.includes("meta-analysis") || combined.includes("meta analysis")) {
    studyType = "Meta-Analysis";
    rigorLevel = "high";
    claimType = "meta-analysis";
    badges.push("Meta-Analysis");
  } else if (combined.includes("systematic review")) {
    studyType = "Systematic Review";
    rigorLevel = "high";
    claimType = "review";
    badges.push("Systematic Review");
  } else if (
    combined.includes("randomized") ||
    combined.includes("randomised") ||
    combined.includes("rct")
  ) {
    studyType = "Randomized Controlled Trial";
    rigorLevel = "high";
    claimType = "novel";
    badges.push("RCT");
  } else if (combined.includes("cohort study") || combined.includes("prospective study")) {
    studyType = "Cohort Study";
    rigorLevel = "medium";
    badges.push("Cohort Study");
  } else if (combined.includes("case report") || combined.includes("case series")) {
    studyType = "Case Report";
    rigorLevel = "low";
    badges.push("Case Report");
  } else if (combined.includes("review") && !combined.includes("systematic")) {
    studyType = "Narrative Review";
    rigorLevel = "low";
    claimType = "review";
    badges.push("Review");
  } else if (
    combined.includes("clinical trial") ||
    combined.includes("phase i") ||
    combined.includes("phase ii") ||
    combined.includes("phase iii")
  ) {
    studyType = "Clinical Trial";
    rigorLevel = "high";
    badges.push("Clinical Trial");
  } else if (combined.includes("observational")) {
    studyType = "Observational Study";
    rigorLevel = "medium";
    badges.push("Observational");
  }

  // Detect novelty indicators
  if (
    combined.includes("first") ||
    combined.includes("novel") ||
    combined.includes("new approach") ||
    combined.includes("breakthrough")
  ) {
    if (claimType === "unknown") claimType = "novel";
    if (!badges.includes("Novel Finding")) badges.push("Novel Finding");
  }

  // Detect human vs animal
  if (
    combined.includes("in vivo") ||
    combined.includes("animal model") ||
    combined.includes("mouse") ||
    combined.includes("rat ")
  ) {
    badges.push("Animal Study");
    if (rigorLevel === "high") rigorLevel = "medium";
  } else if (
    combined.includes("patient") ||
    combined.includes("participants") ||
    combined.includes("human subjects")
  ) {
    badges.push("Human Study");
  }

  return { studyType, rigorLevel, claimType, badges };
}

type BatchPaperInput = {
  paperId?: string;
  title: string;
  abstract: string | null;
};

type ModelBatchResult = PaperMetadata & { paperId?: string };

function safeParseJsonObject<T>(content: string): T | null {
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    return JSON.parse(jsonMatch[0]) as T;
  } catch {
    return null;
  }
}

function safeParseJsonArray<T>(content: string): T[] | null {
  try {
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return null;
    return JSON.parse(jsonMatch[0]) as T[];
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // New batch shape: { papers: [{ paperId?, title, abstract }] }
    if (Array.isArray(body?.papers)) {
      const papers = (body.papers as BatchPaperInput[]).filter((p) => p && typeof p.title === "string");
      if (papers.length === 0) {
        return NextResponse.json({ error: "papers[] with title is required" }, { status: 400 });
      }

      const metadataByPaperId: Record<string, PaperMetadata> = {};
      const toProcess: Array<{ key: string; title: string; abstract: string | null; paperId?: string }> = [];

      // Serve cached where possible (by paperId), otherwise queue for processing.
      for (const p of papers) {
        const key = p.paperId || `${p.title}::${p.abstract || ""}`;
        if (p.paperId) {
          const cached = getCachedMetadata(p.paperId);
          if (cached) {
            metadataByPaperId[p.paperId] = cached;
            continue;
          }
        }
        toProcess.push({ key, title: p.title, abstract: p.abstract, paperId: p.paperId });
      }

      // If no API key, fallback heuristics for all uncached.
      if (!XAI_API_KEY) {
        for (const p of toProcess) {
          const fallback = generateFallbackMetadata(p.title, p.abstract);
          if (p.paperId) {
            setCachedMetadata(p.paperId, fallback);
            metadataByPaperId[p.paperId] = fallback;
          } else {
            metadataByPaperId[p.key] = fallback;
          }
        }
        return NextResponse.json({ metadataByPaperId, cached: false });
      }

      // Batch classify via a single LLM call; fallback heuristics per-item if parsing fails.
      const systemPrompt = `You are a scientific methodology expert. Analyze research paper titles and abstracts to classify them.

Return a JSON object with these fields:
- studyType: The type of study (e.g., "Randomized Controlled Trial", "Meta-Analysis", "Cohort Study", "Case Report", "Systematic Review", "Observational Study", "Clinical Trial", "Original Research")
- rigorLevel: "high" (RCT, meta-analysis, large trials), "medium" (cohort, observational), or "low" (case reports, opinion pieces)
- claimType: "novel" (new finding), "replication" (confirms previous work), "review" (summarizes existing work), "meta-analysis", or "unknown"
- badges: Array of 1-3 short badges like ["RCT", "Human Study", "Novel Finding"] or ["Meta-Analysis", "High Impact"]

Be concise with badges - max 3 words each.`;

      const userPrompt = `Analyze these papers. Return ONLY a JSON array of objects, keyed by paperId, with this exact shape:
[
  { "paperId": "W...", "studyType": "...", "rigorLevel": "high|medium|low", "claimType": "novel|replication|review|meta-analysis|unknown", "badges": ["..."] }
]

Papers:
${toProcess
  .map(
    (p, idx) =>
      `${idx + 1}. paperId: ${p.paperId || "unknown"}\nTitle: ${p.title}\nAbstract: ${p.abstract || "Not available"}\n`
  )
  .join("\n")}`;

      let parsed: ModelBatchResult[] | null = null;
      try {
        const response = await fetch("https://api.x.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${XAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "grok-3-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            temperature: 0.1,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content || "";
          parsed = safeParseJsonArray<ModelBatchResult>(content);
        }
      } catch {
        parsed = null;
      }

      const parsedById = new Map<string, PaperMetadata>();
      if (parsed) {
        for (const item of parsed) {
          if (item?.paperId && item.studyType) {
            const { paperId, ...rest } = item;
            parsedById.set(paperId, rest);
          }
        }
      }

      for (let i = 0; i < toProcess.length; i++) {
        const p = toProcess[i];
        const modelMeta = p.paperId ? parsedById.get(p.paperId) : undefined;
        const finalMeta =
          modelMeta && modelMeta.studyType ? modelMeta : generateFallbackMetadata(p.title, p.abstract);
        if (p.paperId) {
          setCachedMetadata(p.paperId, finalMeta);
          metadataByPaperId[p.paperId] = finalMeta;
        } else {
          metadataByPaperId[p.key] = finalMeta;
        }
      }

      return NextResponse.json({ metadataByPaperId, cached: false });
    }

    // Backward-compatible single-paper shape
    const { paperId, title, abstract } = body as {
      paperId?: string;
      title?: string;
      abstract?: string | null;
    };

    if (!title) {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    // Check cache first
    if (paperId) {
      const cached = getCachedMetadata(paperId);
      if (cached) {
        return NextResponse.json({ metadata: cached, cached: true });
      }
    }

    // If no API key, use heuristic fallback
    if (!XAI_API_KEY) {
      const fallback = generateFallbackMetadata(title, abstract || null);
      if (paperId) setCachedMetadata(paperId, fallback);
      return NextResponse.json({ metadata: fallback, cached: false });
    }

    const systemPrompt = `You are a scientific methodology expert. Analyze research paper titles and abstracts to classify them.

Return a JSON object with these fields:
- studyType: The type of study (e.g., "Randomized Controlled Trial", "Meta-Analysis", "Cohort Study", "Case Report", "Systematic Review", "Observational Study", "Clinical Trial", "Original Research")
- rigorLevel: "high" (RCT, meta-analysis, large trials), "medium" (cohort, observational), or "low" (case reports, opinion pieces)
- claimType: "novel" (new finding), "replication" (confirms previous work), "review" (summarizes existing work), "meta-analysis", or "unknown"
- badges: Array of 1-3 short badges like ["RCT", "Human Study", "Novel Finding"] or ["Meta-Analysis", "High Impact"]

Be concise with badges - max 3 words each.`;

    const userPrompt = `Analyze this paper:
Title: ${title}
Abstract: ${abstract || "Not available"}

Return only valid JSON, no other text.`;

    try {
      const response = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${XAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "grok-3-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
        throw new Error("AI API error");
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";

      const parsed = safeParseJsonObject<PaperMetadata>(content);
      if (parsed) {
        if (paperId) setCachedMetadata(paperId, parsed);
        return NextResponse.json({ metadata: parsed, cached: false });
      }
    } catch {
      // Fall through to heuristic
    }

    // Fallback to heuristic
    const fallback = generateFallbackMetadata(title, abstract || null);
    if (paperId) setCachedMetadata(paperId, fallback);
    return NextResponse.json({ metadata: fallback, cached: false });
  } catch (error) {
    console.error("Error generating paper metadata:", error);
    return NextResponse.json({ error: "Failed to generate metadata" }, { status: 500 });
  }
}
