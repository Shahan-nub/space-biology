"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false,
});

// ---- Interfaces ----
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
  connections?: number;
}

interface Link {
  source: string | Node;
  target: string | Node;
  predicate: string;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

interface NodeInfo {
  id: string;
  group: number;
  connections: number;
  relatedNodes: string[];
  relatedPredicates: string[];
}

// ---- Component ----
export default function KnowledgeGraph() {
  const [data, setData] = useState<GraphData>({ nodes: [], links: [] });
  const [allTriples, setAllTriples] = useState<Triple[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<NodeInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightNodes, setHighlightNodes] = useState(new Set<string>());
  const [highlightLinks, setHighlightLinks] = useState(new Set<Link>());
  const graphRef = useRef<any>(null);

  // Statistics
  const [stats, setStats] = useState({
    totalNodes: 0,
    totalLinks: 0,
    subjects: 0,
    objects: 0,
    avgConnections: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/kg_triples_validated.json");
        const triples: Triple[] = await res.json();
        setAllTriples(triples);

        const nodesMap = new Map<string, Node>();
        const links: Link[] = [];
        const connectionCounts = new Map<string, number>();

        const SAMPLE_LIMIT = 2000; // render first 2K triples
        const limitedTriples = triples.slice(0, SAMPLE_LIMIT);

        limitedTriples.forEach((t) => {
          if (!nodesMap.has(t.subject))
            nodesMap.set(t.subject, {
              id: t.subject,
              group: 1,
              connections: 0,
            });
          if (!nodesMap.has(t.object))
            nodesMap.set(t.object, { id: t.object, group: 2, connections: 0 });

          // Count connections
          connectionCounts.set(
            t.subject,
            (connectionCounts.get(t.subject) || 0) + 1
          );
          connectionCounts.set(
            t.object,
            (connectionCounts.get(t.object) || 0) + 1
          );

          links.push({
            source: t.subject,
            target: t.object,
            predicate: t.predicate,
          });
        });

        // Update nodes with connection counts
        const nodes = Array.from(nodesMap.values()).map((node) => ({
          ...node,
          connections: connectionCounts.get(node.id) || 0,
        }));

        setData({ nodes, links });

        // Calculate statistics
        const subjects = nodes.filter((n) => n.group === 1).length;
        const objects = nodes.filter((n) => n.group === 2).length;
        const totalConnections = Array.from(connectionCounts.values()).reduce(
          (a, b) => a + b,
          0
        );

        setStats({
          totalNodes: nodes.length,
          totalLinks: links.length,
          subjects,
          objects,
          avgConnections: totalConnections / nodes.length,
        });
      } catch (err) {
        console.error("Error loading triples:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle node click
  const handleNodeClick = (node: any) => {
    const nodeId = String(node.id ?? "");

    // Find all connections
    const relatedLinks = data.links.filter((link) => {
      const sourceId =
        typeof link.source === "object" && "id" in link.source
          ? link.source.id
          : String(link.source);
      const targetId =
        typeof link.target === "object" && "id" in link.target
          ? link.target.id
          : String(link.target);
      return sourceId === nodeId || targetId === nodeId;
    });

    const relatedNodes = new Set<string>();
    const relatedPredicates = new Set<string>();

    relatedLinks.forEach((link) => {
      const sourceId =
        typeof link.source === "object" && "id" in link.source
          ? link.source.id
          : String(link.source);
      const targetId =
        typeof link.target === "object" && "id" in link.target
          ? link.target.id
          : String(link.target);

      if (sourceId === nodeId) relatedNodes.add(targetId);
      if (targetId === nodeId) relatedNodes.add(sourceId);
      relatedPredicates.add(link.predicate);
    });

    setSelectedNode({
      id: nodeId,
      group: node.group || 1,
      connections: relatedLinks.length,
      relatedNodes: Array.from(relatedNodes),
      relatedPredicates: Array.from(relatedPredicates),
    });

    // Highlight connections
    const highlightNodesSet = new Set([nodeId, ...Array.from(relatedNodes)]);
    setHighlightNodes(highlightNodesSet);
    setHighlightLinks(new Set(relatedLinks));
  };

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setHighlightNodes(new Set());
      setHighlightLinks(new Set());
      return;
    }

    const matchingNodes = data.nodes.filter((node) =>
      node.id.toLowerCase().includes(term.toLowerCase())
    );

    if (matchingNodes.length > 0) {
      const nodeIds = new Set(matchingNodes.map((n) => n.id));
      const relatedLinks = data.links.filter((link) => {
        const sourceId =
          typeof link.source === "object" && "id" in link.source
            ? link.source.id
            : String(link.source);
        const targetId =
          typeof link.target === "object" && "id" in link.target
            ? link.target.id
            : String(link.target);
        return nodeIds.has(sourceId) || nodeIds.has(targetId);
      });

      setHighlightNodes(nodeIds);
      setHighlightLinks(new Set(relatedLinks));

      // Focus on first matching node
      if (graphRef.current && matchingNodes[0]) {
        const node = matchingNodes[0];
        graphRef.current.cameraPosition({ x: 0, y: 0, z: 300 }, node, 1000);
      }
    }
  };

  if (loading)
    return (
      <div className="text-center text-gray-400 py-20">
        <div className="inline-block relative">
          <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-lg">Loading Space Biology Knowledge Graph...</p>
      </div>
    );

  return (
    <div className="flex mt-6 justify-center items-center w-full mb-16 flex-col">
      {/* Top Bar - Search and Stats */}
      <div className="w-[95%] max-w-6xl mb-4 flex gap-4 items-stretch">
        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-950/40 backdrop-blur-sm border border-indigo-500/30 rounded-xl p-4 shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/20 p-2 rounded-lg border border-indigo-400/30">
              <svg
                className="w-5 h-5 text-indigo-400"
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
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search nodes... (e.g., 'microgravity', 'bone loss')"
              className="flex-1 bg-black/40 border border-gray-700/50 text-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 placeholder-gray-600 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  handleSearch("");
                }}
                className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-lg p-2 transition-all"
              >
                <svg
                  className="w-5 h-5 text-gray-400"
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
              </button>
            )}
          </div>
        </motion.div>

        {/* Stats Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-gray-900 via-gray-900 to-purple-950/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4 shadow-2xl"
        >
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {stats.totalNodes}
              </div>
              <div className="text-xs text-gray-500 font-medium">Nodes</div>
            </div>
            <div className="w-px h-10 bg-gray-700"></div>
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {stats.totalLinks}
              </div>
              <div className="text-xs text-gray-500 font-medium">Links</div>
            </div>
            <div className="w-px h-10 bg-gray-700"></div>
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
                {stats.avgConnections.toFixed(1)}
              </div>
              <div className="text-xs text-gray-500 font-medium">Avg Links</div>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Instructions Tooltip */}
      <div className="w-[95%] max-w-6xl mb-4 bg-gradient-to-r from-indigo-950/60 to-purple-950/60 backdrop-blur-sm border border-indigo-500/30 rounded-xl p-5 shadow-2xl">
        <div className="flex items-center justify-center mb-3">
          <span className="text-indigo-300 font-bold text-sm tracking-wider">
            🎮 INTERACTIVE CONTROLS
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <div className="flex items-center gap-2 bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 hover:border-indigo-400/50 transition-colors">
            <span className="text-indigo-400 font-bold text-xs">🖱️ LEFT</span>
            <span className="text-gray-400 text-xs font-bold">Rotate</span>
          </div>
          <div className="flex items-center gap-2 bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 hover:border-purple-400/50 transition-colors">
            <span className="text-purple-400 font-bold text-xs">🖲️ WHEEL</span>
            <span className="text-gray-400 text-xs font-bold">Zoom</span>
          </div>
          <div className="flex items-center gap-2 bg-black/40 border border-pink-500/30 rounded-lg px-4 py-2 hover:border-pink-400/50 transition-colors">
            <span className="text-pink-400 font-bold text-xs">🖱️ RIGHT</span>
            <span className="text-gray-400 text-xs font-bold">Pan</span>
          </div>
          <div className="flex items-center gap-2 bg-black/40 border border-cyan-500/30 rounded-lg px-4 py-2 hover:border-cyan-400/50 transition-colors">
            <span className="text-cyan-400 font-bold text-xs">🖱️ CLICK</span>
            <span className="text-gray-400 text-xs font-bold">Node Info</span>
          </div>
        </div>
      </div>

      {/* Main Graph Container with Side Panel */}
      <div className="w-[95%] max-w-6xl flex gap-4">
        {/* Graph */}
        <div className="relative flex-1 h-[100vh] bg-black border border-gray-800 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center">
          <ForceGraph3D
            ref={graphRef}
            graphData={data}
            nodeAutoColorBy="group"
            nodeRelSize={6}
            backgroundColor="black"
            linkColor={(link: {
              source?: unknown;
              target?: unknown;
              [key: string]: unknown;
            }) => {
              const sourceNode =
                typeof link.source === "object" &&
                link.source &&
                "id" in link.source
                  ? (link.source as { id: string }).id
                  : String(link.source ?? "");
              const targetNode =
                typeof link.target === "object" &&
                link.target &&
                "id" in link.target
                  ? (link.target as { id: string }).id
                  : String(link.target ?? "");

              if (highlightLinks.size > 0) {
                const isHighlighted = Array.from(highlightLinks).some((l) => {
                  const lSource =
                    typeof l.source === "object" && "id" in l.source
                      ? l.source.id
                      : String(l.source);
                  const lTarget =
                    typeof l.target === "object" && "id" in l.target
                      ? l.target.id
                      : String(l.target);
                  return lSource === sourceNode && lTarget === targetNode;
                });
                return isHighlighted
                  ? "rgba(236, 72, 153, 0.9)" // Bright pink for highlighted
                  : "rgba(34, 211, 238, 0.3)"; // Dimmed cyan for non-highlighted
              }

              if (
                hoveredNode &&
                (sourceNode === hoveredNode || targetNode === hoveredNode)
              ) {
                return "rgba(236, 72, 153, 0.9)"; // Pink for hover
              }
              return "rgba(34, 211, 238, 1)"; // Bright cyan - fully opaque
            }}
            linkWidth={(link: {
              source?: unknown;
              target?: unknown;
              [key: string]: unknown;
            }) => {
              if (highlightLinks.size > 0) {
                const sourceNode =
                  typeof link.source === "object" &&
                  link.source &&
                  "id" in link.source
                    ? (link.source as { id: string }).id
                    : String(link.source ?? "");
                const targetNode =
                  typeof link.target === "object" &&
                  link.target &&
                  "id" in link.target
                    ? (link.target as { id: string }).id
                    : String(link.target ?? "");

                const isHighlighted = Array.from(highlightLinks).some((l) => {
                  const lSource =
                    typeof l.source === "object" && "id" in l.source
                      ? l.source.id
                      : String(l.source);
                  const lTarget =
                    typeof l.target === "object" && "id" in l.target
                      ? l.target.id
                      : String(l.target);
                  return lSource === sourceNode && lTarget === targetNode;
                });

                if (isHighlighted) return 4;
              }

              const sourceNode =
                typeof link.source === "object" &&
                link.source &&
                "id" in link.source
                  ? (link.source as { id: string }).id
                  : String(link.source ?? "");
              const targetNode =
                typeof link.target === "object" &&
                link.target &&
                "id" in link.target
                  ? (link.target as { id: string }).id
                  : String(link.target ?? "");
              if (
                hoveredNode &&
                (sourceNode === hoveredNode || targetNode === hoveredNode)
              ) {
                return 3;
              }
              return 1;
            }}
            nodeLabel={(node: {
              id?: string | number;
              group?: number;
              [key: string]: unknown;
            }) => `
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
            height={undefined}
            showNavInfo={false}
            onNodeClick={handleNodeClick}
            onNodeHover={(
              node: { id?: string | number; [key: string]: unknown } | null
            ) => {
              setHoveredNode(node ? String(node.id ?? "") : null);
              document.body.style.cursor = node ? "pointer" : "default";
            }}
            nodeColor={(node: {
              id?: string | number;
              group?: number;
              [key: string]: unknown;
            }) => {
              const nodeId = String(node.id ?? "");
              const isHighlighted =
                highlightNodes.size > 0 && highlightNodes.has(nodeId);
              const isHovered = hoveredNode === nodeId;
              const group = node.group || 1;

              if (isHighlighted) {
                return group === 1 ? "#a78bfa" : "#f472b6";
              }

              if (isHovered) {
                return group === 1 ? "#8b5cf6" : "#ec4899";
              }

              if (highlightNodes.size > 0) {
                return "#374151"; // Dim non-highlighted nodes
              }

              if (group === 1) {
                return "#6366f1"; // Purple for subjects
              } else {
                return "#a855f7"; // Pink for objects
              }
            }}
            nodeVal={(node: {
              id?: string | number;
              [key: string]: unknown;
            }) => {
              const nodeId = String(node.id ?? "");
              const isHighlighted = highlightNodes.has(nodeId);
              const isHovered = hoveredNode === nodeId;

              if (isHighlighted) return 14;
              if (isHovered) return 12;
              return 6;
            }}
          />
        </div>

        {/* Node Info Panel */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-80 bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-950/40 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[100vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setSelectedNode(null);
                  setHighlightNodes(new Set());
                  setHighlightLinks(new Set());
                }}
                className="absolute top-4 right-4 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-lg p-2 transition-all"
              >
                <svg
                  className="w-4 h-4 text-gray-400"
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
              </button>

              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-indigo-500/20 p-2 rounded-lg border border-indigo-400/30">
                    {selectedNode.group === 1 ? "📍" : "🎯"}
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {selectedNode.group === 1 ? "Subject Node" : "Object Node"}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-200 break-words">
                  {selectedNode.id}
                </h3>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-black/40 border border-gray-700/50 rounded-xl p-4">
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {selectedNode.connections}
                  </div>
                  <div className="text-xs text-gray-500 font-medium mt-1">
                    Connections
                  </div>
                </div>
                <div className="bg-black/40 border border-gray-700/50 rounded-xl p-4">
                  <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    {selectedNode.relatedNodes.length}
                  </div>
                  <div className="text-xs text-gray-500 font-medium mt-1">
                    Related Nodes
                  </div>
                </div>
              </div>

              {/* Related Predicates */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Relationships ({selectedNode.relatedPredicates.length})
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedNode.relatedPredicates
                    .slice(0, 10)
                    .map((pred, i) => (
                      <div
                        key={i}
                        className="bg-black/40 border border-pink-500/20 rounded-lg px-3 py-2 text-sm text-pink-300"
                      >
                        {pred}
                      </div>
                    ))}
                </div>
              </div>

              {/* Related Nodes */}
              <div>
                <h4 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Connected Nodes ({selectedNode.relatedNodes.length})
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedNode.relatedNodes.slice(0, 15).map((nodeId, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const node = data.nodes.find((n) => n.id === nodeId);
                        if (node) handleNodeClick(node);
                      }}
                      className="w-full bg-black/40 border border-cyan-500/20 hover:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-cyan-300 text-left transition-all hover:bg-cyan-500/10"
                    >
                      {nodeId}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
