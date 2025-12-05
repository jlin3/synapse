"use client";

import { motion } from "framer-motion";
import { DollarSign, TrendingDown, TrendingUp, Target } from "lucide-react";

const budgetOptions = [
  {
    title: "MVP Tooling (4 months)",
    value: "$10k",
    range: "$6k–$15k midpoint",
    icon: Target,
    color: "emerald",
    description: "Primary budget for building the oncology MVP",
  },
  {
    title: "12-Month Run Budget",
    value: "$15k–$25k",
    range: "Growth + R&D headroom",
    icon: TrendingUp,
    color: "blue",
    description: "Ongoing operations assuming traffic growth",
  },
];

export default function BudgetRecommendation() {
  return (
    <section className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/20 to-transparent" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="text-xs font-mono text-slate-400">SECTION 08</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            Budget Recommendation
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            What to ask for — AI & tooling budget proposal
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {budgetOptions.map((option, index) => (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`rounded-2xl p-8 border ${
                option.color === "emerald"
                  ? "bg-emerald-500/5 border-emerald-500/30"
                  : "bg-blue-500/5 border-blue-500/30"
              }`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                option.color === "emerald" ? "from-emerald-400 to-teal-500" : "from-blue-400 to-indigo-500"
              } flex items-center justify-center shadow-lg mb-4`}>
                <option.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-slate-500 mb-1">{option.title}</div>
              <div className={`text-4xl font-bold mb-2 ${
                option.color === "emerald" ? "text-emerald-400" : "text-blue-400"
              }`}>
                {option.value}
              </div>
              <div className="text-sm text-slate-400 mb-4">{option.range}</div>
              <p className="text-slate-500 text-sm">{option.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Risk/Flexibility callouts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="rounded-2xl p-6 bg-amber-500/5 border border-amber-500/20"
          >
            <div className="flex items-start gap-4">
              <TrendingDown className="w-6 h-6 text-amber-400 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-white mb-2">Downside Risk</h4>
                <p className="text-sm text-slate-400">
                  Lean OSS path could reduce burn to ~$3k–$6k but will slow delivery and burn your time on infra.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="rounded-2xl p-6 bg-blue-500/5 border border-blue-500/20"
          >
            <div className="flex items-start gap-4">
              <TrendingUp className="w-6 h-6 text-blue-400 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-white mb-2">Upside Flexibility</h4>
                <p className="text-sm text-slate-400">
                  If you want fully Google-native (Option C), budget $25k–$50k for 12 months — marginal cost relative to teams & distribution is still trivial.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quote box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="rounded-3xl p-8 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-8 h-8 text-emerald-400" />
            <span className="text-lg font-semibold text-white">The Ask</span>
          </div>
          <blockquote className="text-lg md:text-xl text-slate-300 leading-relaxed">
            &quot;For a 3–4 month oncology MVP, plus 12 months of low-to-moderate scale usage, I recommend an{" "}
            <span className="text-emerald-400 font-bold">AI & tooling budget of ~$25k–$40k</span>. This covers Unstructured, vector DB, LLM usage, GCP infra (Composer, BigQuery, storage), with headroom to move into a Vertex RAG Engine / Vector Search architecture once we see traction.&quot;
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}

