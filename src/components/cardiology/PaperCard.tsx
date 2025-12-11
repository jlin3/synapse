"use client";

import { motion } from "framer-motion";
import { Calendar, Quote, Users, ExternalLink, Bookmark, ChevronUp, ChevronDown, MessageSquare } from "lucide-react";

interface PaperCardProps {
  title: string;
  authors: string[];
  publicationDate: string;
  abstract: string | null;
  citedByCount: number;
  journal: string | null;
  doi: string | null;
  index: number;
  onClick?: () => void;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  // Voting props
  voteScore?: number;
  userVote?: "up" | "down" | null;
  onUpvote?: () => void;
  onDownvote?: () => void;
  // Comment count
  commentCount?: number;
  // Methodology badges
  badges?: string[];
  rigorLevel?: "high" | "medium" | "low" | null;
}

export default function PaperCard({
  title,
  authors,
  publicationDate,
  abstract,
  citedByCount,
  journal,
  doi,
  index,
  onClick,
  isBookmarked,
  onToggleBookmark,
  voteScore = 0,
  userVote,
  onUpvote,
  onDownvote,
  commentCount = 0,
  badges = [],
  rigorLevel,
}: PaperCardProps) {
  const formattedDate = new Date(publicationDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const truncatedAbstract = abstract
    ? abstract.length > 200
      ? abstract.slice(0, 200) + "..."
      : abstract
    : null;

  const handleExternalLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleBookmark?.();
  };

  const handleUpvoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpvote?.();
  };

  const handleDownvoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownvote?.();
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={onClick}
      className="group p-5 bg-zinc-900/50 rounded-xl border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-300 cursor-pointer"
    >
      <div className="flex gap-3">
        {/* Vote buttons on the left */}
        {(onUpvote || onDownvote) && (
          <div className="flex flex-col items-center gap-0.5 shrink-0">
            <button
              onClick={handleUpvoteClick}
              className={`p-1 rounded-md transition-colors ${
                userVote === "up"
                  ? "text-green-400 bg-green-500/10"
                  : "text-zinc-500 hover:text-green-400 hover:bg-green-500/10"
              }`}
              aria-label="Upvote"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <span
              className={`text-sm font-semibold tabular-nums ${
                voteScore > 0
                  ? "text-green-400"
                  : voteScore < 0
                  ? "text-red-400"
                  : "text-zinc-500"
              }`}
            >
              {voteScore}
            </span>
            <button
              onClick={handleDownvoteClick}
              className={`p-1 rounded-md transition-colors ${
                userVote === "down"
                  ? "text-red-400 bg-red-500/10"
                  : "text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
              }`}
              aria-label="Downvote"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-base font-semibold text-white leading-snug group-hover:text-purple-400 transition-colors">
              {title}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              {onToggleBookmark && (
                <button
                  onClick={handleBookmarkClick}
                  className={`p-2 rounded-lg hover:bg-zinc-800 transition-colors ${
                    isBookmarked ? "text-purple-400" : "text-zinc-500 hover:text-purple-400"
                  }`}
                  aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                >
                  <Bookmark
                    className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
                  />
                </button>
              )}
              {doi && (
                <a
                  href={`https://doi.org/${doi.replace("https://doi.org/", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleExternalLinkClick}
                  className="p-2 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-500 hover:text-purple-400"
                  aria-label="Open paper"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span className="truncate max-w-[200px]">
                {authors.slice(0, 3).join(", ")}
                {authors.length > 3 && ` +${authors.length - 3}`}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            {citedByCount > 0 && (
              <div className="flex items-center gap-1.5">
                <Quote className="w-4 h-4" />
                <span>{citedByCount} citations</span>
              </div>
            )}
            {commentCount > 0 && (
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" />
                <span>{commentCount} comments</span>
              </div>
            )}
          </div>

          {/* Journal and Methodology Badges */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {journal && (
              <span className="inline-block px-2 py-0.5 bg-purple-500/10 text-purple-400 text-xs font-medium rounded-full border border-purple-500/20">
                {journal}
              </span>
            )}
            {rigorLevel && (
              <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border ${
                rigorLevel === "high"
                  ? "bg-green-500/10 text-green-400 border-green-500/20"
                  : rigorLevel === "medium"
                  ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                  : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
              }`}>
                {rigorLevel === "high" ? "High Rigor" : rigorLevel === "medium" ? "Medium Rigor" : "Low Rigor"}
              </span>
            )}
            {badges.slice(0, 2).map((badge, i) => (
              <span
                key={i}
                className="inline-block px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-xs font-medium rounded-full border border-cyan-500/20"
              >
                {badge}
              </span>
            ))}
          </div>

          {truncatedAbstract && (
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
              {truncatedAbstract}
            </p>
          )}
        </div>
      </div>
    </motion.article>
  );
}
