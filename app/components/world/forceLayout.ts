import {
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceCollide,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from "d3-force";
import type { Entity, Relationship } from "@/lib/domain/types";

export interface GraphNode extends SimulationNodeDatum {
  id: string;
  entity: Entity;
  x: number;
  y: number;
  z: number;
}

export interface GraphLink extends SimulationLinkDatum<GraphNode> {
  id: string;
  rel: Relationship;
  source: string | GraphNode;
  target: string | GraphNode;
}

export function buildForceGraph(
  entities: Entity[],
  relationships: Relationship[],
  youId: string
): { nodes: GraphNode[]; links: GraphLink[] } {
  const nodes: GraphNode[] = entities.map((e, i) => {
    const angle = (i / Math.max(1, entities.length)) * Math.PI * 2;
    const r = e.id === youId ? 0 : 4 + (i % 5);
    return {
      id: e.id,
      entity: e,
      x: e.id === youId ? 0 : Math.cos(angle) * r,
      y: e.id === youId ? 0 : Math.sin(angle) * r * 0.6,
      z: e.entityType === "topic" ? 1.2 : e.entityType === "post" ? -0.6 : 0,
    };
  });

  const idSet = new Set(nodes.map((n) => n.id));
  const links: GraphLink[] = relationships
    .filter((r) => idSet.has(r.from) && idSet.has(r.to))
    .map((r) => ({
      id: r.id,
      rel: r,
      source: r.from,
      target: r.to,
    }));

  const sim = forceSimulation(nodes)
    .force(
      "link",
      forceLink<GraphNode, GraphLink>(links)
        .id((d) => d.id)
        .distance((l) => {
          const t = l.rel.relType;
          if (t === "AUTHORED") return 2.2;
          if (t === "ABOUT") return 2.8;
          if (t === "INTERESTED_IN") return 3.5;
          return 4.2;
        })
        .strength(0.45)
    )
    .force("charge", forceManyBody().strength(-18))
    .force("center", forceCenter(0, 0))
    .force(
      "collide",
      forceCollide<GraphNode>().radius((d) => (d.entity.size ?? 1) * 1.1)
    )
    .stop();

  for (let i = 0; i < 180; i++) sim.tick();

  // Fix YOU at origin
  const you = nodes.find((n) => n.id === youId);
  if (you) {
    you.x = 0;
    you.y = 0;
    you.z = 0;
  }

  // Lift topics into a soft halo ring
  nodes.forEach((n) => {
    if (n.entity.entityType === "topic") {
      n.z = 1.4;
    } else if (n.entity.entityType === "post") {
      n.z = -0.8;
    } else if (n.entity.entityType === "community") {
      n.z = 0.6;
    }
  });

  return { nodes, links };
}
