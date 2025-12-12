"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Loader2, Check, AlertCircle, Rss, GraduationCap, BookOpen } from "lucide-react";
import { useState } from "react";

interface ImportedTopic {
  name: string;
  query: string;
  source: "pubmed" | "google_scholar";
  importedAt: string;
}

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (topic: ImportedTopic) => void;
}

type ImportSource = "pubmed" | "google_scholar";

export default function ImportModal({ isOpen, onClose, onImportSuccess }: ImportModalProps) {
  const [activeSource, setActiveSource] = useState<ImportSource>("pubmed");
  const [rssUrl, setRssUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleImport = async () => {
    if (!rssUrl.trim()) {
      setError(
        `Please enter a ${activeSource === "pubmed" ? "PubMed" : "Google Scholar"} RSS feed URL`
      );
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/import-feeds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rssUrl: rssUrl.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to import RSS feed");
      }

      setSuccess(data.message);
      onImportSuccess(data.topic);

      setTimeout(() => {
        setRssUrl("");
        setSuccess(null);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import RSS feed");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRssUrl("");
    setError(null);
    setSuccess(null);
    onClose();
  };

  const handleSourceChange = (source: ImportSource) => {
    setActiveSource(source);
    setRssUrl("");
    setError(null);
    setSuccess(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                    <Upload className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Import Alerts</h2>
                    <p className="text-sm text-zinc-500">Import your saved searches via RSS</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Source Tabs */}
              <div className="flex gap-2 p-1 bg-zinc-800/50 rounded-xl mb-6">
                <button
                  onClick={() => handleSourceChange("pubmed")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    activeSource === "pubmed"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-700/50"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  PubMed
                </button>
                <button
                  onClick={() => handleSourceChange("google_scholar")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    activeSource === "google_scholar"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-700/50"
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  Google Scholar
                </button>
              </div>

              {/* Instructions */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSource}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="mb-6 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50"
                >
                  <h3 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                    <Rss className="w-4 h-4 text-orange-400" />
                    {activeSource === "pubmed"
                      ? "How to get your PubMed RSS feed:"
                      : "How to get your Google Scholar alerts:"}
                  </h3>
                  {activeSource === "pubmed" ? (
                    <ol className="text-sm text-zinc-400 space-y-1.5 list-decimal list-inside">
                      <li>
                        Go to{" "}
                        <a
                          href="https://pubmed.ncbi.nlm.nih.gov"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:underline"
                        >
                          pubmed.ncbi.nlm.nih.gov
                        </a>
                      </li>
                      <li>Search for your topic of interest</li>
                      <li>Click &quot;Create RSS&quot; below the search box</li>
                      <li>Copy the RSS feed URL and paste it below</li>
                    </ol>
                  ) : (
                    <ol className="text-sm text-zinc-400 space-y-1.5 list-decimal list-inside">
                      <li>
                        Go to{" "}
                        <a
                          href="https://scholar.google.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:underline"
                        >
                          scholar.google.com
                        </a>
                      </li>
                      <li>Search for your topic of interest</li>
                      <li>Click &quot;Create alert&quot; in the left sidebar</li>
                      <li>In your email, find the RSS link or copy the alert URL</li>
                    </ol>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Input */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="rss-url" className="block text-sm font-medium text-zinc-400 mb-2">
                    {activeSource === "pubmed" ? "PubMed RSS Feed URL" : "Google Scholar Alert URL"}
                  </label>
                  <input
                    id="rss-url"
                    type="url"
                    value={rssUrl}
                    onChange={(e) => setRssUrl(e.target.value)}
                    placeholder={
                      activeSource === "pubmed"
                        ? "https://pubmed.ncbi.nlm.nih.gov/rss/search/..."
                        : "https://scholar.google.com/scholar?q=..."
                    }
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all text-sm"
                    disabled={loading}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <p className="text-sm text-red-400">{error}</p>
                  </motion.div>
                )}

                {/* Success Message */}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-xl"
                  >
                    <Check className="w-4 h-4 text-green-400 shrink-0" />
                    <p className="text-sm text-green-400">{success}</p>
                  </motion.div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleClose}
                    className="flex-1 px-4 py-2.5 bg-zinc-800 text-zinc-300 text-sm font-medium rounded-xl hover:bg-zinc-700 transition-colors border border-zinc-700"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={loading || !rssUrl.trim()}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Import
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
