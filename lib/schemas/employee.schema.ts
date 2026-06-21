import { z } from "zod";

export const employeeFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name is too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name is too long"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  department: z.string().min(1, "Department is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  status: z.enum(["active", "inactive", "on_leave"], {
    message: "Select a status",
  }),
  hireDate: z.string().min(1, "Hire date is required"),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
