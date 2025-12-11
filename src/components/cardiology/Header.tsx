"use client";

import { motion } from "framer-motion";
import { Search, Upload } from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  onImportClick?: () => void;
}

export default function Header({
  searchQuery,
  onSearchChange,
  onSearch,
  onImportClick,
}: HeaderProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 px-6 py-4 backdrop-blur-xl bg-[#0a0a0a]/80 border-b border-zinc-800/50"
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <SynapseLogo />
          <span className="text-xl font-semibold tracking-tight text-white">
            Synapse
          </span>
          <span className="text-[10px] bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 rounded-full font-medium uppercase tracking-wider">
            Beta
          </span>
        </div>

        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-xl opacity-0 group-hover:opacity-30 blur transition-opacity duration-300" />
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search cardiology papers..."
                className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all font-mono text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onImportClick && (
            <button
              onClick={onImportClick}
              className="px-4 py-2 bg-zinc-800 text-zinc-300 text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors border border-zinc-700 flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import
            </button>
          )}
          <a
            href="https://synapsesocial.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            Join Waitlist
          </a>
        </div>
      </nav>
    </motion.header>
  );
}

function SynapseLogo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
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
