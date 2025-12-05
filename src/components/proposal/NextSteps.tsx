"use client";

import { motion } from "framer-motion";
import { CheckSquare, ArrowRight, Target, BarChart3, Layers, FileText, Users, Calendar } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: CheckSquare,
    title: "Pick an Option",
    description: "Propose Option B in meeting, with C as \"Phase 2\"",
    color: "from-emerald-400 to-teal-500",
  },
  {
    number: "02",
    icon: Target,
    title: "Define MVP KPIs",
    description: "Time-to-first-paper, saves/reads per WAU, lab adoption",
    color: "from-blue-400 to-cyan-500",
  },
  {
    number: "03",
    icon: Layers,
    title: "Lock Initial Stack",
    description: "GCP + Unstructured + Pinecone + Gemini 2.0 Flash + LightGBM",
    color: "from-violet-400 to-purple-500",
  },
  {
    number: "04",
    icon: FileText,
    title: "Create Tech Spec",
    description: "Very short (2–3 pages) referencing this architecture",
    color: "from-rose-400 to-pink-500",
  },
  {
    number: "05",
    icon: Users,
    title: "Decide on Hires",
    description: "Whether to bring on part-time ML/infra contractor",
    color: "from-amber-400 to-orange-500",
  },
  {
    number: "06",
    icon: Calendar,
    title: "Calendar-Level Plan",
    description: "Commit to specific milestones per month",
    color: "from-cyan-400 to-blue-500",
  },
];

export default function NextSteps() {
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
            <span className="text-xs font-mono text-slate-400">SECTION 09</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            Concrete Next Steps
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Immediate action items for MVP kickoff
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl p-6 bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-all group cursor-default"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-slate-500">{step.number}</span>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                  </div>
                  <h3 className="font-semibold text-white mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-400">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

