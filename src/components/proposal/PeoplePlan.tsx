"use client";

import { motion } from "framer-motion";
import { User, Users, Code, Settings, BarChart3 } from "lucide-react";

const roles = [
  {
    icon: User,
    title: "You (Founding ML / Full-Stack Engineer)",
    type: "core",
    color: "from-emerald-400 to-teal-500",
    budget: "Primary",
    responsibilities: [
      "Overall architecture & tech choices",
      "Ingestion, parsing, embedding pipeline",
      "Recommender model (GBDT first, deep later)",
      "APIs & integration with Synapse app + extension",
      "Basic infra (CI/CD, monitoring, logging)",
    ],
  },
  {
    icon: Code,
    title: "ML / Data Engineer (Contract)",
    type: "optional",
    color: "from-violet-400 to-purple-500",
    budget: "$20k–$40k",
    timing: "2–3 days/week for 3–4 months",
    responsibilities: [
      "Hardening data pipelines & feature store",
      "Adding proper eval harness & offline metrics (AUC, NDCG@K, recall@K)",
    ],
  },
  {
    icon: Settings,
    title: "Infra / DevOps (Fractional)",
    type: "optional",
    color: "from-blue-400 to-cyan-500",
    budget: "$5k–$15k",
    timing: "5–10 hours/week",
    responsibilities: [
      "GCP project setup, IAM, secrets, Terraform",
      "Monitoring, logging, cost controls",
    ],
  },
  {
    icon: BarChart3,
    title: "Data Analyst / Applied Scientist",
    type: "later",
    color: "from-amber-400 to-orange-500",
    budget: "TBD",
    timing: "Post-MVP",
    responsibilities: [
      "Heavy iteration on ranking features and experiments",
      "A/B testing and metric analysis",
    ],
  },
];

export default function PeoplePlan() {
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
            <span className="text-xs font-mono text-slate-400">SECTION 06</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            People Plan & Roles
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            MVP is achievable with yourself as primary engineer plus optional fractional help
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`rounded-2xl p-6 border ${
                role.type === "core"
                  ? "bg-emerald-500/5 border-emerald-500/30 md:col-span-2"
                  : "bg-white/[0.02] border-white/[0.06]"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <role.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-white">{role.title}</h3>
                    {role.type === "optional" && (
                      <span className="px-2 py-0.5 text-[10px] rounded bg-violet-500/20 text-violet-300 uppercase font-medium">
                        Nice to have
                      </span>
                    )}
                    {role.type === "later" && (
                      <span className="px-2 py-0.5 text-[10px] rounded bg-amber-500/20 text-amber-300 uppercase font-medium">
                        Later
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-slate-400">
                    {role.timing && (
                      <span className="flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-slate-500" />
                        {role.timing}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-emerald-500" />
                      <span className="text-emerald-400 font-medium">{role.budget}</span>
                    </span>
                  </div>

                  <ul className={`space-y-2 ${role.type === "core" ? "md:grid md:grid-cols-2 md:gap-x-6 md:space-y-0" : ""}`}>
                    {role.responsibilities.map((resp) => (
                      <li key={resp} className="flex items-start gap-2 md:mb-2">
                        <span className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                          role.type === "core" ? "bg-emerald-500" : "bg-slate-500"
                        }`} />
                        <span className="text-sm text-slate-400">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border border-emerald-500/20 text-center"
        >
          <p className="text-slate-300">
            <span className="text-white font-semibold">&quot;I&apos;ll own the entire pipeline end-to-end,</span>
            <span className="text-slate-400"> and here&apos;s the tool budget I need to do it right.&quot;</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

