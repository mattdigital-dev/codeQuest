"use client";

import type { Group } from "three";
import { Suspense } from "react";
import { Islands } from "./Islands";
import { Bridges } from "./Bridges";
import { Player } from "./Player";

interface WorldProps {
  playerRef: React.RefObject<Group>;
}

export function World({ playerRef }: WorldProps) {
  return (
    <Suspense fallback={null}>
      <Islands />
      <Bridges />
      <Player playerRef={playerRef} />
    </Suspense>
  );
}
