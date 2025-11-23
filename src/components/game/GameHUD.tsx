"use client";

import { useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useGameStore } from "@/store/gameStore";
import { useUIStore } from "@/store/uiStore";
import { ZONES, zoneById } from "@/core/types";
import { readCachedProgress } from "@/core/persistence";
import { trpc } from "@/utils/trpc";

export function GameHUD() {
  const { hydrate, completedZones, activeZone } = useGameStore();
  const { openChallenge } = useUIStore();

  useEffect(() => {
    hydrate(readCachedProgress());
  }, [hydrate]);

  trpc.progress.get.useQuery(undefined, {
    staleTime: 60_000,
    onSuccess: (data) => hydrate(data),
  });

  const resetMutation = trpc.progress.reset.useMutation({
    onSuccess: (data) => hydrate(data),
  });

  const currentZone = zoneById[activeZone];
  const total = ZONES.length;

  return (
    <div className="pointer-events-none absolute left-6 top-6 flex w-[360px] flex-col gap-4">
      <Card className="pointer-events-auto">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase text-dusk/60">Zone actuelle</p>
            <p className="text-xl font-semibold text-dusk">{currentZone.name}</p>
            <p className="text-sm text-dusk/70">{currentZone.description}</p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <ProgressBar value={completedZones.length} total={total} />
          <p className="text-xs text-dusk/60">
            {completedZones.length} / {total} défis maîtrisés
          </p>
        </div>
        <div className="mt-4 flex gap-3">
          <Button className="flex-1" onClick={() => openChallenge(activeZone)}>
            Ouvrir le défi
          </Button>
          <Button
            className="flex-1"
            intent="secondary"
            onClick={() => resetMutation.mutate()}
          >
            Réinitialiser
          </Button>
        </div>
      </Card>
    </div>
  );
}
