"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

export default function ProposalFooter() {
  return (
    <footer className="py-16 px-6 border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <SynapseLogo />
            <div>
              <span className="text-xl font-semibold text-white">Synapse</span>
              <p className="text-sm text-slate-500">RAG System v1 Proposal</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-medium text-white/80 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              RAG Explainer
            </Link>
            <Link
              href="https://www.synapsesocial.com"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all text-sm font-medium text-emerald-400 hover:text-emerald-300"
            >
              <ExternalLink className="w-4 h-4" />
              synapsesocial.com
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-12 pt-8 border-t border-white/[0.06] text-center"
        >
          <p className="text-sm text-slate-500">
            Built with Next.js, Tailwind CSS, and Framer Motion
          </p>
          <p className="text-xs text-slate-600 mt-2">
            © {new Date().getFullYear()} Synapse. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

function SynapseLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="3" fill="#10b981"/>
      <circle cx="16" cy="4" r="2.5" fill="#10b981"/>
      <circle cx="16" cy="28" r="2.5" fill="#10b981"/>
      <circle cx="4" cy="16" r="2.5" fill="#10b981"/>
      <circle cx="28" cy="16" r="2.5" fill="#10b981"/>
      <circle cx="7" cy="7" r="2" fill="#10b981"/>
      <circle cx="25" cy="7" r="2" fill="#10b981"/>
      <circle cx="7" cy="25" r="2" fill="#10b981"/>
      <circle cx="25" cy="25" r="2" fill="#10b981"/>
      <line x1="16" y1="13" x2="16" y2="6.5" stroke="#10b981" strokeWidth="1.5"/>
      <line x1="16" y1="19" x2="16" y2="25.5" stroke="#10b981" strokeWidth="1.5"/>
      <line x1="13" y1="16" x2="6.5" y2="16" stroke="#10b981" strokeWidth="1.5"/>
      <line x1="19" y1="16" x2="25.5" y2="16" stroke="#10b981" strokeWidth="1.5"/>
      <line x1="14" y1="14" x2="9" y2="9" stroke="#10b981" strokeWidth="1.2"/>
      <line x1="18" y1="14" x2="23" y2="9" stroke="#10b981" strokeWidth="1.2"/>
      <line x1="14" y1="18" x2="9" y2="23" stroke="#10b981" strokeWidth="1.2"/>
      <line x1="18" y1="18" x2="23" y2="23" stroke="#10b981" strokeWidth="1.2"/>
    </svg>
  );
}

