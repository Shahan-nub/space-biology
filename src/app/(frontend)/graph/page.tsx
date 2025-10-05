import CypherQueryEngine from "@/components/CypherQueryEngine"
import KnowledgeGraph from "@/components/Graph"

type Props = {}
export default function page() {
  return (
    <div className="flex rounded-3xl w-full h-full">
        <KnowledgeGraph></KnowledgeGraph>      
    </div>
  )
}