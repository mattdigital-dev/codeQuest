import { router } from "./trpc";
import { progressRouter } from "./routers/progress";
import { telemetryRouter } from "./routers/telemetry";
import { healthRouter } from "./routers/health";

export const appRouter = router({
  progress: progressRouter,
  telemetry: telemetryRouter,
  health: healthRouter,
});

export type AppRouter = typeof appRouter;
