"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ForceGraph2D } from "react-force-graph";
import kgTriples from "@/data/kg_triples_validated.json";

import Link from "next/link";

interface Triple {
  title: string;
  chunk_id: string;
  subject: string;
  predicate: string;
  object: string;
  faiss_verified: boolean;
}

interface GraphNode {
  id: string;
  name: string;
  type: "subject" | "object";
  val: number;
  [key: string]: unknown; // Allow additional properties from the library
}

interface GraphLink {
  source: string;
  target: string;
  label: string;
  title: string;
  [key: string]: unknown; // Allow additional properties from the library
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export const ForceGraphKG: React.FC = () => {
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    links: [],
  });
  const [stats, setStats] = useState({
    nodes: 0,
    edges: 0,
    subjects: 0,
    objects: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  useEffect(() => {
    setLoading(true);

    // Process all triples from kg_triples_validated.json
    const triples = kgTriples as Triple[];

    // Use Maps to store unique nodes
    const nodeMap = new Map<string, GraphNode>();
    const links: GraphLink[] = [];

    // Process all triples and create graph elements
    triples.forEach((triple) => {
      if (!triple.subject || !triple.object || !triple.predicate) return;

      const subjectId = triple.subject.toLowerCase().trim();
      const objectId = triple.object.toLowerCase().trim();

      // Create or get subject node
      if (!nodeMap.has(subjectId)) {
        nodeMap.set(subjectId, {
          id: subjectId,
          name: triple.subject,
          type: "subject",
          val: 1,
        });
      } else {
        // Increase node size based on connections
        const node = nodeMap.get(subjectId)!;
        node.val += 0.5;
      }

      // Create or get object node
      if (!nodeMap.has(objectId)) {
        nodeMap.set(objectId, {
          id: objectId,
          name: triple.object,
          type: "object",
          val: 1,
        });
      } else {
        // Increase node size based on connections
        const node = nodeMap.get(objectId)!;
        node.val += 0.5;
      }

      // Create link
      links.push({
        source: subjectId,
        target: objectId,
        label: triple.predicate,
        title: triple.title,
      });
    });

    // Update stats
    const subjects = new Set(
      triples.map((t) => t.subject.toLowerCase().trim())
    );
    const objects = new Set(triples.map((t) => t.object.toLowerCase().trim()));

    const nodes = Array.from(nodeMap.values());

    setStats({
      nodes: nodes.length,
      edges: links.length,
      subjects: subjects.size,
      objects: objects.size,
    });

    setGraphData({
      nodes,
      links,
    });

    setLoading(false);
  }, []);

  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode(node);
    console.log("Node clicked:", node);
  }, []);

  const handleLinkClick = useCallback((link: GraphLink) => {
    console.log("Link clicked:", link);
  }, []);

  const handleBackgroundClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1020] via-[#070812] to-[#020205] text-slate-200">
      {/* Navbar */}
      <header className="w-full border-b border-slate-800 bg-slate-900/20 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-[95%] mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center shadow-md">
              <span className="font-bold text-white text-lg">SB</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold">
                Knowledge Graph Explorer
              </h1>
              <p className="text-xs text-slate-400">
                Interactive Force-Directed Visualization
              </p>
            </div>
          </div>
          <a
            href="/"
            className="px-4 py-2 rounded-lg bg-slate-800/40 border border-slate-700 text-sm hover:bg-slate-800/60 transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </header>

      <main className="max-w-[95%] mx-auto p-6">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold text-purple-400">
              {stats.nodes.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-1">Total Nodes</div>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold text-cyan-400">
              {stats.edges.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-1">Total Edges</div>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold text-blue-400">
              {stats.subjects.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-1">Unique Subjects</div>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold text-green-400">
              {stats.objects.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-1">Unique Objects</div>
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 p-4 rounded-xl bg-slate-900/40 border border-slate-800"
        >
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-purple-500 border-2 border-slate-600"></div>
              <span className="text-xs text-slate-300">Subject Entity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-cyan-500 border-2 border-slate-600"></div>
              <span className="text-xs text-slate-300">Object Entity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-slate-500"></div>
              <span className="text-xs text-slate-300">Relationship</span>
            </div>
            <div className="text-xs text-slate-400 ml-4">
              💡 Tip: Drag nodes • Scroll to zoom • Click nodes to explore •
              Double-click to focus
            </div>
          </div>
        </motion.div>

        {/* Selected Node Info */}
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-gradient-to-r from-purple-900/40 to-cyan-900/40 border border-slate-700"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-200 mb-1">
                  Selected Node
                </h3>
                <p className="text-lg font-bold text-white">
                  {selectedNode.name}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Type: {selectedNode.type} • Connections:{" "}
                  {Math.floor(selectedNode.val * 2)}
                </p>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800/60 transition-colors"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}

        {/* Force Graph Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-slate-900/40 border border-slate-800 overflow-hidden shadow-2xl relative"
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                <p className="text-slate-300">Loading knowledge graph...</p>
                <p className="text-xs text-slate-400 mt-2">
                  Processing {kgTriples.length.toLocaleString()} relationships
                </p>
              </div>
            </div>
          )}

          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <h3 className="text-sm font-semibold text-slate-300">
              Interactive Force-Directed Graph
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 hidden md:inline">
                {kgTriples.length.toLocaleString()} relationships loaded
              </span>
            </div>
          </div>

          <div
            className="w-full bg-gradient-to-br from-slate-950 to-black"
            style={{ height: "700px" }}
          >
            {!loading && (
              <ForceGraph2D
                graphData={graphData}
                nodeLabel="name"
                nodeColor={(node: GraphNode) =>
                  node.type === "subject" ? "#8b5cf6" : "#06b6d4"
                }
                nodeRelSize={6}
                nodeVal={(node: GraphNode) => node.val}
                linkColor={() => "#475569"}
                linkWidth={1}
                linkDirectionalArrowLength={3}
                linkDirectionalArrowRelPos={1}
                linkDirectionalParticles={0}
                onNodeClick={handleNodeClick}
                onLinkClick={handleLinkClick}
                onBackgroundClick={handleBackgroundClick}
                enableNodeDrag={true}
                enableZoomInteraction={true}
                enablePanInteraction={true}
                cooldownTicks={100}
                d3AlphaDecay={0.02}
                d3VelocityDecay={0.3}
                backgroundColor="transparent"
                linkDirectionalArrowColor={() => "#475569"}
              />
            )}
          </div>
        </motion.div>

        {/* Info Panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-6 rounded-xl bg-slate-900/40 border border-slate-800"
        >
          <h3 className="text-lg font-semibold text-slate-300 mb-3">
            About This Knowledge Graph
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            This comprehensive knowledge graph represents{" "}
            {kgTriples.length.toLocaleString()} verified relationships extracted
            from space biology research publications. The force-directed layout
            automatically positions nodes based on their connections, creating
            natural clusters of related concepts. Node size indicates the number
            of connections each entity has.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700">
              <div className="text-xs text-slate-400 mb-1">Data Source</div>
              <div className="text-sm font-semibold text-slate-200">
                kg_triples_validated.json
              </div>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700">
              <div className="text-xs text-slate-400 mb-1">
                Visualization Engine
              </div>
              <div className="text-sm font-semibold text-slate-200">
                React Force Graph
              </div>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700">
              <div className="text-xs text-slate-400 mb-1">
                Layout Algorithm
              </div>
              <div className="text-sm font-semibold text-slate-200">
                D3 Force-Directed
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="max-w-7xl mx-auto p-6 text-slate-400 text-sm text-center">
        Built for NASA Space Biology Hackathon • Knowledge Graph Visualization •
        Made with ❤️
      </footer>
    </div>
  );
};
