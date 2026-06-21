import { Elysia, t } from "elysia";
import { paginated, parsePagination, success } from "@/server/lib/response";
import { requirePermission } from "@/server/middleware/permission.middleware";
import {
  getPipelineOverview,
  getPositionActivity,
  listPositionOptions,
} from "@/server/services/report.service";
import { PERMISSIONS } from "@/types/permissions";

const reportQuery = t.Object({
  from: t.Optional(t.String()),
  to: t.Optional(t.String()),
  granularity: t.Optional(
    t.Union([t.Literal("weekly"), t.Literal("monthly"), t.Literal("daily")]),
  ),
  positionIds: t.Optional(t.String()),
  search: t.Optional(t.String()),
});

export const reportsController = new Elysia({ prefix: "/reports" })
  .use(requirePermission(PERMISSIONS.REPORTS_READ))
  .get(
    "/pipeline/overview",
    async ({ query }) => {
      const data = await getPipelineOverview({
        from: query.from,
        to: query.to,
        granularity: query.granularity,
        positionIds: query.positionIds,
      });
      return success(data);
    },
    { query: reportQuery },
  )
  .get(
    "/pipeline/positions",
    async ({ query }) => {
      const { page, limit } = parsePagination(query.page, query.limit);
      const result = await getPositionActivity(
        {
          from: query.from,
          to: query.to,
          granularity: query.granularity,
          positionIds: query.positionIds,
          search: query.search,
        },
        page,
        limit,
      );
      return paginated(result.items, result.pagination);
    },
    {
      query: t.Object({
        from: t.Optional(t.String()),
        to: t.Optional(t.String()),
        granularity: t.Optional(
          t.Union([t.Literal("weekly"), t.Literal("monthly"), t.Literal("daily")]),
        ),
        positionIds: t.Optional(t.String()),
        search: t.Optional(t.String()),
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
      }),
    },
  )
  .get("/pipeline/positions/options", async () => {
    const options = await listPositionOptions();
    return success(options);
  });
