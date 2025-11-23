import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

const getUserId = (req: Request) => {
  const header = req.headers.get("x-codequest-user");
  if (header) return header;
  const fallback =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("cf-connecting-ip") ??
    "voyageur";
  return `user-${fallback}`;
};

export const createTRPCContext = async ({
  req,
}: FetchCreateContextFnOptions) => {
  const userId = getUserId(req);
  return {
    userId,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
