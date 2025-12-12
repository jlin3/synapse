"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function ProposalHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-xl bg-slate-950/60 border-b border-white/5"
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 pointer-events-none">
          <SynapseLogo />
          <span className="text-xl font-semibold tracking-tight text-white">Synapse</span>
          <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
            Proposal
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/explainer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 text-sm font-medium text-white/80 hover:text-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            RAG Explainer
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}

function SynapseLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="3" fill="#10b981" />
      <circle cx="16" cy="4" r="2.5" fill="#10b981" />
      <circle cx="16" cy="28" r="2.5" fill="#10b981" />
      <circle cx="4" cy="16" r="2.5" fill="#10b981" />
      <circle cx="28" cy="16" r="2.5" fill="#10b981" />
      <circle cx="7" cy="7" r="2" fill="#10b981" />
      <circle cx="25" cy="7" r="2" fill="#10b981" />
      <circle cx="7" cy="25" r="2" fill="#10b981" />
      <circle cx="25" cy="25" r="2" fill="#10b981" />
      <line x1="16" y1="13" x2="16" y2="6.5" stroke="#10b981" strokeWidth="1.5" />
      <line x1="16" y1="19" x2="16" y2="25.5" stroke="#10b981" strokeWidth="1.5" />
      <line x1="13" y1="16" x2="6.5" y2="16" stroke="#10b981" strokeWidth="1.5" />
      <line x1="19" y1="16" x2="25.5" y2="16" stroke="#10b981" strokeWidth="1.5" />
      <line x1="14" y1="14" x2="9" y2="9" stroke="#10b981" strokeWidth="1.2" />
      <line x1="18" y1="14" x2="23" y2="9" stroke="#10b981" strokeWidth="1.2" />
      <line x1="14" y1="18" x2="9" y2="23" stroke="#10b981" strokeWidth="1.2" />
      <line x1="18" y1="18" x2="23" y2="23" stroke="#10b981" strokeWidth="1.2" />
    </svg>
  );
}
