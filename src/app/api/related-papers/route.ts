import { NextResponse } from "next/server";

interface RelatedPaper {
  id: string;
  title: string;
  authors: string[];
  publicationDate: string;
  doi: string | null;
  citedByCount: number;
  journal: string | null;
}

interface OpenAlexWork {
  id: string;
  title: string;
  publication_date: string;
  doi: string | null;
  authorships: Array<{
    author: {
      display_name: string;
    };
  }>;
  cited_by_count: number;
  primary_location?: {
    source?: {
      display_name: string;
    };
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workId = searchParams.get("id");

  if (!workId) {
    return NextResponse.json(
      { error: "Work ID is required" },
      { status: 400 }
    );
  }

  try {
    // First, get the work to find its related works
    const workUrl = new URL(`https://api.openalex.org/works/${encodeURIComponent(workId)}`);
    workUrl.searchParams.set("select", "related_works");

    const workResponse = await fetch(workUrl.toString(), {
      headers: {
        "User-Agent": "Synapse/1.0 (mailto:hello@synapse.ai)",
      },
    });

    if (!workResponse.ok) {
      throw new Error(`OpenAlex API error: ${workResponse.status}`);
    }

    const workData = await workResponse.json();
    const relatedWorkIds: string[] = workData.related_works?.slice(0, 5) || [];

    if (relatedWorkIds.length === 0) {
      return NextResponse.json({ relatedPapers: [] });
    }

    // Fetch the related works details
    // OpenAlex IDs are URLs like https://openalex.org/W1234567890
    // We need to extract just the ID part or use the filter
    const idsFilter = relatedWorkIds
      .map((id) => id.replace("https://openalex.org/", ""))
      .join("|");

    const relatedUrl = new URL("https://api.openalex.org/works");
    relatedUrl.searchParams.set("filter", `openalex_id:${idsFilter}`);
    relatedUrl.searchParams.set("per_page", "5");
    relatedUrl.searchParams.set(
      "select",
      "id,title,publication_date,doi,authorships,cited_by_count,primary_location"
    );

    const relatedResponse = await fetch(relatedUrl.toString(), {
      headers: {
        "User-Agent": "Synapse/1.0 (mailto:hello@synapse.ai)",
      },
    });

    if (!relatedResponse.ok) {
      throw new Error(`OpenAlex API error: ${relatedResponse.status}`);
    }

    const relatedData = await relatedResponse.json();
    
    const relatedPapers: RelatedPaper[] = relatedData.results.map(
      (work: OpenAlexWork) => ({
        id: work.id,
        title: work.title,
        authors: work.authorships
          .map((a) => a.author.display_name)
          .slice(0, 3),
        publicationDate: work.publication_date,
        doi: work.doi,
        citedByCount: work.cited_by_count,
        journal: work.primary_location?.source?.display_name || null,
      })
    );

    return NextResponse.json(
      { relatedPapers },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching related papers:", error);
    return NextResponse.json(
      { error: "Failed to fetch related papers" },
      { status: 500 }
    );
  }
}
