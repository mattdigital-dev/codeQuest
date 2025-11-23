import { NextResponse } from "next/server";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import type { ProgressState } from "@/core/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const ctx = await createTRPCContext({ req: request });
  const caller = appRouter.createCaller(ctx);
  const progress = await caller.progress.get();
  return NextResponse.json(progress);
}

export async function POST(request: Request) {
  const ctx = await createTRPCContext({ req: request });
  const caller = appRouter.createCaller(ctx);
  const payload = (await request.json()) as ProgressState;
  const updated = await caller.progress.upsert(payload);
  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  const ctx = await createTRPCContext({ req: request });
  const caller = appRouter.createCaller(ctx);
  const reset = await caller.progress.reset();
  return NextResponse.json(reset);
}
