"use client"

import { motion } from "framer-motion";

// --- About Section ---
export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="bg-gray-950 text-gray-200 py-20 px-6 md:px-20 border-t border-gray-800">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h2
          className="text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About the Project
        </motion.h2>
        <motion.p
          className="text-lg text-gray-400 leading-relaxed mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          This project, built for NASA Space Apps, leverages machine learning to analyze over 600 research papers on space biology. It allows users to query complex biological topics and instantly discover relevant findings, authors, and studies. The goal is to empower researchers, students, and enthusiasts to better understand how life functions in space environments.
        </motion.p>
        <motion.div
          className="grid md:grid-cols-3 gap-8 text-left mt-12"
          initial="hidden"
          whileInView="visible"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } }}
        >
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-indigo-400">Mission</h3>
            <p className="text-gray-400 text-sm">
              To bridge data and discovery by making decades of space biology research easily searchable and understandable.
            </p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-indigo-400">Technology</h3>
            <p className="text-gray-400 text-sm">
              Powered by Natural Language Processing and Embedding Models that capture semantic relationships between research topics.
            </p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-indigo-400">Impact</h3>
            <p className="text-gray-400 text-sm">
              Enabling scientists and the public to explore how organisms adapt, grow, and evolve beyond Earth’s boundaries.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};