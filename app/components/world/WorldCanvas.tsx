"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Html } from "@react-three/drei";
import * as THREE from "three";
import type { Entity, Relationship } from "@/lib/domain/types";
import { useI18n, localizeEntity } from "@/lib/i18n";
import { buildForceGraph, type GraphNode, type GraphLink } from "./forceLayout";

function nodeColor(e: Entity, selected: boolean): string {
  if (selected) return "#ffffff";
  switch (e.entityType) {
    case "person":
      return e.id === "person_you" ? "#e8ecf4" : "#7eb8ff";
    case "topic":
      return "#a78bfa";
    case "post":
      return "#6ee7b7";
    case "community":
      return "#f0c674";
    default:
      return "#8b93a7";
  }
}

function BreathingNode({
  node,
  selected,
  onSelect,
}: {
  node: GraphNode;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const { locale } = useI18n();
  const ref = useRef<THREE.Mesh>(null);
  const base = node.entity.size ?? 1;
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const elapsed = clock.getElapsedTime();
    const breath = 1 + Math.sin(elapsed * 1.4 + base * 3) * 0.04;
    const pulse = selected ? 1.12 : 1;
    ref.current.scale.setScalar(base * breath * pulse);
  });

  const localized = localizeEntity(node.entity, locale);
  const label = localized.title;

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25}>
      <mesh
        ref={ref}
        position={[node.x, node.y, node.z]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.id);
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
          color={nodeColor(node.entity, selected)}
          emissive={nodeColor(node.entity, selected)}
          emissiveIntensity={selected ? 0.55 : 0.22}
          roughness={0.35}
          metalness={0.2}
          transparent
          opacity={node.entity.entityType === "post" ? 0.85 : 0.95}
        />
      </mesh>
      {(node.entity.entityType === "person" ||
        node.entity.entityType === "topic") && (
        <Html
          position={[node.x, node.y + base * 0.45, node.z]}
          center
          distanceFactor={12}
          style={{ pointerEvents: "none", whiteSpace: "nowrap" }}
        >
          <span
            className="rounded-full px-2 py-0.5 text-[10px] tracking-wide"
            style={{
              color: "rgba(232,236,244,0.85)",
              background: "rgba(7,8,12,0.55)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {label}
          </span>
        </Html>
      )}
    </Float>
  );
}

function EdgeLines({ links, nodes }: { links: GraphLink[]; nodes: GraphNode[] }) {
  const map = useMemo(() => {
    const m = new Map<string, GraphNode>();
    nodes.forEach((n) => m.set(n.id, n));
    return m;
  }, [nodes]);

  const positions = useMemo(() => {
    const arr: number[] = [];
    for (const l of links) {
      const sId = typeof l.source === "string" ? l.source : l.source.id;
      const tId = typeof l.target === "string" ? l.target : l.target.id;
      const a = map.get(sId);
      const b = map.get(tId);
      if (!a || !b) continue;
      arr.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
    return new Float32Array(arr);
  }, [links, map]);

  if (positions.length === 0) return null;

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#3a4258"
        transparent
        opacity={0.45}
        depthWrite={false}
      />
    </lineSegments>
  );
}

function DriftCamera({ cinematic }: { cinematic: boolean }) {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime();
    if (cinematic) {
      camera.position.x = Math.sin(t * 0.25) * 9;
      camera.position.z = Math.cos(t * 0.25) * 9;
      camera.position.y = 2.5 + Math.sin(t * 0.4) * 0.6;
      camera.lookAt(0, 0, 0);
    } else {
      // subtle idle drift when not orbiting hard
      camera.position.x += Math.sin(t * 0.15) * 0.0008;
      camera.position.y += Math.cos(t * 0.12) * 0.0005;
    }
  });
  return null;
}

function Scene({
  entities,
  relationships,
  youId,
  selectedId,
  onSelect,
  cinematic,
}: {
  entities: Entity[];
  relationships: Relationship[];
  youId: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
  cinematic: boolean;
}) {
  const { nodes, links } = useMemo(
    () => buildForceGraph(entities, relationships, youId),
    [entities, relationships, youId]
  );

  return (
    <>
      <color attach="background" args={["#07080c"]} />
      <ambientLight intensity={0.45} />
      <pointLight position={[6, 8, 4]} intensity={1.1} color="#7eb8ff" />
      <pointLight position={[-5, -2, -4]} intensity={0.6} color="#a78bfa" />
      <fog attach="fog" args={["#07080c", 14, 32]} />
      <EdgeLines links={links} nodes={nodes} />
      {nodes.map((n) => (
        <BreathingNode
          key={n.id}
          node={n}
          selected={selectedId === n.id}
          onSelect={onSelect}
        />
      ))}
      <DriftCamera cinematic={cinematic} />
      {!cinematic && (
        <OrbitControls
          enablePan={false}
          minDistance={5}
          maxDistance={18}
          autoRotate
          autoRotateSpeed={0.35}
        />
      )}
    </>
  );
}

export function WorldCanvas(props: {
  entities: Entity[];
  relationships: Relationship[];
  youId: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
  cinematic: boolean;
}) {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 2.5, 10], fov: 45 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: false }}
      >
        <Scene {...props} />
      </Canvas>
    </div>
  );
}
