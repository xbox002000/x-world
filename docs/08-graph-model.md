# 08 — Graph Model & Visualization

**Phase:** 0  
**Updated:** 2026-09-04 (Asia/Taipei)

---

## Product graph

Nodes: **Person | Topic | Post | Community**  
Edges: **FOLLOW | MUTUAL | ENGAGED_WITH | AUTHORED | ABOUT | INTERESTED_IN | MEMBER_OF | TRACKS** (see `05-data-model.md`)

Stored model is relational; R3F view model:

```ts
type WorldGraph = {
  nodes: { id: string; kind: EntityType; label: string; tier: 'A'|'B'|'C'|'D'; x?: number; y?: number; z?: number }[];
  links: { id: string; source: string; target: string; rel: RelType; weight: number }[];
};
```

## Lazy Graph Expansion UX

Goal: feel like a world, cost like a page.

1. Cold start: Ego (YOU) + seed neighbors (subscriptions + top-scored) + edges.
2. Hover: tooltip with handle and why-it-matters.
3. Click: side panel with detail + related NBA.
4. Expand: explicit 1-hop Provider page, merge, gentle force reheat.
5. Collapse: hide non-pinned children; keep DB rows.
6. Track/Subscribe: pin into ego seed.

Hard caps (MVP): ~150 visible nodes; expand page ~20; no auto-expand-all.

## Interaction requirements

| Interaction | Required |
|-------------|----------|
| Zoom | Yes |
| Pan | Yes |
| Orbit rotate | Yes |
| Click select | Yes |
| Expand neighborhood | Yes (explicit) |
| NBA spotlight | Yes |
| Multi-select mass-follow | No |


## R3F vs raw Three.js

| | R3F + Three.js | Raw Three.js |
|--|----------------|--------------|
| Declarative React scene | Yes | Manual imperative |
| AI / junior maintainability | Higher (JSX meshes) | Lower (lifecycle soup) |
| Ecosystem | `@react-three/fiber`, `drei` | Full control |
| MVP fit | **Preferred** | Only if R3F blocks a must-have |

**Decision:** Prefer **React Three Fiber**. Three.js remains the engine underneath.

## Library evaluation (ideas — not locked)

Research date: 2026-09-04.

| Library | What it is | Fit | Notes |
|---------|------------|-----|-------|
| d3-force / d3-force-3d | Layout simulation | Strong as layout engine in a worker | Pair with R3F meshes |
| react-force-graph / 3d-force-graph | High-level force graph | Fast prototype | Less idiomatic for custom world aesthetic |
| r3f-forcegraph (vasturiano) | R3F bindings | Good spike candidate | https://github.com/vasturiano/r3f-forcegraph — active through 2025 |
| reagraph (reaviz) | React WebGL graphs | Worth spike | https://github.com/reaviz/reagraph — perf work for large graphs 2025-2026 |
| graphier (community) | R3F + worker + instancing | Ideas only | LOD / instancing reference |

**MVP recommendation:** Custom R3F nodes per entity kind + d3-force-3d in a Web Worker, or a one-day `r3f-forcegraph` spike. Prefer custom visuals for world branding.

Do not adopt unofficial collection-based social-graph repos; visualization ideas only.

## Visual encoding (MVP)

- Person: sphere / avatar billboard
- Topic: octahedron / crystal
- Post: card plane
- Community: torus / ring cluster
- Edge weight → opacity/thickness
- NBA target → emissive pulse

## Performance notes

- InstancedMesh if node count grows
- Layout off main thread
- No force sim on hidden nodes
