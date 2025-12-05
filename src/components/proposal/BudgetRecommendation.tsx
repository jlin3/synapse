"use client";

import { motion } from "framer-motion";
import { DollarSign, TrendingDown, TrendingUp, Target, Users, Cpu } from "lucide-react";

const mvpBudget = [
  {
    category: "Personnel — You (4 months)",
    amount: "$83k",
    detail: "$250k/year prorated",
    type: "people",
  },
  {
    category: "AI & Tooling (MVP)",
    amount: "$10k",
    detail: "Midpoint of $6k–$15k",
    type: "infra",
  },
  {
    category: "Total MVP Phase",
    amount: "~$93k",
    detail: "4-month build cost",
    type: "total",
  },
];

const phase2Budget = [
  {
    category: "Founding Engineer (6 months)",
    amount: "$125k",
    detail: "$250k/year prorated",
    type: "people",
  },
  {
    category: "ML Engineer (Contract)",
    amount: "$125k",
    detail: "6-month engagement",
    type: "people",
  },
  {
    category: "Data / Backend Engineer",
    amount: "$125k",
    detail: "6-month engagement",
    type: "people",
  },
  {
    category: "Designer (Contract)",
    amount: "$25k–$50k",
    detail: "Fractional/contract",
    type: "people",
  },
  {
    category: "AI & Tooling (6 months)",
    amount: "$8k–$15k",
    detail: "Run budget + growth",
    type: "infra",
  },
  {
    category: "Total Phase II (6 months)",
    amount: "$408k–$440k",
    detail: "Full team + infra",
    type: "total",
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
            Full Budget Breakdown
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Complete cost analysis including personnel and infrastructure
          </p>
        </motion.div>

        {/* Two-phase budget view */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* MVP Phase */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl p-6 bg-emerald-500/5 border border-emerald-500/30"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Phase I — MVP</h3>
                <p className="text-sm text-slate-400">4-month build</p>
              </div>
            </div>
            <div className="space-y-3">
              {mvpBudget.map((item) => (
                <div
                  key={item.category}
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    item.type === "total"
                      ? "bg-emerald-500/20 border border-emerald-500/40"
                      : item.type === "people"
                      ? "bg-violet-500/10 border border-violet-500/20"
                      : "bg-white/[0.03] border border-white/[0.06]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.type === "people" && <Users className="w-4 h-4 text-violet-400" />}
                    {item.type === "infra" && <Cpu className="w-4 h-4 text-cyan-400" />}
                    {item.type === "total" && <DollarSign className="w-4 h-4 text-emerald-400" />}
                    <div>
                      <div className={`font-medium ${item.type === "total" ? "text-emerald-400" : "text-white"}`}>
                        {item.category}
                      </div>
                      <div className="text-xs text-slate-500">{item.detail}</div>
                    </div>
                  </div>
                  <div className={`font-mono font-bold ${
                    item.type === "total" ? "text-emerald-400 text-lg" : "text-slate-300"
                  }`}>
                    {item.amount}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Phase II */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl p-6 bg-cyan-500/5 border border-cyan-500/30"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Phase II — Scale</h3>
                <p className="text-sm text-slate-400">6 months post-MVP</p>
              </div>
            </div>
            <div className="space-y-3">
              {phase2Budget.map((item) => (
                <div
                  key={item.category}
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    item.type === "total"
                      ? "bg-cyan-500/20 border border-cyan-500/40"
                      : item.type === "people"
                      ? "bg-violet-500/10 border border-violet-500/20"
                      : "bg-white/[0.03] border border-white/[0.06]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.type === "people" && <Users className="w-4 h-4 text-violet-400" />}
                    {item.type === "infra" && <Cpu className="w-4 h-4 text-cyan-400" />}
                    {item.type === "total" && <DollarSign className="w-4 h-4 text-cyan-400" />}
                    <div>
                      <div className={`font-medium ${item.type === "total" ? "text-cyan-400" : "text-white"}`}>
                        {item.category}
                      </div>
                      <div className="text-xs text-slate-500">{item.detail}</div>
                    </div>
                  </div>
                  <div className={`font-mono font-bold ${
                    item.type === "total" ? "text-cyan-400 text-lg" : "text-slate-300"
                  }`}>
                    {item.amount}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Key insight callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          <div className="rounded-2xl p-6 bg-violet-500/5 border border-violet-500/20">
            <div className="flex items-start gap-4">
              <Users className="w-6 h-6 text-violet-400 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-white mb-2">People Costs Dominate</h4>
                <p className="text-sm text-slate-400">
                  Personnel is ~95% of total cost. Infra/tooling (~$20k for 10 months) is relatively cheap compared to talent investment (~$480k for full build).
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-6 bg-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-start gap-4">
              <Target className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-white mb-2">Phased Build Strategy</h4>
                <p className="text-sm text-slate-400">
                  Phase I (4 months, ~$93k) establishes core infrastructure. Phase II (6 months, ~$420k) scales team to 4 engineers + designer.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Summary box */}
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
          <blockquote className="text-lg md:text-xl text-slate-300 leading-relaxed mb-6">
            <span className="text-white font-semibold">Phase I (MVP):</span> ~$93k total (4 months) = $83k personnel + $10k tooling
          </blockquote>
          <blockquote className="text-lg md:text-xl text-slate-300 leading-relaxed">
            <span className="text-white font-semibold">Phase II (Scale):</span> ~$420k (6 months) = $400k team + $10k–$15k infra
          </blockquote>
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-sm text-slate-400">
              <span className="text-emerald-400 font-medium">Note:</span> Infra budget includes headroom for Google-native migration (Option C) to support enterprise customers at scale.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

