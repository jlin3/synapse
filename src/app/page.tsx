"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Header from "@/components/cardiology/Header";
import PaperList from "@/components/cardiology/PaperList";
import SocialFeed from "@/components/cardiology/SocialFeed";
import ImportModal from "@/components/cardiology/ImportModal";

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

interface ImportedTopic {
  name: string;
  query: string;
  source: "pubmed" | "google_scholar";
  importedAt: string;
}

export default function CardiologyPage() {
  const [searchQuery, setSearchQuery] = useState("cardiology");
  const [papers, setPapers] = useState<Paper[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loadingPapers, setLoadingPapers] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [sortBy, setSortBy] = useState<"recent" | "top">("recent");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const fetchPapers = useCallback(async (query: string, sort: "recent" | "top") => {
    setLoadingPapers(true);
    try {
      const sortParam =
        sort === "recent" ? "publication_date:desc" : "cited_by_count:desc";
      const response = await fetch(
        `/api/papers?query=${encodeURIComponent(query)}&sort=${sortParam}`
      );
      const data = await response.json();
      if (data.papers) {
        setPapers(data.papers);
      }
    } catch (error) {
      console.error("Error fetching papers:", error);
    } finally {
      setLoadingPapers(false);
    }
  }, []);

  const fetchPosts = useCallback(async (query: string) => {
    setLoadingPosts(true);
    try {
      const response = await fetch(
        `/api/social-feed?query=${encodeURIComponent(query + " research paper")}`
      );
      const data = await response.json();
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  useEffect(() => {
    fetchPapers(searchQuery, sortBy);
    fetchPosts(searchQuery);
  }, []);

  const handleSearch = () => {
    fetchPapers(searchQuery, sortBy);
    fetchPosts(searchQuery);
  };

  const handleSortChange = (newSort: "recent" | "top") => {
    setSortBy(newSort);
    fetchPapers(searchQuery, newSort);
  };

  const handleImportSuccess = (topic: ImportedTopic) => {
    // Update the search query with the imported topic
    setSearchQuery(topic.query);
    // Fetch papers and posts for the new topic
    fetchPapers(topic.query, sortBy);
    fetchPosts(topic.query);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative">
      {/* Top gradient glow effect */}
      <div className="top-gradient" />
      
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        onImportClick={() => setIsImportModalOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            <span className="gradient-text">Follow Any</span> Research
          </h1>
          <p className="text-zinc-400 text-base max-w-2xl mx-auto">
            Type it. Synapse builds your daily feed of papers with AI summaries & social discussions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[600px] h-[calc(100vh-220px)]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3 bg-zinc-900/30 rounded-2xl border border-zinc-800/50 p-6 backdrop-blur-sm"
          >
            <PaperList
              papers={papers}
              loading={loadingPapers}
              sortBy={sortBy}
              onSortChange={handleSortChange}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2 bg-zinc-900/30 rounded-2xl border border-zinc-800/50 p-6 backdrop-blur-sm"
          >
            <SocialFeed posts={posts} loading={loadingPosts} />
          </motion.div>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-zinc-600 relative z-10">
        <p>Powered by OpenAlex & xAI Grok</p>
      </footer>

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />
    </div>
  );
}
