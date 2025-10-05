import KnowledgeGraph from "@/components/Graph";

type Props = {};
export default function page() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center py-12 px-4">
      <h1 className="text-3xl font-bold text-indigo-400 mb-6 text-center mt-10">
        3D Knowledge Graph Visualization
      </h1>
      <p className="text-gray-400 max-w-2xl text-center mb-8">
        Explore an interactive 3D visualization of 2,000+ relationships from
        space biology research. Navigate through interconnected concepts,
        entities, and their relationships in real-time.
      </p>
      <KnowledgeGraph />
    </main>
  );
}
