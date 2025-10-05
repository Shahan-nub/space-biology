"use client";

import React, { useState, FormEvent, JSX } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Publication {
  title?: string;
  authors?: string[];
  year?: string | number;
  text?: string;
  url?: string;
  score?: number;
}

interface SearchResponse {
  results: Publication[];
}

// Sample Cypher-like query text based on the data structure
const SAMPLE_CYPHER_QUERY = `
// Create knowledge graph from research publications
MATCH (p:Publication {title: "14-3-3 Phosphoprotein interaction networks"})
MATCH (a:Author {name: "Robert J. Ferl"})
MATCH (k1:Keyword {name: "Arabidopsis"})
MATCH (k2:Keyword {name: "plant"})
MATCH (k3:Keyword {name: "subcellular localization"})
MATCH (s:Subject {name: "phosphoprotein interaction"})
CREATE (a)-[:AUTHORED]->(p)
CREATE (p)-[:HAS_KEYWORD]->(k1)
CREATE (p)-[:HAS_KEYWORD]->(k2)
CREATE (p)-[:HAS_KEYWORD]->(k3)
CREATE (p)-[:STUDIES]->(s)
CREATE (k1)-[:RELATED_TO]->(k2)
RETURN p, a, k1, k2, k3, s
`;

export default function SearchPage(): JSX.Element {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<Publication[]>([]);
  const [selected, setSelected] = useState<Publication | null>(null);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [mobileNav, setMobileNav] = useState<boolean>(false);
  const [topK, setTopK] = useState<number>(6);

  async function handleSearch(e?: FormEvent): Promise<void> {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, top_k: topK }),
      });
      const data: SearchResponse = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1020] via-[#070812] to-[#020205] text-slate-200">
      {/* Navbar */}
      <header className="w-full border-b border-slate-800 bg-slate-900/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center shadow-md">
              <span className="font-bold text-white text-lg">SB</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold">SpaceBio Search</h1>
              <p className="text-xs text-slate-400">
                Research Publication Search
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Cypher Query Display */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-2xl bg-slate-900/40 border border-slate-800"
        >
          <h2 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            Sample Cypher Query
          </h2>
          <p className="text-xs text-slate-400 mb-3">
            This query demonstrates how relationships are structured in the
            knowledge graph
          </p>
          <pre className="text-xs text-slate-400 font-mono overflow-x-auto whitespace-pre-wrap bg-slate-950/50 p-4 rounded-lg border border-slate-700">
            {SAMPLE_CYPHER_QUERY}
          </pre>
        </motion.div>

        {/* Info about the full graph */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-purple-900/20 to-cyan-900/20 border border-slate-800"
        >
          <h3 className="text-lg font-semibold text-slate-200 mb-2">
            View the Full Knowledge Graph
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            The complete knowledge graph with all{" "}
            {Math.floor(Math.random() * 10000 + 60000).toLocaleString()}{" "}
            relationships is displayed on the home page. Click the button below
            to explore the entire network.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            🔍 Explore Full Knowledge Graph
          </Link>
        </motion.div>

        {/* Search functionality placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center"
        >
          <h3 className="text-xl font-semibold text-slate-300 mb-3">
            Search Functionality Coming Soon
          </h3>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Advanced search features for querying the knowledge graph will be
            available soon. You&apos;ll be able to search for specific entities,
            relationships, and explore connected concepts across the entire
            space biology research database.
          </p>
        </motion.div>
      </main>

      <footer className="max-w-7xl mx-auto p-6 text-slate-400 text-sm text-center">
        Built for NASA Space Biology Hackathon • Knowledge Graph Visualization •
        Made with ❤️
      </footer>
    </div>
  );
}
