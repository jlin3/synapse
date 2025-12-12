"use client";

import { motion } from "framer-motion";
import { Newspaper, Chrome, Users, Database, XCircle } from "lucide-react";

const functionalScope = [
  {
    icon: Newspaper,
    title: 'Daily "What\'s New" Feed',
    items: [
      "Per field (heme/onc, solid tumors)",
      "Per lab / institution",
      "Per individual researcher",
    ],
  },
  {
    icon: Chrome,
    title: "Browser Extension",
    items: [
      "User highlights text on PubMed / journal",
      "See 3–10 related papers using corpus + community signal",
    ],
  },
  {
    icon: Users,
    title: "Community Signal",
    items: [
      "Saves, reads, highlights, discussions",
      "Early oncology labs (Fred Hutch, Vanderbilt, NYU)",
    ],
  },
  {
    icon: Database,
    title: "Backend Support",
    items: [
      "Ingestion from OpenAlex (works, authors, institutions)",
      "PDF/HTML parsing into chunks",
      "Embedding, vector search, ranking API",
    ],
  },
];

const nonGoals = [
  "Full cross-field generality (stay in oncology)",
  "Full community feature set (likes, follows, reputation systems)",
  "Production-hardened multi-tenant lab environments",
];

export default function MVPScope() {
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
            <span className="text-xs font-mono text-slate-400">SECTION 01</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            Scope of the MVP
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            3–4 months • Oncology-first approach
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {functionalScope.map((scope, index) => (
            <motion.div
              key={scope.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="rounded-2xl p-6 bg-white/[0.02] border border-white/[0.06] hover:border-emerald-500/30 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center border border-emerald-500/20 group-hover:border-emerald-500/40 transition-colors">
                  <scope.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-3">{scope.title}</h3>
                  <ul className="space-y-2">
                    {scope.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                        <span className="text-sm text-slate-400">{item}</span>
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
          transition={{ delay: 0.4, duration: 0.5 }}
          className="rounded-2xl p-6 bg-rose-500/5 border border-rose-500/20"
        >
          <div className="flex items-start gap-4">
            <XCircle className="w-6 h-6 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Non-Goals in MVP</h4>
              <ul className="space-y-3">
                {nonGoals.map((goal) => (
                  <li key={goal} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
                    <span className="text-slate-400">{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
