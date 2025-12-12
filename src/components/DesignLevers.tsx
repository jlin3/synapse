"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Scissors, Brain, Layers, Target, FileCode } from "lucide-react";

const levers = [
  {
    icon: Scissors,
    title: "Chunking",
    description: "How you split documents into retrievable units",
    tradeoffs: [
      {
        label: "Too small",
        effect: "More precise match, but lose context. Model may answer from fragments.",
      },
      {
        label: "Too large",
        effect: "More complete info, but harder to retrieve precisely. Blows context window.",
      },
      {
        label: "Sweet spot",
        effect:
          "200-800 tokens with 10-20% overlap. Use semantic splits at sentence/heading boundaries.",
      },
    ],
  },
  {
    icon: Brain,
    title: "Embedding Model",
    description: "The neural net that converts text to vectors",
    tradeoffs: [
      {
        label: "Higher dims",
        effect: "More expressive but heavier compute. 384 → 768 → 1536 dimensions.",
      },
      {
        label: "Domain-specific",
        effect: "Code, legal, medical may benefit from specialized embeddings.",
      },
      {
        label: "Latency/cost",
        effect: "Batch embedding for ingestion; query side is single-shot — speed matters.",
      },
    ],
  },
  {
    icon: Layers,
    title: "Index Type",
    description: "How vectors are stored and searched",
    tradeoffs: [
      {
        label: "Exact (brute-force)",
        effect: "Great for small corpora (<10k docs). Very simple infra.",
      },
      { label: "ANN (approximate)", effect: "FAISS, HNSW, ScaNN. Needed for millions+ chunks." },
      {
        label: "Hybrid search",
        effect: "BM25 lexical + vector. Handles keywords AND semantic queries.",
      },
    ],
  },
  {
    icon: Target,
    title: "Retrieval Strategy",
    description: "How many chunks and how to rank them",
    tradeoffs: [
      { label: "top_k too small", effect: "Miss relevant context. Answer may be incomplete." },
      { label: "top_k too large", effect: "Overflow context window, dilute signal with noise." },
      { label: "Reranking", effect: "Fast ANN k=100 → cross-encoder rerank → keep best 10-20." },
    ],
  },
  {
    icon: FileCode,
    title: "Prompt Format",
    description: "How you structure the LLM's instructions",
    tradeoffs: [
      {
        label: "Strict grounding",
        effect: '"Answer using ONLY the context. If not present, say you don\'t know."',
      },
      {
        label: "Citation request",
        effect: "Ask for source chunk IDs or document titles for transparency.",
      },
      {
        label: "Structured output",
        effect: "Request JSON for downstream processing. Step-by-step reasoning.",
      },
    ],
  },
];

export default function DesignLevers() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Key Design Levers</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The knobs you can turn — think of these as{" "}
            <span className="font-semibold">trade-offs</span>, not magic
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Lever tabs */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
            {levers.map((lever, index) => (
              <motion.button
                key={lever.title}
                onClick={() => setActiveIndex(index)}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className={`flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-300 min-w-[200px] lg:min-w-0 ${
                  activeIndex === index ? "glass shadow-lg" : "hover:bg-white/40"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    activeIndex === index
                      ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <lever.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold">{lever.title}</h4>
                  <p className="text-xs text-gray-500 hidden lg:block">{lever.description}</p>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Active lever detail */}
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-2xl p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                {(() => {
                  const Icon = levers[activeIndex].icon;
                  return <Icon className="w-7 h-7 text-white" />;
                })()}
              </div>
              <div>
                <h3 className="text-2xl font-bold">{levers[activeIndex].title}</h3>
                <p className="text-gray-600">{levers[activeIndex].description}</p>
              </div>
            </div>

            <div className="space-y-4">
              {levers[activeIndex].tradeoffs.map((tradeoff, index) => (
                <motion.div
                  key={tradeoff.label}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="bg-white/50 rounded-xl p-4 border border-gray-100"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium ${
                        tradeoff.label.includes("too") || tradeoff.label === "Higher dims"
                          ? "bg-amber-100 text-amber-700"
                          : tradeoff.label === "Sweet spot" || tradeoff.label === "Hybrid search"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {tradeoff.label}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700 text-sm">{tradeoff.effect}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
