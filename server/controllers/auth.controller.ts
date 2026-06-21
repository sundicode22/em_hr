import { Elysia } from "elysia";
import { error, success } from "@/server/lib/response";
import { getSessionUser } from "@/server/lib/session";

export const authController = new Elysia({ prefix: "/auth" }).get(
  "/me",
  async ({ set }) => {
    const user = await getSessionUser();
    if (!user) {
      set.status = 401;
      return error("UNAUTHORIZED", "Authentication required");
    }
    return success(user);
  },
);
