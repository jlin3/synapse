"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-5xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-gray-200 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-sm text-gray-600 font-medium">Internal Knowledge Base</span>
        </motion.div>

        <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.9] mb-6">
          <span className="block">UNDERSTANDING</span>
          <span className="block gradient-text">RAG</span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-8"
        >
          Retrieval-Augmented Generation
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="glass rounded-2xl p-8 max-w-3xl mx-auto"
        >
          <p className="text-lg md:text-xl leading-relaxed text-gray-700">
            <span className="font-semibold text-gray-900">&quot;Search + LLM&quot;</span> — Retrieve
            relevant chunks from your data, then feed them into the prompt so the LLM answers using{" "}
            <span className="text-blue-600 font-medium">that info</span> instead of memorized
            knowledge.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-2 text-gray-500">
            <span className="text-sm">Scroll to explore</span>
            <motion.svg
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </motion.svg>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
