"use client";

import { motion } from "framer-motion";
import { Bookmark, Copy, Check } from "lucide-react";
import { useState } from "react";

const keyDefinitions = [
  {
    context: "The Core Pattern",
    quote:
      "RAG is a pattern where, before calling an LLM, we run a search over our own documents, pull the top-k relevant chunks, and stuff them into the prompt so the model answers grounded in that retrieved context.",
  },
  {
    context: "RAG vs Fine-tuning",
    quote:
      "If the knowledge changes often or is large and structured, we use RAG. If we need the model to change its behavior or style, we reach for fine-tuning.",
  },
  {
    context: "RAG vs Semantic Search",
    quote:
      "RAG is basically semantic search + an LLM that reads and synthesizes the retrieved documents for you.",
  },
];

export default function InterviewTip() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-transparent via-indigo-50/30 to-transparent">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 text-sm font-medium mb-4">
            <Bookmark className="w-4 h-4" />
            Quick Reference
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Key Definitions</h2>
          <p className="text-xl text-gray-600">How we talk about RAG across the team</p>
        </motion.div>

        <div className="space-y-6">
          {keyDefinitions.map((item, index) => (
            <motion.div
              key={item.context}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="glass rounded-2xl p-6 group"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {item.context}
                </span>
                <button
                  onClick={() => copyToClipboard(item.quote, index)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Copy to clipboard"
                >
                  {copiedIndex === index ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
              <blockquote className="text-lg text-gray-700 leading-relaxed">
                &quot;{item.quote}&quot;
              </blockquote>
            </motion.div>
          ))}
        </div>

        {/* Summary card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-12 relative"
        >
          <div className="absolute -top-6 -left-4 text-8xl text-blue-200/50 font-serif">&quot;</div>
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 text-white">
            <p className="text-xl md:text-2xl leading-relaxed mb-6">
              We take all our internal docs, parse and chunk them, embed each chunk, and store those
              vectors in an index. At query time we embed the user question, retrieve the most
              similar chunks, optionally rerank them, and then pass both the question and those
              chunks into an LLM. The LLM&apos;s job is just to read that context and synthesize an
              answer, not to guess from pretraining.
              <span className="text-blue-400 font-semibold"> That&apos;s RAG in a nutshell.</span>
            </p>
            <p className="text-sm text-slate-400">— The full picture in one paragraph</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
