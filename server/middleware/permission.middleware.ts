import { Elysia } from "elysia";
import { requireAuth } from "@/server/middleware/auth.middleware";
import type { AuthSessionUser } from "@/types/auth";
import type { PermissionName } from "@/types/permissions";

export function requirePermission(permission: PermissionName) {
  return new Elysia({ name: `permission-${permission}` })
    .use(requireAuth())
    .onBeforeHandle((ctx) => {
      const { user, set } = ctx as typeof ctx & {
        user: AuthSessionUser | null;
      };
      if (!user?.permissions.includes(permission)) {
        set.status = 403;
        return {
          success: false as const,
          error: {
            code: "FORBIDDEN",
            message: `Missing permission: ${permission}`,
          },
        };
      }
    });
}
