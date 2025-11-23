import { prisma } from "./client";
import { getInitialProgress, normalizeProgress } from "@/core/progress";
import type { ProgressState, ZoneId } from "@/core/types";

const baseSelect = {
  userId: true,
  unlockedZones: true,
  completedZones: true,
  activeZone: true,
  lastChallengeId: true,
  xp: true,
  badges: true,
  updatedAt: true,
};

const ensureUserExists = async (userId: string) => {
  await prisma.user.upsert({
    where: { id: userId },
    create: {
      id: userId,
    },
    update: {},
  });
};

const coerceState = (payload?: {
  unlockedZones: string[];
  completedZones: string[];
  activeZone: string | null;
  lastChallengeId: string | null;
  xp: number;
  badges: string[];
}): ProgressState => {
  if (!payload) {
    return getInitialProgress();
  }
  return normalizeProgress({
    activeZone: (payload.activeZone ?? "village") as ZoneId,
    unlockedZones: (payload.unlockedZones ?? ["village"]) as ZoneId[],
    completedZones: (payload.completedZones ?? []) as ZoneId[],
    lastChallengeId: payload.lastChallengeId as ZoneId | undefined,
    xp: payload.xp ?? 0,
    badges: payload.badges ?? [],
  });
};

export const getProgressForUser = async (
  userId: string,
): Promise<ProgressState> => {
  await ensureUserExists(userId);
  const progress = await prisma.progress.findUnique({
    where: { userId },
    select: baseSelect,
  });

  if (!progress) {
    const initial = getInitialProgress();
    await prisma.progress.create({
      data: {
        userId,
        unlockedZones: initial.unlockedZones,
        completedZones: initial.completedZones,
        activeZone: initial.activeZone,
          xp: initial.xp,
          badges: initial.badges,
      },
    });
    return initial;
  }

  return coerceState(progress);
};

export const upsertProgressForUser = async (
  userId: string,
  state: ProgressState,
): Promise<ProgressState> => {
  const payload = await prisma.progress.upsert({
    where: { userId },
    update: {
      unlockedZones: state.unlockedZones,
      completedZones: state.completedZones,
      activeZone: state.activeZone,
      lastChallengeId: state.lastChallengeId,
        xp: state.xp,
        badges: state.badges,
    },
    create: {
      userId,
      unlockedZones: state.unlockedZones,
      completedZones: state.completedZones,
      activeZone: state.activeZone,
      lastChallengeId: state.lastChallengeId,
        xp: state.xp,
        badges: state.badges,
    },
    select: baseSelect,
  });

  return coerceState(payload);
};

export const resetProgressForUser = async (
  userId: string,
): Promise<ProgressState> => {
  const initial = getInitialProgress();
  await prisma.progress.upsert({
    where: { userId },
    update: {
      unlockedZones: initial.unlockedZones,
      completedZones: initial.completedZones,
      activeZone: initial.activeZone,
      lastChallengeId: initial.lastChallengeId ?? null,
        xp: initial.xp,
        badges: initial.badges,
    },
    create: {
      userId,
      unlockedZones: initial.unlockedZones,
      completedZones: initial.completedZones,
      activeZone: initial.activeZone,
        xp: initial.xp,
        badges: initial.badges,
    },
  });
  await prisma.challengeStatus.deleteMany({
    where: { userId },
  });
  return initial;
};

export const recordChallengeStatus = async (
  userId: string,
  challengeId: ZoneId,
  success: boolean,
) => {
  await prisma.challengeStatus.upsert({
    where: {
      userId_challengeId: { userId, challengeId },
    },
    update: {
      status: success ? "completed" : "attempted",
      completedAt: success ? new Date() : null,
      attempts: { increment: 1 },
    },
    create: {
      userId,
      challengeId,
      status: success ? "completed" : "attempted",
      attempts: 1,
      completedAt: success ? new Date() : null,
    },
  });
};

export interface TelemetryPayload {
  eventType: string;
  payload?: Record<string, unknown>;
}

export const logEvent = async (userId: string, event: TelemetryPayload) => {
  await prisma.eventLog.create({
    data: {
      userId,
      eventType: event.eventType,
      payload: event.payload ?? {},
    },
  });
};
