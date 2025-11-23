"use client";

import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "@/server/api/root";
import {
  PROGRESS_STORAGE_KEY,
  getInitialProgress,
  normalizeProgress,
} from "./progress";
import type { ProgressState } from "./types";

let browserClient:
  | ReturnType<typeof createTRPCClient<AppRouter>>
  | null = null;

const getClient = () => {
  if (typeof window === "undefined") {
    throw new Error("Progress persistence ne peut s'exécuter que côté client.");
  }
  if (!browserClient) {
    browserClient = createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: "/api/trpc",
        }),
      ],
      transformer: superjson,
    });
  }
  return browserClient;
};

export const readCachedProgress = (): ProgressState => {
  if (typeof window === "undefined") {
    return getInitialProgress();
  }
  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) {
      return getInitialProgress();
    }
    return normalizeProgress(JSON.parse(raw) as ProgressState);
  } catch (error) {
    console.warn("Impossible de lire la progression locale", error);
    return getInitialProgress();
  }
};

export const writeCachedProgress = (state: ProgressState) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify(state),
    );
  } catch (error) {
    console.warn("Impossible d'écrire la progression locale", error);
  }
};

export const loadServerProgress = async (): Promise<ProgressState> => {
  const client = getClient();
  const payload = await client.progress.get.query();
  return normalizeProgress(payload);
};

export const pushServerProgress = async (
  state: ProgressState,
): Promise<ProgressState> => {
  const client = getClient();
  const updated = await client.progress.upsert.mutate(state);
  writeCachedProgress(updated);
  return normalizeProgress(updated);
};

export const resetServerProgress = async (): Promise<ProgressState> => {
  const client = getClient();
  const reset = await client.progress.reset.mutate();
  writeCachedProgress(reset);
  return normalizeProgress(reset);
};
