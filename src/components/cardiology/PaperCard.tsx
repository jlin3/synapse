"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  ExternalLink,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Github,
  Sparkles,
  ChevronDown,
  Check,
  FolderPlus,
  Shield,
  Beaker,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";

interface Concept {
  id: string;
  name: string;
  score: number;
}

interface Collection {
  id: string;
  name: string;
}

interface PaperCardProps {
  id: string;
  title: string;
  authors: string[];
  publicationDate: string;
  abstract: string | null;
  citedByCount: number;
  journal: string | null;
  doi: string | null;
  index: number;
  onClick?: () => void;
  // Paper metadata
  concepts?: Concept[];
  pdfUrl?: string | null;
  githubUrl?: string | null;
  arxivId?: string | null;
  isOpenAccess?: boolean;
  trendScore?: number;
  // Methodology (restored)
  badges?: string[];
  rigorLevel?: "high" | "medium" | "low" | null;
  // Interactions
  likeCount?: number;
  isLiked?: boolean;
  onLike?: () => void;
  dislikeCount?: number;
  isDisliked?: boolean;
  onDislike?: () => void;
  commentCount?: number;
  // Collections
  collections?: Collection[];
  savedCollections?: string[];
  onSaveToCollection?: (collectionId: string) => void;
  onCreateCollection?: (name: string) => void;
  // Tag click
  onTagClick?: (tag: string) => void;
}

// Rigor level configuration
const rigorConfig = {
  high: {
    label: "High Rigor",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    icon: Shield,
  },
  medium: {
    label: "Medium Rigor",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    icon: Shield,
  },
  low: {
    label: "Low Rigor",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    icon: Beaker,
  },
};

