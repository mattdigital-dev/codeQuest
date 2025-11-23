"use client";

import { create } from "zustand";
import type { ZoneId } from "@/core/types";

interface OverlayState {
  isOpen: boolean;
  zoneId?: ZoneId;
}

interface CodexState {
  isOpen: boolean;
  zoneId?: ZoneId;
}

interface UIStore {
  overlay: OverlayState;
  codex: CodexState;
  mentorHints: Record<ZoneId, number>;
  openChallenge: (zoneId: ZoneId) => void;
  closeChallenge: () => void;
  openCodex: (zoneId: ZoneId) => void;
  closeCodex: () => void;
  increaseHintLevel: (zoneId: ZoneId) => number;
  resetHintLevel: (zoneId: ZoneId) => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  overlay: { isOpen: false },
  codex: { isOpen: false },
  mentorHints: {},
  openChallenge: (zoneId) =>
    set((state) => ({
      ...state,
      overlay: { isOpen: true, zoneId },
    })),
  closeChallenge: () =>
    set((state) => ({
      ...state,
      overlay: { isOpen: false },
    })),
  openCodex: (zoneId) =>
    set((state) => ({
      ...state,
      codex: { isOpen: true, zoneId },
    })),
  closeCodex: () =>
    set((state) => ({
      ...state,
      codex: { isOpen: false },
    })),
  increaseHintLevel: (zoneId) => {
    const current = get().mentorHints[zoneId] ?? 0;
    const nextLevel = current + 1;
    set((state) => ({
      ...state,
      mentorHints: {
        ...state.mentorHints,
        [zoneId]: nextLevel,
      },
    }));
    return nextLevel;
  },
  resetHintLevel: (zoneId) =>
    set((state) => {
      if (!(zoneId in state.mentorHints)) {
        return state;
      }
      const nextHints = { ...state.mentorHints };
      delete nextHints[zoneId];
      return {
        ...state,
        mentorHints: nextHints,
      };
    }),
}));
