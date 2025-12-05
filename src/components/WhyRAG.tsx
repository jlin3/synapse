"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

const strengths = [
  {
    title: "Up-to-date Knowledge",
    description: "Just re-index documents — no retraining needed. Your AI stays current.",
  },
  {
    title: "Cheaper & Faster Iteration",
    description: "Swap embedding models, adjust chunking, tweak retrieval without touching the base LLM.",
  },
  {
    title: "Controllable & Debuggable",
    description: "When wrong, inspect: Did we retrieve the right chunks? Was the source outdated?",
  },
  {
    title: "Data Isolation",
    description: "Your proprietary documents stay in your index; model only sees them at inference time.",
  },
];

const weaknesses = [
  {
    title: "Retrieval Miss = Model Blind",
    description: "If the right chunk isn't retrieved, the LLM will hallucinate or say \"I don't know.\"",
  },
  {
    title: "Latency Overhead",
    description: "Extra hops: embed query → ANN search → reranker → LLM. Each adds time.",
  },
  {
    title: "Infrastructure Complexity",
    description: "Need ingestion pipeline, index maintenance, permission filtering, observability.",
  },
  {
    title: "Context Window Limits",
    description: "You can only feed so many tokens. Huge documents may need multi-hop RAG.",
  },
];

export default function WhyRAG() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Why Use RAG?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Make the LLM <span className="font-semibold text-blue-600">know your private data</span> without retraining
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Strengths</h3>
            </div>
            
            <div className="space-y-4">
              {strengths.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="glass rounded-xl p-5"
                >
                  <h4 className="font-semibold mb-1 text-green-700">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Weaknesses */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Weaknesses</h3>
            </div>
            
            <div className="space-y-4">
              {weaknesses.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="glass rounded-xl p-5"
                >
                  <h4 className="font-semibold mb-1 text-rose-700">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Key takeaway */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-block glass rounded-2xl p-6 max-w-2xl">
            <p className="text-lg text-gray-700">
              <span className="font-semibold">&quot;Garbage in → garbage out.&quot;</span>
              {" "}If retrieval fails or chunking is bad, the LLM will still hallucinate confidently.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

