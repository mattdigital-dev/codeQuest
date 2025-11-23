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
  openChallenge: (zoneId: ZoneId) => void;
  closeChallenge: () => void;
  openCodex: (zoneId: ZoneId) => void;
  closeCodex: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  overlay: { isOpen: false },
  codex: { isOpen: false },
  openChallenge: (zoneId) =>
    set({
      overlay: { isOpen: true, zoneId },
    }),
  closeChallenge: () =>
    set({
      overlay: { isOpen: false },
    }),
  openCodex: (zoneId) =>
    set({
      codex: { isOpen: true, zoneId },
    }),
  closeCodex: () =>
    set({
      codex: { isOpen: false },
    }),
}));
