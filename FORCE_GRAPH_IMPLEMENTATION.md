# React Force Graph Implementation Guide

## 🎯 Overview

Successfully migrated the knowledge graph from Cytoscape to **React Force Graph** and moved it to a dedicated route at `/knowledge-graph`. The implementation processes all 74,250+ triples from `kg_triples_validated.json` and displays them using a dynamic force-directed layout.

## 📁 Project Structure

```
src/
├── app/
│   ├── knowledge-graph/
│   │   └── page.tsx              # New route for knowledge graph
│   ├── page.tsx                  # Home page
│   └── search/
│       └── page.tsx              # Search page with Cypher query
├── components/
│   ├── ForceGraphKG.tsx          # NEW: React Force Graph component
│   ├── HomePage.tsx              # Updated with CTA section
│   ├── KnowledgeGraph.tsx        # OLD: Cytoscape version (can be removed)
│   └── ...other components
└── data/
    └── kg_triples_validated.json # Graph data source
```

## 🆕 What's New

### 1. Force-Directed Layout

- **Automatic positioning** based on connections
- **Natural clustering** of related concepts
- **Dynamic node sizing** based on number of connections
- **Real-time physics simulation** for organic movement

### 2. Separate Route

- **New route**: `/knowledge-graph`
- **Dedicated page** for graph exploration
- **Clean separation** from home page
- **Better performance** (loads only when needed)

### 3. Enhanced Interactivity

- **Drag nodes** to rearrange layout
- **Click nodes** to see details
- **Scroll to zoom** in/out
- **Double-click** to focus on a node
- **Background click** to deselect

## 🚀 Routes

### Home Page (`/`)

- Hero section
- **Knowledge Graph CTA** with:
  - Visual icon
  - Description
  - Launch button → `/knowledge-graph`
  - Sample query button → `/search`
  - Statistics cards (74,250+ relationships, etc.)
- About section

### Knowledge Graph Page (`/knowledge-graph`)

- Full-screen force-directed graph
- Statistics dashboard
- Legend
- Selected node info panel
- Interactive controls
- Back to home button

### Search Page (`/search`)

- Sample Cypher query
- Link to full knowledge graph
- Future search functionality placeholder

## 🎨 Force Graph Features

### Node Visualization

```typescript
- Color: Purple (#8b5cf6) for subjects, Cyan (#06b6d4) for objects
- Size: Dynamic based on connections (val property)
- Label: Entity name on hover
- Interactive: Clickable and draggable
```

### Link Visualization

```typescript
- Color: Slate gray (#475569)
- Width: 1px for performance
- Arrows: Directional arrows showing relationship direction
- Interactive: Clickable to see details
```

### Layout Algorithm

**D3 Force-Directed Layout** with custom parameters:

```typescript
- cooldownTicks: 100         // Simulation iterations
- d3AlphaDecay: 0.02         // Cooling rate
- d3VelocityDecay: 0.3       // Momentum decay
- nodeRelSize: 6             // Node size multiplier
```

## 📊 Data Processing

### Triple Structure

```typescript
interface Triple {
  title: string; // Source publication
  chunk_id: string; // Unique identifier
  subject: string; // Source entity
  predicate: string; // Relationship type
  object: string; // Target entity
  faiss_verified: boolean; // Verification flag
}
```

### Graph Data Structure

```typescript
interface GraphData {
  nodes: Array<{
    id: string; // Normalized entity name
    name: string; // Display name
    type: "subject" | "object";
    val: number; // Connection count (for sizing)
  }>;
  links: Array<{
    source: string; // Source node ID
    target: string; // Target node ID
    label: string; // Relationship type
    title: string; // Source publication
  }>;
}
```

### Processing Logic

1. **Iterate through all triples**
2. **Normalize entity names** (lowercase, trim)
3. **Create unique nodes** using Map for deduplication
4. **Track connections** by incrementing node.val
5. **Create directed links** from subject to object
6. **Calculate statistics** for dashboard

## 🎮 Interactive Features

### Node Interactions

```typescript
handleNodeClick(node)
- Sets selectedNode state
- Displays node info panel
- Logs node data to console
- Future: Show connected nodes
```

### Link Interactions

```typescript
handleLinkClick(link)
- Logs link data to console
- Shows relationship type and source
- Future: Filter by relationship type
```

### Background Interactions

```typescript
handleBackgroundClick()
- Clears selected node
- Resets highlight state
```

## 🎯 Component Props

### ForceGraph2D Configuration

```typescript
<ForceGraph2D
  ref={forceRef}                        // Reference for programmatic control
  graphData={graphData}                 // Nodes and links data
  nodeLabel="name"                      // Tooltip text
  nodeColor={(node) => ...}             // Dynamic coloring
  nodeRelSize={6}                       // Size multiplier
  nodeVal={(node) => node.val}          // Size based on connections
  linkColor={() => '#475569'}           // Link color
  linkWidth={1}                         // Link thickness
  linkDirectionalArrowLength={3}        // Arrow size
  linkDirectionalArrowRelPos={1}        // Arrow position
  onNodeClick={handleNodeClick}         // Click handler
  onLinkClick={handleLinkClick}         // Click handler
  onBackgroundClick={handleBackgroundClick} // Click handler
  enableNodeDrag={true}                 // Draggable nodes
  enableZoomInteraction={true}          // Zoom enabled
  enablePanInteraction={true}           // Pan enabled
  cooldownTicks={100}                   // Simulation duration
  d3AlphaDecay={0.02}                   // Cooling speed
  d3VelocityDecay={0.3}                 // Momentum
  backgroundColor="transparent"          // Transparent background
/>
```

