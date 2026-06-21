import { Elysia, t } from "elysia";
import { error, paginated, parsePagination, success } from "@/server/lib/response";
import { requirePermission } from "@/server/middleware/permission.middleware";
import {
  createEmployee,
  listEmployeesPaginated,
  updateEmployee,
} from "@/server/services/employee.service";
import { PERMISSIONS } from "@/types/permissions";

const employeeBody = t.Object({
  firstName: t.String(),
  lastName: t.String(),
  email: t.String({ format: "email" }),
  department: t.String(),
  jobTitle: t.String(),
  status: t.Union([
    t.Literal("active"),
    t.Literal("inactive"),
    t.Literal("on_leave"),
  ]),
  hireDate: t.String(),
});

export const employeesController = new Elysia({ prefix: "/employees" })
  .use(requirePermission(PERMISSIONS.EMPLOYEES_READ))
  .get(
    "/",
    async ({ query }) => {
      const { page, limit } = parsePagination(query.page, query.limit);
      const result = await listEmployeesPaginated(page, limit);
      return paginated(result.items, result.pagination);
    },
    {
      query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
      }),
    },
  )
  .use(requirePermission(PERMISSIONS.EMPLOYEES_WRITE))
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const employee = await createEmployee(body);
        return success(employee);
      } catch {
        set.status = 500;
        return error("CREATE_FAILED", "Failed to create employee");
      }
    },
    { body: employeeBody },
  )
  .patch(
    "/:id",
    async ({ params, body, set }) => {
      try {
        const employee = await updateEmployee(params.id, body);
        return success(employee);
      } catch (err) {
        if (err instanceof Error && err.message === "NOT_FOUND") {
          set.status = 404;
          return error("NOT_FOUND", "Employee not found");
        }
        set.status = 500;
        return error("UPDATE_FAILED", "Failed to update employee");
      }
    },
    {
      params: t.Object({ id: t.String() }),
      body: employeeBody,
    },
  );
