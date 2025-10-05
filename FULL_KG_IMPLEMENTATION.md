# Full Knowledge Graph Implementation - Complete Guide

## 🎯 Overview

Successfully implemented a comprehensive knowledge graph visualization using **all** the data from `kg_triples_validated.json` (74,250 triples) on the home page, while keeping the sample Cypher query demonstration on the search page.

## 📁 Files Created/Modified

### New Files:

1. **`src/components/KnowledgeGraph.tsx`** - Main knowledge graph component
   - Processes all 74,250+ triples from the validated JSON file
   - Creates nodes for subjects and objects
   - Creates edges for relationships (predicates)
   - Implements interactive features (zoom, pan, node selection)

### Modified Files:

1. **`src/components/HomePage.tsx`** - Added KnowledgeGraph component
2. **`src/components/SearchPage.tsx`** - Simplified to show only sample Cypher query

## 🎨 Implementation Details

### Knowledge Graph Component (`KnowledgeGraph.tsx`)

#### Data Structure

The component processes triples with the following structure:

```json
{
  "title": "Publication Title",
  "chunk_id": "unique_chunk_identifier",
  "subject": "entity1",
  "predicate": "relationship_type",
  "object": "entity2",
  "faiss_verified": true
}
```

#### Node Types

- **Subject Entities** (Purple Ellipses)

  - Represents the source entity in relationships
  - Color: `#8b5cf6` (Purple)
  - Shape: Ellipse

- **Object Entities** (Cyan Rectangles)
  - Represents the target entity in relationships
  - Color: `#06b6d4` (Cyan)
  - Shape: Rounded Rectangle

#### Edge Properties

- Color: `#475569` (Slate)
- Arrow: Triangle pointing to target
- Opacity: 0.6 for better visibility with many edges
- Width: 1px for performance optimization

#### Graph Statistics

The component displays:

- **Total Nodes**: Unique entities (subjects + objects)
- **Total Edges**: All relationships (triples)
- **Unique Subjects**: Distinct subject entities
- **Unique Objects**: Distinct object entities

### Layout Algorithm

**COSE (Compound Spring Embedder)** - Force-directed layout

```typescript
{
  name: 'cose',
  animate: false,              // Disabled for performance
  nodeRepulsion: 4000,         // Space between nodes
  idealEdgeLength: 50,         // Preferred edge length
  edgeElasticity: 100,         // Edge flexibility
  gravity: 40,                 // Center attraction
  numIter: 1000,              // Layout iterations
  coolingFactor: 0.95,        // Convergence speed
}
```

### Interactive Features

1. **Node Click**

   - Highlights the clicked node
   - Highlights all connected edges
   - Highlights all connected nodes
   - Console logs node data for debugging

2. **Edge Click**

   - Console logs edge data including relationship type and source publication

3. **Background Click**

   - Resets all highlights

4. **Zoom Controls**

   - Mouse wheel to zoom (0.1x to 3x)
   - Pinch to zoom on touch devices

5. **Pan Controls**
   - Click and drag to move around the graph

## 🚀 Usage

### Home Page

Visit `http://localhost:3001/` to see the full knowledge graph with all relationships.

### Search Page

Visit `http://localhost:3001/search` to see the sample Cypher query and search functionality.

## 📊 Performance Optimizations

### Large Graph Handling

With 74,250+ triples, several optimizations were implemented:

1. **No Animation During Layout**

   - `animate: false` reduces initial load time
   - Layout calculates positions immediately

2. **Reduced Edge Visibility**

   - `opacity: 0.6` for edges
   - Thinner edges (`width: 1`)
   - No edge labels by default

3. **Optimized Node Sizing**

   - Smaller nodes (30px) to fit more on screen
   - Reduced font size (8px)

4. **Map-Based Deduplication**

   - Uses `Map` data structure for O(1) lookups
   - Normalizes entity names (lowercase, trim)
   - Prevents duplicate nodes

5. **Memory Efficient**
   - Single pass through triples data
   - Efficient data structures
   - No unnecessary re-renders

## 🎨 Visual Design

### Color Scheme

