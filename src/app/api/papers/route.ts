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
  const sort = searchParams.get("sort") || "publication_date:desc";
  const sortBy = searchParams.get("sortBy") || "";
  const page = searchParams.get("page") || "1";
  const minCitations = searchParams.get("minCitations");
  const fromDate = searchParams.get("fromDate");

  try {
    const requestedPage = Math.max(1, parseInt(page || "1", 10) || 1);
    const requestedPerPage = 20;
    // For "hot", pull a broader candidate set once and then slice locally.
    // This avoids extra upstream calls while improving local reranking.
    const candidatePerPage = sortBy === "hot" ? 80 : requestedPerPage;
    const upstreamPage = sortBy === "hot" ? "1" : String(requestedPage);

    const url = new URL("https://api.openalex.org/works");
    url.searchParams.set("search", query);
    url.searchParams.set("per_page", String(candidatePerPage));
    url.searchParams.set("page", upstreamPage);
    url.searchParams.set("sort", sort);
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

    // Hybrid keyword behavior: if the query looks like an identifier (e.g., BPC-157),
    // require the identifier token to appear in title OR abstract.
    if (isIdentifierLikeQuery(query)) {
      const tokens = extractIdentifierTokens(query);
      const token = tokens[0];
      if (token) {
        // OpenAlex supports OR with '|' inside the filter parameter.
        // See: https://docs.openalex.org/how-to-use-the-api/get-lists-of-entities/filter-entity-lists
        filters.push(`title.search:${token}|abstract.search:${token}`);
      }
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

    // Safety net: enforce exact-token presence for identifier-like queries even if
    // OpenAlex ranking includes adjacent results.
    if (isIdentifierLikeQuery(query)) {
      const token = extractIdentifierTokens(query)[0];
      if (token) {
        const tokenLower = token.toLowerCase();
        papers = papers.filter((p) => {
          const title = (p.title || "").toLowerCase();
          const abs = (p.abstract || "").toLowerCase();
          return title.includes(tokenLower) || abs.includes(tokenLower);
        });
      }
    }

    // Improve "Hot" ranking without changing the backend (Option A).
    // If the client requests sortBy=hot, we fetch high-citation candidates from OpenAlex
    // and then locally re-rank using a blend of citations, recency, and trend.
    if (sortBy === "hot") {
      const now = Date.now();
      const msPerDay = 24 * 60 * 60 * 1000;

      const scoreHot = (p: Paper) => {
        const cited = Math.max(0, p.citedByCount || 0);
        const citations = Math.log10(1 + cited); // compress heavy tails

        const pubMs = Date.parse(p.publicationDate || "");
        const ageDays = Number.isFinite(pubMs) ? (now - pubMs) / msPerDay : 3650;
        const recency = Math.max(0, 1 - ageDays / 365); // 0..1 over last year

        const trend = Math.max(-100, Math.min(200, p.trendScore || 0)) / 100; // approx -1..2

        // Weighting tuned for a "research feed" feel:
        // citations dominate, but recency/trend can bubble up new papers.
        return citations * 2.0 + recency * 1.0 + trend * 0.8;
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
