import { boolean, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const workflows = pgTable("workflow", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  trigger: text("trigger").notNull(),
  action: text("action").notNull(),
  enabled: boolean("enabled").notNull().default(true),
  config: jsonb("config"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});