## 🎨 Styling

### Color Palette

- **Background**: Gradient from `#0b1020` to `#020205`
- **Subject Nodes**: Purple `#8b5cf6`
- **Object Nodes**: Cyan `#06b6d4`
- **Links**: Slate `#475569`
- **Selected**: Orange/Yellow `#fbbf24`
- **UI Cards**: Slate with transparency

### Responsive Design

- Mobile-first approach
- Grid layouts adapt to screen size
- Statistics cards stack on mobile
- Full-width graph on all devices

## 🔧 Performance Optimizations

### Data Processing

1. **Single pass** through triples array
2. **Map-based** node deduplication (O(1) lookup)
3. **Normalized keys** for consistent matching
4. **Incremental val** for connection counting

### Rendering

1. **React memo** for static components
2. **useCallback** for event handlers
3. **Conditional rendering** with loading state
4. **Transparent background** for better performance

### Force Simulation

1. **Limited cooldown ticks** (100 iterations)
2. **Optimized decay rates** for faster convergence
3. **Thin links** (1px) for better performance
4. **No link particles** to reduce calculations

## 📱 User Experience

### Loading State

```typescript
- Animated spinner
- Loading message
- Progress indicator (relationship count)
- Smooth transition when ready
```

### Navigation

```typescript
- Sticky navbar with back button
- Clear route structure
- Prominent CTA on home page
- Breadcrumb-style navigation
```

### Feedback

```typescript
- Selected node info panel
- Console logs for debugging
- Hover tooltips on nodes
- Visual feedback on interactions
```

## 🔮 Future Enhancements

### Planned Features

1. **Search/Filter**

   - Search for specific entities
   - Filter by relationship type
   - Filter by publication source

2. **Advanced Visualizations**

   - 3D force graph option
   - Different layout algorithms
   - Custom color schemes

3. **Node Details**

   - Detailed info panel
   - Connected nodes list
   - Relationship paths

4. **Export Options**

   - Export as PNG/SVG
   - Export subgraphs
   - Share via URL

5. **Analytics**
   - Most connected entities
   - Community detection
   - Path analysis

## 📊 Statistics Dashboard

### Metrics Displayed

```typescript
1. Total Nodes: Unique entities in the graph
2. Total Edges: All relationships (triples)
3. Unique Subjects: Distinct source entities
4. Unique Objects: Distinct target entities
```

### Calculation

```typescript
const subjects = new Set(triples.map((t) => normalize(t.subject)));
const objects = new Set(triples.map((t) => normalize(t.object)));
const nodes = nodeMap.size;
const edges = links.length;
```

## 🛠️ Technical Dependencies

### Core Libraries

```json
{
  "react-force-graph": "^1.48.1",
  "react": "19.1.0",
  "next": "15.5.4",
  "framer-motion": "^12.23.22",
  "lucide-react": "^0.544.0"
}
```

### Why React Force Graph?

1. **Better for large graphs** - Optimized for thousands of nodes
2. **Natural clustering** - Force-directed layout creates intuitive groupings
3. **Smooth interactions** - Hardware-accelerated canvas rendering
4. **D3.js powered** - Industry-standard force simulation
5. **TypeScript support** - Better developer experience

## 🆚 Comparison: Cytoscape vs React Force Graph

### Cytoscape

- ✅ More layout algorithms
- ✅ Better for static layouts
- ✅ Compound nodes support
- ❌ Performance with huge graphs
- ❌ Less dynamic

### React Force Graph

- ✅ Better performance with large graphs
- ✅ Natural force-directed layout
- ✅ Smoother interactions
- ✅ Canvas-based rendering
- ❌ Fewer layout options

## 🎓 Learning Resources

- [React Force Graph Documentation](https://github.com/vasturiano/react-force-graph)
- [D3 Force Simulation](https://github.com/d3/d3-force)
- [Force-Directed Graph Drawing](https://en.wikipedia.org/wiki/Force-directed_graph_drawing)

## ✅ Implementation Checklist

- [x] Create ForceGraphKG component
- [x] Set up /knowledge-graph route
- [x] Process all 74,250+ triples
- [x] Implement node and link visualization
- [x] Add interactive features (drag, zoom, click)
- [x] Create statistics dashboard
- [x] Add legend and info panels
- [x] Update HomePage with CTA section
- [x] Add navigation between routes
- [x] Optimize for performance
- [x] Style with dark theme
- [x] Make responsive for all devices
- [x] Add loading states
- [x] Implement event handlers

## 🎉 Result

A fully functional, performant, and beautiful force-directed knowledge graph that:

- Displays all 74,250+ relationships
- Lives on its own dedicated route
- Provides smooth, intuitive interactions
- Automatically clusters related concepts
- Scales well with large datasets
- Looks stunning with the space theme

---

**Access the Knowledge Graph**: `http://localhost:3001/knowledge-graph`

**Built for NASA Space Biology Hackathon 2025** 🚀