- **Background**: Black gradient to dark slate
- **Nodes**:
  - Purple (#8b5cf6) for subjects
  - Cyan (#06b6d4) for objects
- **Edges**: Slate gray (#475569)
- **Selection**: Orange/Yellow (#fbbf24, #f59e0b)
- **UI Elements**: Slate with transparency

### Typography

- **Headers**: Bold, gradient text (purple → cyan → blue)
- **Stats**: Large, bold, colored numbers
- **Labels**: Small, slate-colored text

### Layout

- **Full Width**: 95% of viewport width
- **Responsive**: Adapts to mobile and desktop
- **Sticky Elements**: None for maximum graph space
- **Height**: 700px graph container

## 🔍 Data Insights

### Sample Relationships

```
COVID-19 → is caused by → SARS-CoV-2
COVID-19 → has caused → significant morbidity
COVID-19 → has caused → mortality
SARS-CoV-2 → continues to evolve with → global health implications
```

### Relationship Types (Predicates)

Common predicates in the dataset:

- "is caused by"
- "has caused"
- "continues to evolve with"
- "is associated with"
- "affects"
- "regulates"
- "interacts with"
- Many more...

## 🛠️ Technical Stack

### Core Libraries

- **Cytoscape.js** (v3.33.1) - Graph visualization
- **React** (v19.1.0) - UI framework
- **Next.js** (v15.5.4) - React framework
- **Framer Motion** (v12.23.22) - Animations
- **TypeScript** - Type safety

### Styling

- **Tailwind CSS** (v4) - Utility-first CSS
- **Custom Gradients** - For visual appeal

## 📝 Code Structure

### Component Hierarchy

```
HomePage
  └── KnowledgeGraph
        ├── Header (Title + Description)
        ├── Stats Panel (4 stat cards)
        ├── Legend (Node types + Tips)
        ├── Graph Container
        │     └── Cytoscape Instance
        └── Info Panel (About + Details)
```

### State Management

```typescript
const [stats, setStats] = useState({
  nodes: 0,
  edges: 0,
  subjects: 0,
  objects: 0,
});
const [loading, setLoading] = useState(true);
const cyRef = useRef<HTMLDivElement>(null);
```

## 🔮 Future Enhancements

### Potential Improvements

1. **Search Functionality**

   - Search for specific entities
   - Filter by relationship type
   - Highlight search results

2. **Advanced Filters**

   - Filter by publication
   - Filter by entity type
   - Date range filters

3. **Graph Algorithms**

   - Shortest path between entities
   - Community detection
   - Centrality measures

4. **Export Features**

   - Export as PNG/SVG
   - Export subgraphs
   - Export to JSON/CSV

5. **Layout Options**

   - Multiple layout algorithms
   - Custom layouts
   - Save/load positions

6. **Performance**

   - Virtualization for very large graphs
   - Level of detail rendering
   - Progressive loading

7. **Analytics**
   - Most connected entities
   - Relationship statistics
   - Graph metrics dashboard

## 🐛 Troubleshooting

### Graph Not Rendering

- Check if `cyRef.current` exists
- Verify JSON data is loading correctly
- Check browser console for errors

### Performance Issues

- Reduce number of visible nodes (implement filtering)
- Disable labels on zoom out
- Use simpler layout algorithm

### Layout Issues

- Adjust `nodeRepulsion` for spacing
- Modify `gravity` for clustering
- Change `idealEdgeLength` for edge length

## 📚 Resources

- [Cytoscape.js Documentation](https://js.cytoscape.org/)
- [COSE Layout Documentation](https://github.com/cytoscape/cytoscape.js-cose-bilkent)
- [Knowledge Graph Best Practices](https://www.w3.org/TR/swbp-vocab-pub/)

## ✅ Verification Checklist

- [x] All triples from `kg_triples_validated.json` processed
- [x] Nodes created for unique subjects and objects
- [x] Edges created for all relationships
- [x] Interactive features working (zoom, pan, click)
- [x] Statistics displayed correctly
- [x] Responsive design implemented
- [x] Loading state handled
- [x] Performance optimized for large dataset
- [x] Search page shows sample Cypher query
- [x] No compilation errors

## 🎉 Result

A fully functional, interactive knowledge graph displaying **74,250+ relationships** from space biology research, with:

- Beautiful dark-themed design
- Smooth interactions
- Comprehensive statistics
- Optimized performance
- Professional presentation

---

**Built for NASA Space Biology Hackathon 2025**
