"use client";

import { motion } from "framer-motion";
import { Calendar, Settings, Database, Award, Chrome, Sparkles } from "lucide-react";

const milestones = [
  {
    month: "Month 1",
    title: "Foundation",
    icon: Settings,
    color: "from-blue-400 to-cyan-400",
    tasks: [
      "GCP project, basic infra, repos, CI/CD",
      "OpenAlex ingestion into BigQuery",
      "Unstructured parsing pipeline (GCS → structured chunks)",
      "Choose and test embedding model(s)",
      "Start embedding oncology subset",
    ],
  },
  {
    month: "Month 2",
    title: "Retrieval & Feeds",
    icon: Database,
    color: "from-emerald-400 to-teal-400",
    tasks: [
      "Stand up vector DB (Pinecone or Vertex Vector Search)",
      "Implement candidate generation: user/query → ANN search + filters",
      "v0 feed: simple scoring (recency + popularity)",
      "\"Top in oncology this week\" feed",
    ],
  },
  {
    month: "Month 3",
    title: "Ranking & Extension",
    icon: Award,
    color: "from-violet-400 to-purple-400",
    tasks: [
      "Implement LightGBM/XGBoost ranker + offline eval",
      "Ship personalized home feed per user / lab",
      "Extension endpoint: highlight → related papers",
      "Add basic instrumentation for engagement metrics",
    ],
  },
  {
    month: "Month 4",
    title: "Polish & Iterate",
    icon: Sparkles,
    color: "from-amber-400 to-orange-400",
    badge: "Optional / Stretch",
    tasks: [
      "Add LLM reranking for top-K (Gemini 2.0 Flash)",
      "Fine-tune ranking with early lab feedback",
      "Add \"lab pages\" and institution-level feeds",
      "Performance optimization and hardening",
    ],
  },
];

export default function Timeline() {
  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="text-xs font-mono text-slate-400">SECTION 07</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            Timeline & Milestones
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            3–4 month roadmap assuming Option B (Managed Hybrid)
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 via-emerald-500/50 via-violet-500/50 to-amber-500/50" />

          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.month}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className={`relative flex flex-col md:flex-row items-start gap-6 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline node - centered on desktop */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl bg-gradient-to-br items-center justify-center shadow-lg z-10"
                     style={{
                       backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                     }}>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${milestone.color} flex items-center justify-center shadow-lg`}>
                    <milestone.icon className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* Mobile timeline node */}
                <div className={`md:hidden absolute left-0 w-12 h-12 rounded-xl bg-gradient-to-br ${milestone.color} flex items-center justify-center shadow-lg z-10`}>
                  <milestone.icon className="w-6 h-6 text-white" />
                </div>

                {/* Spacer for desktop layout */}
                <div className="hidden md:block w-1/2" />

                {/* Content */}
                <div className={`flex-1 md:w-1/2 pl-16 md:pl-0 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                  <div className="rounded-2xl p-6 bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-3 py-1 rounded-lg bg-gradient-to-r ${milestone.color} text-white text-sm font-semibold`}>
                        {milestone.month}
                      </span>
                      {milestone.badge && (
                        <span className="px-2 py-0.5 text-[10px] rounded bg-amber-500/20 text-amber-300 uppercase font-medium">
                          {milestone.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4">{milestone.title}</h3>
                    <ul className="space-y-2">
                      {milestone.tasks.map((task) => (
                        <li key={task} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-2 flex-shrink-0" />
                          <span className="text-sm text-slate-400">{task}</span>
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

