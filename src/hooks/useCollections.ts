"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "synapse_collections";

interface Concept {
  id: string;
  name: string;
  score: number;
}

interface Paper {
  id: string;
  title: string;
  authors: string[];
  publicationDate: string;
  doi: string | null;
  abstract: string | null;
  citedByCount: number;
  journal: string | null;
  concepts?: Concept[];
  pdfUrl?: string | null;
  githubUrl?: string | null;
  arxivId?: string | null;
  isOpenAccess?: boolean;
  trendScore?: number;
}

interface Collection {
  id: string;
  name: string;
  papers: Paper[];
  createdAt: string;
}

const DEFAULT_COLLECTION: Collection = {
  id: "default",
  name: "Saved",
  papers: [],
  createdAt: new Date().toISOString(),
};

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([DEFAULT_COLLECTION]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure default collection exists
        if (!parsed.find((c: Collection) => c.id === "default")) {
          parsed.unshift(DEFAULT_COLLECTION);
        }
        setCollections(parsed);
      }
    } catch (error) {
      console.error("Error loading collections:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
    }
  }, [collections, isLoaded]);

  // Create a new collection
  const createCollection = useCallback((name: string): string => {
    const id = `collection_${Date.now()}`;
    const newCollection: Collection = {
      id,
      name,
      papers: [],
      createdAt: new Date().toISOString(),
    };
    setCollections((prev) => [...prev, newCollection]);
    return id;
  }, []);

  // Delete a collection (except default)
  const deleteCollection = useCallback((collectionId: string) => {
    if (collectionId === "default") return;
    setCollections((prev) => prev.filter((c) => c.id !== collectionId));
  }, []);

  // Rename a collection
  const renameCollection = useCallback((collectionId: string, newName: string) => {
    setCollections((prev) =>
      prev.map((c) => (c.id === collectionId ? { ...c, name: newName } : c))
    );
  }, []);

  // Add paper to a collection
  const addToCollection = useCallback((collectionId: string, paper: Paper) => {
    setCollections((prev) =>
      prev.map((c) => {
        if (c.id !== collectionId) return c;
        // Don't add duplicates
        if (c.papers.some((p) => p.id === paper.id)) return c;
        return { ...c, papers: [...c.papers, paper] };
      })
    );
  }, []);

  // Remove paper from a collection
  const removeFromCollection = useCallback((collectionId: string, paperId: string) => {
    setCollections((prev) =>
      prev.map((c) => {
        if (c.id !== collectionId) return c;
        return { ...c, papers: c.papers.filter((p) => p.id !== paperId) };
      })
    );
  }, []);

  // Check if paper is in a collection
  const isInCollection = useCallback(
    (collectionId: string, paperId: string): boolean => {
      const collection = collections.find((c) => c.id === collectionId);
      return collection?.papers.some((p) => p.id === paperId) || false;
    },
    [collections]
  );

  // Check if paper is in any collection
  const isBookmarked = useCallback(
    (paperId: string): boolean => {
      return collections.some((c) => c.papers.some((p) => p.id === paperId));
    },
    [collections]
  );

  // Get all collections containing a paper
  const getCollectionsForPaper = useCallback(
    (paperId: string): Collection[] => {
      return collections.filter((c) => c.papers.some((p) => p.id === paperId));
    },
    [collections]
  );

  // Get all bookmarked papers (from all collections, deduplicated)
  const getAllBookmarkedPapers = useCallback((): Paper[] => {
    const paperMap = new Map<string, Paper>();
    for (const collection of collections) {
      for (const paper of collection.papers) {
        if (!paperMap.has(paper.id)) {
          paperMap.set(paper.id, paper);
        }
      }
    }
    return Array.from(paperMap.values());
  }, [collections]);

  return {
    collections,
    isLoaded,
    createCollection,
    deleteCollection,
    renameCollection,
    addToCollection,
    removeFromCollection,
    isInCollection,
    isBookmarked,
    getCollectionsForPaper,
    getAllBookmarkedPapers,
  };
}
