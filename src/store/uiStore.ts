"use client";

import { create } from "zustand";
import type { ZoneId } from "@/core/types";

interface OverlayState {
  isOpen: boolean;
  zoneId?: ZoneId;
}

interface UIStore {
  overlay: OverlayState;
  openChallenge: (zoneId: ZoneId) => void;
  closeChallenge: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  overlay: { isOpen: false },
  openChallenge: (zoneId) =>
    set({
      overlay: { isOpen: true, zoneId },
    }),
  closeChallenge: () =>
    set({
      overlay: { isOpen: false },
    }),
}));
