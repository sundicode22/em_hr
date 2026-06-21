import { jsonb, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { candidates } from "./candidates";

export const pipelineStageEnum = pgEnum("pipeline_stage", [
  "reviewed",
  "accepted",
  "outreached",
  "email_opened",
  "replied",
  "interested",
  "scheduled",
]);

export const pipelineEvents = pgTable("pipeline_event", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  candidateId: text("candidate_id")
    .notNull()
    .references(() => candidates.id, { onDelete: "cascade" }),
  stage: pipelineStageEnum("stage").notNull(),
  occurredAt: timestamp("occurred_at", { mode: "date" }).notNull(),
  metadata: jsonb("metadata"),
});
