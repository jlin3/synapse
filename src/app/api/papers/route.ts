import { NextResponse } from "next/server";
import { Paper } from "@/types";
import { extractIdentifierTokens, isIdentifierLikeQuery, normalizeQueryForSearch } from "@/lib/search";

// CDN cache: 6h fresh, 24h stale-while-revalidate
const CACHE_CONTROL_HEADER_VALUE = "public, s-maxage=21600, stale-while-revalidate=86400";

export interface OpenAlexWork {
  id: string;
  title: string;
  publication_date: string;
  doi: string | null;
  authorships: Array<{
    author: {
      display_name: string;
    };
  }>;
  abstract_inverted_index: Record<string, number[]> | null;
  cited_by_count: number;
  primary_location?: {
    source?: {
      display_name: string;
    };
    pdf_url?: string;
    landing_page_url?: string;
  };
  locations?: Array<{
    source?: {
      display_name: string;
      type?: string;
    };
    pdf_url?: string;
    landing_page_url?: string;
  }>;
  concepts?: Array<{
    id: string;
    display_name: string;
    level: number;
    score: number;
  }>;
  open_access?: {
    is_oa: boolean;
    oa_url?: string;
  };
  biblio?: {
    volume?: string;
    issue?: string;
    first_page?: string;
    last_page?: string;
  };
  counts_by_year?: Array<{
    year: number;
    cited_by_count: number;
  }>;
}

// Paper type is imported from @/types

// Decode HTML entities and strip HTML tags
function decodeHtmlEntities(text: string): string {
  if (!text) return text;
  return text
    // Strip HTML tags (e.g., <i>, </i>, <b>, etc.)
    .replace(/<[^>]*>/g, "")
    // Decode common HTML entities
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&nbsp;/g, " ")
    // Clean up any double spaces
    .replace(/\s+/g, " ")
    .trim();
}

// High-impact journals get a prestige boost for "hot" ranking
const HIGH_IMPACT_JOURNALS = new Set([
  "nature", "science", "cell", "the lancet", "lancet", "nejm",
  "new england journal of medicine", "jama", "bmj", "circulation",
  "european heart journal", "journal of the american college of cardiology",
  "jacc", "nature medicine", "nature cardiovascular research",
  "annals of internal medicine", "plos medicine", "jama cardiology",
  "jama internal medicine", "the bmj", "circulation research",
  "cardiovascular research", "heart", "esc heart failure",
]);

// Study types that indicate higher rigor
const HIGH_RIGOR_CONCEPTS = new Set([
  "randomized controlled trial", "rct", "meta-analysis", "systematic review",
  "clinical trial", "double-blind", "placebo-controlled",
]);

function getJournalPrestigeScore(journal: string | null): number {
  if (!journal) return 0;
  const normalized = journal.toLowerCase().trim();
  if (HIGH_IMPACT_JOURNALS.has(normalized)) return 3.0;
  // Partial matches for journal families
  if (normalized.includes("nature") || normalized.includes("lancet") ||
      normalized.includes("jama") || normalized.includes("nejm")) return 2.5;
  if (normalized.includes("circulation") || normalized.includes("heart") ||
      normalized.includes("cardio")) return 1.5;
  return 0;
}

function getRigorScore(concepts: Array<{ name: string; score: number }> | undefined): number {
  if (!concepts) return 0;
  let rigorScore = 0;
  for (const c of concepts) {
    const name = (c.name || "").toLowerCase();
    if (HIGH_RIGOR_CONCEPTS.has(name) || name.includes("randomized") ||
        name.includes("meta-analysis") || name.includes("systematic review") ||
        name.includes("clinical trial")) {
      rigorScore = Math.max(rigorScore, 2.0);
    }
  }
  return rigorScore;
}

function reconstructAbstract(invertedIndex: Record<string, number[]> | null): string | null {
  if (!invertedIndex) return null;

  const words: string[] = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    for (const pos of positions) {
      words[pos] = word;
    }
  }
  const abstract = words.join(" ");

  // Filter out bad abstracts (cookie notices, navigation text, etc.)
  const badPatterns = [
    /our website uses cookies/i,
    /cookie policy/i,
    /by continuing to use our site/i,
    /accept cookies/i,
    /we use cookies/i,
    /this site uses cookies/i,
    /sign in.*create account/i,
    /subscribe now/i,
    /javascript is disabled/i,
  ];

  for (const pattern of badPatterns) {
    if (pattern.test(abstract)) {
      return null;
    }
  }

  return abstract;
}

function extractGitHubUrl(locations: OpenAlexWork["locations"]): string | null {
  if (!locations) return null;

  for (const loc of locations) {
    const url = loc.landing_page_url || loc.pdf_url || "";
    if (url.includes("github.com")) {
      return url;
    }
  }
  return null;
}

