"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import PaperCard from "./PaperCard";
import PaperDetailModal from "./PaperDetailModal";
import FilterPanel, { SortOption } from "./FilterPanel";
import { Loader2, Bookmark } from "lucide-react";
import { useCollections } from "@/hooks/useCollections";
import { useVotes } from "@/hooks/useVotes";
import { usePaperMetadata } from "@/hooks/usePaperMetadata";
import { Paper } from "@/types";

interface FilterState {
  sortBy: SortOption;
  minCitations: number | null;
  dateRange: string | null;
  studyType: string | null;
}

interface PaperListProps {
  papers: Paper[];
  loading: boolean;
  onFilterChange?: (filters: FilterState) => void;
  onTagClick?: (tag: string) => void;
}

type ViewType = "all" | "saved";

export default function PaperList({ papers, loading, onFilterChange, onTagClick }: PaperListProps) {
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<ViewType>("all");
  const [filters, setFilters] = useState<FilterState>({
    sortBy: "hot",
    minCitations: null,
    dateRange: null,
    studyType: null,
  });

  const {
    collections,
    getAllBookmarkedPapers,
    addToCollection,
    removeFromCollection,
    isInCollection,
    createCollection,
    getCollectionsForPaper,
  } = useCollections();

  // Get all paper IDs for vote fetching
  const paperIds = useMemo(() => {
    const allPapers = view === "saved" ? getAllBookmarkedPapers() : papers;
    return allPapers.map((p) => p.id);
  }, [papers, view, getAllBookmarkedPapers]);

  const { getVote, toggleUpvote, toggleDownvote } = useVotes(paperIds);

  // Get papers for metadata fetching
  const papersForMetadata = useMemo(() => {
    const allPapers = view === "saved" ? getAllBookmarkedPapers() : papers;
    return allPapers.map((p) => ({ id: p.id, title: p.title, abstract: p.abstract }));
  }, [papers, view, getAllBookmarkedPapers]);

  const { getBadges, getRigorLevel } = usePaperMetadata(papersForMetadata);

  const handlePaperClick = (paper: Paper) => {
    setSelectedPaper(paper);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedPaper(null), 300);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleSaveToCollection = (paperId: string, collectionId: string) => {
    const paper =
      papers.find((p) => p.id === paperId) ||
      getAllBookmarkedPapers().find((p) => p.id === paperId);
    if (!paper) return;

    if (isInCollection(collectionId, paperId)) {
      removeFromCollection(collectionId, paperId);
    } else {
      addToCollection(collectionId, paper);
    }
  };

  const handleCreateCollection = (name: string) => {
    createCollection(name);
  };

  const displayedPapers = view === "saved" ? getAllBookmarkedPapers() : papers;
  const savedCount = getAllBookmarkedPapers().length;

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex rounded-lg bg-[var(--chip-surface)] p-1 border border-[color:var(--chip-border)]">
              <button
                onClick={() => setView("all")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  view === "all"
                    ? "bg-[var(--surface-2)] text-[color:var(--foreground)]"
                    : "text-[color:var(--foreground-muted)] hover:text-[color:var(--foreground)]"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setView("saved")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-1.5 ${
                  view === "saved"
                    ? "bg-[var(--surface-2)] text-[color:var(--foreground)]"
                    : "text-[color:var(--foreground-muted)] hover:text-[color:var(--foreground)]"
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${view === "saved" ? "fill-current" : ""}`} />
                Saved
                {savedCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-[var(--surface-2)] rounded-full">
                    {savedCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Filters - only show for "all" view */}
          {view === "all" && (
            <div className="relative">
              <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
            </div>
          )}
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
                    Click the bookmark button on any paper to save it
                  </p>
                </>
              ) : (
                <p className="text-zinc-500">No papers found</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 -mr-2">
            {displayedPapers.map((paper, index) => {
              const vote = getVote(paper.id);
              const savedCollections = getCollectionsForPaper(paper.id).map((c) => c.id);

              return (
                <PaperCard
                  key={paper.id}
                  id={paper.id}
                  title={paper.title}
                  authors={paper.authors}
                  publicationDate={paper.publicationDate}
                  abstract={paper.abstract}
                  citedByCount={paper.citedByCount}
                  journal={paper.journal}
                  doi={paper.doi}
                  index={index}
                  onClick={() => handlePaperClick(paper)}
                  concepts={paper.concepts}
                  pdfUrl={paper.pdfUrl}
                  githubUrl={paper.githubUrl}
                  arxivId={paper.arxivId}
                  isOpenAccess={paper.isOpenAccess}
                  trendScore={paper.trendScore}
                  likeCount={vote.upvotes}
                  isLiked={vote.userVote === "up"}
                  onLike={() => toggleUpvote(paper.id)}
                  dislikeCount={vote.downvotes}
                  isDisliked={vote.userVote === "down"}
                  onDislike={() => toggleDownvote(paper.id)}
                  collections={collections}
                  savedCollections={savedCollections}
                  onSaveToCollection={(collectionId) =>
                    handleSaveToCollection(paper.id, collectionId)
                  }
                  onCreateCollection={handleCreateCollection}
                  onTagClick={onTagClick}
                  badges={getBadges(paper.id)}
                  rigorLevel={getRigorLevel(paper.id)}
                />
              );
            })}
          </div>
        )}
      </div>

      <PaperDetailModal
        paper={selectedPaper}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isBookmarked={selectedPaper ? getCollectionsForPaper(selectedPaper.id).length > 0 : false}
        onToggleBookmark={
          selectedPaper
            ? () => {
                if (getCollectionsForPaper(selectedPaper.id).length > 0) {
                  // Remove from all collections
                  getCollectionsForPaper(selectedPaper.id).forEach((c) => {
                    removeFromCollection(c.id, selectedPaper.id);
                  });
                } else {
                  // Add to default collection
                  addToCollection("default", selectedPaper);
                }
              }
            : undefined
        }
        onSelectPaper={(paper) => setSelectedPaper(paper)}
      />
    </>
  );
}
