"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), { ssr: false });

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
  source: string;
  target: string;
  predicate: string;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

// ---- Component ----
export default function KnowledgeGraph() {
  const [data, setData] = useState<GraphData>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);

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
    <div className="flex mt-[10%] justify-center items-center w-full mb-16">
      <div className="relative w-[95%] max-w-6xl h-[100vh] bg-black border border-gray-800 rounded-2xl overflow-hidden shadow-lg">
        <ForceGraph3D
          graphData={data}
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
    </div>
  );
}
