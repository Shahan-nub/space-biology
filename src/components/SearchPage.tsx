"use client"

import React, { useState, FormEvent, JSX } from "react";
import { motion } from "framer-motion";
import { Search, Filter, X, ChevronRight, Menu } from "lucide-react";

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
        <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center shadow-md">
              <span className="font-bold text-white text-lg">SB</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold">SpaceBio Search</h1>
              <p className="text-xs text-slate-400">608 publications</p>
            </div>
          </div>

          <div className="hidden md:flex gap-4 items-center">
            <a className="text-sm text-slate-400 hover:text-white" href="#">About</a>
            <a className="text-sm text-slate-400 hover:text-white" href="#">Docs</a>
            <button className="px-3 py-1 rounded-md bg-slate-800/40 border border-slate-700 text-sm">Export</button>
          </div>

          <button
            onClick={() => setMobileNav(!mobileNav)}
            className="md:hidden p-2 rounded-md hover:bg-slate-800/50"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileNav && (
          <div className="md:hidden bg-slate-900/60 border-t border-slate-800 flex flex-col items-start px-6 py-4 space-y-2">
            <a className="text-sm text-slate-400 hover:text-white" href="/">About</a>
            <a className="text-sm text-slate-400 hover:text-white" href="#">Docs</a>
            <button className="px-3 py-1 rounded-md bg-slate-800/40 border border-slate-700 text-sm">Export</button>
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className={`md:col-span-1 ${filtersOpen ? "block" : "hidden md:block"}`}>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 shadow-sm sticky top-6">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Filters</h3>
              <button onClick={() => setFiltersOpen(!filtersOpen)} className="p-1 rounded-md hover:bg-slate-800/30">
                <Filter size={16} />
              </button>
            </div>

            <div className="mt-4">
              <label className="block text-xs text-slate-400">Top K results</label>
              <input type="range" min={1} max={20} value={topK} onChange={(e) => setTopK(Number(e.target.value))} className="w-full mt-2" />
              <div className="text-sm text-slate-300 mt-1">{topK} results</div>
            </div>

            <div className="mt-6">
              <label className="block text-xs text-slate-400">Year</label>
              <select className="mt-2 w-full bg-transparent border border-slate-800 rounded-md p-2 text-sm">
                <option>All</option>
                <option>2025</option>
                <option>2024</option>
                <option>2010-2023</option>
              </select>
            </div>

            <div className="mt-6">
              <label className="block text-xs text-slate-400">Topic</label>
              <div className="flex flex-col gap-2 mt-2">
                <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" className="accent-sky-400" /> Microgravity</label>
                <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" className="accent-sky-400" /> Radiation</label>
                <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" className="accent-sky-400" /> Synthetic Biology</label>
              </div>
            </div>

            <div className="mt-6 text-sm text-slate-400">Tip: Use precise terms like <span className="text-sky-300">"microbial growth"</span> for better matches.</div>
          </motion.div>
        </aside>

        <section className="md:col-span-3">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-3">
              <label htmlFor="q" className="relative flex-1">
                <input id="q" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search publications, authors, or keywords..." className="w-full rounded-2xl bg-slate-900/30 border border-slate-800 p-4 pl-12 placeholder:text-slate-400 focus:outline-none" />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Search size={18} /></div>
              </label>

              <button type="submit" className="px-5 rounded-2xl bg-gradient-to-r from-[#6ee7b7] to-[#3b82f6] text-black font-semibold hover:opacity-95 disabled:opacity-60" disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </button>

              <button type="button" onClick={() => { setQuery(""); setResults([]); }} title="Clear" className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700">
                <X size={16} />
              </button>
            </div>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {results.length === 0 && !loading ? (
              <div className="col-span-full rounded-2xl p-8 bg-slate-900/30 border border-slate-800 text-slate-400">Try a query like <span className="text-sky-300">"bacterial resistance microgravity"</span></div>
            ) : null}

            {results.map((item, idx) => (
              <motion.article key={idx} layout whileHover={{ scale: 1.01 }} className="rounded-2xl p-4 bg-slate-900/30 border border-slate-800 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold leading-tight">{item.title || "Untitled"}</h3>
                    <div className="text-sm text-slate-400 mt-1">{(item.authors || []).slice(0,3).join(", ")} • {item.year || "—"}</div>
                    <p className="mt-3 text-sm text-slate-300 line-clamp-4">{item.text?.slice(0,420) || "No excerpt available."}</p>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button onClick={() => setSelected(item)} className="text-sm px-3 py-1 rounded-lg bg-slate-800/40 border border-slate-700">View</button>
                        <a className="text-sm px-3 py-1 rounded-lg bg-transparent border border-slate-800/40" href={item.url || '#'} target="_blank" rel="noreferrer">Open Source</a>
                      </div>
                      <div className="text-sm text-slate-400 flex items-center gap-2">Score: <span className="text-sky-300 font-semibold">{item.score ? item.score.toFixed(3) : "0.000"}</span> <ChevronRight size={14} /></div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {results.length > 0 ? (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-slate-400">Showing {results.length} result(s)</div>
              <div className="flex items-center gap-3">
                <button className="px-3 py-1 rounded-md bg-slate-800/30 border border-slate-700">Prev</button>
                <button className="px-3 py-1 rounded-md bg-slate-800/30 border border-slate-700">Next</button>
              </div>
            </div>
          ) : null}
        </section>
      </main>

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10 max-w-3xl w-full rounded-2xl p-6 bg-gradient-to-br from-slate-900/60 to-slate-900 border border-slate-800">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{selected.title}</h2>
                <p className="text-sm text-slate-400 mt-1">{(selected.authors || []).join(", ")} • {selected.year || '—'}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-md bg-slate-800/30 border border-slate-700"><X size={16} /></button>
            </div>

            <div className="mt-4 text-sm text-slate-200 leading-relaxed">
              {selected.text}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <a href={selected.url || '#'} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] text-black font-semibold">Open Publication</a>
              <button className="px-4 py-2 rounded-lg bg-slate-800/30 border border-slate-700">Copy Excerpt</button>
            </div>
          </motion.div>
        </div>
      ) : null}

      <footer className="max-w-6xl mx-auto p-6 text-slate-400 text-sm">Built for NASA Space Biology Hackathon • 608 publications • Made with ❤️</footer>
    </div>
  );
}
