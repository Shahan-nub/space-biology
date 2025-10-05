"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

// Dynamically import 3D graph (no SSR)
const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false,
});

// --- Types ---
interface Triple {
  subject: string;
  predicate: string;
  object: string;
  title?: string;
  chunk_id?: string;
  faiss_verified?: boolean;
}

interface Node {
  id: string;
  group?: number;
}

interface Link {
  source: string;
  target: string;
  predicate: string;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

export default function QueryGraphExplorer() {
  const [triples, setTriples] = useState<Triple[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Triple[]>([]);
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    links: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const fgRef = useRef<any>(null);

  // Load dataset
  useEffect(() => {
    fetch("/kg_triples_validated.json")
      .then((res) => res.json())
      .then((data) => {
        setTriples(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load dataset.");
        setLoading(false);
      });
  }, []);

  // --- Cypher-like Query Runner ---
  const runQuery = () => {
    setError(null);
    if (!query.trim()) {
      setResults([]);
      setGraphData({ nodes: [], links: [] });
      return;
    }

    try {
      const matchRegex = /MATCH\s*\(.*?\)-\[.*?\]->\(.*?\)/i;
      const whereRegex = /WHERE\s+(.+)/i;

      if (!matchRegex.test(query)) {
        throw new Error(
          'Invalid syntax. Try: MATCH (s)-[p]->(o) WHERE s = "covid-19"'
        );
      }

      const whereMatch = query.match(whereRegex);
      let filtered = triples;

      if (whereMatch) {
        const condition = whereMatch[1].replace(/["']/g, "").trim();
        const condParts = condition.split("=").map((s) => s.trim());

        if (condParts.length === 2) {
          const [lhs, rhs] = condParts;
          if (lhs === "s" || lhs === "subject") {
            filtered = triples.filter(
              (t) => t.subject.toLowerCase() === rhs.toLowerCase()
            );
          } else if (lhs === "p" || lhs === "predicate") {
            filtered = triples.filter(
              (t) => t.predicate.toLowerCase() === rhs.toLowerCase()
            );
          } else if (lhs === "o" || lhs === "object") {
            filtered = triples.filter(
              (t) => t.object.toLowerCase() === rhs.toLowerCase()
            );
          } else {
            throw new Error("Unknown field. Use s, p, or o.");
          }
        } else {
          throw new Error(
            'Invalid WHERE clause. Example: WHERE s = "covid-19"'
          );
        }
      }

      setResults(filtered.slice(0, 100));

      // Build Graph Data from filtered triples
      const nodesMap = new Map<string, Node>();
      const links: Link[] = [];

      filtered.slice(0, 100).forEach((t) => {
        if (!nodesMap.has(t.subject))
          nodesMap.set(t.subject, { id: t.subject, group: 1 });
        if (!nodesMap.has(t.object))
          nodesMap.set(t.object, { id: t.object, group: 2 });

        links.push({
          source: t.subject,
          target: t.object,
          predicate: t.predicate,
        });
      });

      setGraphData({
        nodes: Array.from(nodesMap.values()),
        links,
      });

      // Set zoom level after graph is created
      setTimeout(() => {
        if (fgRef.current) {
          fgRef.current.cameraPosition({ z: 400 }, undefined, 1000);
        }
      }, 100);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading)
    return (
      <div className="text-gray-400 text-center py-10">Loading dataset...</div>
    );

  return (
    <div className="w-full max-w-6xl mx-auto mt-10">
      {/* Query Section - Premium Design */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-950/40 text-gray-200 p-8 rounded-3xl shadow-2xl border border-indigo-500/20 backdrop-blur-lg overflow-hidden">
        {/* Animated Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header with Icon */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-indigo-500/20 p-3 rounded-xl border border-indigo-400/30">
              <svg
                className="w-6 h-6 text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Cypher Query Explorer
            </h2>
          </div>

          {/* Query Input Container */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-1 shadow-inner mb-4">
            <div className="bg-gradient-to-br from-gray-950 to-gray-900 rounded-xl p-5 border border-gray-800/50">
              {/* Label with Quick Examples */}
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                  <span className="text-indigo-400">⚡</span> Query Input
                </label>
                <div className="flex flex-wrap gap-2 justify-end">
                  <button
                    onClick={() =>
                      setQuery('MATCH (s)-[p]->(o) WHERE s = "microgravity"')
                    }
                    className="text-xs px-3 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-lg text-indigo-300 transition-all hover:scale-105"
                  >
                    Subject Query
                  </button>
                  <button
                    onClick={() =>
                      setQuery('MATCH (s)-[p]->(o) WHERE p = "affects"')
                    }
                    className="text-xs px-3 py-1 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-purple-300 transition-all hover:scale-105"
                  >
                    Predicate Query
                  </button>
                  <button
                    onClick={() =>
                      setQuery('MATCH (s)-[p]->(o) WHERE o = "bone loss"')
                    }
                    className="text-xs px-3 py-1 bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/30 rounded-lg text-pink-300 transition-all hover:scale-105"
                  >
                    Object Query
                  </button>
                  <button
                    onClick={() =>
                      setQuery('MATCH (s)-[p]->(o) WHERE s = "space radiation"')
                    }
                    className="text-xs px-3 py-1 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 rounded-lg text-cyan-300 transition-all hover:scale-105"
                  >
                    Radiation Effects
                  </button>
                </div>
              </div>

              {/* Textarea with Enhanced Styling */}
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    runQuery();
                  }
                }}
                placeholder='MATCH (s)-[p]->(o) WHERE s = "your-query-here"'
                className="w-full bg-black/60 border border-indigo-500/20 text-gray-100 p-4 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 placeholder-gray-600 transition-all resize-none shadow-inner"
                rows={3}
              />

              {/* Syntax Hints */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800/50">
                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  <span className="bg-gray-800/50 px-2 py-1 rounded border border-gray-700/30">
                    <span className="text-indigo-400">s</span> = subject
                  </span>
                  <span className="bg-gray-800/50 px-2 py-1 rounded border border-gray-700/30">
                    <span className="text-purple-400">p</span> = predicate
                  </span>
                  <span className="bg-gray-800/50 px-2 py-1 rounded border border-gray-700/30">
                    <span className="text-pink-400">o</span> = object
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  Press{" "}
                  <kbd className="bg-gray-800 px-2 py-0.5 rounded text-indigo-400 border border-gray-700">
                    Ctrl+Enter
                  </kbd>{" "}
                  to execute
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 justify-between">
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
                setGraphData({ nodes: [], links: [] });
                setError(null);
              }}
              className="px-5 py-2.5 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-xl text-gray-400 hover:text-gray-200 font-medium transition-all hover:scale-105 flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Clear
            </button>

            <button
              onClick={runQuery}
              disabled={!query.trim()}
              className="group relative px-8 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 rounded-xl text-white font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-indigo-500/30 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative flex items-center gap-2">
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
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
                Execute Query
              </span>
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 bg-red-950/40 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm flex items-start gap-3 animate-[fadeIn_0.3s_ease-in]">
              <svg
                className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h4 className="text-red-400 font-semibold mb-1">Query Error</h4>
                <p className="text-red-300/80 text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="mt-8">
        <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-purple-950/40 rounded-3xl border border-purple-500/20 p-6 shadow-2xl">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500/20 p-2 rounded-lg border border-purple-400/30">
                <svg
                  className="w-5 h-5 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-200">Query Results</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Total:</span>
              <span className="px-3 py-1 bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/30 rounded-lg text-purple-300 font-bold text-sm">
                {results.length}
              </span>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-block bg-gray-800/50 p-4 rounded-2xl mb-4">
                <svg
                  className="w-12 h-12 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-lg mb-2">No results found</p>
              <p className="text-gray-600 text-sm">
                Try adjusting your query or use one of the examples above
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
              {results.map((t, i) => (
                <div
                  key={i}
                  className="group bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 hover:border-indigo-500/40 rounded-xl p-4 transition-all hover:shadow-lg hover:shadow-indigo-500/10 hover:scale-[1.02] backdrop-blur-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-500/10 p-1.5 rounded-lg border border-indigo-500/20 mt-0.5">
                      <svg
                        className="w-4 h-4 text-indigo-400"
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
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                          Subject
                        </span>
                        <span className="text-sm text-gray-300 font-medium">
                          {t.subject}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 pl-4">
                        <svg
                          className="w-4 h-4 text-pink-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                        <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">
                          Predicate
                        </span>
                        <span className="text-sm text-gray-400 italic">
                          {t.predicate}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2 pl-8">
                        <span className="text-xs font-bold text-green-400 uppercase tracking-wider">
                          Object
                        </span>
                        <span className="text-sm text-gray-300 font-medium">
                          {t.object}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Graph */}
      {graphData.nodes.length > 0 && (
        <div className="mt-10">
          {/* Instructions Tooltip */}
          <div className="mb-4 bg-gradient-to-r from-indigo-950/60 to-purple-950/60 backdrop-blur-sm border border-indigo-500/30 rounded-xl p-5 shadow-2xl">
            <div className="flex items-center justify-center mb-3">
              <span className="text-indigo-300 font-bold text-sm tracking-wider">
                🎮 GRAPH CONTROLS
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <div className="flex items-center gap-2 bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 hover:border-indigo-400/50 transition-colors">
                <span className="text-indigo-400 font-bold text-xs">
                  🖱️ LEFT
                </span>
                <span className="text-gray-400 text-xs font-bold">Rotate</span>
              </div>
              <div className="flex items-center gap-2 bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 hover:border-purple-400/50 transition-colors">
                <span className="text-purple-400 font-bold text-xs">
                  🖲️ WHEEL
                </span>
                <span className="text-gray-400 text-xs font-bold">Zoom</span>
              </div>
              <div className="flex items-center gap-2 bg-black/40 border border-pink-500/30 rounded-lg px-4 py-2 hover:border-pink-400/50 transition-colors">
                <span className="text-pink-400 font-bold text-xs">
                  🖱️ RIGHT
                </span>
                <span className="text-gray-400 text-xs font-bold">Pan</span>
              </div>
            </div>
          </div>

          <div className="h-[600px] w-full bg-black border border-gray-800 rounded-xl overflow-hidden flex items-center justify-center">
            <ForceGraph3D
              ref={fgRef}
              graphData={graphData}
              nodeAutoColorBy="group"
              nodeRelSize={6}
              backgroundColor="black"
              linkOpacity={0.7}
              linkColor={(link: any) => {
                const sourceNode =
                  typeof link.source === "object"
                    ? link.source.id
                    : link.source;
                const targetNode =
                  typeof link.target === "object"
                    ? link.target.id
                    : link.target;
                if (
                  hoveredNode &&
                  (sourceNode === hoveredNode || targetNode === hoveredNode)
                ) {
                  return "rgba(236, 72, 153, 0.9)"; // Pink highlight
                }
                return "rgba(99,102,241,0.6)";
              }}
              linkWidth={(link: any) => {
                const sourceNode =
                  typeof link.source === "object"
                    ? link.source.id
                    : link.source;
                const targetNode =
                  typeof link.target === "object"
                    ? link.target.id
                    : link.target;
                if (
                  hoveredNode &&
                  (sourceNode === hoveredNode || targetNode === hoveredNode)
                ) {
                  return 3;
                }
                return 1;
              }}
              nodeLabel={(node: any) => `
                <div style="
                  background: linear-gradient(135deg, rgba(99, 102, 241, 0.95), rgba(168, 85, 247, 0.95));
                  color: white;
                  padding: 12px 16px;
                  border-radius: 12px;
                  font-family: system-ui, -apple-system, sans-serif;
                  font-size: 14px;
                  font-weight: 600;
                  border: 2px solid rgba(255, 255, 255, 0.3);
                  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                  backdrop-filter: blur(10px);
                  max-width: 250px;
                  word-wrap: break-word;
                ">
                  <div style="margin-bottom: 4px; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">
                    ${node.group === 1 ? "📍 Subject" : "🎯 Object"}
                  </div>
                  ${node.id}
                </div>
              `}
              linkLabel="predicate"
              enableNodeDrag={true}
              width={undefined}
              height={600}
              showNavInfo={false}
              onNodeHover={(node: any) => {
                setHoveredNode(node ? node.id : null);
                document.body.style.cursor = node ? "pointer" : "default";
              }}
              nodeColor={(node: any) => {
                const isHovered = hoveredNode === node.id;
                const group = node.group || 1;

                if (group === 1) {
                  return isHovered ? "#8b5cf6" : "#6366f1"; // Purple for subjects
                } else {
                  return isHovered ? "#ec4899" : "#a855f7"; // Pink for objects
                }
              }}
              nodeVal={(node: any) => {
                const isHovered = hoveredNode === node.id;
                return isHovered ? 12 : 6; // Size increase on hover
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
