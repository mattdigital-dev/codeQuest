"use client";

import { useEffect, useMemo, useState } from "react";
import type { RefObject } from "react";
import { Group, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { clampToWalkable } from "./Collisions";
import { ZONES, type ZoneId } from "@/core/types";
import { useGameStore } from "@/store/gameStore";

const SPEED = 6;

const KEY_MAP: Record<string, keyof typeof DIRECTIONS> = {
  KeyZ: "forward",
  KeyW: "forward",
  ArrowUp: "forward",
  KeyS: "backward",
  ArrowDown: "backward",
  KeyQ: "left",
  KeyA: "left",
  ArrowLeft: "left",
  KeyD: "right",
  ArrowRight: "right",
};

const DIRECTIONS = {
  forward: 0,
  backward: 0,
  left: 0,
  right: 0,
};

const findZoneAtPosition = (position: Vector3): ZoneId | null => {
  for (const zone of ZONES) {
    const center = new Vector3(...zone.position);
    const distance = center.distanceTo(position);
    if (distance <= zone.radius + 0.3) {
      return zone.id;
    }
  }
  return null;
};

export function Player({ playerRef }: { playerRef: RefObject<Group> }) {
  const [directions, setDirections] = useState(DIRECTIONS);
  const { selectZone } = useGameStore();
  const [lastZone, setLastZone] = useState<ZoneId>("village");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = KEY_MAP[event.code];
      if (!key) return;
      setDirections((prev) => ({ ...prev, [key]: 1 }));
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = KEY_MAP[event.code];
      if (!key) return;
      setDirections((prev) => ({ ...prev, [key]: 0 }));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    if (!playerRef.current) return;
    const { forward, backward, left, right } = directions;
    const velocity = new Vector3(right - left, 0, backward - forward)
      .normalize()
      .multiplyScalar(SPEED * delta);

    const target = playerRef.current.position.clone().add(velocity);
    target.y = 0.4;
    const clamped = clampToWalkable(target, playerRef.current.position);
    playerRef.current.position.copy(clamped);

    const zone = findZoneAtPosition(clamped);
    if (zone && zone !== lastZone) {
      setLastZone(zone);
      selectZone(zone);
    }
  });

  const body = useMemo(
    () => (
      <group>
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[0.4, 0.8, 0.25]} />
          <meshStandardMaterial color="#f6c48f" />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[0.35, 0.35, 0.35]} />
          <meshStandardMaterial color="#f6e7c1" />
        </mesh>
        <mesh position={[-0.22, 0.7, 0]}>
          <boxGeometry args={[0.15, 0.5, 0.15]} />
          <meshStandardMaterial color="#7fb2ff" />
        </mesh>
        <mesh position={[0.22, 0.7, 0]}>
          <boxGeometry args={[0.15, 0.5, 0.15]} />
          <meshStandardMaterial color="#7fb2ff" />
        </mesh>
      </group>
    ),
    [],
  );

  return <group ref={playerRef} position={[0, 0.4, 0]}>{body}</group>;
}
