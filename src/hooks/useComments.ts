"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "./useUser";

interface Comment {
  id: string;
  paperId: string;
  userId: string;
  displayName: string;
  content: string;
  createdAt: string;
}

export function useComments(paperId: string | null) {
  const { userId, displayName } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch comments for a paper
  const fetchComments = useCallback(async () => {
    if (!paperId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/comments?paperId=${encodeURIComponent(paperId)}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
        setCount(data.count || 0);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
    }
  }, [paperId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Add a new comment
  const addComment = useCallback(async (content: string, customDisplayName?: string): Promise<boolean> => {
    if (!paperId || !userId || !content.trim()) return false;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paperId,
          userId,
          displayName: customDisplayName || displayName || "Anonymous",
          content: content.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments((prev) => [data.comment, ...prev]);
        setCount((prev) => prev + 1);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding comment:", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [paperId, userId, displayName]);

  // Delete a comment
  const deleteComment = useCallback(async (commentId: string): Promise<boolean> => {
    if (!userId) return false;

    try {
      const response = await fetch(
        `/api/comments?commentId=${encodeURIComponent(commentId)}&userId=${encodeURIComponent(userId)}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        setCount((prev) => Math.max(0, prev - 1));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting comment:", error);
      return false;
    }
  }, [userId]);

  // Check if the current user owns a comment
  const isOwnComment = useCallback((comment: Comment): boolean => {
    return comment.userId === userId;
  }, [userId]);

  return {
    comments,
    count,
    isLoading,
    isSubmitting,
    addComment,
    deleteComment,
    isOwnComment,
    refetch: fetchComments,
  };
}
