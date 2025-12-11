"use client";

import { motion } from "framer-motion";
import PaperCard from "./PaperCard";
import { Loader2 } from "lucide-react";

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

export default function PaperList({
  papers,
  loading,
  sortBy,
  onSortChange,
}: PaperListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">
          Research Papers
        </h2>
        <div className="flex items-center gap-2">
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
      ) : papers.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-zinc-500">No papers found</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 -mr-2">
          {papers.map((paper, index) => (
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
            />
          ))}
        </div>
      )}
    </div>
  );
}
