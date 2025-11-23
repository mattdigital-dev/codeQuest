import type { Vector3Tuple } from "three";

export type ZoneId =
  | "village"
  | "forest"
  | "temple"
  | "forge"
  | "tower"
  | "sanctum";

export interface ZoneDefinition {
  id: ZoneId;
  name: string;
  description: string;
  color: string;
  accent: string;
  radius: number;
  position: Vector3Tuple;
}

export interface ProgressState {
  activeZone: ZoneId;
  unlockedZones: ZoneId[];
  completedZones: ZoneId[];
  lastChallengeId?: ZoneId;
}

export const initialProgressState: ProgressState = {
  activeZone: "village",
  unlockedZones: ["village"],
  completedZones: [],
};

export interface SandboxExecutionResult {
  logs: string[];
  state: Record<string, unknown>;
  metrics: Record<string, number>;
}

export interface ChallengeResult {
  success: boolean;
  message: string;
  reward?: Partial<ProgressState>;
  telemetry?: Record<string, unknown>;
}

export interface ChallengeDefinition {
  id: ZoneId;
  zoneName: string;
  title: string;
  description: string;
  toolboxXml: string;
  starterXml?: string;
  allowedBlocks: string[];
  validate: (result: SandboxExecutionResult) => ChallengeResult;
  hint?: string;
}

export type ChallengeMap = Record<ZoneId, ChallengeDefinition>;

export interface UserProgressPayload extends ProgressState {
  updatedAt: string;
}

export const ZONES: ZoneDefinition[] = [
  {
    id: "village",
    name: "Village de la Logique",
    description: "Apprenez les instructions simples sur la première île paisible.",
    color: "#f7c873",
    accent: "#f6a356",
    radius: 6,
    position: [0, 0, 0],
  },
  {
    id: "forest",
    name: "Forêt des Boucles",
    description: "Découvrez les répétitions régulières au cœur des arbres pastel.",
    color: "#8ed1c2",
    accent: "#5fb39b",
    radius: 5.5,
    position: [14, 0, -4],
  },
  {
    id: "temple",
    name: "Temple des Conditions",
    description: "Utilisez le pouvoir des choix pour révéler les arches flottantes.",
    color: "#c0a3e5",
    accent: "#9a7acc",
    radius: 6,
    position: [26, 0, 2],
  },
  {
    id: "forge",
    name: "Forge des Variables",
    description: "Manipulez la matière des données près des braises sacrées.",
    color: "#f08a8d",
    accent: "#cf5d63",
    radius: 5.5,
    position: [38, 0, -6],
  },
  {
    id: "tower",
    name: "Tour des Événements",
    description: "Répondez aux signaux lumineux qui rythment la tour céleste.",
    color: "#7fb2ff",
    accent: "#4a89e8",
    radius: 5.5,
    position: [50, 0, 0],
  },
  {
    id: "sanctum",
    name: "Sanctuaire Final",
    description: "Combinez toutes les notions dans ce sanctuaire suspendu.",
    color: "#f6e7c1",
    accent: "#d7c291",
    radius: 7,
    position: [64, 0, -3],
  },
];

export const ZONE_SEQUENCE: ZoneId[] = ZONES.map((zone) => zone.id);

export const zoneById = Object.fromEntries(
  ZONES.map((zone) => [zone.id, zone]),
) as Record<ZoneId, ZoneDefinition>;
