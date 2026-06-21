import { count, desc, eq } from "drizzle-orm";
import { db } from "@/server/db";
import { workflows } from "@/server/db/schema";
import { buildPaginationMeta } from "@/server/lib/response";
import type { PaginatedData } from "@/types/api";
import type { Workflow, WorkflowInput } from "@/types/workflow";

function mapWorkflow(row: typeof workflows.$inferSelect): Workflow {
  return {
    id: row.id,
    name: row.name,
    trigger: row.trigger,
    action: row.action,
    enabled: row.enabled,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function listWorkflowsPaginated(
  page: number,
  limit: number,
): Promise<PaginatedData<Workflow>> {
  const offset = (page - 1) * limit;
  const [totalRow] = await db.select({ value: count() }).from(workflows);
  const total = totalRow?.value ?? 0;

  const rows = await db
    .select()
    .from(workflows)
    .orderBy(desc(workflows.createdAt))
    .limit(limit)
    .offset(offset);

  return {
    items: rows.map(mapWorkflow),
    pagination: buildPaginationMeta(page, limit, total),
  };
}

export async function createWorkflow(input: WorkflowInput) {
  const [row] = await db.insert(workflows).values(input).returning();
  return mapWorkflow(row);
}

export async function updateWorkflow(id: string, input: WorkflowInput) {
  const [row] = await db
    .update(workflows)
    .set(input)
    .where(eq(workflows.id, id))
    .returning();
  if (!row) throw new Error("NOT_FOUND");
  return mapWorkflow(row);
}
