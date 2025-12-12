import { NextResponse } from "next/server";

// Generate a thumbnail URL for a paper
// In production, you'd want to actually generate/cache thumbnails from PDFs
// For now, we'll use placeholder services and arXiv thumbnails when available

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const arxivId = searchParams.get("arxivId");
  const doi = searchParams.get("doi");
  const title = searchParams.get("title") || "Paper";

  // arXiv has thumbnail images available
  if (arxivId) {
    // arXiv provides thumbnails at this URL pattern
    const thumbnailUrl = `https://arxiv.org/abs/${arxivId}`;
    
    return NextResponse.json({
      thumbnailUrl: null, // arXiv doesn't provide direct thumbnails easily
      arxivUrl: thumbnailUrl,
      type: "arxiv",
    });
  }

  // For DOIs, we could potentially use Unpaywall or similar
  if (doi) {
    const cleanDoi = doi.replace("https://doi.org/", "");
    
    return NextResponse.json({
      thumbnailUrl: null,
      doiUrl: `https://doi.org/${cleanDoi}`,
      type: "doi",
    });
  }

  // Return placeholder info
  return NextResponse.json({
    thumbnailUrl: null,
    type: "placeholder",
  });
}
