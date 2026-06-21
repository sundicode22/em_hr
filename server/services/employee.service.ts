import { count, desc, eq } from "drizzle-orm";
import { db } from "@/server/db";
import { employees } from "@/server/db/schema";
import { buildPaginationMeta } from "@/server/lib/response";
import type { PaginatedData } from "@/types/api";
import type { Employee, EmployeeInput } from "@/types/employee";

function mapEmployee(row: typeof employees.$inferSelect): Employee {
  return {
    id: row.id,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    department: row.department,
    jobTitle: row.jobTitle,
    status: row.status,
    hireDate: row.hireDate,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function listEmployeesPaginated(
  page: number,
  limit: number,
): Promise<PaginatedData<Employee>> {
  const offset = (page - 1) * limit;
  const [totalRow] = await db.select({ value: count() }).from(employees);
  const total = totalRow?.value ?? 0;

  const rows = await db
    .select()
    .from(employees)
    .orderBy(desc(employees.createdAt))
    .limit(limit)
    .offset(offset);

  return {
    items: rows.map(mapEmployee),
    pagination: buildPaginationMeta(page, limit, total),
  };
}

export async function listAllEmployees(): Promise<Employee[]> {
  const rows = await db
    .select()
    .from(employees)
    .orderBy(desc(employees.createdAt));
  return rows.map(mapEmployee);
}

export async function createEmployee(input: EmployeeInput) {
  const [row] = await db.insert(employees).values(input).returning();
  return mapEmployee(row);
}

export async function updateEmployee(id: string, input: EmployeeInput) {
  const [row] = await db
    .update(employees)
    .set(input)
    .where(eq(employees.id, id))
    .returning();
  if (!row) throw new Error("NOT_FOUND");
  return mapEmployee(row);
}
