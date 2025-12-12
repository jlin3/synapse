"use client";

import { motion } from "framer-motion";
import { Download, FileText, Box, Search, Award, Server } from "lucide-react";

const pipelineSteps = [
  {
    icon: Download,
    step: "01",
    title: "Ingest & Parse",
    color: "from-blue-400 to-cyan-400",
    items: [
      "Pull metadata + links from OpenAlex for oncology-related concepts",
      "Fetch PDFs/HTML, store in object storage (GCS)",
      "Parse into structured chunks (title, abstract, sections) via OSS Unstructured or SaaS",
    ],
  },
  {
    icon: Box,
    step: "02",
    title: "Embed & Index",
    color: "from-violet-400 to-purple-400",
    items: [
      "Generate document embeddings (SPECTER2 / SciBERT / Gemini embeddings)",
      "Store vectors in OSS vector DB (pgvector/Qdrant), Pinecone, or Vertex AI Vector Search",
    ],
  },
  {
    icon: Search,
    step: "03",
    title: "Candidate Generation",
    color: "from-emerald-400 to-teal-400",
    items: [
      "Semantic nearest neighbors (vector search)",
      "Heuristic / graph-based candidates (popular in lab, co-read, etc.)",
    ],
  },
  {
    icon: Award,
    step: "04",
    title: "Ranking & Personalization",
    color: "from-amber-400 to-orange-400",
    items: [
      "GBDT or deep ranker on (user, lab, paper, context) features",
      "Optional LLM-based reranking (Gemini 2.0 Flash, Ranking API)",
    ],
  },
  {
    icon: Server,
    step: "05",
    title: "Serving",
    color: "from-rose-400 to-pink-400",
    items: ["APIs for feeds, related-papers, lab pages", "Observability + A/B hooks"],
  },
];

export default function BaselineArchitecture() {
  return (
    <section className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="text-xs font-mono text-slate-400">SECTION 02</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            Baseline Architecture
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            RAG + Recommender pipeline powering personalized feeds — options differ in &quot;who
            runs which piece&quot;
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-[27px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 via-emerald-500/50 to-rose-500/50 hidden md:block" />

          <div className="space-y-8">
            {pipelineSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`flex flex-col md:flex-row items-start gap-6 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline node - desktop */}
                <div className="hidden md:flex w-1/2 items-center justify-center">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg relative z-10`}
                  >
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* Content card */}
                <div className={`flex-1 md:w-1/2 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                  <div className="rounded-2xl p-6 bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      {/* Timeline node - mobile */}
                      <div
                        className={`md:hidden w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                      >
                        <step.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="text-xs font-mono text-slate-500">STEP {step.step}</span>
                        <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {step.items.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-2 flex-shrink-0" />
                          <span className="text-sm text-slate-400 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
