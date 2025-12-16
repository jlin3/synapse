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

  return {
    id: work.id,
    title: work.title,
    authors: work.authorships.map((a) => a.author.display_name).slice(0, 5),
    publicationDate: work.publication_date,
    doi: work.doi,
    abstract: reconstructAbstract(work.abstract_inverted_index),
    citedByCount: work.cited_by_count,
    journal: work.primary_location?.source?.display_name || null,
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

    // Trust OpenAlex's relevance scoring - it uses semantic matching across title,
    // abstract, and full text. No client-side filtering needed for general queries.

    // Improve "Hot" ranking: heavily favor recent papers (60-180 days) while still
    // considering citations and trend. This surfaces timely, impactful research.
    if (sortBy === "hot") {
      const now = Date.now();
      const msPerDay = 24 * 60 * 60 * 1000;

      const scoreHot = (p: Paper) => {
        const cited = Math.max(0, p.citedByCount || 0);
        const citations = Math.log10(1 + cited); // compress heavy tails (0-4 range typically)

        const pubMs = Date.parse(p.publicationDate || "");
        const ageDays = Number.isFinite(pubMs) ? (now - pubMs) / msPerDay : 3650;

        // Strong recency scoring: papers in the sweet spot (30-90 days) get highest boost
        // - 0-30 days: very new, boost = 3.0
        // - 30-90 days: sweet spot (citations starting + still fresh), boost = 4.0
        // - 90-180 days: recent, boost = 2.5
        // - 180-365 days: older but still relevant, boost = 1.0
        // - >365 days: minimal boost = 0.2
        let recencyBoost = 0.2;
        if (ageDays <= 30) {
          recencyBoost = 3.0;
        } else if (ageDays <= 90) {
          recencyBoost = 4.0; // sweet spot
        } else if (ageDays <= 180) {
          recencyBoost = 2.5;
        } else if (ageDays <= 365) {
          recencyBoost = 1.0;
        }

        const trend = Math.max(-100, Math.min(200, p.trendScore || 0)) / 100; // approx -1..2

        // Weighting: recency now dominates for "hot", citations secondary, trend tertiary
        return recencyBoost * 2.5 + citations * 1.2 + trend * 0.6;
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
