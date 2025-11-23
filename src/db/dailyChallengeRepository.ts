import { prisma } from "./client";
import { generateDailyChallenge } from "@/core/dailyChallenges";
import { getProgressForUser, upsertProgressForUser } from "./progressRepository";
import type {
  DailyChallenge,
  DailyChallengeSnapshot,
  LeaderboardEntry,
  RetentionMetrics,
} from "@/core/types";

const toChallengeDate = (challenge: DailyChallenge) => new Date(`${challenge.id}T00:00:00.000Z`);

export const getDailyChallengeSnapshot = async (
  userId: string,
  date = new Date(),
): Promise<DailyChallengeSnapshot> => {
  const challenge = generateDailyChallenge(date);
  const completion = await prisma.dailyChallengeResult.findUnique({
    where: {
      userId_challengeDate: {
        userId,
        challengeDate: toChallengeDate(challenge),
      },
    },
  });
  return {
    ...challenge,
    alreadyCompleted: Boolean(completion),
  };
};

export const recordDailyChallengeCompletion = async (
  userId: string,
  date = new Date(),
) => {
  const challenge = generateDailyChallenge(date);
  const challengeDate = toChallengeDate(challenge);
  const existing = await prisma.dailyChallengeResult.findUnique({
    where: {
      userId_challengeDate: {
        userId,
        challengeDate,
      },
    },
  });
  if (existing) {
    const progress = await getProgressForUser(userId);
    return {
      alreadyCompleted: true,
      challenge,
      progress,
    };
  }

  const currentProgress = await getProgressForUser(userId);
  const nextBadges =
    challenge.bonusBadge && !currentProgress.badges.includes(challenge.bonusBadge)
      ? [...currentProgress.badges, challenge.bonusBadge]
      : currentProgress.badges;
  const nextProgress = await upsertProgressForUser(userId, {
    ...currentProgress,
    xp: currentProgress.xp + challenge.bonusXp,
    badges: nextBadges,
  });

  await prisma.dailyChallengeResult.create({
    data: {
      userId,
      challengeId: challenge.zoneId,
      challengeDate,
      bonusXp: challenge.bonusXp,
      rewardBadge: challenge.bonusBadge,
    },
  });

  return {
    alreadyCompleted: false,
    challenge,
    progress: nextProgress,
  };
};

export const getXpLeaderboard = async (limit = 10): Promise<LeaderboardEntry[]> => {
  const rows = await prisma.progress.findMany({
    orderBy: [
      {
        xp: "desc",
      },
      {
        updatedAt: "asc",
      },
    ],
    take: limit,
    include: {
      user: true,
    },
  });

  return rows.map((row, index) => ({
    userId: row.userId,
    displayName: row.user?.displayName ?? null,
    xp: row.xp,
    badges: row.badges,
    rank: index + 1,
  }));
};

export const getRetentionMetrics = async (windowDays = 7): Promise<RetentionMetrics> => {
  const now = new Date();
  const since = new Date(now);
  since.setUTCDate(since.getUTCDate() - (windowDays - 1));

  const raw = await prisma.dailyChallengeResult.findMany({
    where: {
      challengeDate: {
        gte: since,
      },
    },
    select: {
      challengeDate: true,
      userId: true,
    },
    orderBy: {
      challengeDate: "asc",
    },
  });

  const breakdownMap = new Map<
    string,
    {
      completions: number;
      users: Set<string>;
    }
  >();

  raw.forEach((entry) => {
    const key = entry.challengeDate.toISOString().slice(0, 10);
    if (!breakdownMap.has(key)) {
      breakdownMap.set(key, { completions: 0, users: new Set() });
    }
    const bucket = breakdownMap.get(key)!;
    bucket.completions += 1;
    bucket.users.add(entry.userId);
  });

  const dailyBreakdown = Array.from(breakdownMap.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, bucket]) => ({
      date,
      completions: bucket.completions,
      uniquePlayers: bucket.users.size,
    }));

  const totalCompletions = raw.length;
  const uniquePlayers = new Set(raw.map((entry) => entry.userId)).size;
  const activePlayers = await prisma.progress.count({
    where: {
      xp: {
        gt: 0,
      },
    },
  });

  const completionRate =
    activePlayers > 0 ? Math.round((totalCompletions / activePlayers) * 1000) / 10 / windowDays : undefined;

  return {
    windowDays,
    totalCompletions,
    uniquePlayers,
    dailyBreakdown,
    completionRate,
  };
};
