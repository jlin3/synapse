"use client";

import { motion } from "framer-motion";
import { Heart, Repeat2, ExternalLink } from "lucide-react";

interface PostCardProps {
  content: string;
  author: string;
  handle: string;
  timestamp: string;
  url: string | null;
  likes?: number;
  retweets?: number;
  index: number;
}

// Format timestamp to relative time (e.g., "2h", "1d", "Dec 15")
function formatTimestamp(ts: string): string {
  if (!ts) return "";
  
  // If already in relative format (e.g., "2h", "1d"), return as-is
  if (/^\d+[mhdw]$/.test(ts.trim())) {
    return ts;
  }
  
  // Try to parse as ISO date
  const date = new Date(ts);
  if (isNaN(date.getTime())) {
    // If can't parse, return original (might already be formatted)
    return ts;
  }
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  
  // For older posts, show date
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

export default function PostCard({
  content,
  author,
  handle,
  timestamp,
  url,
  likes,
  retweets,
  index,
}: PostCardProps) {
  const handleClick = () => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={handleClick}
      className={`p-4 bg-[var(--surface-1)] rounded-xl border border-[color:var(--panel-border)] hover:border-[color:var(--card-border)] hover:bg-[var(--surface-1-hover)] transition-all duration-300 ${
        url ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">{author.charAt(0).toUpperCase()}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-[color:var(--foreground)] truncate">{author}</span>
            <span className="text-[color:var(--foreground-muted)] text-sm truncate">{handle}</span>
            <span className="text-[color:var(--foreground-subtle)]">·</span>
            <span className="text-[color:var(--foreground-muted)] text-sm shrink-0">{formatTimestamp(timestamp)}</span>
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="ml-auto shrink-0 p-1 rounded hover:bg-[var(--button-surface)] transition-colors"
                aria-label="Open on X"
              >
                <ExternalLink className="w-4 h-4 text-[color:var(--foreground-subtle)] hover:text-[color:var(--accent-purple)]" />
              </a>
            )}
          </div>

          <p className="mt-2 text-[color:var(--foreground)] text-sm leading-relaxed whitespace-pre-wrap">
            {content}
          </p>

          <div className="mt-3 flex items-center gap-4 text-[color:var(--foreground-muted)]">
            {likes !== undefined && likes > 0 && (
              <div className="flex items-center gap-1.5 text-sm hover:text-pink-500 transition-colors">
                <Heart className="w-4 h-4" />
                <span>{formatNumber(likes)}</span>
              </div>
            )}
            {retweets !== undefined && retweets > 0 && (
              <div className="flex items-center gap-1.5 text-sm hover:text-cyan-500 transition-colors">
                <Repeat2 className="w-4 h-4" />
                <span>{formatNumber(retweets)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}
