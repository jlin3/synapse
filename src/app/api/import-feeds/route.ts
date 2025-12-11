import { NextResponse } from "next/server";

interface ImportedTopic {
  name: string;
  query: string;
  source: "pubmed" | "google_scholar";
  importedAt: string;
}

type FeedSource = "pubmed" | "google_scholar" | "unknown";

function detectFeedSource(url: string): FeedSource {
  if (url.includes("pubmed.ncbi.nlm.nih.gov") || url.includes("ncbi.nlm.nih.gov")) {
    return "pubmed";
  }
  if (url.includes("scholar.google.com") || url.includes("scholar.google")) {
    return "google_scholar";
  }
  return "unknown";
}

async function parsePubMedFeed(xmlText: string, url: string): Promise<{ query: string; name: string } | null> {
  const titleMatch = xmlText.match(/<title>(?:<!\[CDATA\[)?([^<\]]+)(?:\]\]>)?<\/title>/i);
  const descriptionMatch = xmlText.match(/<description>(?:<!\[CDATA\[)?([^<\]]+)(?:\]\]>)?<\/description>/i);

  let searchQuery = "";
  let topicName = "";

  if (titleMatch && titleMatch[1]) {
    const title = titleMatch[1].trim();
    
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

  if (descriptionMatch && descriptionMatch[1] && !searchQuery) {
    const description = descriptionMatch[1].trim();
    const queryMatch = description.match(/search[:\s]+([^.]+)/i);
    if (queryMatch) {
      searchQuery = queryMatch[1].trim();
      topicName = searchQuery;
    }
  }

  const linkMatch = xmlText.match(/<link>([^<]+)<\/link>/i);
  if (linkMatch && linkMatch[1] && !searchQuery) {
    const link = linkMatch[1];
    const termMatch = link.match(/[?&]term=([^&]+)/i);
    if (termMatch) {
      searchQuery = decodeURIComponent(termMatch[1].replace(/\+/g, " "));
      topicName = searchQuery;
    }
  }

  if (!searchQuery) return null;

  searchQuery = searchQuery
    .replace(/["\[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  topicName = searchQuery
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return { query: searchQuery, name: topicName };
}

async function parseGoogleScholarFeed(xmlText: string, url: string): Promise<{ query: string; name: string } | null> {
  // Google Scholar RSS feeds have the search in the title
  // Format: "Google Scholar Alert - cardiology"
  // Or from URL: scholar.google.com/scholar?q=cardiology
  
  let searchQuery = "";
  let topicName = "";

  // Try to extract from title
  const titleMatch = xmlText.match(/<title>(?:<!\[CDATA\[)?([^<\]]+)(?:\]\]>)?<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    const title = titleMatch[1].trim();
    
    if (title.toLowerCase().includes("google scholar alert")) {
      searchQuery = title.replace(/google scholar alert\s*[-:]\s*/i, "").trim();
    } else if (title.toLowerCase().includes("google scholar")) {
      searchQuery = title.replace(/google scholar\s*[-:]\s*/i, "").trim();
    } else {
      searchQuery = title;
    }
    
    topicName = searchQuery;
  }

  // Try to extract from URL if not found in XML
  if (!searchQuery) {
    const qMatch = url.match(/[?&]q=([^&]+)/i);
    if (qMatch) {
      searchQuery = decodeURIComponent(qMatch[1].replace(/\+/g, " "));
      topicName = searchQuery;
    }
  }

  // Try from link element in RSS
  if (!searchQuery) {
    const linkMatch = xmlText.match(/<link>([^<]+)<\/link>/i);
    if (linkMatch && linkMatch[1]) {
      const link = linkMatch[1];
      const qMatch = link.match(/[?&]q=([^&]+)/i);
      if (qMatch) {
        searchQuery = decodeURIComponent(qMatch[1].replace(/\+/g, " "));
        topicName = searchQuery;
      }
    }
  }

  if (!searchQuery) return null;

  searchQuery = searchQuery
    .replace(/["\[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  topicName = searchQuery
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return { query: searchQuery, name: topicName };
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

    const feedSource = detectFeedSource(rssUrl);
    
    if (feedSource === "unknown") {
      return NextResponse.json(
        { error: "Please provide a valid PubMed or Google Scholar feed URL" },
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

    let result: { query: string; name: string } | null = null;

    if (feedSource === "pubmed") {
      result = await parsePubMedFeed(xmlText, rssUrl);
    } else if (feedSource === "google_scholar") {
      result = await parseGoogleScholarFeed(xmlText, rssUrl);
    }

    if (!result) {
      return NextResponse.json(
        { error: "Could not extract search terms from this RSS feed. Please try a different feed." },
        { status: 400 }
      );
    }

    const importedTopic: ImportedTopic = {
      name: result.name,
      query: result.query,
      source: feedSource,
      importedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      topic: importedTopic,
      message: `Successfully imported from ${feedSource === "pubmed" ? "PubMed" : "Google Scholar"}: "${result.name}"`,
    });
  } catch (error) {
    console.error("Error importing RSS feed:", error);
    return NextResponse.json(
      { error: "Failed to import RSS feed. Please check the URL and try again." },
      { status: 500 }
    );
  }
}
