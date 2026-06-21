import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { positions } from "./positions";

export const candidates = pgTable("candidate", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  positionId: text("position_id")
    .notNull()
    .references(() => positions.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  source: text("source").notNull().default("linkedin"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});
