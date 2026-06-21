"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormField } from "@/components/form/form-field";
import { FormModal } from "@/components/modal";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SelectInput } from "@/components/ui/select-input";
import { useEmployeeOptions } from "@/hooks/api/use-employees";
import {
  useCreatePayroll,
  useUpdatePayroll,
} from "@/hooks/api/use-payroll";
import {
  payrollFormSchema,
  type PayrollFormValues,
} from "@/lib/schemas/payroll.schema";
import type { PayrollRecord } from "@/types/payroll";
import {
  emptyPayrollForm,
  payrollToFormValues,
} from "@/types/payroll";

type PayrollFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record?: PayrollRecord | null;
};

export function PayrollFormModal({
  open,
  onOpenChange,
  record,
}: PayrollFormModalProps) {
  const isEdit = Boolean(record);
  const createPayroll = useCreatePayroll();
  const updatePayroll = useUpdatePayroll();
  const { data: employees } = useEmployeeOptions();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PayrollFormValues>({
    resolver: zodResolver(payrollFormSchema),
    defaultValues: emptyPayrollForm,
  });

  useEffect(() => {
    if (open) {
      reset(record ? payrollToFormValues(record) : emptyPayrollForm);
      setApiError(null);
    }
  }, [open, record, reset]);

  const loading = createPayroll.isPending || updatePayroll.isPending;

  const onSubmit = handleSubmit(async (values) => {
    setApiError(null);
    try {
      if (isEdit && record) {
        await updatePayroll.mutateAsync({ id: record.id, input: values });
      } else {
        await createPayroll.mutateAsync(values);
      }
      onOpenChange(false);
    } catch {
      setApiError(
        "Failed to save payroll record. Please check the form and try again.",
      );
    }
  });

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit payroll record" : "Add payroll record"}
      description={
        isEdit
          ? "Update payroll details below."
          : "Enter details for the new payroll record."
      }
      submitLabel={isEdit ? "Update" : "Create"}
      loading={loading}
      onSubmit={onSubmit}
    >
      <FieldGroup className="gap-5">
        {apiError ? <p className="text-sm text-destructive">{apiError}</p> : null}
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="Employee"
            htmlFor="employeeId"
            error={errors.employeeId?.message}
            className="sm:col-span-2"
          >
            <Controller
              name="employeeId"
              control={control}
              render={({ field }) => (
                <SelectInput
                  id="employeeId"
                  aria-invalid={!!errors.employeeId}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                >
                  <option value="">Select employee</option>
                  {employees?.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName}
                    </option>
                  ))}
                </SelectInput>
              )}
            />
          </FormField>
          <FormField
            label="Period start"
            htmlFor="periodStart"
            error={errors.periodStart?.message}
          >
            <Input
              id="periodStart"
              type="date"
              aria-invalid={!!errors.periodStart}
              {...register("periodStart")}
            />
          </FormField>
          <FormField
            label="Period end"
            htmlFor="periodEnd"
            error={errors.periodEnd?.message}
          >
            <Input
              id="periodEnd"
              type="date"
              aria-invalid={!!errors.periodEnd}
              {...register("periodEnd")}
            />
          </FormField>
          <FormField
            label="Gross pay"
            htmlFor="grossPay"
            error={errors.grossPay?.message}
          >
            <Input
              id="grossPay"
              type="number"
              step="0.01"
              min="0"
              aria-invalid={!!errors.grossPay}
              {...register("grossPay")}
            />
          </FormField>
          <FormField label="Net pay" htmlFor="netPay" error={errors.netPay?.message}>
            <Input
              id="netPay"
              type="number"
              step="0.01"
              min="0"
              aria-invalid={!!errors.netPay}
              {...register("netPay")}
            />
          </FormField>
          <FormField label="Status" htmlFor="payrollStatus" error={errors.status?.message}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <SelectInput
                  id="payrollStatus"
                  aria-invalid={!!errors.status}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                >
                  <option value="draft">Draft</option>
                  <option value="processed">Processed</option>
                  <option value="paid">Paid</option>
                </SelectInput>
              )}
            />
          </FormField>
        </div>
      </FieldGroup>
    </FormModal>
  );
}
