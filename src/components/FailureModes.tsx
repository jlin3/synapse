"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Wrench } from "lucide-react";

const failureModes = [
  {
    problem: "Wrong or hallucinated answers",
    cause: "Missing or irrelevant retrieved chunks. Weak instructions.",
    fixes: [
      "Improve recall: better chunking, hybrid search, reranking",
      "Enforce stricter prompting: refuse when context is missing",
      "Use answer-verification or self-critique calls",
    ],
  },
  {
    problem: "Retrieving the right doc but wrong part",
    cause: "Whole doc chunked poorly — the clause you need is split.",
    fixes: [
      "Use semantic chunking at paragraph/section boundaries",
      "Increase overlap between chunks",
    ],
  },
  {
    problem: "Answers mixing multiple tenants/users",
    cause: "Missing row-level permissions in retrieval.",
    fixes: [
      "Guarantee metadata filters (e.g. tenant_id)",
      "Enforce at query level regardless of prompt",
    ],
  },
  {
    problem: "Latency too high",
    cause: "Multiple hops without optimization.",
    fixes: [
      "Cache embeddings and retrieval results",
      "Use smaller embedding models",
      "Lower k, less expensive rerankers",
      "Parallelize retrieval and other tools",
    ],
  },
  {
    problem: "Stale data",
    cause: "Documents updated but index not refreshed.",
    fixes: [
      "Incremental re-indexing on document updates",
      "TTL or updated_at filters in retrieval",
    ],
  },
];

export default function FailureModes() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-4">
            <AlertTriangle className="w-4 h-4" />
            Things That Go Wrong
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Common Failure Modes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Mentioning 2–3 of these + mitigations shows practical understanding
          </p>
        </motion.div>

        <div className="space-y-6">
          {failureModes.map((mode, index) => (
            <motion.div
              key={mode.problem}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Problem */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-600 font-bold text-sm">
                        {index + 1}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900">{mode.problem}</h3>
                    </div>
                    <p className="text-gray-600 text-sm ml-11">
                      <span className="font-medium text-gray-700">Cause: </span>
                      {mode.cause}
                    </p>
                  </div>

                  {/* Fixes */}
                  <div className="md:w-1/2">
                    <div className="flex items-center gap-2 mb-3 text-green-700">
                      <Wrench className="w-4 h-4" />
                      <span className="text-sm font-semibold">Mitigations</span>
                    </div>
                    <ul className="space-y-2">
                      {mode.fixes.map((fix) => (
                        <li key={fix} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                          {fix}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

