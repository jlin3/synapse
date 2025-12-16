"use client";

import { useState, useEffect, useCallback } from "react";
import { PaperMetadata } from "@/types";

interface PaperInput {
  id: string;
  title: string;
  abstract: string | null;
}

// Local cache to avoid refetching during the session
const sessionCache = new Map<string, PaperMetadata>();

export function usePaperMetadata(papers: PaperInput[]) {
  const [metadata, setMetadata] = useState<Record<string, PaperMetadata>>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchMetadata = useCallback(async () => {
    if (papers.length === 0) return;

    // Filter papers that we don't have metadata for
    const papersToFetch = papers.filter((p) => !sessionCache.has(p.id) && !metadata[p.id]);

    if (papersToFetch.length === 0) {
      // Use cached data
      const cached: Record<string, PaperMetadata> = {};
      papers.forEach((p) => {
        const cachedData = sessionCache.get(p.id);
        if (cachedData) cached[p.id] = cachedData;
      });
      if (Object.keys(cached).length > 0) {
        setMetadata((prev) => ({ ...prev, ...cached }));
      }
      return;
    }

    setIsLoading(true);
    // Batch request to reduce N network calls -> 1 call
    try {
      const response = await fetch("/api/paper-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          papers: papersToFetch.map((p) => ({ paperId: p.id, title: p.title, abstract: p.abstract })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const results = (data.metadataByPaperId || {}) as Record<string, PaperMetadata>;

        if (results && typeof results === "object") {
          Object.entries(results).forEach(([paperId, paperMetadata]) => {
            if (paperMetadata) sessionCache.set(paperId, paperMetadata);
          });
          setMetadata((prev) => ({ ...prev, ...results }));
        }
      }
    } catch (error) {
      console.error("Error fetching paper metadata batch:", error);
    }

    setIsLoading(false);
  }, [papers.map((p) => p.id).join(",")]);

  useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  const getMetadata = useCallback(
    (paperId: string): PaperMetadata | null => {
      return metadata[paperId] || sessionCache.get(paperId) || null;
    },
    [metadata]
  );

  const getBadges = useCallback(
    (paperId: string): string[] => {
      const data = getMetadata(paperId);
      return data?.badges || [];
    },
    [getMetadata]
  );

  const getRigorLevel = useCallback(
    (paperId: string): "high" | "medium" | "low" | null => {
      const data = getMetadata(paperId);
      return data?.rigorLevel || null;
    },
    [getMetadata]
  );

  return {
    metadata,
    isLoading,
    getMetadata,
    getBadges,
    getRigorLevel,
    refetch: fetchMetadata,
  };
}
