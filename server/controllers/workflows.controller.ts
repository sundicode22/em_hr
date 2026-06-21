import { Elysia, t } from "elysia";
import { error, paginated, parsePagination, success } from "@/server/lib/response";
import { requirePermission } from "@/server/middleware/permission.middleware";
import {
  createWorkflow,
  listWorkflowsPaginated,
  updateWorkflow,
} from "@/server/services/workflow.service";
import { PERMISSIONS } from "@/types/permissions";

const workflowBody = t.Object({
  name: t.String(),
  trigger: t.String(),
  action: t.String(),
  enabled: t.Boolean(),
});

export const workflowsController = new Elysia({ prefix: "/workflows" })
  .use(requirePermission(PERMISSIONS.WORKFLOWS_READ))
  .get(
    "/",
    async ({ query }) => {
      const { page, limit } = parsePagination(query.page, query.limit);
      const result = await listWorkflowsPaginated(page, limit);
      return paginated(result.items, result.pagination);
    },
    {
      query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
      }),
    },
  )
  .use(requirePermission(PERMISSIONS.WORKFLOWS_WRITE))
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const workflow = await createWorkflow(body);
        return success(workflow);
      } catch {
        set.status = 500;
        return error("CREATE_FAILED", "Failed to create workflow");
      }
    },
    { body: workflowBody },
  )
  .patch(
    "/:id",
    async ({ params, body, set }) => {
      try {
        const workflow = await updateWorkflow(params.id, body);
        return success(workflow);
      } catch (err) {
        if (err instanceof Error && err.message === "NOT_FOUND") {
          set.status = 404;
          return error("NOT_FOUND", "Workflow not found");
        }
        set.status = 500;
        return error("UPDATE_FAILED", "Failed to update workflow");
      }
    },
    {
      params: t.Object({ id: t.String() }),
      body: workflowBody,
    },
  );
