import QueryGraphExplorer from "@/components/QueryGraphExplorer";

export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center py-12 px-4">
      <h1 className="text-3xl font-bold text-indigo-400 mb-6 text-center mt-10">
        Space Biology Knowledge Explorer
      </h1>
      <p className="text-gray-400 max-w-2xl text-center mb-8">
        Search and visualize relationships from 600+ space biology publications.
        Query using simple Cypher-like syntax — all processed locally.
      </p>
      <QueryGraphExplorer />
    </main>
  );
}
