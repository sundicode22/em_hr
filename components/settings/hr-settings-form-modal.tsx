"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormField } from "@/components/form/form-field";
import { FormModal } from "@/components/modal";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SelectInput } from "@/components/ui/select-input";
import {
  hrSettingsFormSchema,
  type HrSettingsFormValues,
} from "@/lib/schemas/hr-settings.schema";
import type { HrSettings } from "@/types/hr-settings";

type HrSettingsFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: HrSettings;
  onSave: (settings: HrSettings) => void;
};

export function HrSettingsFormModal({
  open,
  onOpenChange,
  settings,
  onSave,
}: HrSettingsFormModalProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HrSettingsFormValues>({
    resolver: zodResolver(hrSettingsFormSchema),
    defaultValues: settings,
  });

  useEffect(() => {
    if (open) reset(settings);
  }, [open, settings, reset]);

  const onSubmit = handleSubmit(async (values) => {
    onSave(values);
    onOpenChange(false);
  });

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit HR settings"
      description="Update company HR policies and defaults."
      submitLabel="Save settings"
      loading={isSubmitting}
      onSubmit={onSubmit}
    >
      <FieldGroup className="gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="Company name"
            htmlFor="companyName"
            error={errors.companyName?.message}
            className="sm:col-span-2"
          >
            <Input
              id="companyName"
              aria-invalid={!!errors.companyName}
              {...register("companyName")}
            />
          </FormField>
          <FormField
            label="Default work hours (weekly)"
            htmlFor="defaultWorkHours"
            error={errors.defaultWorkHours?.message}
          >
            <Input
              id="defaultWorkHours"
              type="number"
              min="1"
              aria-invalid={!!errors.defaultWorkHours}
              {...register("defaultWorkHours")}
            />
          </FormField>
          <FormField
            label="PTO allowance (days)"
            htmlFor="ptoAllowanceDays"
            error={errors.ptoAllowanceDays?.message}
          >
            <Input
              id="ptoAllowanceDays"
              type="number"
              min="0"
              aria-invalid={!!errors.ptoAllowanceDays}
              {...register("ptoAllowanceDays")}
            />
          </FormField>
          <FormField
            label="Probation period (days)"
            htmlFor="probationPeriodDays"
            error={errors.probationPeriodDays?.message}
          >
            <Input
              id="probationPeriodDays"
              type="number"
              min="0"
              aria-invalid={!!errors.probationPeriodDays}
              {...register("probationPeriodDays")}
            />
          </FormField>
          <FormField
            label="Default currency"
            htmlFor="defaultCurrency"
            error={errors.defaultCurrency?.message}
          >
            <Controller
              name="defaultCurrency"
              control={control}
              render={({ field }) => (
                <SelectInput
                  id="defaultCurrency"
                  aria-invalid={!!errors.defaultCurrency}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </SelectInput>
              )}
            />
          </FormField>
          <FormField
            label="HR contact email"
            htmlFor="hrContactEmail"
            error={errors.hrContactEmail?.message}
            className="sm:col-span-2"
          >
            <Input
              id="hrContactEmail"
              type="email"
              aria-invalid={!!errors.hrContactEmail}
              {...register("hrContactEmail")}
            />
          </FormField>
        </div>
      </FieldGroup>
    </FormModal>
  );
}
