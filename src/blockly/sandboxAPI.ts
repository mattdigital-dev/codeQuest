"use client";

import type { SandboxExecutionResult } from "@/core/types";

export interface SandboxRunOptions {
  code: string;
  timeoutMs?: number;
}

const createWorldAPI = () => {
  const logs: string[] = [];
  const state: Record<string, unknown> = {
    lights: {} as Record<string, boolean>,
    markers: {} as Record<string, { x: number; y: number }>,
    counters: {} as Record<string, number>,
    sequence: [] as string[],
  };

  const api = {
    log: (message: string) => {
      logs.push(message);
    },
    setLightState: (id: string, on: boolean) => {
      (state.lights as Record<string, boolean>)[id] = on;
      logs.push(`Lumière ${id} → ${on ? "ON" : "OFF"}`);
    },
    moveMarker: (id: string, x: number, y: number) => {
      (state.markers as Record<string, { x: number; y: number }>)[id] = { x, y };
      logs.push(`Marqueur ${id} déplacé (${x}, ${y})`);
    },
    incrementCounter: (name: string, delta = 1) => {
      const counters = state.counters as Record<string, number>;
      counters[name] = (counters[name] ?? 0) + delta;
      logs.push(`Compteur ${name} = ${counters[name]}`);
      return counters[name];
    },
    pushEvent: (eventName: string) => {
      (state.sequence as string[]).push(eventName);
      logs.push(`Événement ${eventName}`);
    },
  };

  return { api, logs, state };
};

export const executeBlocklyCode = async ({
  code,
  timeoutMs = 1500,
}: SandboxRunOptions): Promise<SandboxExecutionResult> => {
  const { api, logs, state } = createWorldAPI();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const runner = new Function("world", `"use strict";\n${code}`);
    runner(api);
  } catch (error) {
    logs.push(`Erreur: ${(error as Error).message}`);
  } finally {
    clearTimeout(timer);
  }

  if (controller.signal.aborted) {
    logs.push("Temps d'exécution dépassé");
  }

  return {
    logs,
    state,
    metrics: {
      instructions: code.split("\n").length,
      logCount: logs.length,
    },
  };
};
