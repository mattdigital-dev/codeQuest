import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { getDailyChallengeSnapshot, recordDailyChallengeCompletion, getXpLeaderboard, getRetentionMetrics } from "@/db/dailyChallengeRepository";
import { ZONE_SEQUENCE, type ZoneId } from "@/core/types";

const zoneSchema = z.enum(ZONE_SEQUENCE as [ZoneId, ...ZoneId[]]);

export const dailyRouter = router({
  current: publicProcedure.query(async ({ ctx }) => {
    return getDailyChallengeSnapshot(ctx.userId);
  }),
  claim: publicProcedure.input(z.object({ zoneId: zoneSchema })).mutation(async ({ ctx, input }) => {
    const snapshot = await getDailyChallengeSnapshot(ctx.userId);
    if (snapshot.zoneId !== input.zoneId) {
      throw new Error("Le défi quotidien demandé ne correspond pas à celui en cours.");
    }
    const result = await recordDailyChallengeCompletion(ctx.userId);
    return {
      alreadyCompleted: result.alreadyCompleted,
      challenge: result.challenge,
      progress: result.progress,
    };
  }),
  leaderboard: publicProcedure.query(async () => {
    return getXpLeaderboard(10);
  }),
  metrics: publicProcedure.query(async () => {
    return getRetentionMetrics(14);
  }),
});
