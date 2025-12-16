import { headers } from "next/headers";
import SynapsePageClient from "./SynapsePageClient";
import type { Paper, PaperMetadata } from "@/types";

const DEFAULT_QUERY = "cardiology";

function getOriginFromHeaders(h: Headers): string {
  const proto = h.get("x-forwarded-proto") || "http";
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  return `${proto}://${host}`;
}

export default async function Page() {
  const h = await headers();
  const origin = getOriginFromHeaders(h);

  const initialQuery = DEFAULT_QUERY;
  let initialPapers: Paper[] = [];
  let initialMetadataByPaperId: Record<string, PaperMetadata> = {};

  try {
    const papersRes = await fetch(
      `${origin}/api/papers?query=${encodeURIComponent(initialQuery)}&sort=cited_by_count:desc&sortBy=hot`,
      { next: { revalidate: 300 } }
    );
    if (papersRes.ok) {
      const papersJson = await papersRes.json();
      initialPapers = (papersJson.papers || []) as Paper[];
    }
  } catch {
    // ignore SSR fetch errors; client will recover
  }

  try {
    if (initialPapers.length > 0) {
      const metaRes = await fetch(`${origin}/api/paper-metadata`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          papers: initialPapers.map((p) => ({
            paperId: p.id,
            title: p.title,
            abstract: p.abstract,
          })),
        }),
        next: { revalidate: 300 },
      });

      if (metaRes.ok) {
        const metaJson = await metaRes.json();
        initialMetadataByPaperId = (metaJson.metadataByPaperId || {}) as Record<string, PaperMetadata>;
      }
    }
  } catch {
    // ignore SSR fetch errors; client will recover
  }

  return (
    <SynapsePageClient
      initialQuery={initialQuery}
      initialPapers={initialPapers}
      initialMetadataByPaperId={initialMetadataByPaperId}
      initialPosts={[]}
    />
  );
}
