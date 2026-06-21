import { Elysia, t } from "elysia";
import { error, paginated, parsePagination, success } from "@/server/lib/response";
import { requirePermission } from "@/server/middleware/permission.middleware";
import {
  createPayrollRecord,
  listPayrollPaginated,
  updatePayrollRecord,
} from "@/server/services/payroll.service";
import { PERMISSIONS } from "@/types/permissions";

const payrollBody = t.Object({
  employeeId: t.String(),
  periodStart: t.String(),
  periodEnd: t.String(),
  grossPay: t.String(),
  netPay: t.String(),
  status: t.Union([
    t.Literal("draft"),
    t.Literal("processed"),
    t.Literal("paid"),
  ]),
});

export const payrollController = new Elysia({ prefix: "/payroll" })
  .use(requirePermission(PERMISSIONS.PAYROLL_READ))
  .get(
    "/",
    async ({ query }) => {
      const { page, limit } = parsePagination(query.page, query.limit);
      const result = await listPayrollPaginated(page, limit);
      return paginated(result.items, result.pagination);
    },
    {
      query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
      }),
    },
  )
  .use(requirePermission(PERMISSIONS.PAYROLL_WRITE))
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const record = await createPayrollRecord(body);
        return success(record);
      } catch (err) {
        if (err instanceof Error && err.message === "EMPLOYEE_NOT_FOUND") {
          set.status = 400;
          return error("EMPLOYEE_NOT_FOUND", "Employee not found");
        }
        set.status = 500;
        return error("CREATE_FAILED", "Failed to create payroll record");
      }
    },
    { body: payrollBody },
  )
  .patch(
    "/:id",
    async ({ params, body, set }) => {
      try {
        const record = await updatePayrollRecord(params.id, body);
        return success(record);
      } catch (err) {
        if (err instanceof Error && err.message === "NOT_FOUND") {
          set.status = 404;
          return error("NOT_FOUND", "Payroll record not found");
        }
        set.status = 500;
        return error("UPDATE_FAILED", "Failed to update payroll record");
      }
    },
    {
      params: t.Object({ id: t.String() }),
      body: payrollBody,
    },
  );
