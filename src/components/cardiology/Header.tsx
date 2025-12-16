"use client";

import { motion } from "framer-motion";
import { Upload, History, Sparkles, ArrowUp, Paperclip } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  onImportClick?: () => void;
  onHistoryClick?: () => void;
  isAiSearching?: boolean;
}

export default function Header({
  searchQuery,
  onSearchChange,
  onSearch,
  onImportClick,
  onHistoryClick,
  isAiSearching,
}: HeaderProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onSearch();
    } else if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 px-6 py-4 backdrop-blur-xl bg-[var(--header-bg)] border-b border-[color:var(--header-border)]"
    >
      <nav className="max-w-7xl mx-auto">
        {/* Top row - Logo and actions */}
        <div className="flex items-center justify-between gap-8 mb-4">
          <div className="flex items-center gap-3">
            <SynapseLogo />
            <span className="text-xl font-semibold tracking-tight text-[color:var(--foreground)]">
              Synapse
            </span>
            <span className="text-[10px] bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 rounded-full font-medium uppercase tracking-wider">
              Beta
            </span>
          </div>

          <div className="flex items-center gap-3">
            {onImportClick && (
              <button
                onClick={onImportClick}
                className="px-4 py-2 bg-[var(--button-surface)] text-[color:var(--foreground-muted)] text-sm font-medium rounded-lg hover:bg-[var(--button-surface-hover)] hover:text-[color:var(--foreground)] transition-colors border border-[color:var(--button-border)] flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Import
              </button>
            )}
            <ThemeToggle />
            <a
              href="https://synapsesocial.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              Join Waitlist
            </a>
          </div>
        </div>

        {/* AI Search Box - Full width */}
        <div className="relative group">
          <div
            className={`absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-2xl transition-opacity duration-300 blur ${isFocused ? "opacity-40" : "opacity-0 group-hover:opacity-20"}`}
          />
          <div className="relative bg-[var(--input-surface)] border border-[color:var(--panel-border)] rounded-2xl overflow-hidden">
            <div className="flex items-center">
              {/* Sparkles icon */}
              <div className="pl-4 pr-2">
                <Sparkles
                  className={`w-5 h-5 ${isAiSearching ? "text-purple-400 animate-pulse" : "text-[color:var(--foreground-subtle)]"}`}
                />
              </div>

              {/* Input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Ask anything about research... (⌘↵ to search)"
                className="flex-1 py-4 bg-transparent text-[color:var(--foreground)] placeholder-[color:var(--input-placeholder)] focus:outline-none text-base"
              />

              {/* Action buttons */}
              <div className="flex items-center gap-1 pr-2">
                {/* Paperclip (visual only) */}
                <button
                  type="button"
                  className="p-2 text-[color:var(--foreground-subtle)] hover:text-[color:var(--foreground)] transition-colors rounded-lg hover:bg-[var(--button-surface)]"
                  title="Attach file (coming soon)"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                {/* History */}
                {onHistoryClick && (
                  <button
                    type="button"
                    onClick={onHistoryClick}
                    className="p-2 text-[color:var(--foreground-subtle)] hover:text-[color:var(--foreground)] transition-colors rounded-lg hover:bg-[var(--button-surface)]"
                    title="Search history"
                  >
                    <History className="w-5 h-5" />
                  </button>
                )}

                {/* Search button */}
                <button
                  type="button"
                  onClick={onSearch}
                  disabled={isAiSearching}
                  className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isAiSearching ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <ArrowUp className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}

function SynapseLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="3" fill="url(#grad1)" />
      <circle cx="16" cy="4" r="2.5" fill="url(#grad1)" />
      <circle cx="16" cy="28" r="2.5" fill="url(#grad1)" />
      <circle cx="4" cy="16" r="2.5" fill="url(#grad1)" />
      <circle cx="28" cy="16" r="2.5" fill="url(#grad1)" />
      <circle cx="7" cy="7" r="2" fill="url(#grad1)" />
      <circle cx="25" cy="7" r="2" fill="url(#grad1)" />
      <circle cx="7" cy="25" r="2" fill="url(#grad1)" />
      <circle cx="25" cy="25" r="2" fill="url(#grad1)" />
      <line x1="16" y1="13" x2="16" y2="6.5" stroke="url(#grad1)" strokeWidth="1.5" />
      <line x1="16" y1="19" x2="16" y2="25.5" stroke="url(#grad1)" strokeWidth="1.5" />
      <line x1="13" y1="16" x2="6.5" y2="16" stroke="url(#grad1)" strokeWidth="1.5" />
      <line x1="19" y1="16" x2="25.5" y2="16" stroke="url(#grad1)" strokeWidth="1.5" />
      <line x1="14" y1="14" x2="9" y2="9" stroke="url(#grad1)" strokeWidth="1.2" />
      <line x1="18" y1="14" x2="23" y2="9" stroke="url(#grad1)" strokeWidth="1.2" />
      <line x1="14" y1="18" x2="9" y2="23" stroke="url(#grad1)" strokeWidth="1.2" />
      <line x1="18" y1="18" x2="23" y2="23" stroke="url(#grad1)" strokeWidth="1.2" />
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  );
}
