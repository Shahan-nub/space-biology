"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

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

interface ForceGraphMethods {
  cameraPosition: (
    position: { x?: number; y?: number; z?: number },
    lookAt?: { x?: number; y?: number; z?: number },
    duration?: number
  ) => void;
}

// ---- Component ----
export default function KnowledgeGraph() {
  const [data, setData] = useState<GraphData>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/kg_triples_validated.json");
        const triples: Triple[] = await res.json();

        const nodesMap = new Map<string, Node>();
        const links: Link[] = [];

        const SAMPLE_LIMIT = 2000; // render first 2K triples
        const limitedTriples = triples.slice(0, SAMPLE_LIMIT);

        limitedTriples.forEach((t) => {
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

        setData({
          nodes: Array.from(nodesMap.values()),
          links,
        });

        // Note: Camera positioning removed to avoid ref typing issues
      } catch (err) {
        console.error("Error loading triples:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading)
    return (
      <div className="text-center text-gray-400 py-20">
        Loading Space Biology Knowledge Graph...
      </div>
    );

  return (
    <div className="flex mt-6 justify-center items-center w-full mb-16 flex-col">
      {/* Instructions Tooltip */}
      <div className="w-[95%] max-w-6xl mb-4 bg-gradient-to-r from-indigo-950/60 to-purple-950/60 backdrop-blur-sm border border-indigo-500/30 rounded-xl p-5 shadow-2xl">
        <div className="flex items-center justify-center mb-3">
          <span className="text-indigo-300 font-bold text-sm tracking-wider">
            🎮 GRAPH CONTROLS
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
        </div>
      </div>

      <div className="relative w-[95%] max-w-6xl h-[100vh] bg-black border border-gray-800 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center">
        <ForceGraph3D
          graphData={data}
          nodeAutoColorBy="group"
          nodeRelSize={6}
          backgroundColor="black"
          linkOpacity={0.7}
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
            if (
              hoveredNode &&
              (sourceNode === hoveredNode || targetNode === hoveredNode)
            ) {
              return "rgba(236, 72, 153, 0.9)"; // Pink highlight
            }
            return "rgba(99,102,241,0.6)";
          }}
          linkWidth={(link: {
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
            const isHovered = hoveredNode === nodeId;
            const group = node.group || 1;

            if (group === 1) {
              return isHovered ? "#8b5cf6" : "#6366f1"; // Purple for subjects
            } else {
              return isHovered ? "#ec4899" : "#a855f7"; // Pink for objects
            }
          }}
          nodeVal={(node: { id?: string | number; [key: string]: unknown }) => {
            const isHovered = hoveredNode === String(node.id ?? "");
            return isHovered ? 12 : 6; // Size increase on hover
          }}
        />
      </div>
    </div>
  );
}
