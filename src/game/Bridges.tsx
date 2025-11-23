"use client";

import { useMemo } from "react";
import { Vector3, Euler } from "three";
import { ZONES } from "@/core/types";

interface BridgeSegment {
  position: [number, number, number];
  length: number;
  rotation: Euler;
}

const computeBridgeSegments = (): BridgeSegment[] => {
  const segments: BridgeSegment[] = [];
  for (let i = 0; i < ZONES.length - 1; i += 1) {
    const a = new Vector3(...ZONES[i].position);
    const b = new Vector3(...ZONES[i + 1].position);
    const midpoint = a.clone().lerp(b, 0.5);
    const direction = b.clone().sub(a);
    const length = direction.length();
    const rotation = new Euler(0, Math.atan2(direction.x, direction.z), 0);
    segments.push({
      position: [midpoint.x, midpoint.y - 0.5, midpoint.z],
      length,
      rotation,
    });
  }
  return segments;
};

export function Bridges() {
  const segments = useMemo(() => computeBridgeSegments(), []);

  return (
    <group>
      {segments.map((segment, index) => (
        <group key={`bridge-${index}`} position={segment.position} rotation={segment.rotation}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[segment.length, 0.4, 1.2]} />
            <meshStandardMaterial color="#ffe3c7" />
          </mesh>
          <mesh position={[0, 0.5, -0.6]}>
            <boxGeometry args={[segment.length, 0.1, 0.1]} />
            <meshStandardMaterial color="#f6a356" />
          </mesh>
          <mesh position={[0, 0.5, 0.6]}>
            <boxGeometry args={[segment.length, 0.1, 0.1]} />
            <meshStandardMaterial color="#f6a356" />
          </mesh>
        </group>
      ))}
    </group>
  );
}
