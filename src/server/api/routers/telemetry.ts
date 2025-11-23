import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { logEvent } from "@/db/progressRepository";

const telemetrySchema = z.object({
  eventType: z.string(),
  payload: z.record(z.any()).optional(),
});

export const telemetryRouter = router({
  emit: publicProcedure.input(telemetrySchema).mutation(async ({ ctx, input }) => {
    await logEvent(ctx.userId, input);
    return { status: "ok" };
  }),
});
