import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import {
  getProgressForUser,
  recordChallengeStatus,
  resetProgressForUser,
  upsertProgressForUser,
} from "@/db/progressRepository";
import { ZONE_SEQUENCE, type ZoneId } from "@/core/types";

const zoneSchema = z.enum(ZONE_SEQUENCE as [ZoneId, ...ZoneId[]]);

const progressStateSchema = z.object({
  activeZone: zoneSchema,
  unlockedZones: z.array(zoneSchema),
  completedZones: z.array(zoneSchema),
  lastChallengeId: zoneSchema.optional(),
});

export const progressRouter = router({
  get: publicProcedure.query(async ({ ctx }) => {
    return getProgressForUser(ctx.userId);
  }),
  upsert: publicProcedure.input(progressStateSchema).mutation(async ({ ctx, input }) => {
    const updated = await upsertProgressForUser(ctx.userId, input);
    if (input.lastChallengeId) {
      const success = input.completedZones.includes(input.lastChallengeId);
      await recordChallengeStatus(ctx.userId, input.lastChallengeId, success);
    }
    return updated;
  }),
  reset: publicProcedure.mutation(async ({ ctx }) => {
    return resetProgressForUser(ctx.userId);
  }),
});