export default function PaperCard({
  id,
  title,
  authors,
  publicationDate,
  abstract,
  citedByCount,
  journal,
  doi,
  index,
  onClick,
  concepts = [],
  pdfUrl,
  githubUrl,
  arxivId,
  isOpenAccess,
  trendScore = 0,
  badges = [],
  rigorLevel,
  likeCount = 0,
  isLiked = false,
  onLike,
  dislikeCount = 0,
  isDisliked = false,
  onDislike,
  commentCount = 0,
  collections = [],
  savedCollections = [],
  onSaveToCollection,
  onCreateCollection,
  onTagClick,
}: PaperCardProps) {
  const [showBookmarkMenu, setShowBookmarkMenu] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [showNewCollectionInput, setShowNewCollectionInput] = useState(false);

  const formattedDate = new Date(publicationDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Longer abstract for more context (350 chars)
  const truncatedAbstract = abstract
    ? abstract.length > 350
      ? abstract.slice(0, 350) + "..."
      : abstract
    : null;

  const handleExternalLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike?.();
  };

  const handleDislikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDislike?.();
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowBookmarkMenu(!showBookmarkMenu);
  };

  const handleSaveToCollection = (collectionId: string) => {
    onSaveToCollection?.(collectionId);
  };

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      onCreateCollection?.(newCollectionName.trim());
      setNewCollectionName("");
      setShowNewCollectionInput(false);
    }
  };

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    onTagClick?.(tag);
  };

  const isSaved = savedCollections.length > 0;
  const rigor = rigorLevel ? rigorConfig[rigorLevel] : null;
  const RigorIcon = rigor?.icon || Shield;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      onClick={onClick}
      data-paper-id={id}
      className="group bg-[var(--surface-1)] rounded-xl border border-[color:var(--panel-border)] hover:border-[color:var(--card-border)] hover:bg-[var(--surface-1-hover)] transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className="p-4">
        {/* Top row - Badges */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-xs text-[color:var(--foreground-muted)]">{formattedDate}</span>

          {/* Citation count with trend */}
          <div className="flex items-center gap-1 px-2 py-0.5 bg-[var(--chip-surface)] border border-[color:var(--chip-border)] rounded-full">
            <BarChart3 className="w-3 h-3 text-[color:var(--foreground-subtle)]" />
            <span className="text-[10px] font-medium text-[color:var(--foreground)]">
              {citedByCount.toLocaleString()}
            </span>
            {trendScore !== 0 && (
              <span className={trendScore > 0 ? "text-green-400" : "text-red-400"}>
                {trendScore > 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
              </span>
            )}
          </div>

          {/* Rigor badge */}
          {rigor && (
            <div
              className={`flex items-center gap-1 px-2 py-0.5 ${rigor.bg} rounded-full border ${rigor.border}`}
            >
              <RigorIcon className={`w-3 h-3 ${rigor.color}`} />
              <span className={`text-[10px] font-medium ${rigor.color}`}>{rigor.label}</span>
            </div>
          )}

          {/* Open Access */}
          {isOpenAccess && (
            <span className="text-[10px] px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
              Open Access
            </span>
          )}

          {/* Methodology badges (RCT, Meta-Analysis, etc.) */}
          {badges.slice(0, 3).map((badge) => (
            <span
              key={badge}
              className="px-2 py-0.5 text-[10px] font-medium bg-purple-500/15 text-purple-400 rounded-full border border-purple-500/25"
            >
              {badge}
            </span>
          ))}

          {/* Topic tags */}
          {concepts.slice(0, 2).map((concept) => (
            <button
              key={concept.id}
              onClick={(e) => handleTagClick(e, concept.name)}
              className="px-2 py-0.5 text-[10px] bg-[var(--chip-surface)] text-[color:var(--foreground-muted)] rounded-full border border-[color:var(--chip-border)] hover:border-purple-500/40 hover:text-purple-400 transition-colors"
            >
              {concept.name.toLowerCase().replace(/\s+/g, "-")}
            </button>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-[color:var(--foreground)] leading-snug group-hover:text-purple-400 transition-colors mb-2">
          {title}
        </h3>

        {/* Authors and Journal */}
        <div className="flex items-center gap-3 text-xs text-[color:var(--foreground-muted)] mb-2">
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span className="truncate max-w-[200px]">
              {authors.slice(0, 3).join(", ")}
              {authors.length > 3 && ` +${authors.length - 3}`}
            </span>
          </div>
          {journal && (
            <span className="px-2 py-0.5 bg-[var(--chip-surface)] border border-[color:var(--chip-border)] text-[color:var(--foreground-muted)] text-[10px] rounded-full truncate max-w-[180px]">
              {journal}
            </span>
          )}
        </div>

        {/* Abstract with AI sparkles */}
        {truncatedAbstract && (
          <div className="relative mb-3">
            <Sparkles className="absolute -left-0.5 top-0.5 w-3.5 h-3.5 text-purple-500/40" />
            <p className="text-xs text-[color:var(--foreground-muted)] leading-relaxed pl-4 line-clamp-3">
              {truncatedAbstract}
            </p>
          </div>
        )}

        {/* Bottom row - Actions */}
        <div className="flex items-center justify-end pt-3 border-t border-[color:var(--divider)]">
          <div className="flex items-center gap-2">
            {/* PDF link */}
            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleExternalLinkClick}
                className="flex items-center gap-1 px-2 py-1 text-[10px] text-[color:var(--foreground-muted)] hover:text-[color:var(--foreground)] bg-[var(--chip-surface)] rounded-lg border border-[color:var(--chip-border)] hover:border-[color:var(--card-border)] transition-colors"
              >
                <span>PDF</span>
              </a>
            )}

            {/* arXiv link */}
            {arxivId && (
              <a
                href={`https://arxiv.org/abs/${arxivId}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleExternalLinkClick}
                className="flex items-center gap-1 px-2 py-1 text-[10px] text-[color:var(--foreground-muted)] hover:text-[color:var(--foreground)] bg-[var(--chip-surface)] rounded-lg border border-[color:var(--chip-border)] hover:border-[color:var(--card-border)] transition-colors"
              >
                <span>arXiv</span>
              </a>
            )}

            {/* GitHub link */}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleExternalLinkClick}
                className="flex items-center gap-1 px-2 py-1 text-[10px] text-[color:var(--foreground-muted)] hover:text-[color:var(--foreground)] bg-[var(--chip-surface)] rounded-lg border border-[color:var(--chip-border)] hover:border-[color:var(--card-border)] transition-colors"
              >
                <Github className="w-3 h-3" />
                <span>Code</span>
              </a>
            )}

            {/* Comments count */}
            {commentCount > 0 && (
              <span className="flex items-center gap-1 px-2 py-1 text-xs text-zinc-500">
                <MessageSquare className="w-3.5 h-3.5" />
                {commentCount}
              </span>
            )}

            {/* Bookmark with dropdown */}
            <div className="relative">
              <button
                onClick={handleBookmarkClick}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg border transition-colors ${
                  isSaved
                    ? "text-purple-400 bg-purple-500/10 border-purple-500/30"
                    : "text-[color:var(--foreground-muted)] bg-[var(--chip-surface)] border-[color:var(--chip-border)] hover:text-purple-400 hover:border-purple-500/30"
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                <ChevronDown className="w-3 h-3" />
              </button>

              {/* Bookmark dropdown */}
              <AnimatePresence>
                {showBookmarkMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowBookmarkMenu(false);
                      }}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 bottom-full mb-2 w-52 bg-[var(--surface-2)] border border-[color:var(--chip-border)] rounded-xl shadow-xl overflow-hidden z-20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-2 border-b border-[color:var(--divider)]">
                        <p className="text-[10px] text-[color:var(--foreground-subtle)] px-2">Save to collection</p>
                      </div>
                      <div className="max-h-40 overflow-y-auto">
                        {collections.map((collection) => {
                          const isInCollection = savedCollections.includes(collection.id);
                          return (
                            <button
                              key={collection.id}
                              onClick={() => handleSaveToCollection(collection.id)}
                              className="w-full px-3 py-2 flex items-center justify-between text-xs text-[color:var(--foreground)] hover:bg-[var(--surface-2-hover)] transition-colors"
                            >
                              <span>{collection.name}</span>
                              {isInCollection && <Check className="w-3.5 h-3.5 text-purple-400" />}
                            </button>
                          );
                        })}
                      </div>
                      <div className="p-2 border-t border-[color:var(--divider)]">
                        {showNewCollectionInput ? (
                          <div className="flex gap-1">
                            <input
                              type="text"
                              value={newCollectionName}
                              onChange={(e) => setNewCollectionName(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleCreateCollection()}
                              placeholder="Name"
                              className="flex-1 px-2 py-1 bg-[var(--input-surface)] border border-[color:var(--chip-border)] rounded text-xs text-[color:var(--foreground)] focus:outline-none focus:border-purple-500/50"
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                            />
                            <button
                              onClick={handleCreateCollection}
                              className="px-2 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600 transition-colors"
                            >
                              Add
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowNewCollectionInput(true)}
                            className="w-full px-3 py-1.5 flex items-center gap-2 text-xs text-purple-400 hover:bg-[var(--surface-2-hover)] rounded transition-colors"
                          >
                            <FolderPlus className="w-3.5 h-3.5" />
                            New collection
                          </button>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Like/Dislike buttons */}
            <div className="flex items-center">
              <button
                onClick={handleLikeClick}
                className={`flex items-center gap-1 px-2 py-1 rounded-l-lg border-y border-l transition-colors ${
                  isLiked
                    ? "text-green-400 bg-green-500/10 border-green-500/30"
                    : "text-[color:var(--foreground-muted)] bg-[var(--chip-surface)] border-[color:var(--chip-border)] hover:text-green-400 hover:border-green-500/30"
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? "fill-current" : ""}`} />
                <span className="text-xs font-medium">{likeCount}</span>
              </button>
              <button
                onClick={handleDislikeClick}
                className={`flex items-center gap-1 px-2 py-1 rounded-r-lg border transition-colors ${
                  isDisliked
                    ? "text-red-400 bg-red-500/10 border-red-500/30"
                    : "text-[color:var(--foreground-muted)] bg-[var(--chip-surface)] border-[color:var(--chip-border)] hover:text-red-400 hover:border-red-500/30"
                }`}
              >
                <ThumbsDown className={`w-3.5 h-3.5 ${isDisliked ? "fill-current" : ""}`} />
                <span className="text-xs font-medium">{dislikeCount}</span>
              </button>
            </div>

            {/* External link */}
            {doi && (
              <a
                href={`https://doi.org/${doi.replace("https://doi.org/", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleExternalLinkClick}
                className="p-1.5 rounded-lg text-[color:var(--foreground-subtle)] hover:text-purple-400 hover:bg-[var(--button-surface)] transition-colors"
                aria-label="Open paper"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
