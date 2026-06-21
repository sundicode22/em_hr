import { Elysia } from "elysia";
import { getSessionUser } from "@/server/lib/session";
import type { AuthSessionUser } from "@/types/auth";

export const authMiddleware = new Elysia({ name: "auth-middleware" }).derive(
  { as: "scoped" },
  async () => {
    const user = await getSessionUser();
    return { user };
  },
);

export function requireAuth() {
  return new Elysia({ name: "require-auth" })
    .use(authMiddleware)
    .onBeforeHandle((ctx) => {
      const { user, set } = ctx as typeof ctx & { user: AuthSessionUser | null };
      if (!user) {
        set.status = 401;
        return {
          success: false as const,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required",
          },
        };
      }
    });
}
