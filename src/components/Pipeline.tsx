"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Scissors,
  Box,
  Database,
  Search,
  Filter,
  MessageSquare,
  Sparkles,
} from "lucide-react";

const pipelineSteps = [
  {
    icon: FileText,
    title: "Ingest",
    description: "PDFs, HTML, docs — clean & normalize",
    color: "from-blue-400 to-blue-500",
    detail:
      "Tools like unstructured.io convert messy formats into clean text segments with metadata.",
  },
  {
    icon: Scissors,
    title: "Chunk",
    description: "Split into 200-1000 token segments",
    color: "from-indigo-400 to-indigo-500",
    detail:
      "Overlap 10-20% so concepts aren't cut awkwardly. Each chunk tracks its source document.",
  },
  {
    icon: Box,
    title: "Embed",
    description: "Text → dense vectors in ℝⁿ",
    color: "from-violet-400 to-violet-500",
    detail: "Embedding models map text so semantically similar content is close in vector space.",
  },
  {
    icon: Database,
    title: "Index",
    description: "Store in vector database",
    color: "from-purple-400 to-purple-500",
    detail: "FAISS, Pinecone, Weaviate — supports fast ANN (approximate nearest neighbor) queries.",
  },
  {
    icon: Search,
    title: "Retrieve",
    description: "Find top-k similar chunks",
    color: "from-fuchsia-400 to-fuchsia-500",
    detail: "Embed the query, run similarity search with metadata filters, get relevant chunks.",
  },
  {
    icon: Filter,
    title: "Rerank",
    description: "Cross-encoder fine-ranking",
    color: "from-pink-400 to-pink-500",
    detail: "Optional: reorder chunks by relevance. Coarse retrieval → fine rerank for quality.",
  },
  {
    icon: MessageSquare,
    title: "Prompt",
    description: "Construct context + question",
    color: "from-rose-400 to-rose-500",
    detail: "System instructions + concatenated chunks + user question = grounded prompt.",
  },
  {
    icon: Sparkles,
    title: "Generate",
    description: "LLM answers from context",
    color: "from-orange-400 to-orange-500",
    detail: "Model reads retrieved documents, synthesizes answer, optionally cites sources.",
  },
];

export default function Pipeline() {
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
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">The RAG Pipeline</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Eight steps from raw documents to grounded answers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pipelineSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="glass rounded-2xl p-6 group cursor-default"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 shadow-lg shadow-${step.color.split("-")[1]}-500/20`}
              >
                <step.icon className="w-6 h-6 text-white" />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-gray-400">0{index + 1}</span>
                <h3 className="font-semibold text-lg">{step.title}</h3>
              </div>

              <p className="text-gray-600 text-sm mb-3">{step.description}</p>

              <p className="text-gray-500 text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {step.detail}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Flow visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-12 flex justify-center items-center gap-2 text-gray-400"
        >
          <span className="text-sm">Document</span>
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ delay: i * 0.2, repeat: Infinity, duration: 1.5 }}
              className="w-8 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"
            />
          ))}
          <span className="text-sm">Answer</span>
        </motion.div>
      </div>
    </section>
  );
}
