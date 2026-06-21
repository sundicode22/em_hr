import { Elysia } from "elysia";
import { success } from "@/server/lib/response";
import { authController } from "@/server/controllers/auth.controller";
import { employeesController } from "@/server/controllers/employees.controller";
import { payrollController } from "@/server/controllers/payroll.controller";
import { reportsController } from "@/server/controllers/reports.controller";
import { usersController } from "@/server/controllers/users.controller";
import { workflowsController } from "@/server/controllers/workflows.controller";

export const app = new Elysia({ prefix: "/api", aot: false })
  .get("/health", () =>
    success({ status: "ok", timestamp: new Date().toISOString() }),
  )
  .use(authController)
  .use(usersController)
  .use(reportsController)
  .use(employeesController)
  .use(payrollController)
  .use(workflowsController)
  .onError(({ code, error: err, set }) => {
    if (code === "VALIDATION") {
      set.status = 422;
      return {
        success: false as const,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request",
          details: err.message,
        },
      };
    }

    set.status = 500;
    return {
      success: false as const,
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
      },
    };
  });

export type App = typeof app;
