"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Loader2, Sparkles, Baby, ListChecks } from "lucide-react";
import { useState, useEffect } from "react";

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

interface PaperInsights {
  synthesis: string;
  eli5: string;
  highlights: string[];
}

interface PaperDetailModalProps {
  paper: Paper | null;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "synthesis" | "eli5" | "highlights";

export default function PaperDetailModal({ paper, isOpen, onClose }: PaperDetailModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("synthesis");
  const [insights, setInsights] = useState<PaperInsights | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (paper && isOpen) {
      fetchInsights();
    }
  }, [paper?.id, isOpen]);

  const fetchInsights = async () => {
    if (!paper) return;
    
    setLoadingInsights(true);
    setError(null);
    
    try {
      const response = await fetch("/api/paper-insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: paper.title,
          abstract: paper.abstract,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate insights");
      }
      
      const data = await response.json();
      setInsights(data);
    } catch (err) {
      setError("Failed to generate AI insights. Please try again.");
      console.error("Error fetching insights:", err);
    } finally {
      setLoadingInsights(false);
    }
  };

  const formattedDate = paper
    ? new Date(paper.publicationDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "synthesis", label: "Synthesis", icon: <Sparkles className="w-4 h-4" /> },
    { id: "eli5", label: "ELI5", icon: <Baby className="w-4 h-4" /> },
    { id: "highlights", label: "Highlights", icon: <ListChecks className="w-4 h-4" /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && paper && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-zinc-900 border-l border-zinc-800 z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-800">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white leading-tight">
                    {paper.title}
                  </h2>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                    <span>{paper.authors.slice(0, 3).join(", ")}{paper.authors.length > 3 && ` +${paper.authors.length - 3}`}</span>
                    <span className="text-zinc-600">•</span>
                    <span>{formattedDate}</span>
                    {paper.citedByCount > 0 && (
                      <>
                        <span className="text-zinc-600">•</span>
                        <span>{paper.citedByCount} citations</span>
                      </>
                    )}
                  </div>
                  {paper.journal && (
                    <div className="mt-2">
                      <span className="inline-block px-2 py-0.5 bg-purple-500/10 text-purple-400 text-xs font-medium rounded-full border border-purple-500/20">
                        {paper.journal}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>

              {paper.doi && (
                <a
                  href={`https://doi.org/${paper.doi.replace("https://doi.org/", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  <ExternalLink className="w-4 h-4" />
                  Read Full Paper
                </a>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Abstract */}
              {paper.abstract && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                    Abstract
                  </h3>
                  <p className="text-zinc-300 leading-relaxed text-sm">
                    {paper.abstract}
                  </p>
                </div>
              )}

              {/* AI Insights */}
              <div className="border-t border-zinc-800 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">
                    AI Insights
                  </h3>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 p-1 bg-zinc-800/50 rounded-lg mb-4">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-700/50"
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[200px]">
                  {loadingInsights ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-3" />
                      <p className="text-sm text-zinc-500">Generating AI insights...</p>
                    </div>
                  ) : error ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <p className="text-sm text-red-400 mb-3">{error}</p>
                      <button
                        onClick={fetchInsights}
                        className="px-4 py-2 bg-zinc-800 text-white text-sm rounded-lg hover:bg-zinc-700 transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : insights ? (
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {activeTab === "synthesis" && (
                        <div className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/50">
                          <p className="text-zinc-300 leading-relaxed">
                            {insights.synthesis}
                          </p>
                        </div>
                      )}

                      {activeTab === "eli5" && (
                        <div className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/50">
                          <p className="text-zinc-300 leading-relaxed">
                            {insights.eli5}
                          </p>
                        </div>
                      )}

                      {activeTab === "highlights" && (
                        <ul className="space-y-3">
                          {insights.highlights.map((highlight, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 p-3 bg-zinc-800/30 rounded-xl border border-zinc-700/50"
                            >
                              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {index + 1}
                              </span>
                              <p className="text-zinc-300 leading-relaxed text-sm">
                                {highlight}
                              </p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <p className="text-sm text-zinc-500">No insights available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
