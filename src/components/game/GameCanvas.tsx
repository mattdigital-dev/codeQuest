"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Stars } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";
import { World } from "@/game/World";
import { CameraRig } from "@/game/CameraRig";

export function GameCanvas() {
  const playerRef = useRef<Group>(null);

  return (
    <Canvas
      className="h-full w-full"
      shadows
      camera={{ position: [-12, 8, 16], fov: 45 }}
    >
      <color attach="background" args={["#f6f0ff"]} />
      <fog attach="fog" args={["#f6f0ff", 40, 150]} />

      <ambientLight intensity={0.7} />
      <directionalLight
        position={[-30, 40, 20]}
        intensity={1.1}
        castShadow
        color="#ffd6a5"
      />

      <World playerRef={playerRef} />
      <CameraRig target={playerRef} />

      <Stars radius={200} depth={60} count={3000} factor={4} saturation={0} fade />
      <Environment preset="sunset" />
    </Canvas>
  );
}
