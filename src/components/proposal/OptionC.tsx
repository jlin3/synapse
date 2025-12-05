"use client";

import { motion } from "framer-motion";
import { Cloud, Cpu, DollarSign, ThumbsUp, ThumbsDown } from "lucide-react";

const stackItems = [
  { label: "Cloud", value: "GCP only" },
  { label: "Parsing", value: "Unstructured Serverless API (cleaner scientific PDFs than Google parsing)" },
  { label: "RAG + Vector", value: "Vertex AI RAG Engine with RAG-managed database (Spanner)" },
  { label: "Embeddings", value: "Gemini Embedding + Gemini 2.0 Flash / Flash-Lite" },
  { label: "Ranking", value: "Custom ranker (GBDT/deep) + Vertex AI Ranking API as additional reranker" },
  { label: "Orchestration", value: "Cloud Composer + Workflows" },
];

const costBreakdown = [
  { category: "Parsing (one-time)", detail: "Same as Option B", cost: "~$550" },
  { category: "Vector Search", detail: "≤1-2GiB index, data × $3/GiB", cost: "~$10/rebuild" },
  { category: "RAG Engine + Spanner", detail: "Spanner Enterprise (100 PUs)", cost: "$200–$600/mo" },
  { category: "Other (LLM, BigQuery)", detail: "Same as Option B", cost: "$500–$1.5k/mo" },
  { category: "Total Run Rate", detail: "MVP scale monthly", cost: "$1.5k–$4k/mo" },
  { category: "Total MVP Budget", detail: "3-4 months", cost: "$10k–$25k" },
];

const pros = [
  "Deepest integration into Google's RAG/search stack",
  "Future-proof for heavy enterprise deals (\"all Google infra\")",
  "RAG Engine reduces bespoke glue code",
  "\"Google-grade\" vector search and ranking capabilities",
];

const cons = [
  "Higher minimum spend floor (Spanner + RAG Engine)",
  "More complexity in learning Google's way of doing things",
  "Less portable if you ever want multi-cloud",
];

export default function OptionC() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <span className="text-xs font-mono text-blue-400">SECTION 05</span>
          </div>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Cloud className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-white">
            Option C
          </h2>
          <p className="text-2xl text-blue-400 font-semibold mb-4">Google-Native SOTA (Vertex RAG Engine)</p>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Lean hard into Google — maximum quality, least undifferentiated heavy lifting
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Stack */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl p-6 bg-white/[0.02] border border-blue-500/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <Cpu className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Technology Stack</h3>
            </div>
            <div className="space-y-4">
              {stackItems.map((item) => (
                <div key={item.label} className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-wider text-blue-400/70">{item.label}</span>
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
              <DollarSign className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Cost Breakdown (MVP Scale)</h3>
            </div>
            <div className="space-y-3">
              {costBreakdown.map((item, index) => (
                <div
                  key={item.category}
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    index === costBreakdown.length - 1
                      ? "bg-blue-500/10 border border-blue-500/30"
                      : index === costBreakdown.length - 2
                      ? "bg-indigo-500/5 border border-indigo-500/20"
                      : "bg-white/[0.02]"
                  }`}
                >
                  <div>
                    <div className={`font-medium ${index >= costBreakdown.length - 2 ? "text-blue-400" : "text-white"}`}>
                      {item.category}
                    </div>
                    <div className="text-xs text-slate-500">{item.detail}</div>
                  </div>
                  <div className={`font-mono font-bold ${index === costBreakdown.length - 1 ? "text-blue-400" : "text-indigo-400"}`}>
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

