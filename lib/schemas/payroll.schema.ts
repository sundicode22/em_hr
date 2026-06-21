import { z } from "zod";

const moneyField = z
  .string()
  .min(1, "Amount is required")
  .refine((value) => /^\d+(\.\d{1,2})?$/.test(value), {
    message: "Enter a valid amount (e.g. 5000 or 5000.00)",
  })
  .refine((value) => parseFloat(value) >= 0, {
    message: "Amount must be zero or greater",
  });

export const payrollFormSchema = z
  .object({
    employeeId: z.string().min(1, "Select an employee"),
    periodStart: z.string().min(1, "Period start is required"),
    periodEnd: z.string().min(1, "Period end is required"),
    grossPay: moneyField,
    netPay: moneyField,
    status: z.enum(["draft", "processed", "paid"], {
      message: "Select a status",
    }),
  })
  .refine((data) => data.periodEnd >= data.periodStart, {
    message: "Period end must be on or after period start",
    path: ["periodEnd"],
  })
  .refine((data) => parseFloat(data.netPay) <= parseFloat(data.grossPay), {
    message: "Net pay cannot exceed gross pay",
    path: ["netPay"],
  });

export type PayrollFormValues = z.infer<typeof payrollFormSchema>;
