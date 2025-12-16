"use client";

import { motion } from "framer-motion";
import PostCard from "./PostCard";
import { Loader2 } from "lucide-react";

interface SocialPost {
  id: string;
  content: string;
  author: string;
  handle: string;
  timestamp: string;
  url: string | null;
  likes?: number;
  retweets?: number;
}

interface SocialFeedProps {
  posts: SocialPost[];
  loading: boolean;
}

export default function SocialFeed({ posts, loading }: SocialFeedProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 text-[color:var(--foreground)] bg-[var(--chip-surface)] border border-[color:var(--chip-border)] rounded-lg">
          <XLogo />
        </div>
        <h2 className="text-xl font-bold text-[color:var(--foreground)]">Social Feed</h2>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
            <p className="text-sm text-[color:var(--foreground-muted)]">Finding posts...</p>
          </motion.div>
        </div>
      ) : posts.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-[color:var(--foreground-muted)]">No posts found</p>
            <p className="text-sm text-[color:var(--foreground-subtle)] mt-1">
              Try searching for a different topic
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 -mr-2">
          {posts.map((post, index) => (
            <PostCard
              key={post.id}
              content={post.content}
              author={post.author}
              handle={post.handle}
              timestamp={post.timestamp}
              url={post.url}
              likes={post.likes}
              retweets={post.retweets}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function XLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        fill="currentColor"
      />
    </svg>
  );
}
