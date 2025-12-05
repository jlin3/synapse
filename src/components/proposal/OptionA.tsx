"use client";

import { motion } from "framer-motion";
import { Server, HardDrive, Cpu, Database, DollarSign, ThumbsUp, ThumbsDown } from "lucide-react";

const stackItems = [
  { label: "Cloud", value: "GCP (minimal managed AI)" },
  { label: "Parsing", value: "Self-hosted Unstructured OSS (Docker + Cloud Run / GKE)" },
  { label: "Vector Search", value: "pgvector on Cloud SQL or Qdrant/Weaviate OSS on a small VM" },
  { label: "Embeddings", value: "Open-source SPECTER2 / PubMedBERT on GPU VM, or cheap Gemini embedding ($0.15/1M tokens)" },
  { label: "Ranking", value: "LightGBM/XGBoost model, served via REST microservice" },
  { label: "Orchestration", value: "Self-hosted Airflow or cron + lightweight scripts" },
];

const costBreakdown = [
  { category: "One-time Parsing", detail: "100k pages, mix of pipelines", cost: "$500–$1,500" },
  { category: "Embeddings", detail: "50M tokens × $0.15/1M (Gemini)", cost: "~$7.50" },
  { category: "Infra (Monthly)", detail: "1 small DB + 1 small VM + storage", cost: "$200–$500/mo" },
  { category: "Total MVP (3-4 mo)", detail: "One-off + 4 months run", cost: "$3k–$6k" },
];

const pros = [
  "Lowest cash burn, no dependence on Vertex RAG Engine / Spanner",
  "Can move to any cloud later with minimal rewrite",
  "Full control over every component",
];

const cons = [
  "You own more infra (Airflow, vector DB, scaling)",
  "Slower path to \"Google-grade\" search and RAG features",
  "More yak-shaving; this eats into your 3–4 months",
];

export default function OptionA() {
  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
            <span className="text-xs font-mono text-amber-400">SECTION 03</span>
          </div>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Server className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-white">
            Option A
          </h2>
          <p className="text-2xl text-amber-400 font-semibold mb-4">Lean OSS / Cost-Minimal</p>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Maximum control with lowest cash burn — you leverage OSS where possible
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Stack */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl p-6 bg-white/[0.02] border border-amber-500/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <Cpu className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-semibold text-white">Technology Stack</h3>
            </div>
            <div className="space-y-4">
              {stackItems.map((item) => (
                <div key={item.label} className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-wider text-amber-400/70">{item.label}</span>
                  <span className="text-sm text-slate-300">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Cost Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl p-6 bg-white/[0.02] border border-white/[0.06]"
          >
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-semibold text-white">Cost Breakdown (MVP Scale)</h3>
            </div>
            <div className="space-y-4">
              {costBreakdown.map((item, index) => (
                <div
                  key={item.category}
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    index === costBreakdown.length - 1
                      ? "bg-amber-500/10 border border-amber-500/20"
                      : "bg-white/[0.02]"
                  }`}
                >
                  <div>
                    <div className={`font-medium ${index === costBreakdown.length - 1 ? "text-amber-400" : "text-white"}`}>
                      {item.category}
                    </div>
                    <div className="text-xs text-slate-500">{item.detail}</div>
                  </div>
                  <div className={`font-mono font-bold ${index === costBreakdown.length - 1 ? "text-amber-400" : "text-emerald-400"}`}>
                    {item.cost}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Pros & Cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="rounded-2xl p-6 bg-emerald-500/5 border border-emerald-500/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <ThumbsUp className="w-5 h-5 text-emerald-400" />
              <h4 className="font-semibold text-white">Pros</h4>
            </div>
            <ul className="space-y-3">
              {pros.map((pro) => (
                <li key={pro} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                  <span className="text-sm text-slate-300">{pro}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="rounded-2xl p-6 bg-rose-500/5 border border-rose-500/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <ThumbsDown className="w-5 h-5 text-rose-400" />
              <h4 className="font-semibold text-white">Cons</h4>
            </div>
            <ul className="space-y-3">
              {cons.map((con) => (
                <li key={con} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
                  <span className="text-sm text-slate-300">{con}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

      </div>
    </section>
  );
}

