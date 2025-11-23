"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { applyChallengeSuccess, getInitialProgress, setActiveZone } from "@/core/progress";
import { writeCachedProgress } from "@/core/persistence";
import type { ProgressState, ZoneId } from "@/core/types";

interface GameStore extends ProgressState {
  isSyncing: boolean;
  hydrate: (state: ProgressState) => void;
  selectZone: (zoneId: ZoneId) => void;
  completeZone: (zoneId: ZoneId) => ProgressState;
  setSyncing: (value: boolean) => void;
}

export const useGameStore = create<GameStore>()(
  devtools(
    (set, get) => ({
      ...getInitialProgress(),
      isSyncing: false,
      hydrate: (state) =>
        set(() => {
          writeCachedProgress(state);
          return state;
        }),
      selectZone: (zoneId) =>
        set((prev) => {
          const next = setActiveZone(prev, zoneId);
          writeCachedProgress(next);
          return next;
        }),
      completeZone: (zoneId) => {
        const next = applyChallengeSuccess(get(), zoneId);
        set(next);
        writeCachedProgress(next);
        return next;
      },
      setSyncing: (value) => set({ isSyncing: value }),
    }),
    { name: "game-store" },
  ),
);
