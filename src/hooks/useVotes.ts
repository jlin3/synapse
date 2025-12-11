"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "./useUser";

interface VoteData {
  paperId: string;
  upvotes: number;
  downvotes: number;
  score: number;
  userVote: "up" | "down" | null;
}

export function useVotes(paperIds: string[]) {
  const { userId, isLoaded: userLoaded } = useUser();
  const [votes, setVotes] = useState<Record<string, VoteData>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch votes for papers
  const fetchVotes = useCallback(async () => {
    if (paperIds.length === 0 || !userLoaded) return;

    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("paperIds", paperIds.join(","));
      if (userId) {
        params.set("userId", userId);
      }

      const response = await fetch(`/api/votes?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setVotes(data.votes || {});
      }
    } catch (error) {
      console.error("Error fetching votes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [paperIds.join(","), userId, userLoaded]);

  useEffect(() => {
    fetchVotes();
  }, [fetchVotes]);

  // Cast a vote
  const vote = useCallback(async (paperId: string, voteType: "up" | "down" | null) => {
    if (!userId) return;

    // Optimistic update
    setVotes((prev) => {
      const current = prev[paperId] || {
        paperId,
        upvotes: 0,
        downvotes: 0,
        score: 0,
        userVote: null,
      };

      const newVote = { ...current };
      
      // Remove previous vote count
      if (current.userVote === "up") {
        newVote.upvotes--;
      } else if (current.userVote === "down") {
        newVote.downvotes--;
      }

      // Add new vote count
      if (voteType === "up") {
        newVote.upvotes++;
      } else if (voteType === "down") {
        newVote.downvotes++;
      }

      newVote.score = newVote.upvotes - newVote.downvotes;
      newVote.userVote = voteType;

      return { ...prev, [paperId]: newVote };
    });

    try {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paperId, userId, voteType }),
      });

      if (response.ok) {
        const data = await response.json();
        setVotes((prev) => ({ ...prev, [paperId]: data.vote }));
      }
    } catch (error) {
      console.error("Error casting vote:", error);
      // Revert on error
      fetchVotes();
    }
  }, [userId, fetchVotes]);

  const getVote = useCallback((paperId: string): VoteData => {
    return votes[paperId] || {
      paperId,
      upvotes: 0,
      downvotes: 0,
      score: 0,
      userVote: null,
    };
  }, [votes]);

  const toggleUpvote = useCallback((paperId: string) => {
    const current = getVote(paperId);
    const newVoteType = current.userVote === "up" ? null : "up";
    vote(paperId, newVoteType);
  }, [getVote, vote]);

  const toggleDownvote = useCallback((paperId: string) => {
    const current = getVote(paperId);
    const newVoteType = current.userVote === "down" ? null : "down";
    vote(paperId, newVoteType);
  }, [getVote, vote]);

  return {
    votes,
    isLoading,
    getVote,
    toggleUpvote,
    toggleDownvote,
    refetch: fetchVotes,
  };
}
