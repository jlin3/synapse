import { NextResponse } from "next/server";

const XAI_API_KEY = process.env.XAI_API_KEY;

interface PaperMetadata {
  studyType: string;
  rigorLevel: "high" | "medium" | "low";
  claimType: "novel" | "replication" | "review" | "meta-analysis" | "unknown";
  badges: string[];
}

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
  } else if (combined.includes("randomized") || combined.includes("randomised") || combined.includes("rct")) {
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
  } else if (combined.includes("clinical trial") || combined.includes("phase i") || combined.includes("phase ii") || combined.includes("phase iii")) {
    studyType = "Clinical Trial";
    rigorLevel = "high";
    badges.push("Clinical Trial");
  } else if (combined.includes("observational")) {
    studyType = "Observational Study";
    rigorLevel = "medium";
    badges.push("Observational");
  }
  
  // Detect novelty indicators
  if (combined.includes("first") || combined.includes("novel") || combined.includes("new approach") || combined.includes("breakthrough")) {
    if (claimType === "unknown") claimType = "novel";
    if (!badges.includes("Novel Finding")) badges.push("Novel Finding");
  }
  
  // Detect human vs animal
  if (combined.includes("in vivo") || combined.includes("animal model") || combined.includes("mouse") || combined.includes("rat ")) {
    badges.push("Animal Study");
    if (rigorLevel === "high") rigorLevel = "medium";
  } else if (combined.includes("patient") || combined.includes("participants") || combined.includes("human subjects")) {
    badges.push("Human Study");
  }
  
  return { studyType, rigorLevel, claimType, badges };
}

export async function POST(request: Request) {
  try {
    const { paperId, title, abstract } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: "title is required" },
        { status: 400 }
      );
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
      const fallback = generateFallbackMetadata(title, abstract);
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
      
      // Parse the JSON response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const metadata: PaperMetadata = JSON.parse(jsonMatch[0]);
        if (paperId) setCachedMetadata(paperId, metadata);
        return NextResponse.json({ metadata, cached: false });
      }
    } catch {
      // Fall through to heuristic
    }

    // Fallback to heuristic
    const fallback = generateFallbackMetadata(title, abstract);
    if (paperId) setCachedMetadata(paperId, fallback);
    return NextResponse.json({ metadata: fallback, cached: false });
  } catch (error) {
    console.error("Error generating paper metadata:", error);
    return NextResponse.json(
      { error: "Failed to generate metadata" },
      { status: 500 }
    );
  }
}
