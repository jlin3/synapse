"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "synapse_user";

interface User {
  id: string;
  displayName: string | null;
  createdAt: string;
}

function generateUserId(): string {
  // Generate a random ID
  return (
    "user_" +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } else {
        // Create a new anonymous user
        const newUser: User = {
          id: generateUserId(),
          displayName: null,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
        setUser(newUser);
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error);
      // Create a new user if there's an error
      const newUser: User = {
        id: generateUserId(),
        displayName: null,
        createdAt: new Date().toISOString(),
      };
      setUser(newUser);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Update display name
  const setDisplayName = useCallback((name: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, displayName: name };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Get user ID (or generate one if not loaded)
  const getUserId = useCallback((): string => {
    if (user) return user.id;
    // Fallback: try to get from localStorage directly
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.id;
      }
    } catch {
      // Ignore
    }
    return generateUserId();
  }, [user]);

  return {
    user,
    userId: user?.id || null,
    displayName: user?.displayName || null,
    isLoaded,
    setDisplayName,
    getUserId,
  };
}