function extractArxivId(locations: OpenAlexWork["locations"], doi: string | null): string | null {
  if (!locations) return null;

  for (const loc of locations) {
    const url = loc.landing_page_url || "";
    const arxivMatch = url.match(/arxiv\.org\/abs\/(\d+\.\d+)/);
    if (arxivMatch) {
      return arxivMatch[1];
    }
  }

  // Also check DOI for arXiv
  if (doi && doi.includes("arxiv")) {
    const match = doi.match(/(\d+\.\d+)/);
    if (match) return match[1];
  }

  return null;
}

function calculateTrendScore(countsByYear: OpenAlexWork["counts_by_year"]): number {
  if (!countsByYear || countsByYear.length < 2) return 0;

  // Sort by year descending
  const sorted = [...countsByYear].sort((a, b) => b.year - a.year);
  const thisYear = sorted[0]?.cited_by_count || 0;
  const lastYear = sorted[1]?.cited_by_count || 0;

  if (lastYear === 0) return thisYear > 0 ? 100 : 0;

  // Calculate percentage change
  return Math.round(((thisYear - lastYear) / lastYear) * 100);
}

function transformWork(work: OpenAlexWork): Paper {
  // Get top concepts (level 1-2 for broader topics)
  const concepts = (work.concepts || [])
    .filter((c) => c.level <= 2 && c.score > 0.3)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((c) => ({
      id: c.id,
      name: c.display_name,
      score: c.score,
    }));

  // Find PDF URL
  const pdfUrl =
    work.primary_location?.pdf_url ||
    work.open_access?.oa_url ||
    work.locations?.find((l) => l.pdf_url)?.pdf_url ||
    null;

  const abstract = reconstructAbstract(work.abstract_inverted_index);
  const journal = work.primary_location?.source?.display_name || null;

  return {
    id: work.id,
    title: decodeHtmlEntities(work.title),
    authors: work.authorships.map((a) => a.author.display_name).slice(0, 5),
    publicationDate: work.publication_date,
    doi: work.doi,
    abstract: abstract ? decodeHtmlEntities(abstract) : null,
    citedByCount: work.cited_by_count,
    journal: journal ? decodeHtmlEntities(journal) : null,
    concepts,
    pdfUrl,
    githubUrl: extractGitHubUrl(work.locations),
    arxivId: extractArxivId(work.locations, work.doi),
    isOpenAccess: work.open_access?.is_oa || false,
    trendScore: calculateTrendScore(work.counts_by_year),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams.get("query") || "cardiology";
  const query = normalizeQueryForSearch(rawQuery) || "cardiology";
  const sortBy = searchParams.get("sortBy") || "";
  const page = searchParams.get("page") || "1";
  const minCitations = searchParams.get("minCitations");
  const fromDate = searchParams.get("fromDate");

  try {
    const requestedPage = Math.max(1, parseInt(page || "1", 10) || 1);
    const requestedPerPage = 20;
    // For "hot", pull a broader candidate set once and then slice locally.
    const candidatePerPage = sortBy === "hot" ? 80 : requestedPerPage;
    const upstreamPage = sortBy === "hot" ? "1" : String(requestedPage);

    const url = new URL("https://api.openalex.org/works");
    url.searchParams.set("search", query);
    url.searchParams.set("per_page", String(candidatePerPage));
    url.searchParams.set("page", upstreamPage);
    
    // OpenAlex best practice: use relevance_score when searching for best semantic matching.
    // Only override with date/citations sort when explicitly requested via sortBy.
    // See: https://docs.openalex.org/how-to-use-the-api/get-lists-of-entities/sort-entity-lists
    let openAlexSort = "relevance_score:desc"; // Default: relevance-based ranking
    if (sortBy === "newest") {
      openAlexSort = "publication_date:desc";
    } else if (sortBy === "citations") {
      openAlexSort = "cited_by_count:desc";
    } else if (sortBy === "hot") {
      // For hot, get relevance-sorted candidates, then rerank locally
      openAlexSort = "relevance_score:desc";
    }
    url.searchParams.set("sort", openAlexSort);
    
    url.searchParams.set(
      "select",
      "id,title,publication_date,doi,authorships,abstract_inverted_index,cited_by_count,primary_location,locations,concepts,open_access,biblio,counts_by_year"
    );

    // Add filters
    const filters: string[] = [];
    
    if (minCitations) {
      filters.push(`cited_by_count:>${minCitations}`);
    }
    if (fromDate) {
      filters.push(`from_publication_date:${fromDate}`);
    }

    // For identifier-like queries (e.g., BPC-157), add a stricter title/abstract filter
    // to ensure exact identifier matches. General queries rely on OpenAlex's semantic search.
    if (isIdentifierLikeQuery(query)) {
      const token = extractIdentifierTokens(query)[0];
      if (token && token.length >= 3) {
        filters.push(`title.search:${token}|abstract.search:${token}`);
      }
    }

    // For "hot" ranking, restrict to recent papers (last 180 days) to surface fresh research
    if (sortBy === "hot" && !fromDate) {
      const hotWindowDate = new Date();
      hotWindowDate.setDate(hotWindowDate.getDate() - 180);
      filters.push(`from_publication_date:${hotWindowDate.toISOString().split("T")[0]}`);
    }

    if (filters.length > 0) {
      url.searchParams.set("filter", filters.join(","));
    }

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "Synapse/1.0 (mailto:hello@synapse.ai)",
      },
    });

    if (!response.ok) {
      throw new Error(`OpenAlex API error: ${response.status}`);
    }

    const data = await response.json();
    let papers: Paper[] = data.results.map(transformWork);

    // Light filtering for quality - keep journals but remove broken records
    papers = papers.filter((p) => {
      // Must have a title
      if (!p.title || p.title.length < 10) return false;
      return true;
    });

    // Improve "Hot" ranking: balance recency, citations, journal prestige, rigor, and accessibility.
    // Hot papers should be recent, getting cited, from reputable sources, high rigor, and accessible.
    if (sortBy === "hot") {
      const now = Date.now();
      const msPerDay = 24 * 60 * 60 * 1000;

      const scoreHot = (p: Paper) => {
        // 1. Citations (log-scaled to compress heavy tails)
        const cited = Math.max(0, p.citedByCount || 0);
        const citationScore = Math.log10(1 + cited) * 1.5; // 0-6 range typically

        // 2. Recency boost - favor 30-90 day sweet spot
        const pubMs = Date.parse(p.publicationDate || "");
        const ageDays = Number.isFinite(pubMs) ? (now - pubMs) / msPerDay : 3650;
        let recencyBoost = 0.2;
        if (ageDays <= 30) {
          recencyBoost = 2.0; // very new
        } else if (ageDays <= 90) {
          recencyBoost = 2.5; // sweet spot (citations starting + still fresh)
        } else if (ageDays <= 180) {
          recencyBoost = 1.5;
        } else if (ageDays <= 365) {
          recencyBoost = 0.5;
        }

        // 3. Citation trend (momentum) - papers gaining citations quickly
        const trend = Math.max(-100, Math.min(200, p.trendScore || 0)) / 100;
        const trendScore = trend * 1.2;

        // 4. Journal prestige - high-impact journals get a boost
        const journalScore = getJournalPrestigeScore(p.journal);

        // 5. Rigor signals from concepts (RCT, meta-analysis, etc.)
        const rigorScore = getRigorScore(p.concepts || []);

        // 6. Open Access boost - OA papers get more visibility and engagement
        const openAccessBoost = p.isOpenAccess ? 1.0 : 0;

        // 7. PDF availability - papers with accessible full text
        const pdfBoost = p.pdfUrl ? 0.8 : 0;

        // 8. Abstract quality - papers with substantive abstracts are real research
        const abstractLength = (p.abstract || "").length;
        const abstractBoost = abstractLength > 500 ? 1.0 : abstractLength > 200 ? 0.5 : 0;

        // 9. Author collaboration - collaborative papers (3-10 authors) often indicate significant research
        const authorCount = p.authors?.length || 0;
        const collaborationBoost = authorCount >= 3 && authorCount <= 15 ? 0.5 : 0;

        // 10. Concept specificity - papers with high-confidence concept tags
        const conceptScore = (p.concepts || []).reduce((sum, c) => sum + (c.score > 0.5 ? 0.2 : 0), 0);
        const conceptBoost = Math.min(conceptScore, 1.0); // cap at 1.0

        // 11. Penalty for corrections/errata (less interesting for "hot" feed)
        const title = (p.title || "").toLowerCase();
        const isCorrection = title.startsWith("correction") || title.startsWith("erratum") ||
                            title.includes("correction to:") || title.includes("erratum to:");
        const correctionPenalty = isCorrection ? -8.0 : 0;

        // Combined score: all positive signals minus penalties
        return citationScore + recencyBoost + trendScore + journalScore + rigorScore +
               openAccessBoost + pdfBoost + abstractBoost + collaborationBoost + conceptBoost +
               correctionPenalty;
      };

      papers = [...papers].sort((a, b) => scoreHot(b) - scoreHot(a));

      // Slice locally for requested page. Note: we only have `candidatePerPage` candidates.
      const offset = (requestedPage - 1) * requestedPerPage;
      papers = papers.slice(offset, offset + requestedPerPage);
    }

    return NextResponse.json({
      papers,
      meta: {
        count: data.meta.count,
        page: requestedPage,
        perPage: requestedPerPage,
      },
    }, {
      headers: {
        "Cache-Control": CACHE_CONTROL_HEADER_VALUE,
      },
    });
  } catch (error) {
    console.error("Error fetching papers:", error);
    return NextResponse.json({ error: "Failed to fetch papers" }, { status: 500 });
  }
}
