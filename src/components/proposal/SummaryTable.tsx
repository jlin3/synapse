"use client";

import { motion } from "framer-motion";
import { CheckCircle, Zap, Shield, DollarSign, Cloud, Server, Cpu } from "lucide-react";

const options = [
  {
    id: "A",
    name: "Lean OSS",
    icon: Server,
    color: "from-amber-400 to-orange-500",
    borderColor: "border-amber-500/30",
    bgColor: "bg-amber-500/5",
    goal: "Lowest cash burn, more infra work",
    stack: "GCP + OSS vector DB + OSS embeddings + self-hosted parsing",
    buildTime: "3–4 months",
    mvpBudget: "$3k–$6k",
    runRate: "~$300–$800/mo",
    pros: ["Cheap", "Portable", "Maximum control"],
    cons: ["More DevOps", "More time on infra"],
  },
  {
    id: "B",
    name: "Managed Hybrid",
    icon: Zap,
    color: "from-emerald-400 to-teal-500",
    borderColor: "border-emerald-500/40",
    bgColor: "bg-emerald-500/10",
    goal: "Best balance of speed, cost, and quality",
    stack: "GCP + Unstructured API + Pinecone + Gemini",
    buildTime: "3 months",
    mvpBudget: "$6k–$15k",
    runRate: "~$800–$2k/mo",
    pros: ["Fast to market", "Minimal ops", "Great DX"],
    cons: ["Some vendor lock-in"],
    recommended: true,
  },
  {
    id: "C",
    name: "Google-Native",
    icon: Cloud,
    color: "from-blue-400 to-indigo-500",
    borderColor: "border-blue-500/30",
    bgColor: "bg-blue-500/5",
    goal: "Max quality / least heavy lifting",
    stack: "GCP + Vertex RAG Engine + Vector Search + Gemini",
    buildTime: "3 months",
    mvpBudget: "$10k–$25k",
    runRate: "~$1.5k–$4k/mo",
    pros: ["Best integration", "Google-grade infra", "Future-proof"],
    cons: ["Highest complexity", "Spanner cost floor"],
  },
];

export default function SummaryTable() {
  return (
    <section className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="text-xs font-mono text-slate-400">SECTION 00</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            Summary — MVP Options
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Three implementation paths for the Personalized Feed system
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {options.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`relative rounded-3xl p-6 border ${option.borderColor} ${option.bgColor} backdrop-blur-sm ${
                option.recommended ? "ring-2 ring-emerald-500/50" : ""
              }`}
            >
              {option.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-emerald-500/30">
                    Recommended
                  </span>
                </div>
              )}

              <div className="flex items-center gap-4 mb-6 mt-2">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${option.color} flex items-center justify-center shadow-lg`}
                >
                  <option.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-500 mb-1">OPTION {option.id}</div>
                  <h3 className="text-2xl font-bold text-white">{option.name}</h3>
                </div>
              </div>

              <p className="text-slate-400 text-sm mb-6 leading-relaxed">{option.goal}</p>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <Cpu className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-slate-500 leading-relaxed">{option.stack}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                    Build Time
                  </div>
                  <div className="text-base font-semibold text-white">{option.buildTime}</div>
                </div>
                <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                    MVP Budget
                  </div>
                  <div className="text-base font-semibold text-emerald-400">{option.mvpBudget}</div>
                </div>
              </div>

              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 mb-6">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                  Run Rate
                </div>
                <div className="text-base font-semibold text-white">{option.runRate}</div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-emerald-400 mb-2">
                    Pros
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {option.pros.map((pro) => (
                      <span
                        key={pro}
                        className="px-2 py-1 text-xs rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                      >
                        {pro}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-rose-400 mb-2">
                    Cons
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {option.cons.map((con) => (
                      <span
                        key={con}
                        className="px-2 py-1 text-xs rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20"
                      >
                        {con}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-12 p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20"
        >
          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Recommendation</h4>
              <p className="text-slate-400 leading-relaxed">
                <span className="text-emerald-400 font-semibold">Option B</span> for the next 12
                months — fastest to ship with minimal infra pain, with a clear migration path into
                Option C once the product is hitting PMF.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
