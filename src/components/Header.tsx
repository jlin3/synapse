"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <SynapseLogo />
          <span className="text-xl font-semibold tracking-tight">Synapse</span>
          <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full font-medium">
            RAG
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all duration-200 text-sm font-medium text-emerald-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Feed Proposal
          </Link>
          <Link
            href="https://www.synapsesocial.com"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 hover:bg-white border border-gray-200 transition-all duration-200 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            synapsesocial.com
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}

function SynapseLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="3" fill="currentColor" />
      <circle cx="16" cy="4" r="2.5" fill="currentColor" />
      <circle cx="16" cy="28" r="2.5" fill="currentColor" />
      <circle cx="4" cy="16" r="2.5" fill="currentColor" />
      <circle cx="28" cy="16" r="2.5" fill="currentColor" />
      <circle cx="7" cy="7" r="2" fill="currentColor" />
      <circle cx="25" cy="7" r="2" fill="currentColor" />
      <circle cx="7" cy="25" r="2" fill="currentColor" />
      <circle cx="25" cy="25" r="2" fill="currentColor" />
      <line x1="16" y1="13" x2="16" y2="6.5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="16" y1="19" x2="16" y2="25.5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="13" y1="16" x2="6.5" y2="16" stroke="currentColor" strokeWidth="1.5" />
      <line x1="19" y1="16" x2="25.5" y2="16" stroke="currentColor" strokeWidth="1.5" />
      <line x1="14" y1="14" x2="9" y2="9" stroke="currentColor" strokeWidth="1.2" />
      <line x1="18" y1="14" x2="23" y2="9" stroke="currentColor" strokeWidth="1.2" />
      <line x1="14" y1="18" x2="9" y2="23" stroke="currentColor" strokeWidth="1.2" />
      <line x1="18" y1="18" x2="23" y2="23" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
