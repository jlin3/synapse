"use client";

import { motion } from "framer-motion";

export default function MathSection() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-transparent via-slate-50/50 to-transparent">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-medium mb-4">
            Under the Hood
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">The Core Equation</h2>
          <p className="text-xl text-gray-600">The math that powers semantic retrieval</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="glass rounded-3xl p-8 md:p-12"
        >
          {/* Embedding function */}
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Embedding Function
            </h4>
            <div className="bg-slate-900 rounded-xl p-6 font-mono text-lg text-white">
              <span className="text-blue-400">E</span>(text) → vector in{" "}
              <span className="text-green-400">ℝ</span>
              <sup className="text-orange-400">d</sup>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              E maps text to a d-dimensional vector space (e.g., d = 1536)
            </p>
          </div>

          {/* Query and document vectors */}
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Vectors
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-900 rounded-xl p-4 font-mono text-white">
                <span className="text-purple-400">v</span>
                <sub className="text-gray-400">q</sub> = <span className="text-blue-400">E</span>
                (query)
              </div>
              <div className="bg-slate-900 rounded-xl p-4 font-mono text-white">
                <span className="text-purple-400">v</span>
                <sub className="text-gray-400">i</sub> = <span className="text-blue-400">E</span>(d
                <sub className="text-gray-400">i</sub>)
              </div>
            </div>
          </div>

          {/* Similarity formula */}
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Cosine Similarity
            </h4>
            <div className="bg-slate-900 rounded-xl p-6 font-mono text-white text-center">
              <span className="text-yellow-400">sim</span>(q, d
              <sub className="text-gray-400">i</sub>) ={" "}
              <span className="inline-flex flex-col items-center">
                <span>
                  <span className="text-purple-400">v</span>
                  <sub className="text-gray-400">q</sub> ·{" "}
                  <span className="text-purple-400">v</span>
                  <sub className="text-gray-400">i</sub>
                </span>
                <span className="border-t border-gray-600 pt-1">
                  |<span className="text-purple-400">v</span>
                  <sub className="text-gray-400">q</sub>| × |
                  <span className="text-purple-400">v</span>
                  <sub className="text-gray-400">i</sub>|
                </span>
              </span>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              Dot product of vectors normalized by their magnitudes. Range: [-1, 1]
            </p>
          </div>

          {/* Retrieval */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Retrieval
            </h4>
            <div className="bg-slate-900 rounded-xl p-6 font-mono text-white">
              <span className="text-green-400">top_k</span> ={" "}
              <span className="text-yellow-400">argmax</span>
              <sub className="text-gray-400">k</sub> <span className="text-yellow-400">sim</span>(q,
              d<sub className="text-gray-400">i</sub>)
            </div>
            <p className="mt-3 text-sm text-gray-600">
              Pick the k documents with highest similarity → pass their text to the LLM
            </p>
          </div>
        </motion.div>

        {/* Old vs New comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 grid md:grid-cols-2 gap-6"
        >
          <div className="glass rounded-2xl p-6">
            <h4 className="font-semibold text-gray-500 mb-3">Traditional ML Approach</h4>
            <code className="text-sm block bg-gray-100 rounded-lg p-3 text-gray-800">
              features = [cosine_sim(q, doc_i)]
              <br />→ GBDT → label
            </code>
            <p className="mt-3 text-xs text-gray-500">Similarity as feature for classification</p>
          </div>
          <div className="glass rounded-2xl p-6 border-2 border-blue-200">
            <h4 className="font-semibold text-blue-600 mb-3">RAG Pattern</h4>
            <code className="text-sm block bg-blue-50 rounded-lg p-3 text-gray-800">
              neighbors = top_k(cosine_sim(q, doc_i))
              <br />→ LLM(q, neighbors_text)
            </code>
            <p className="mt-3 text-xs text-gray-500">
              Similarity for retrieval, LLM for generation
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
