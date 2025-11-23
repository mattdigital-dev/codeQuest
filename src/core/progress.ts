"use client";

import {
  ZONE_SEQUENCE,
  initialProgressState,
  type ChallengeReward,
  type ProgressState,
  type ZoneId,
} from "./types";

export const PROGRESS_STORAGE_KEY = "codequest:progress";

export const getInitialProgress = (): ProgressState => ({
  ...initialProgressState,
});

export const normalizeProgress = (input?: ProgressState | null): ProgressState => {
  if (!input) {
    return getInitialProgress();
  }

  const unlocked = [...new Set(input.unlockedZones)];
  const completed = [...new Set(input.completedZones)].filter((zone) =>
    unlocked.includes(zone),
  );

  const active = input.activeZone ?? unlocked[0] ?? "village";
  const xp = Math.max(0, input.xp ?? 0);
  const badges = [...new Set(input.badges ?? [])];

  return {
    activeZone: active,
    unlockedZones: unlocked,
    completedZones: completed,
    lastChallengeId: input.lastChallengeId,
    xp,
    badges,
  };
};

export const zoneAfter = (zoneId: ZoneId): ZoneId | undefined => {
  const index = ZONE_SEQUENCE.indexOf(zoneId);
  if (index === -1) return undefined;
  return ZONE_SEQUENCE[index + 1];
};

export const applyChallengeSuccess = (
  current: ProgressState,
  zoneId: ZoneId,
  reward?: ChallengeReward,
): ProgressState => {
  const completed = current.completedZones.includes(zoneId)
    ? current.completedZones
    : [...current.completedZones, zoneId];

  const nextZone = zoneAfter(zoneId);
  const unlocked = nextZone && !current.unlockedZones.includes(nextZone)
    ? [...current.unlockedZones, nextZone]
    : current.unlockedZones;

  const activeZone =
    nextZone ??
    zoneId ??
    current.activeZone;

  const alreadyCompleted = current.completedZones.includes(zoneId);
  const rewardXp = !alreadyCompleted ? reward?.xp ?? 0 : 0;
  const nextBadges =
    !alreadyCompleted && reward?.badge && !current.badges.includes(reward.badge)
      ? [...current.badges, reward.badge]
      : current.badges;

  return normalizeProgress({
    activeZone,
    unlockedZones: unlocked,
    completedZones: completed,
    lastChallengeId: zoneId,
    xp: current.xp + rewardXp,
    badges: nextBadges,
  });
};

export const setActiveZone = (
  current: ProgressState,
  zoneId: ZoneId,
): ProgressState => {
  if (!current.unlockedZones.includes(zoneId)) {
    return current;
  }
  return {
    ...current,
    activeZone: zoneId,
  };
};
