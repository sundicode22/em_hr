import { z } from "zod";

const positiveIntString = (label: string) =>
  z
    .string()
    .min(1, `${label} is required`)
    .refine((value) => /^\d+$/.test(value), {
      message: `${label} must be a whole number`,
    })
    .refine((value) => parseInt(value, 10) >= 0, {
      message: `${label} must be zero or greater`,
    });

export const hrSettingsFormSchema = z.object({
  companyName: z.string().min(1, "Company name is required").max(200),
  defaultWorkHours: positiveIntString("Work hours").refine(
    (value) => parseInt(value, 10) > 0,
    { message: "Work hours must be greater than zero" },
  ),
  ptoAllowanceDays: positiveIntString("PTO allowance"),
  probationPeriodDays: positiveIntString("Probation period"),
  defaultCurrency: z.enum(["USD", "EUR", "GBP"], {
    message: "Select a currency",
  }),
  hrContactEmail: z
    .string()
    .min(1, "HR contact email is required")
    .email("Enter a valid email"),
});

export type HrSettingsFormValues = z.infer<typeof hrSettingsFormSchema>;
