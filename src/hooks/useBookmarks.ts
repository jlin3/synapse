"use client";

import { useState, useEffect, useCallback } from "react";

interface Paper {
  id: string;
  title: string;
  authors: string[];
  publicationDate: string;
  doi: string | null;
  abstract: string | null;
  citedByCount: number;
  journal: string | null;
}

const STORAGE_KEY = "synapse_bookmarks";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Paper[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setBookmarks(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever bookmarks change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
      } catch (error) {
        console.error("Error saving bookmarks:", error);
      }
    }
  }, [bookmarks, isLoaded]);

  const addBookmark = useCallback((paper: Paper) => {
    setBookmarks((prev) => {
      if (prev.some((p) => p.id === paper.id)) {
        return prev;
      }
      return [paper, ...prev];
    });
  }, []);

  const removeBookmark = useCallback((paperId: string) => {
    setBookmarks((prev) => prev.filter((p) => p.id !== paperId));
  }, []);

  const isBookmarked = useCallback(
    (paperId: string) => {
      return bookmarks.some((p) => p.id === paperId);
    },
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    (paper: Paper) => {
      if (isBookmarked(paper.id)) {
        removeBookmark(paper.id);
      } else {
        addBookmark(paper);
      }
    },
    [isBookmarked, addBookmark, removeBookmark]
  );

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    toggleBookmark,
    isLoaded,
  };
}
