import { Elysia, t } from "elysia";
import { paginated, parsePagination } from "@/server/lib/response";
import { requirePermission } from "@/server/middleware/permission.middleware";
import { listUsersPaginated } from "@/server/services/user.service";
import { PERMISSIONS } from "@/types/permissions";

export const usersController = new Elysia({ prefix: "/users" })
  .use(requirePermission(PERMISSIONS.USERS_READ))
  .get(
    "/",
    async ({ query }) => {
      const { page, limit, offset } = parsePagination(query.page, query.limit);
      const result = await listUsersPaginated(page, limit, offset);
      return paginated(result.items, result.pagination);
    },
    {
      query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
      }),
    },
  );
