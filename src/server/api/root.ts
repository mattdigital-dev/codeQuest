import { router } from "./trpc";
import { progressRouter } from "./routers/progress";
import { telemetryRouter } from "./routers/telemetry";
import { healthRouter } from "./routers/health";
import { dailyRouter } from "./routers/daily";

export const appRouter = router({
  progress: progressRouter,
  telemetry: telemetryRouter,
  health: healthRouter,
  daily: dailyRouter,
});

export type AppRouter = typeof appRouter;
