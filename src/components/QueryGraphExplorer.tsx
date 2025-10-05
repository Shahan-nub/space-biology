"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import 3D graph (no SSR)
const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), { ssr: false });

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
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
        throw new Error('Invalid syntax. Try: MATCH (s)-[p]->(o) WHERE s = "covid-19"');
      }

      const whereMatch = query.match(whereRegex);
      let filtered = triples;

      if (whereMatch) {
        const condition = whereMatch[1].replace(/["']/g, "").trim();
        const condParts = condition.split("=").map((s) => s.trim());

        if (condParts.length === 2) {
          const [lhs, rhs] = condParts;
          if (lhs === "s" || lhs === "subject") {
            filtered = triples.filter((t) => t.subject.toLowerCase() === rhs.toLowerCase());
          } else if (lhs === "p" || lhs === "predicate") {
            filtered = triples.filter((t) => t.predicate.toLowerCase() === rhs.toLowerCase());
          } else if (lhs === "o" || lhs === "object") {
            filtered = triples.filter((t) => t.object.toLowerCase() === rhs.toLowerCase());
          } else {
            throw new Error("Unknown field. Use s, p, or o.");
          }
        } else {
          throw new Error('Invalid WHERE clause. Example: WHERE s = "covid-19"');
        }
      }

      setResults(filtered.slice(0, 100));

      // Build Graph Data from filtered triples
      const nodesMap = new Map<string, Node>();
      const links: Link[] = [];

      filtered.slice(0, 100).forEach((t) => {
        if (!nodesMap.has(t.subject)) nodesMap.set(t.subject, { id: t.subject, group: 1 });
        if (!nodesMap.has(t.object)) nodesMap.set(t.object, { id: t.object, group: 2 });

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
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-gray-400 text-center py-10">Loading dataset...</div>;

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 bg-gray-900 text-gray-200 p-6 rounded-2xl shadow-lg border border-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-indigo-400 text-center">
        Cypher Query + Knowledge Graph Explorer
      </h2>

      {/* Query Box */}
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='Try: MATCH (s)-[p]->(o) WHERE s = "microgravity"'
        className="w-full bg-black border border-gray-700 text-gray-100 p-3 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        rows={3}
      />

      <div className="flex justify-end mt-4">
        <button
          onClick={runQuery}
          className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-white font-medium transition"
        >
          Run Query
        </button>
      </div>

      {error && (
        <div className="mt-4 text-red-400 bg-red-950/30 border border-red-800 p-2 rounded-lg">
          {error}
        </div>
      )}

      {/* Results */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-300 mb-2">
          Results ({results.length})
        </h3>
        {results.length === 0 ? (
          <p className="text-gray-500">No results found.</p>
        ) : (
          <div className="space-y-3 max-h-72 overflow-y-auto">
            {results.map((t, i) => (
              <div
                key={i}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-sm"
              >
                <p>
                  <span className="text-indigo-400">Subject:</span> {t.subject}
                </p>
                <p>
                  <span className="text-pink-400">Predicate:</span> {t.predicate}
                </p>
                <p>
                  <span className="text-green-400">Object:</span> {t.object}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Graph */}
      {graphData.nodes.length > 0 && (
        <div className="h-[600px] w-full bg-black border border-gray-800 rounded-xl mt-10">
          <ForceGraph3D
            graphData={graphData}
            nodeAutoColorBy="group"
            nodeRelSize={6}
            backgroundColor="black"
            linkOpacity={0.7}
            linkColor={() => "rgba(99,102,241,0.6)"}
            nodeLabel="id"
            linkLabel="predicate"
            enableNodeDrag={true}
          />
        </div>
      )}
    </div>
  );
}
