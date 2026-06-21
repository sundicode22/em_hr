"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormField } from "@/components/form/form-field";
import { FormModal } from "@/components/modal";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  useCreateWorkflow,
  useUpdateWorkflow,
} from "@/hooks/api/use-workflows";
import {
  workflowFormSchema,
  type WorkflowFormValues,
} from "@/lib/schemas/workflow.schema";
import type { Workflow } from "@/types/workflow";
import {
  emptyWorkflowForm,
  workflowToFormValues,
} from "@/types/workflow";

type WorkflowFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflow?: Workflow | null;
};

export function WorkflowFormModal({
  open,
  onOpenChange,
  workflow,
}: WorkflowFormModalProps) {
  const isEdit = Boolean(workflow);
  const createWorkflow = useCreateWorkflow();
  const updateWorkflow = useUpdateWorkflow();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WorkflowFormValues>({
    resolver: zodResolver(workflowFormSchema),
    defaultValues: emptyWorkflowForm,
  });

  useEffect(() => {
    if (open) {
      reset(workflow ? workflowToFormValues(workflow) : emptyWorkflowForm);
      setApiError(null);
    }
  }, [open, workflow, reset]);

  const loading = createWorkflow.isPending || updateWorkflow.isPending;

  const onSubmit = handleSubmit(async (values) => {
    setApiError(null);
    try {
      if (isEdit && workflow) {
        await updateWorkflow.mutateAsync({ id: workflow.id, input: values });
      } else {
        await createWorkflow.mutateAsync(values);
      }
      onOpenChange(false);
    } catch {
      setApiError("Failed to save workflow. Please check the form and try again.");
    }
  });

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit workflow" : "Add workflow"}
      description={
        isEdit
          ? "Update automation workflow settings."
          : "Configure a new automation workflow."
      }
      submitLabel={isEdit ? "Update" : "Create"}
      loading={loading}
      onSubmit={onSubmit}
    >
      <FieldGroup className="gap-5">
        {apiError ? <p className="text-sm text-destructive">{apiError}</p> : null}
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="Name"
            htmlFor="name"
            error={errors.name?.message}
            className="sm:col-span-2"
          >
            <Input
              id="name"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
          </FormField>
          <FormField label="Trigger" htmlFor="trigger" error={errors.trigger?.message}>
            <Input
              id="trigger"
              placeholder="e.g. candidate.stage_changed"
              aria-invalid={!!errors.trigger}
              {...register("trigger")}
            />
          </FormField>
          <FormField label="Action" htmlFor="action" error={errors.action?.message}>
            <Input
              id="action"
              placeholder="e.g. send_email"
              aria-invalid={!!errors.action}
              {...register("action")}
            />
          </FormField>
          <Field className="sm:col-span-2">
            <Controller
              name="enabled"
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    onBlur={field.onBlur}
                    className="size-4 rounded border-input"
                  />
                  <FieldLabel className="cursor-pointer">Enabled</FieldLabel>
                </label>
              )}
            />
          </Field>
        </div>
      </FieldGroup>
    </FormModal>
  );
}
