"use client";

import { motion } from "framer-motion";
import {
  Building2,
  FileText,
  Scissors,
  Box,
  Database,
  Search,
  Filter,
  MessageSquare,
  Sparkles,
} from "lucide-react";

const exampleSteps = [
  {
    step: 1,
    icon: FileText,
    title: "Ingestion",
    description: "HR uploads PDFs, Confluence pages, Google Docs",
    detail: "unstructured.io normalizes all documents into clean paragraphs + section titles",
    code: null,
  },
  {
    step: 2,
    icon: Scissors,
    title: "Chunking",
    description: "Split into ~300-500 token chunks",
    detail: "50-100 token overlap so headings and definitions stay together",
    code: null,
  },
  {
    step: 3,
    icon: Box,
    title: "Embeddings",
    description: "Compute 1536-dimensional vector per chunk",
    detail: "Using OpenAI, Vertex, or similar embedding models",
    code: null,
  },
  {
    step: 4,
    icon: Database,
    title: "Index",
    description: "Store in pgvector or Pinecone",
    detail: "With metadata: {doc_id, section, updated_at, country, audience}",
    code: null,
  },
  {
    step: 5,
    icon: Search,
    title: "Query",
    description: '"What is parental leave policy in Germany?"',
    detail: "User asks a natural language question",
    code: null,
  },
  {
    step: 6,
    icon: Filter,
    title: "Retrieve",
    description: "Embed query, search with filter country='DE'",
    detail: "Returns k=10 most relevant chunks from German policies",
    code: null,
  },
  {
    step: 7,
    icon: MessageSquare,
    title: "Rerank",
    description: "Cross-encoder or BM25 hybrid",
    detail: "Put the policy paragraph at the top",
    code: null,
  },
  {
    step: 8,
    icon: Sparkles,
    title: "Prompt",
    description: "Top 5 chunks + instructions",
    detail: '"Use only this context. If not present, say you don\'t know."',
    code: `System: You are a helpful HR assistant.
Use ONLY the provided context.
If information isn't present, say "I don't know."

Context:
[chunk_1]: Parental Leave Policy - Germany...
[chunk_2]: Leave Duration and Pay...
[chunk_3]: Application Process...

User: What is parental leave policy in Germany?`,
  },
];

export default function ConcreteExample() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200 mb-6">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Walkthrough Example</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Company Handbook Bot
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Employees ask questions about HR policies — the bot answers using the handbook
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 via-indigo-300 to-purple-300 hidden md:block" />

          <div className="space-y-6">
            {exampleSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative"
              >
                <div className="flex gap-4 md:gap-6">
                  {/* Step number */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                      <step.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 glass rounded-2xl p-5 md:p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-mono text-gray-400">Step {step.step}</span>
                      <h3 className="font-bold text-lg">{step.title}</h3>
                    </div>
                    <p className="text-gray-700 mb-1">{step.description}</p>
                    <p className="text-sm text-gray-500">{step.detail}</p>

                    {step.code && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        whileInView={{ opacity: 1, height: "auto" }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        className="mt-4"
                      >
                        <pre className="bg-slate-900 rounded-xl p-4 text-sm text-slate-300 overflow-x-auto">
                          <code>{step.code}</code>
                        </pre>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Result */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-8 ml-0 md:ml-20"
          >
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-semibold text-green-700">Model Response</span>
              </div>
              <div className="prose prose-sm text-gray-700">
                <p className="mb-2">
                  Based on the company handbook, parental leave in Germany includes:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    <strong>Duration:</strong> Up to 3 years per child (can be split)
                  </li>
                  <li>
                    <strong>Pay:</strong> Elterngeld up to 67% of net income for 12-14 months
                  </li>
                  <li>
                    <strong>Application:</strong> Submit request 7 weeks before start date
                  </li>
                </ul>
                <p className="mt-3 text-xs text-gray-500">
                  Source: <span className="text-blue-600 underline">HR Handbook §4.2</span>, Last
                  updated: Nov 2024
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
