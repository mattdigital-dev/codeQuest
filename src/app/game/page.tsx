"use client";

import dynamic from "next/dynamic";
import { GameHUD } from "@/components/game/GameHUD";
import { ChallengeOverlay } from "@/components/game/ChallengeOverlay";

const GameCanvas = dynamic(
  async () => {
    const mod = await import("@/components/game/GameCanvas");
    return mod.GameCanvas;
  },
  { ssr: false },
);

export default function GamePage() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-cloud">
      <GameCanvas />
      <GameHUD />
      <ChallengeOverlay />
    </div>
  );
}
