"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PaperCard from "./PaperCard";
import PaperDetailModal from "./PaperDetailModal";
import { Loader2, Bookmark } from "lucide-react";
import { useBookmarks } from "@/hooks/useBookmarks";

interface Paper {
  id: string;
  title: string;
  authors: string[];
  publicationDate: string;
  doi: string | null;
  abstract: string | null;
  citedByCount: number;
  journal: string | null;
}

interface PaperListProps {
  papers: Paper[];
  loading: boolean;
  sortBy: "recent" | "top";
  onSortChange: (sort: "recent" | "top") => void;
}

type ViewType = "all" | "saved";

export default function PaperList({
  papers,
  loading,
  sortBy,
  onSortChange,
}: PaperListProps) {
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<ViewType>("all");
  
  const { bookmarks, isBookmarked, toggleBookmark, isLoaded } = useBookmarks();

  const handlePaperClick = (paper: Paper) => {
    setSelectedPaper(paper);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Delay clearing the paper to allow exit animation
    setTimeout(() => setSelectedPaper(null), 300);
  };

  const displayedPapers = view === "saved" ? bookmarks : papers;

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">
              Research Papers
            </h2>
            {isLoaded && bookmarks.length > 0 && (
              <span className="text-xs text-zinc-500">
                ({bookmarks.length} saved)
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex rounded-lg bg-zinc-800/50 p-1 border border-zinc-700/50">
              <button
                onClick={() => setView("all")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  view === "all"
                    ? "bg-zinc-700 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setView("saved")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-1.5 ${
                  view === "saved"
                    ? "bg-zinc-700 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${view === "saved" ? "fill-current" : ""}`} />
                Saved
              </button>
            </div>

            {/* Sort Toggle - only show for "all" view */}
            {view === "all" && (
              <>
                <span className="text-sm text-zinc-500">Sort:</span>
                <div className="flex rounded-lg bg-zinc-800/50 p-1 border border-zinc-700/50">
                  <button
                    onClick={() => onSortChange("recent")}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                      sortBy === "recent"
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Recent
                  </button>
                  <button
                    onClick={() => onSortChange("top")}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                      sortBy === "top"
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Top
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
              <p className="text-sm text-zinc-500">Loading papers...</p>
            </motion.div>
          </div>
        ) : displayedPapers.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              {view === "saved" ? (
                <>
                  <Bookmark className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                  <p className="text-zinc-500">No saved papers yet</p>
                  <p className="text-sm text-zinc-600 mt-1">
                    Click the bookmark icon on any paper to save it
                  </p>
                </>
              ) : (
                <p className="text-zinc-500">No papers found</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 -mr-2">
            {displayedPapers.map((paper, index) => (
              <PaperCard
                key={paper.id}
                title={paper.title}
                authors={paper.authors}
                publicationDate={paper.publicationDate}
                abstract={paper.abstract}
                citedByCount={paper.citedByCount}
                journal={paper.journal}
                doi={paper.doi}
                index={index}
                onClick={() => handlePaperClick(paper)}
                isBookmarked={isBookmarked(paper.id)}
                onToggleBookmark={() => toggleBookmark(paper)}
              />
            ))}
          </div>
        )}
      </div>

      <PaperDetailModal
        paper={selectedPaper}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isBookmarked={selectedPaper ? isBookmarked(selectedPaper.id) : false}
        onToggleBookmark={selectedPaper ? () => toggleBookmark(selectedPaper) : undefined}
      />
    </>
  );
}
