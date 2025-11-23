import { DAILY_NARRATIVE_SCRIPTS } from "@/content/dailyScripts";
import { ZONE_SEQUENCE, zoneById, type DailyChallenge, type ZoneId } from "./types";

const BADGE_POOL = [
  "Éclaireur Solaire",
  "Gardien des Runes",
  "Navigateur Astral",
  "Héraut des Courants",
  "Artisan des Flux",
  "Veilleur des Brumes",
];

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const toStartOfUTCDate = (date: Date) => {
  const utc = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  return utc;
};

const addDays = (date: Date, amount: number) => {
  const copy = new Date(date);
  copy.setUTCDate(copy.getUTCDate() + amount);
  return copy;
};

const createTitle = (zoneId: ZoneId) => {
  const zone = zoneById[zoneId];
  return `Défi quotidien · ${zone.name}`;
};

type NarrativeScript = (typeof DAILY_NARRATIVE_SCRIPTS)[number];

const scriptsByZone = DAILY_NARRATIVE_SCRIPTS.reduce<Record<ZoneId, NarrativeScript[]>>((acc, script) => {
  const list = acc[script.zoneId] ?? [];
  list.push(script);
  acc[script.zoneId] = list;
  return acc;
}, {} as Record<ZoneId, NarrativeScript[]>);

const pickNarrative = (zoneId: ZoneId, seed: number) => {
  const scripts = scriptsByZone[zoneId] ?? DAILY_NARRATIVE_SCRIPTS;
  return scripts[seed % scripts.length];
};

export const generateDailyChallenge = (inputDate = new Date()): DailyChallenge => {
  const dayStart = toStartOfUTCDate(inputDate);
  const id = dayStart.toISOString().slice(0, 10);
  const seed = `${id}-codequest`;
  const hashed = hashString(seed);
  const zoneIndex = hashed % ZONE_SEQUENCE.length;
  const zoneId = ZONE_SEQUENCE[zoneIndex];
  const bonusXp = 80 + (hashed % 90);
  const badgeName = BADGE_POOL[hashed % BADGE_POOL.length];
  const expiresAt = addDays(dayStart, 1).toISOString();
  const narrative = pickNarrative(zoneId, hashed);

  return {
    id,
    zoneId,
    title: createTitle(zoneId),
    bonusXp,
    bonusBadge: badgeName,
    seed,
    expiresAt,
    narrative,
  };
};
