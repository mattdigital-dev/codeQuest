"use client";

import type { Group } from "three";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

interface CameraRigProps {
  target: React.RefObject<Group>;
}

const FOLLOW_OFFSET = new Vector3(-8, 6, 8);

export function CameraRig({ target }: CameraRigProps) {
  useFrame((state, delta) => {
    if (!target.current) return;
    const desired = target.current.position.clone().add(FOLLOW_OFFSET);
    state.camera.position.lerp(desired, 1 - Math.pow(0.001, delta));
    state.camera.lookAt(target.current.position);
  });

  return null;
}
