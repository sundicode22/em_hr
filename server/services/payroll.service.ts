import { count, desc, eq } from "drizzle-orm";
import { db } from "@/server/db";
import { employees, payrollRecords } from "@/server/db/schema";
import { buildPaginationMeta } from "@/server/lib/response";
import type { PaginatedData } from "@/types/api";
import type { PayrollInput, PayrollRecord } from "@/types/payroll";

function mapPayroll(
  row: typeof payrollRecords.$inferSelect & {
    firstName: string;
    lastName: string;
  },
): PayrollRecord {
  return {
    id: row.id,
    employeeId: row.employeeId,
    employeeName: `${row.firstName} ${row.lastName}`,
    periodStart: row.periodStart,
    periodEnd: row.periodEnd,
    grossPay: row.grossPay,
    netPay: row.netPay,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function listPayrollPaginated(
  page: number,
  limit: number,
): Promise<PaginatedData<PayrollRecord>> {
  const offset = (page - 1) * limit;
  const [totalRow] = await db.select({ value: count() }).from(payrollRecords);
  const total = totalRow?.value ?? 0;

  const rows = await db
    .select({
      id: payrollRecords.id,
      employeeId: payrollRecords.employeeId,
      firstName: employees.firstName,
      lastName: employees.lastName,
      periodStart: payrollRecords.periodStart,
      periodEnd: payrollRecords.periodEnd,
      grossPay: payrollRecords.grossPay,
      netPay: payrollRecords.netPay,
      status: payrollRecords.status,
      createdAt: payrollRecords.createdAt,
    })
    .from(payrollRecords)
    .innerJoin(employees, eq(payrollRecords.employeeId, employees.id))
    .orderBy(desc(payrollRecords.createdAt))
    .limit(limit)
    .offset(offset);

  return {
    items: rows.map(mapPayroll),
    pagination: buildPaginationMeta(page, limit, total),
  };
}

export async function createPayrollRecord(input: PayrollInput) {
  const [employee] = await db
    .select()
    .from(employees)
    .where(eq(employees.id, input.employeeId))
    .limit(1);
  if (!employee) throw new Error("EMPLOYEE_NOT_FOUND");

  const [row] = await db.insert(payrollRecords).values(input).returning();
  return mapPayroll({ ...row, firstName: employee.firstName, lastName: employee.lastName });
}

export async function updatePayrollRecord(id: string, input: PayrollInput) {
  const [employee] = await db
    .select()
    .from(employees)
    .where(eq(employees.id, input.employeeId))
    .limit(1);
  if (!employee) throw new Error("EMPLOYEE_NOT_FOUND");

  const [row] = await db
    .update(payrollRecords)
    .set(input)
    .where(eq(payrollRecords.id, id))
    .returning();
  if (!row) throw new Error("NOT_FOUND");
  return mapPayroll({ ...row, firstName: employee.firstName, lastName: employee.lastName });
}
