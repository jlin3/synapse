import { NextResponse } from "next/server";

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
  };
}

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  publicationDate: string;
  doi: string | null;
  abstract: string | null;
  citedByCount: number;
  journal: string | null;
}

function reconstructAbstract(
  invertedIndex: Record<string, number[]> | null
): string | null {
  if (!invertedIndex) return null;

  const words: string[] = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    for (const pos of positions) {
      words[pos] = word;
    }
  }
  return words.join(" ");
}

function transformWork(work: OpenAlexWork): Paper {
  return {
    id: work.id,
    title: work.title,
    authors: work.authorships.map((a) => a.author.display_name).slice(0, 5),
    publicationDate: work.publication_date,
    doi: work.doi,
    abstract: reconstructAbstract(work.abstract_inverted_index),
    citedByCount: work.cited_by_count,
    journal: work.primary_location?.source?.display_name || null,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "cardiology";
  const sort = searchParams.get("sort") || "publication_date:desc";
  const page = searchParams.get("page") || "1";

  try {
    const url = new URL("https://api.openalex.org/works");
    url.searchParams.set("search", query);
    url.searchParams.set("per_page", "20");
    url.searchParams.set("page", page);
    url.searchParams.set("sort", sort);
    url.searchParams.set(
      "select",
      "id,title,publication_date,doi,authorships,abstract_inverted_index,cited_by_count,primary_location"
    );

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "Synapse/1.0 (mailto:hello@synapse.ai)",
      },
    });

    if (!response.ok) {
      throw new Error(`OpenAlex API error: ${response.status}`);
    }

    const data = await response.json();
    const papers: Paper[] = data.results.map(transformWork);

    return NextResponse.json({
      papers,
      meta: {
        count: data.meta.count,
        page: data.meta.page,
        perPage: data.meta.per_page,
      },
    });
  } catch (error) {
    console.error("Error fetching papers:", error);
    return NextResponse.json(
      { error: "Failed to fetch papers" },
      { status: 500 }
    );
  }
}
