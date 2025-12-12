"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Loader2, Sparkles, Baby, ListChecks, Bookmark, Share2, Link2, Check, Quote, FileText, MessageSquare, Send, Trash2, Github, ArrowUp, BookOpen, Users2 } from "lucide-react";
import { useState, useEffect } from "react";
import { generateBibTeX, generateAPA, copyToClipboard } from "@/lib/citations";
import { useComments } from "@/hooks/useComments";
import { useUser } from "@/hooks/useUser";

interface Concept {
  id: string;
  name: string;
  score: number;
}

interface Paper {
  id: string;
  title: string;
  authors: string[];
  publicationDate: string;
  doi: string | null;
  abstract: string | null;
  citedByCount: number;
  journal: string | null;
  concepts?: Concept[];
  pdfUrl?: string | null;
  githubUrl?: string | null;
  arxivId?: string | null;
  isOpenAccess?: boolean;
  trendScore?: number;
}

interface PaperInsights {
  synthesis: string;
  eli5: string;
  highlights: string[];
}

interface RelatedPaper {
  id: string;
  title: string;
  authors: string[];
  publicationDate: string;
  doi: string | null;
  citedByCount: number;
  journal: string | null;
}

interface PaperDetailModalProps {
  paper: Paper | null;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  onSelectPaper?: (paper: Paper) => void;
}

type TabType = "synthesis" | "eli5" | "highlights";

