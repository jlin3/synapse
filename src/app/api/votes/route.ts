import { NextResponse } from "next/server";

// In-memory store for votes (in production, use a database)
// Structure: { paperId: { upvotes: Set<userId>, downvotes: Set<userId> } }
const votesStore = new Map<string, { upvotes: Set<string>; downvotes: Set<string> }>();

interface VoteData {
  paperId: string;
  upvotes: number;
  downvotes: number;
  score: number;
  userVote: "up" | "down" | null;
}

function getVoteData(paperId: string, userId?: string): VoteData {
  const paperVotes = votesStore.get(paperId);
  if (!paperVotes) {
    return {
      paperId,
      upvotes: 0,
      downvotes: 0,
      score: 0,
      userVote: null,
    };
  }

  let userVote: "up" | "down" | null = null;
  if (userId) {
    if (paperVotes.upvotes.has(userId)) {
      userVote = "up";
    } else if (paperVotes.downvotes.has(userId)) {
      userVote = "down";
    }
  }

  return {
    paperId,
    upvotes: paperVotes.upvotes.size,
    downvotes: paperVotes.downvotes.size,
    score: paperVotes.upvotes.size - paperVotes.downvotes.size,
    userVote,
  };
}

// GET: Get vote counts for one or more papers
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const paperIds = searchParams.get("paperIds")?.split(",") || [];
  const userId = searchParams.get("userId") || undefined;

  if (paperIds.length === 0) {
    return NextResponse.json({ error: "paperIds required" }, { status: 400 });
  }

  const votes: Record<string, VoteData> = {};
  for (const paperId of paperIds) {
    votes[paperId] = getVoteData(paperId, userId);
  }

  return NextResponse.json({ votes });
}

// POST: Cast or remove a vote
export async function POST(request: Request) {
  try {
    const { paperId, userId, voteType } = await request.json();

    if (!paperId || !userId) {
      return NextResponse.json(
        { error: "paperId and userId are required" },
        { status: 400 }
      );
    }

    if (voteType && voteType !== "up" && voteType !== "down") {
      return NextResponse.json(
        { error: "voteType must be 'up', 'down', or null" },
        { status: 400 }
      );
    }

    // Initialize paper votes if not exists
    if (!votesStore.has(paperId)) {
      votesStore.set(paperId, { upvotes: new Set(), downvotes: new Set() });
    }

    const paperVotes = votesStore.get(paperId)!;

    // Remove existing vote
    paperVotes.upvotes.delete(userId);
    paperVotes.downvotes.delete(userId);

    // Add new vote if specified
    if (voteType === "up") {
      paperVotes.upvotes.add(userId);
    } else if (voteType === "down") {
      paperVotes.downvotes.add(userId);
    }

    const voteData = getVoteData(paperId, userId);

    return NextResponse.json({
      success: true,
      vote: voteData,
    });
  } catch (error) {
    console.error("Error processing vote:", error);
    return NextResponse.json(
      { error: "Failed to process vote" },
      { status: 500 }
    );
  }
}
