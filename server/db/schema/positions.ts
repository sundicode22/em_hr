import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const positionStatusEnum = pgEnum("position_status", ["open", "closed"]);

export const positions = pgTable("position", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  department: text("department").notNull(),
  colorKey: text("color_key").notNull().default("chart-1"),
  status: positionStatusEnum("status").notNull().default("open"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});
