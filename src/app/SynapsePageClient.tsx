"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Header from "@/components/cardiology/Header";
import PaperList from "@/components/cardiology/PaperList";
import SocialFeed from "@/components/cardiology/SocialFeed";
import ImportModal from "@/components/cardiology/ImportModal";
import { SortOption } from "@/components/cardiology/FilterPanel";
import { Paper } from "@/types";
import { isIdentifierLikeQuery } from "@/lib/search";

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

const SOCIAL_FEED_CACHE_KEY_PREFIX = "synapse:social-feed:";
const SOCIAL_FEED_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h
const DEFAULT_QUERY = "cardiology";

type SocialFeedCacheEntry = {
  expiresAt: number;
  posts: SocialPost[];
};

function getSocialFeedQuery(query: string) {
  const q = query.trim();
  // Keep consistent with the API default ("cardiology research")
  return q.length > 0 ? `${q} research` : "cardiology research";
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

export default function SynapsePageClient(props: {
  initialQuery?: string;
  initialPosts?: SocialPost[];
}) {
  const initialQuery = props.initialQuery || DEFAULT_QUERY;
  const initialPosts = props.initialPosts || [];

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>(initialPosts);
  const [loadingPapers, setLoadingPapers] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(initialPosts.length === 0);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAiSearching, setIsAiSearching] = useState(false);

  const primeSocialFeedFromCache = useCallback((query: string) => {
    try {
      const socialQuery = getSocialFeedQuery(query);
      const raw = localStorage.getItem(`${SOCIAL_FEED_CACHE_KEY_PREFIX}${socialQuery}`);
      if (!raw) return false;

      const parsed = JSON.parse(raw) as SocialFeedCacheEntry;
      if (!parsed || !Array.isArray(parsed.posts) || typeof parsed.expiresAt !== "number") {
        return false;
      }
      if (Date.now() > parsed.expiresAt) {
        localStorage.removeItem(`${SOCIAL_FEED_CACHE_KEY_PREFIX}${socialQuery}`);
        return false;
      }

      setPosts(parsed.posts);
      setLoadingPosts(false);
      return true;
    } catch {
      return false;
    }
  }, []);

  const writeSocialFeedCache = useCallback((query: string, nextPosts: SocialPost[]) => {
    try {
      const socialQuery = getSocialFeedQuery(query);
      const entry: SocialFeedCacheEntry = {
        posts: nextPosts,
        expiresAt: Date.now() + SOCIAL_FEED_CACHE_TTL_MS,
      };
      localStorage.setItem(`${SOCIAL_FEED_CACHE_KEY_PREFIX}${socialQuery}`, JSON.stringify(entry));
    } catch {
      // ignore cache write failures (e.g., blocked storage)
    }
  }, []);

  const fetchPapers = useCallback(
    async (
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
    },
    []
  );

  const fetchPosts = useCallback(
    async (query: string, opts?: { showLoading?: boolean }) => {
      const showLoading = opts?.showLoading ?? true;
      if (showLoading) setLoadingPosts(true);
      try {
        const socialQuery = getSocialFeedQuery(query);
        const response = await fetch(`/api/social-feed?query=${encodeURIComponent(socialQuery)}`);
        const data = await response.json();
        if (data.posts) {
          setPosts(data.posts);
          writeSocialFeedCache(query, data.posts);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        if (showLoading) setLoadingPosts(false);
      }
    },
    [writeSocialFeedCache]
  );

  // On first mount:
  // - start papers fetch
  // - ensure Social Feed cache is primed (SSR-provided initialPosts) and refresh in background
  useEffect(() => {
    fetchPapers(initialQuery);

    // If SSR gave us posts, make sure they land in localStorage for future instant loads.
    if (initialPosts.length > 0) {
      writeSocialFeedCache(initialQuery, initialPosts);
      // Background refresh without showing a spinner
      fetchPosts(initialQuery, { showLoading: false });
      return;
    }

    // Otherwise, try local cache first, then fetch.
    const cacheHit = primeSocialFeedFromCache(initialQuery);
    fetchPosts(initialQuery, { showLoading: !cacheHit });
  }, [
    fetchPapers,
    fetchPosts,
    initialPosts,
    initialQuery,
    primeSocialFeedFromCache,
    writeSocialFeedCache,
  ]);

  const handleSearch = async () => {
    setIsAiSearching(true);
    try {
      // If the query looks like an identifier (e.g., BPC-157), keep it verbatim.
      // AI expansion often dilutes identifiers and hurts exact keyword matching.
      if (isIdentifierLikeQuery(searchQuery)) {
        const cacheHit = primeSocialFeedFromCache(searchQuery);
        fetchPapers(searchQuery);
        fetchPosts(searchQuery, { showLoading: !cacheHit });
        return;
      }

      // Try AI search first
      const aiResponse = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (aiResponse.ok) {
        const aiResult = await aiResponse.json();
        const searchTerms = aiResult.searchTerms?.join(" ") || searchQuery;

        const cacheHit = primeSocialFeedFromCache(searchTerms);

        // Use the interpreted search terms
        fetchPapers(searchTerms, "hot", {
          minCitations: aiResult.filters?.minCitations || undefined,
          fromDate: aiResult.filters?.dateRange?.split("-")[0] || undefined,
        });
        fetchPosts(searchTerms, { showLoading: !cacheHit });
      } else {
        // Fallback to regular search
        const cacheHit = primeSocialFeedFromCache(searchQuery);
        fetchPapers(searchQuery);
        fetchPosts(searchQuery, { showLoading: !cacheHit });
      }
    } catch (error) {
      console.error("AI search error:", error);
      const cacheHit = primeSocialFeedFromCache(searchQuery);
      fetchPapers(searchQuery);
      fetchPosts(searchQuery, { showLoading: !cacheHit });
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
    const cacheHit = primeSocialFeedFromCache(tag);
    fetchPosts(tag, { showLoading: !cacheHit });
  };

  const handleImportSuccess = (topic: ImportedTopic) => {
    setSearchQuery(topic.query);
    fetchPapers(topic.query);
    const cacheHit = primeSocialFeedFromCache(topic.query);
    fetchPosts(topic.query, { showLoading: !cacheHit });
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


