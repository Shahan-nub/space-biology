"use client";

import { AboutSection } from "./About";
import { HeroSection } from "./Hero";
import { motion } from "framer-motion";
import Link from "next/link";

// --- Types ---
// interface SearchResult {
//   title: string;
//   author: string;
//   text: string;
// }

// --- Example Integration ---
export const HomePage: React.FC = () => {
  //   const handleSearch = async () => {
  //     setLoading(true);
  //     const res = await fetch('/api/search', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ query, top_k: 5 }),
  //     });
  //     const data = await res.json();
  //     setResults(data.results);
  //     setLoading(false);
  //   };

  return (
    <main className="bg-black text-white min-h-screen">
      <HeroSection />

      {/* Knowledge Graph CTA Section */}
      <section className="relative w-full bg-gradient-to-b from-black via-gray-950 to-black py-20 overflow-hidden">
        {/* Background Effects */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 border border-purple-500/30 rounded-2xl p-8 md:p-12 text-center backdrop-blur-sm shadow-2xl"
          >
            <motion.div
              className="mb-6"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="inline-block p-4 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-2xl mb-4 shadow-lg shadow-purple-500/50">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Explore the Knowledge Graph
            </h2>

            <p className="text-slate-300 text-lg mb-2 max-w-2xl mx-auto">
              Dive into 74,000+ interconnected relationships from space biology
              research
            </p>
            <p className="text-slate-400 text-sm mb-8 max-w-2xl mx-auto">
              Interactive force-directed visualization powered by
              react-force-graph
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/explore"
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Launch Knowledge Graph
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/search"
                  className="px-8 py-4 bg-slate-800/40 border border-cyan-500/30 text-slate-200 font-semibold rounded-lg hover:bg-slate-800/60 hover:border-cyan-500/60 transition-all duration-300"
                >
                  Query Knowledge Graph
                </Link>
              </motion.div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className="p-4 bg-gradient-to-br from-purple-900/30 to-slate-900/40 border border-purple-500/30 rounded-lg group hover:border-purple-500/60 transition-all duration-300"
              >
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                  74,250+
                </div>
                <div className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                  Verified Relationships
                </div>
              </motion.div>
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className="p-4 bg-gradient-to-br from-cyan-900/30 to-slate-900/40 border border-cyan-500/30 rounded-lg group hover:border-cyan-500/60 transition-all duration-300"
              >
                <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-1">
                  Interactive
                </div>
                <div className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                  Drag, Zoom, Explore
                </div>
              </motion.div>
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className="p-4 bg-gradient-to-br from-blue-900/30 to-slate-900/40 border border-blue-500/30 rounded-lg group hover:border-blue-500/60 transition-all duration-300"
              >
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">
                  Real-time
                </div>
                <div className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                  Dynamic Force Layout
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <AboutSection />
    </main>
  );
};
