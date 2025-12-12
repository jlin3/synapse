"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "synapse_history";
const MAX_HISTORY = 50;

interface HistoryItem {
  id: string;
  title: string;
  viewedAt: string;
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading history:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
  }, [history, isLoaded]);

  const addToHistory = useCallback((id: string, title: string) => {
    setHistory((prev) => {
      // Remove existing entry if present
      const filtered = prev.filter((item) => item.id !== id);
      // Add new entry at the beginning
      const newHistory = [
        { id, title, viewedAt: new Date().toISOString() },
        ...filtered,
      ].slice(0, MAX_HISTORY);
      return newHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const removeFromHistory = useCallback((id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return {
    history,
    isLoaded,
    addToHistory,
    clearHistory,
    removeFromHistory,
  };
}
