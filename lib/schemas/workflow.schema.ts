import { z } from "zod";

export const workflowFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(200, "Name is too long"),
  trigger: z.string().min(1, "Trigger is required"),
  action: z.string().min(1, "Action is required"),
  enabled: z.boolean(),
});

export type WorkflowFormValues = z.infer<typeof workflowFormSchema>;
