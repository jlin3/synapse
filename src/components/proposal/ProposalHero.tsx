"use client";

import { motion } from "framer-motion";

export default function ProposalHero() {
  return (
    <section className="min-h-[85vh] flex flex-col items-center justify-center px-6 pt-20 pb-12 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.1)_0%,transparent_70%)]" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-5xl mx-auto relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-emerald-300 font-medium">MVP Recommender • 3–4 Months</span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6">
          <span className="block text-white/90">SYNAPSE</span>
          <span className="block bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
            PERSONALIZED FEED
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-4"
        >
          v1 Budget & Architecture Proposal
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-base text-slate-500 max-w-xl mx-auto mb-12"
        >
          RAG + Recommender system powering personalized research discovery for oncology
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {[
            { label: "Build Time", value: "3–4 months", subtext: "MVP Phase" },
            { label: "Phase I Total", value: "~$93k", subtext: "$83k people + $10k tools" },
            { label: "Phase II/Year", value: "$565k+", subtext: "Full team + infra" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm"
            >
              <div className="text-xs uppercase tracking-wider text-slate-500 mb-1">{stat.label}</div>
              <div className="text-xl font-bold text-white">{stat.value}</div>
              {stat.subtext && <div className="text-xs text-slate-500 mt-1">{stat.subtext}</div>}
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-2 text-slate-500">
            <span className="text-sm">Scroll to explore</span>
            <motion.svg
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </motion.svg>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

