import { NextResponse } from "next/server";

interface Comment {
  id: string;
  paperId: string;
  userId: string;
  displayName: string;
  content: string;
  createdAt: string;
}

// In-memory store for comments (in production, use a database)
const commentsStore = new Map<string, Comment[]>();

function generateCommentId(): string {
  return "comment_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

// GET: Fetch comments for a paper
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const paperId = searchParams.get("paperId");

  if (!paperId) {
    return NextResponse.json({ error: "paperId required" }, { status: 400 });
  }

  const comments = commentsStore.get(paperId) || [];

  // Sort by newest first
  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return NextResponse.json({
    comments: sortedComments,
    count: sortedComments.length,
  });
}

// POST: Add a new comment
export async function POST(request: Request) {
  try {
    const { paperId, userId, displayName, content } = await request.json();

    if (!paperId || !userId || !content) {
      return NextResponse.json(
        { error: "paperId, userId, and content are required" },
        { status: 400 }
      );
    }

    if (content.trim().length === 0) {
      return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 });
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: "Comment is too long (max 2000 characters)" },
        { status: 400 }
      );
    }

    const newComment: Comment = {
      id: generateCommentId(),
      paperId,
      userId,
      displayName: displayName || "Anonymous",
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    // Add to store
    if (!commentsStore.has(paperId)) {
      commentsStore.set(paperId, []);
    }
    commentsStore.get(paperId)!.push(newComment);

    return NextResponse.json({
      success: true,
      comment: newComment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}

// DELETE: Remove a comment (only by the user who created it)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("commentId");
    const userId = searchParams.get("userId");

    if (!commentId || !userId) {
      return NextResponse.json({ error: "commentId and userId are required" }, { status: 400 });
    }

    // Find and remove the comment
    for (const [paperId, comments] of commentsStore.entries()) {
      const index = comments.findIndex((c) => c.id === commentId && c.userId === userId);
      if (index !== -1) {
        comments.splice(index, 1);
        return NextResponse.json({ success: true });
      }
    }

    return NextResponse.json(
      { error: "Comment not found or you don't have permission to delete it" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
