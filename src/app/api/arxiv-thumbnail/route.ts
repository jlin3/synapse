import { NextResponse } from "next/server";

// In-memory cache for thumbnail URLs
const thumbnailCache = new Map<string, { url: string | null; fetchedAt: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

async function fetchArxivThumbnail(arxivId: string): Promise<string | null> {
  // Check cache first
  const cached = thumbnailCache.get(arxivId);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
    return cached.url;
  }

  try {
    // Try ar5iv.org which renders arXiv papers as HTML with images
    // ar5iv often has figure previews
    const ar5ivUrl = `https://ar5iv.labs.arxiv.org/html/${arxivId}`;

    const ar5ivResponse = await fetch(ar5ivUrl, {
      headers: {
        "User-Agent": "Synapse/1.0 (mailto:hello@synapse.ai)",
      },
    });

    if (ar5ivResponse.ok) {
      const html = await ar5ivResponse.text();

      // Look for figure images in ar5iv HTML
      // ar5iv uses img tags with src pointing to extracted figures
      const figurePatterns = [
        /src="([^"]+\/html\/[^"]+\/(x\d+|figure\d+|fig\d+)[^"]*\.(png|jpg|jpeg|svg))"/i,
        /src="(https?:\/\/[^"]+\.(png|jpg|jpeg))"/i,
        /<img[^>]+src="([^"]+)"[^>]*class="[^"]*ltx_graphics/i,
      ];

      for (const pattern of figurePatterns) {
        const match = html.match(pattern);
        if (match && match[1]) {
          let imageUrl = match[1];
          // Make relative URLs absolute
          if (imageUrl.startsWith("/")) {
            imageUrl = `https://ar5iv.labs.arxiv.org${imageUrl}`;
          } else if (!imageUrl.startsWith("http")) {
            imageUrl = `https://ar5iv.labs.arxiv.org/html/${arxivId}/${imageUrl}`;
          }
          thumbnailCache.set(arxivId, { url: imageUrl, fetchedAt: Date.now() });
          return imageUrl;
        }
      }
    }

    // Fallback: Try the standard arXiv abstract page for og:image
    const absUrl = `https://arxiv.org/abs/${arxivId}`;
    const absResponse = await fetch(absUrl, {
      headers: {
        "User-Agent": "Synapse/1.0 (mailto:hello@synapse.ai)",
      },
    });

    if (absResponse.ok) {
      const html = await absResponse.text();

      // Extract og:image meta tag (arXiv sometimes has these for papers with figures)
      const ogImageMatch =
        html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i) ||
        html.match(/<meta\s+content="([^"]+)"\s+property="og:image"/i);

      if (ogImageMatch && ogImageMatch[1] && !ogImageMatch[1].includes("arxiv-logo")) {
        const thumbnailUrl = ogImageMatch[1];
        thumbnailCache.set(arxivId, { url: thumbnailUrl, fetchedAt: Date.now() });
        return thumbnailUrl;
      }
    }

    // No thumbnail found - cache the null result
    thumbnailCache.set(arxivId, { url: null, fetchedAt: Date.now() });
    return null;
  } catch (error) {
    console.error("Error fetching arXiv thumbnail:", error);
    thumbnailCache.set(arxivId, { url: null, fetchedAt: Date.now() });
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const arxivId = searchParams.get("arxivId");
  const doi = searchParams.get("doi");

  // Try arXiv first if we have an arXiv ID
  if (arxivId) {
    const thumbnailUrl = await fetchArxivThumbnail(arxivId);

    return NextResponse.json(
      {
        thumbnailUrl,
        arxivId,
        source: "arxiv",
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  }

  // For DOI-based papers without arXiv ID, we can't easily get thumbnails
  // Return null and let frontend handle with styled placeholder
  if (doi) {
    const cleanDoi = doi.replace("https://doi.org/", "");

    return NextResponse.json(
      {
        thumbnailUrl: null,
        doi: cleanDoi,
        source: "doi",
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  }

  // No identifiers provided
  return NextResponse.json({
    thumbnailUrl: null,
    source: "unknown",
  });
}
