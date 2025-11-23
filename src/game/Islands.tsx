"use client";

import { Float, Html } from "@react-three/drei";
import { useMemo } from "react";
import { ZONES } from "@/core/types";
import { useGameStore } from "@/store/gameStore";
import { useUIStore } from "@/store/uiStore";

export function Islands() {
  const { unlockedZones, completedZones } = useGameStore();
  const { openChallenge } = useUIStore();

  const islands = useMemo(
    () =>
      ZONES.map((zone) => {
        const isUnlocked = unlockedZones.includes(zone.id);
        const isCompleted = completedZones.includes(zone.id);
        return {
          ...zone,
          isUnlocked,
          isCompleted,
        };
      }),
    [completedZones, unlockedZones],
  );

  return (
    <group>
      {islands.map((zone) => (
        <group key={zone.id} position={zone.position}>
          <mesh receiveShadow castShadow>
            <cylinderGeometry args={[zone.radius, zone.radius * 1.05, 2, 6]} />
            <meshStandardMaterial
              color={zone.isCompleted ? zone.accent : zone.color}
              flatShading
            />
          </mesh>

          <Float speed={2} rotationIntensity={0.2} position={[0, 2, 0]}>
            <mesh
              onClick={() => zone.isUnlocked && openChallenge(zone.id)}
              onPointerOver={(event) => event.stopPropagation()}
              scale={islandScale(zone.isUnlocked)}
            >
              <octahedronGeometry args={[0.7, 0]} />
              <meshStandardMaterial
                color={zone.isCompleted ? "#fff4d6" : "#ffffff"}
                emissive={zone.isUnlocked ? zone.accent : "#999999"}
                emissiveIntensity={zone.isUnlocked ? 0.6 : 0.1}
              />
            </mesh>
            <Html distanceFactor={18}>
              <div className="rounded-full bg-white/80 px-3 py-1 text-xs text-dusk shadow">
                {zone.name}
              </div>
            </Html>
          </Float>
        </group>
      ))}
    </group>
  );
}

const islandScale = (isUnlocked: boolean) => (isUnlocked ? 1 : 0.6);
