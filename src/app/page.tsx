"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Header from "@/components/cardiology/Header";
import PaperList from "@/components/cardiology/PaperList";
import SocialFeed from "@/components/cardiology/SocialFeed";
import ImportModal from "@/components/cardiology/ImportModal";
import { SortOption } from "@/components/cardiology/FilterPanel";

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

interface FilterState {
  sortBy: SortOption;
  minCitations: number | null;
  dateRange: string | null;
  studyType: string | null;
}

export default function SynapsePage() {
  const [searchQuery, setSearchQuery] = useState("cardiology");
  const [papers, setPapers] = useState<Paper[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loadingPapers, setLoadingPapers] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAiSearching, setIsAiSearching] = useState(false);

  const fetchPapers = useCallback(async (
    query: string, 
    sortBy: SortOption = "hot",
    filters?: { minCitations?: number; fromDate?: string }
  ) => {
    setLoadingPapers(true);
    try {
      // Map sort options to OpenAlex sort params
      let sortParam = "publication_date:desc";
      if (sortBy === "hot" || sortBy === "top_all") {
        sortParam = "cited_by_count:desc";
      } else if (sortBy === "new") {
        sortParam = "publication_date:desc";
      } else if (sortBy === "top_week" || sortBy === "top_month") {
        sortParam = "cited_by_count:desc";
      }

      const params = new URLSearchParams({
        query,
        sort: sortParam,
      });

      if (filters?.minCitations) {
        params.set("minCitations", filters.minCitations.toString());
      }
      if (filters?.fromDate) {
        params.set("fromDate", filters.fromDate);
      }

      const response = await fetch(`/api/papers?${params.toString()}`);
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
    fetchPapers(searchQuery);
    fetchPosts(searchQuery);
  }, []);

  const handleSearch = async () => {
    setIsAiSearching(true);
    try {
      // Try AI search first
      const aiResponse = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      
      if (aiResponse.ok) {
        const aiResult = await aiResponse.json();
        const searchTerms = aiResult.searchTerms?.join(" ") || searchQuery;
        
        // Use the interpreted search terms
        fetchPapers(searchTerms, "hot", {
          minCitations: aiResult.filters?.minCitations || undefined,
          fromDate: aiResult.filters?.dateRange?.split("-")[0] || undefined,
        });
        fetchPosts(searchTerms);
      } else {
        // Fallback to regular search
        fetchPapers(searchQuery);
        fetchPosts(searchQuery);
      }
    } catch (error) {
      console.error("AI search error:", error);
      fetchPapers(searchQuery);
      fetchPosts(searchQuery);
    } finally {
      setIsAiSearching(false);
    }
  };

  const handleFilterChange = (filters: FilterState) => {
    const dateFilter = filters.dateRange || undefined;
    fetchPapers(searchQuery, filters.sortBy, {
      minCitations: filters.minCitations || undefined,
      fromDate: dateFilter,
    });
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    fetchPapers(tag);
    fetchPosts(tag);
  };

  const handleImportSuccess = (topic: ImportedTopic) => {
    setSearchQuery(topic.query);
    fetchPapers(topic.query);
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
        isAiSearching={isAiSearching}
      />

      <main className="max-w-7xl mx-auto px-6 py-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[600px] h-[calc(100vh-180px)]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3 bg-zinc-900/30 rounded-2xl border border-zinc-800/50 p-6 backdrop-blur-sm"
          >
            <PaperList
              papers={papers}
              loading={loadingPapers}
              onFilterChange={handleFilterChange}
              onTagClick={handleTagClick}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 bg-zinc-900/30 rounded-2xl border border-zinc-800/50 p-6 backdrop-blur-sm"
          >
            <SocialFeed posts={posts} loading={loadingPosts} />
          </motion.div>
        </div>
      </main>

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />
    </div>
  );
}
