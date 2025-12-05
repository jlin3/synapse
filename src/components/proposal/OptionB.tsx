"use client";

import { motion } from "framer-motion";
import { Zap, Cpu, DollarSign, ThumbsUp, ThumbsDown, Star, CheckCircle } from "lucide-react";

const stackItems = [
  { label: "Cloud", value: "GCP" },
  { label: "Parsing", value: "Unstructured Serverless API (Fast: $1/1k pages, Hi-Res: $10/1k pages)" },
  { label: "Vector DB", value: "Pinecone serverless (~$25/month starter, usage-based)" },
  { label: "Embeddings", value: "Gemini Embedding or text-embedding-004 (~$0.15/M tokens)" },
  { label: "LLMs", value: "Gemini 2.0 Flash (input $0.10/M, output $0.40/M)" },
  { label: "Ranking", value: "LightGBM/XGBoost in Vertex AI or Cloud Run" },
  { label: "Orchestration", value: "Cloud Composer (managed Airflow) + Google Workflows" },
];

const costBreakdown = [
  { category: "Parsing (one-time)", detail: "50k fast + 50k hi-res pages", cost: "~$550" },
  { category: "Embeddings", detail: "50M tokens × $0.15/M", cost: "~$7.50" },
  { category: "LLM Calls (monthly)", detail: "50k calls, ~1k tokens each", cost: "<$20/mo" },
  { category: "Vector + Infra", detail: "Pinecone + BigQuery + Composer", cost: "$500–$1.5k/mo" },
  { category: "Total Run Rate", detail: "MVP scale monthly", cost: "$800–$2k/mo" },
  { category: "Total MVP Budget", detail: "3-4 months to be safe", cost: "$6k–$15k" },
];

const pros = [
  "Fastest to ship with minimal infra burden",
  "Managed doc parsing + managed vector + cheap, high-quality Gemini models",
  "Easy path to gradually swap components (Pinecone → Vertex Vector Search, etc.)",
];

const cons = [
  "Vendor dependence on Unstructured + Pinecone + Google",
  "Some Composer overhead (but familiar territory)",
];

export default function OptionB() {
  return (
    <section className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/20 to-transparent" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-6">
            <Star className="w-3 h-3 text-emerald-400" />
            <span className="text-xs font-mono text-emerald-400">SECTION 04 • RECOMMENDED</span>
          </div>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-500/20">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-white">
            Option B
          </h2>
          <p className="text-2xl text-emerald-400 font-semibold mb-4">Managed Hybrid</p>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            The &quot;speed + quality sweet spot&quot; — leverage managed services where painful, keep enough control to avoid total lock-in
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/30"
        >
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            <span className="text-lg font-semibold text-white">This is the recommended option</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Best balance of speed, cost, and quality for the next 12 months. Ship fast with minimal infra pain, with a clear migration path into Option C once the product is hitting PMF.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Stack */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl p-6 bg-white/[0.02] border border-emerald-500/30"
          >
            <div className="flex items-center gap-3 mb-6">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-semibold text-white">Technology Stack</h3>
            </div>
            <div className="space-y-4">
              {stackItems.map((item) => (
                <div key={item.label} className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-wider text-emerald-400/70">{item.label}</span>
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
            <div className="space-y-3">
              {costBreakdown.map((item, index) => (
                <div
                  key={item.category}
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    index === costBreakdown.length - 1
                      ? "bg-emerald-500/10 border border-emerald-500/30"
                      : index === costBreakdown.length - 2
                      ? "bg-teal-500/5 border border-teal-500/20"
                      : "bg-white/[0.02]"
                  }`}
                >
                  <div>
                    <div className={`font-medium ${index >= costBreakdown.length - 2 ? "text-emerald-400" : "text-white"}`}>
                      {item.category}
                    </div>
                    <div className="text-xs text-slate-500">{item.detail}</div>
                  </div>
                  <div className={`font-mono font-bold ${index === costBreakdown.length - 1 ? "text-emerald-400" : "text-teal-400"}`}>
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
            className="rounded-2xl p-6 bg-emerald-500/10 border border-emerald-500/30"
          >
            <div className="flex items-center gap-3 mb-4">
              <ThumbsUp className="w-5 h-5 text-emerald-400" />
              <h4 className="font-semibold text-white">Pros</h4>
            </div>
            <ul className="space-y-3">
              {pros.map((pro) => (
                <li key={pro} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                  <span className="text-sm text-slate-200">{pro}</span>
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

