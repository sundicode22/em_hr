import { date, numeric, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { employees } from "./employees";

export const payrollStatusEnum = pgEnum("payroll_status", [
  "draft",
  "processed",
  "paid",
]);

export const payrollRecords = pgTable("payroll_record", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  employeeId: text("employee_id")
    .notNull()
    .references(() => employees.id, { onDelete: "cascade" }),
  periodStart: date("period_start").notNull(),
  periodEnd: date("period_end").notNull(),
  grossPay: numeric("gross_pay", { precision: 12, scale: 2 }).notNull(),
  netPay: numeric("net_pay", { precision: 12, scale: 2 }).notNull(),
  status: payrollStatusEnum("status").notNull().default("draft"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});
