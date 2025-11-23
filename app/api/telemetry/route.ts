import { NextResponse } from "next/server";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const ctx = await createTRPCContext({ req: request });
  const caller = appRouter.createCaller(ctx);
  const payload = await request.json();
  await caller.telemetry.emit(payload);
  return NextResponse.json({ status: "ok" });
}
