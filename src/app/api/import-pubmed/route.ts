import { NextResponse } from "next/server";

interface ImportedTopic {
  name: string;
  query: string;
  source: "pubmed";
  importedAt: string;
}

export async function POST(request: Request) {
  try {
    const { rssUrl } = await request.json();

    if (!rssUrl) {
      return NextResponse.json(
        { error: "RSS URL is required" },
        { status: 400 }
      );
    }

    // Validate that it's a PubMed RSS URL
    if (!rssUrl.includes("pubmed.ncbi.nlm.nih.gov") && !rssUrl.includes("ncbi.nlm.nih.gov")) {
      return NextResponse.json(
        { error: "Please provide a valid PubMed RSS feed URL" },
        { status: 400 }
      );
    }

    // Fetch the RSS feed
    const response = await fetch(rssUrl, {
      headers: {
        "User-Agent": "Synapse/1.0 (mailto:hello@synapse.ai)",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch RSS feed. Please check the URL." },
        { status: 400 }
      );
    }

    const xmlText = await response.text();

    // Parse the XML to extract search information
    // PubMed RSS feeds have the search term in the <title> tag
    // Format: "pubmed: search term - PubMed"
    const titleMatch = xmlText.match(/<title>(?:<!\[CDATA\[)?([^<\]]+)(?:\]\]>)?<\/title>/i);
    const descriptionMatch = xmlText.match(/<description>(?:<!\[CDATA\[)?([^<\]]+)(?:\]\]>)?<\/description>/i);

    let searchQuery = "";
    let topicName = "";

    if (titleMatch && titleMatch[1]) {
      const title = titleMatch[1].trim();
      
      // Extract search term from PubMed title format
      // Common formats:
      // "cardiology - PubMed"
      // "pubmed: cardiology"
      // "Results for cardiology"
      if (title.includes(" - PubMed")) {
        searchQuery = title.replace(" - PubMed", "").trim();
      } else if (title.toLowerCase().startsWith("pubmed:")) {
        searchQuery = title.replace(/^pubmed:\s*/i, "").trim();
      } else if (title.toLowerCase().startsWith("results for")) {
        searchQuery = title.replace(/^results for\s*/i, "").trim();
      } else {
        searchQuery = title;
      }
      
      topicName = searchQuery;
    }

    // Try to get more context from description
    if (descriptionMatch && descriptionMatch[1] && !searchQuery) {
      const description = descriptionMatch[1].trim();
      // Extract any useful query info from description
      const queryMatch = description.match(/search[:\s]+([^.]+)/i);
      if (queryMatch) {
        searchQuery = queryMatch[1].trim();
        topicName = searchQuery;
      }
    }

    // Also try to parse the link to extract the search term
    const linkMatch = xmlText.match(/<link>([^<]+)<\/link>/i);
    if (linkMatch && linkMatch[1] && !searchQuery) {
      const link = linkMatch[1];
      // PubMed search URLs: https://pubmed.ncbi.nlm.nih.gov/?term=cardiology
      const termMatch = link.match(/[?&]term=([^&]+)/i);
      if (termMatch) {
        searchQuery = decodeURIComponent(termMatch[1].replace(/\+/g, " "));
        topicName = searchQuery;
      }
    }

    if (!searchQuery) {
      return NextResponse.json(
        { error: "Could not extract search terms from this RSS feed. Please try a different feed." },
        { status: 400 }
      );
    }

    // Clean up the search query
    searchQuery = searchQuery
      .replace(/["\[\]]/g, "") // Remove quotes and brackets
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim();

    // Create a topic name (capitalize first letter of each word)
    topicName = searchQuery
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    const importedTopic: ImportedTopic = {
      name: topicName,
      query: searchQuery,
      source: "pubmed",
      importedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      topic: importedTopic,
      message: `Successfully imported topic: "${topicName}"`,
    });
  } catch (error) {
    console.error("Error importing PubMed RSS:", error);
    return NextResponse.json(
      { error: "Failed to import RSS feed. Please check the URL and try again." },
      { status: 500 }
    );
  }
}