export default function PaperDetailModal({ 
  paper, 
  isOpen, 
  onClose,
  isBookmarked,
  onToggleBookmark,
  onSelectPaper,
}: PaperDetailModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("synthesis");
  const [insights, setInsights] = useState<PaperInsights | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState<"bibtex" | "apa" | null>(null);
  const [relatedPapers, setRelatedPapers] = useState<RelatedPaper[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  
  // Comments
  const { comments, count: commentCount, isLoading: loadingComments, isSubmitting, addComment, deleteComment, isOwnComment } = useComments(paper?.id || null);
  const { displayName, setDisplayName } = useUser();

  // Handle AI question submission
  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim() || !paper) return;

    setAiLoading(true);
    setAiResponse(null);

    try {
      const response = await fetch("/api/paper-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: aiQuestion,
          title: paper.title,
          abstract: paper.abstract,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiResponse(data.answer);
      } else {
        setAiResponse("Sorry, I couldn't answer that question. Please try again.");
      }
    } catch (error) {
      console.error("AI chat error:", error);
      setAiResponse("An error occurred. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (paper && isOpen) {
      fetchInsights();
      fetchRelatedPapers();
      setNewComment("");
    }
  }, [paper?.id, isOpen]);

  // Close share menu when clicking outside
  useEffect(() => {
    if (showShareMenu) {
      const handleClick = () => setShowShareMenu(false);
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [showShareMenu]);

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

  const fetchRelatedPapers = async () => {
    if (!paper) return;
    
    setLoadingRelated(true);
    setRelatedPapers([]);
    
    try {
      const response = await fetch(`/api/related-papers?id=${encodeURIComponent(paper.id)}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch related papers");
      }
      
      const data = await response.json();
      setRelatedPapers(data.relatedPapers || []);
    } catch (err) {
      console.error("Error fetching related papers:", err);
    } finally {
      setLoadingRelated(false);
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

  const getShareUrl = () => {
    if (!paper?.doi) return window.location.href;
    return `https://doi.org/${paper.doi.replace("https://doi.org/", "")}`;
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShareX = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `Check out this research paper: "${paper?.title}"`;
    const url = getShareUrl();
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const handleShareLinkedIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getShareUrl();
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const handleShareEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    const subject = `Research Paper: ${paper?.title}`;
    const body = `I thought you might find this research paper interesting:\n\n${paper?.title}\n\n${getShareUrl()}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleCopyBibTeX = async () => {
    if (!paper) return;
    const bibtex = generateBibTeX(paper);
    const success = await copyToClipboard(bibtex);
    if (success) {
      setCopiedCitation("bibtex");
      setTimeout(() => setCopiedCitation(null), 2000);
    }
  };

  const handleCopyAPA = async () => {
    if (!paper) return;
    const apa = generateAPA(paper);
    const success = await copyToClipboard(apa);
    if (success) {
      setCopiedCitation("apa");
      setTimeout(() => setCopiedCitation(null), 2000);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    // Save display name if provided
    if (displayNameInput.trim() && displayNameInput !== displayName) {
      setDisplayName(displayNameInput.trim());
    }
    
    const success = await addComment(newComment, displayNameInput.trim() || displayName || undefined);
    if (success) {
      setNewComment("");
    }
  };

  const formatCommentDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

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
                <div className="flex items-center gap-1">
                  {/* Bookmark Button */}
                  {onToggleBookmark && (
                    <button
                      onClick={onToggleBookmark}
                      className={`p-2 rounded-lg hover:bg-zinc-800 transition-colors ${
                        isBookmarked ? "text-purple-400" : "text-zinc-400 hover:text-purple-400"
                      }`}
                      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                    >
                      <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
                    </button>
                  )}
                  
                  {/* Share Button */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowShareMenu(!showShareMenu);
                      }}
                      className="p-2 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-purple-400"
                      aria-label="Share paper"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                    
                    {/* Share Menu */}
                    <AnimatePresence>
                      {showShareMenu && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute right-0 top-full mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl overflow-hidden z-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={handleCopyLink}
                            className="w-full px-4 py-3 flex items-center gap-3 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
                          >
                            {copied ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Link2 className="w-4 h-4" />
                            )}
                            {copied ? "Copied!" : "Copy link"}
                          </button>
                          <button
                            onClick={handleShareX}
                            className="w-full px-4 py-3 flex items-center gap-3 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
                          >
                            <XLogo className="w-4 h-4" />
                            Share on X
                          </button>
                          <button
                            onClick={handleShareLinkedIn}
                            className="w-full px-4 py-3 flex items-center gap-3 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
                          >
                            <LinkedInLogo className="w-4 h-4" />
                            Share on LinkedIn
                          </button>
                          <button
                            onClick={handleShareEmail}
                            className="w-full px-4 py-3 flex items-center gap-3 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
                          >
                            <EmailIcon className="w-4 h-4" />
                            Share via Email
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {paper.doi && (
                  <a
                    href={`https://doi.org/${paper.doi.replace("https://doi.org/", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Read Full Paper
                  </a>
                )}
                
                {/* Citation Buttons */}
                <button
                  onClick={handleCopyBibTeX}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-zinc-800 text-zinc-300 text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors border border-zinc-700"
                >
                  {copiedCitation === "bibtex" ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                  {copiedCitation === "bibtex" ? "Copied!" : "BibTeX"}
                </button>
                <button
                  onClick={handleCopyAPA}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-zinc-800 text-zinc-300 text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors border border-zinc-700"
                >
                  {copiedCitation === "apa" ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Quote className="w-4 h-4" />
                  )}
                  {copiedCitation === "apa" ? "Copied!" : "APA"}
                </button>
                
                {/* GitHub Link */}
                {paper.githubUrl && (
                  <a
                    href={paper.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-zinc-800 text-zinc-300 text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors border border-zinc-700"
                  >
                    <Github className="w-4 h-4" />
                    Code
                  </a>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* AI Insights */}
              <div className="mb-6">
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

              {/* Abstract */}
              {paper.abstract && (
                <div className="border-t border-zinc-800 pt-6">
                  <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                    Abstract
                  </h3>
                  <p className="text-zinc-300 leading-relaxed text-sm">
                    {paper.abstract}
                  </p>
                </div>
              )}

              {/* Related Papers */}
              <div className="border-t border-zinc-800 pt-6 mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-cyan-500/20 rounded-lg">
                    <LinkIcon className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">
                    Related Papers
                  </h3>
                </div>

                {loadingRelated ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-cyan-500 animate-spin" />
                  </div>
                ) : relatedPapers.length === 0 ? (
                  <p className="text-sm text-zinc-500 py-4">No related papers found</p>
                ) : (
                  <div className="space-y-3">
                    {relatedPapers.map((related) => (
                      <button
                        key={related.id}
                        onClick={() => {
                          if (onSelectPaper) {
                            onSelectPaper({
                              ...related,
                              abstract: null,
                            });
                          }
                        }}
                        className="w-full text-left p-3 bg-zinc-800/30 rounded-xl border border-zinc-700/50 hover:border-cyan-500/30 hover:bg-zinc-800/50 transition-all group"
                      >
                        <h4 className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                          {related.title}
                        </h4>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                          <span>{related.authors.slice(0, 2).join(", ")}{related.authors.length > 2 && " et al."}</span>
                          <span>•</span>
                          <span>{new Date(related.publicationDate).getFullYear()}</span>
                          {related.citedByCount > 0 && (
                            <>
                              <span>•</span>
                              <span>{related.citedByCount} citations</span>
                            </>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Comments Section */}
              <div className="border-t border-zinc-800 pt-6 mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-amber-500/20 rounded-lg">
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">
                    Discussion
                  </h3>
                  {commentCount > 0 && (
                    <span className="text-xs text-zinc-500">({commentCount})</span>
                  )}
                </div>

                {/* Comment Form */}
                <form onSubmit={handleSubmitComment} className="mb-6">
                  {!displayName && (
                    <input
                      type="text"
                      value={displayNameInput}
                      onChange={(e) => setDisplayNameInput(e.target.value)}
                      placeholder="Your name (optional)"
                      className="w-full px-3 py-2 mb-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 text-sm"
                    />
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 text-sm"
                      disabled={isSubmitting}
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting || !newComment.trim()}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                {loadingComments ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                  </div>
                ) : comments.length === 0 ? (
                  <p className="text-sm text-zinc-500 text-center py-4">
                    No comments yet. Be the first to share your thoughts!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="p-3 bg-zinc-800/30 rounded-xl border border-zinc-700/50"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                              {comment.displayName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="text-sm font-medium text-white">
                                {comment.displayName}
                              </span>
                              <span className="text-xs text-zinc-500 ml-2">
                                {formatCommentDate(comment.createdAt)}
                              </span>
                            </div>
                          </div>
                          {isOwnComment(comment) && (
                            <button
                              onClick={() => deleteComment(comment.id)}
                              className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                              aria-label="Delete comment"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-zinc-300 leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AI Chat - Fixed Bottom */}
            <div className="border-t border-zinc-800 bg-zinc-900/95 backdrop-blur-sm p-4">
              {/* AI Response */}
              {aiResponse && (
                <div className="mb-3 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-zinc-300 leading-relaxed">{aiResponse}</p>
                  </div>
                </div>
              )}
              
              {/* Question Input */}
              <form onSubmit={handleAskQuestion} className="relative">
                <input
                  type="text"
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  placeholder="Ask anything about this paper..."
                  className="w-full px-4 py-3 pr-12 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 text-sm"
                  disabled={aiLoading}
                />
                <button
                  type="submit"
                  disabled={aiLoading || !aiQuestion.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {aiLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowUp className="w-4 h-4" />
                  )}
                </button>
              </form>
              <p className="mt-2 text-[10px] text-zinc-600 text-center">
                AI responses are generated based on the paper&apos;s title and abstract
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Icon Components
function XLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function EmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
