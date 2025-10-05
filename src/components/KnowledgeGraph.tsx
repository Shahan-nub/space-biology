"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import cytoscape from "cytoscape";
import kgTriples from "@/data/kg_triples_validated.json";

interface Triple {
  title: string;
  chunk_id: string;
  subject: string;
  predicate: string;
  object: string;
  faiss_verified: boolean;
}

export const KnowledgeGraph: React.FC = () => {
  const cyRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState({
    nodes: 0,
    edges: 0,
    subjects: 0,
    objects: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cyRef.current) return;

    setLoading(true);

    // Process all triples from kg_triples_validated.json
    const triples = kgTriples as Triple[];

    // Use Maps to store unique nodes and their IDs
    const nodeMap = new Map<
      string,
      { id: string; label: string; type: string }
    >();
    const elements: Array<{
      data: {
        id: string;
        label?: string;
        source?: string;
        target?: string;
        predicate?: string;
        type?: string;
        title?: string;
        [key: string]: unknown;
      };
      classes?: string;
    }> = [];
    let nodeIdCounter = 0;
    let edgeIdCounter = 0;

    // Helper function to get or create node
    const getOrCreateNode = (label: string, type: "subject" | "object") => {
      const normalizedLabel = label.toLowerCase().trim();
      if (!nodeMap.has(normalizedLabel)) {
        const id = `node-${nodeIdCounter++}`;
        nodeMap.set(normalizedLabel, { id, label, type });
        elements.push({
          data: {
            id,
            label,
            type,
            originalLabel: label,
          },
        });
      }
      return nodeMap.get(normalizedLabel)!.id;
    };

    // Process all triples and create graph elements
    triples.forEach((triple) => {
      if (!triple.subject || !triple.object || !triple.predicate) return;

      // Create or get subject node
      const subjectId = getOrCreateNode(triple.subject, "subject");

      // Create or get object node
      const objectId = getOrCreateNode(triple.object, "object");

      // Create edge
      elements.push({
        data: {
          id: `edge-${edgeIdCounter++}`,
          source: subjectId,
          target: objectId,
          label: triple.predicate,
          title: triple.title,
        },
      });
    });

    // Update stats
    const subjects = new Set(
      triples.map((t) => t.subject.toLowerCase().trim())
    );
    const objects = new Set(triples.map((t) => t.object.toLowerCase().trim()));

    setStats({
      nodes: nodeMap.size,
      edges: edgeIdCounter,
      subjects: subjects.size,
      objects: objects.size,
    });

    // Initialize Cytoscape with optimized settings for large graphs
    const cy = cytoscape({
      container: cyRef.current,
      elements: elements,
      style: [
        {
          selector: "node",
          style: {
            label: "data(label)",
            "text-valign": "center",
            "text-halign": "center",
            "font-size": "8px",
            color: "#e2e8f0",
            "text-wrap": "wrap",
            "text-max-width": "60px",
            width: "30px",
            height: "30px",
            "border-width": "1.5px",
            "border-color": "#475569",
            "background-opacity": 0.9,
            "text-opacity": 0.9,
          },
        },
        {
          selector: 'node[type="subject"]',
          style: {
            "background-color": "#8b5cf6",
            shape: "ellipse",
          },
        },
        {
          selector: 'node[type="object"]',
          style: {
            "background-color": "#06b6d4",
            shape: "roundrectangle",
          },
        },
        {
          selector: "edge",
          style: {
            width: 1,
            "line-color": "#475569",
            "target-arrow-color": "#475569",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            "arrow-scale": 0.8,
            opacity: 0.6,
          },
        },
        {
          selector: "node:selected",
          style: {
            "border-width": "3px",
            "border-color": "#fbbf24",
            "background-color": "#f59e0b",
            "z-index": 999,
          },
        },
        {
          selector: "edge:selected",
          style: {
            width: 3,
            "line-color": "#fbbf24",
            "target-arrow-color": "#fbbf24",
            opacity: 1,
            "z-index": 999,
          },
        },
      ],
      layout: {
        name: "cose",
        animate: false, // Disable animation for better performance with large graphs
        nodeRepulsion: 4000,
        idealEdgeLength: 50,
        edgeElasticity: 100,
        nestingFactor: 5,
        gravity: 40,
        numIter: 1000,
        initialTemp: 200,
        coolingFactor: 0.95,
        minTemp: 1.0,
      },
      minZoom: 0.1,
      maxZoom: 3,
      wheelSensitivity: 0.2,
    });

    // Add interaction handlers
    cy.on("tap", "node", function (evt) {
      const node = evt.target;
      const connectedEdges = node.connectedEdges();
      const connectedNodes = connectedEdges.connectedNodes();

      // Highlight connected elements
      cy.elements().removeClass("highlighted");
      node.addClass("highlighted");
      connectedEdges.addClass("highlighted");
      connectedNodes.addClass("highlighted");

      console.log("Node:", node.data());
      console.log("Connected edges:", connectedEdges.length);
    });

    cy.on("tap", "edge", function (evt) {
      const edge = evt.target;
      console.log("Edge:", edge.data());
    });

    // Reset highlight on background tap
    cy.on("tap", function (evt) {
      if (evt.target === cy) {
        cy.elements().removeClass("highlighted");
      }
    });

    setLoading(false);

    return () => {
      cy.destroy();
    };
  }, []);

  return (
    <section className="w-full bg-gradient-to-b from-black via-[#0a0a0a] to-black py-16">
      <div className="max-w-[95%] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Knowledge Graph Visualization
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-3xl mx-auto">
            Explore the interconnected web of space biology research. Each node
            represents an entity, and edges show relationships extracted from
            scientific publications.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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
          transition={{ delay: 0.2 }}
          className="mb-6 p-4 rounded-xl bg-slate-900/40 border border-slate-800"
        >
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-purple-500 border-2 border-slate-600"></div>
              <span className="text-xs text-slate-300">Subject Entity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-cyan-500 border-2 border-slate-600"></div>
              <span className="text-xs text-slate-300">Object Entity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-slate-500"></div>
              <span className="text-xs text-slate-300">Relationship</span>
            </div>
            <div className="text-xs text-slate-400 ml-4">
              💡 Tip: Scroll to zoom • Drag to pan • Click nodes to explore
              connections
            </div>
          </div>
        </motion.div>

        {/* Graph Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-slate-900/40 border border-slate-800 overflow-hidden shadow-2xl relative"
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                <p className="text-slate-300">Loading knowledge graph...</p>
              </div>
            </div>
          )}

          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <h3 className="text-sm font-semibold text-slate-300">
              Interactive Graph Explorer
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 hidden md:inline">
                {kgTriples.length.toLocaleString()} relationships loaded
              </span>
            </div>
          </div>

          <div
            ref={cyRef}
            className="w-full bg-gradient-to-br from-slate-950 to-black"
            style={{ height: "700px" }}
          />
        </motion.div>

        {/* Info Panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 p-6 rounded-xl bg-slate-900/40 border border-slate-800"
        >
          <h3 className="text-lg font-semibold text-slate-300 mb-3">
            About This Knowledge Graph
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            This comprehensive knowledge graph represents{" "}
            {kgTriples.length.toLocaleString()} verified relationships extracted
            from space biology research publications. Each connection (triple)
            consists of a subject entity, a predicate (relationship type), and
            an object entity, forming a rich semantic network of scientific
            knowledge.
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
                Cytoscape.js
              </div>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700">
              <div className="text-xs text-slate-400 mb-1">
                Layout Algorithm
              </div>
              <div className="text-sm font-semibold text-slate-200">
                COSE (Force-directed)
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
