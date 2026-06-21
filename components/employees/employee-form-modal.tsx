"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormField } from "@/components/form/form-field";
import { FormModal } from "@/components/modal";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SelectInput } from "@/components/ui/select-input";
import {
  useCreateEmployee,
  useUpdateEmployee,
} from "@/hooks/api/use-employees";
import {
  employeeFormSchema,
  type EmployeeFormValues,
} from "@/lib/schemas/employee.schema";
import type { Employee } from "@/types/employee";
import {
  emptyEmployeeForm,
  employeeToFormValues,
} from "@/types/employee";

type EmployeeFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: Employee | null;
};

export function EmployeeFormModal({
  open,
  onOpenChange,
  employee,
}: EmployeeFormModalProps) {
  const isEdit = Boolean(employee);
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: emptyEmployeeForm,
  });

  useEffect(() => {
    if (open) {
      reset(employee ? employeeToFormValues(employee) : emptyEmployeeForm);
      setApiError(null);
    }
  }, [open, employee, reset]);

  const loading = createEmployee.isPending || updateEmployee.isPending;

  const onSubmit = handleSubmit(async (values) => {
    setApiError(null);
    try {
      if (isEdit && employee) {
        await updateEmployee.mutateAsync({ id: employee.id, input: values });
      } else {
        await createEmployee.mutateAsync(values);
      }
      onOpenChange(false);
    } catch {
      setApiError("Failed to save employee. Please check the form and try again.");
    }
  });

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit employee" : "Add employee"}
      description={
        isEdit
          ? "Update employee details below."
          : "Enter details for the new employee."
      }
      submitLabel={isEdit ? "Update" : "Create"}
      loading={loading}
      onSubmit={onSubmit}
    >
      <FieldGroup className="gap-5">
        {apiError ? <p className="text-sm text-destructive">{apiError}</p> : null}
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="First name"
            htmlFor="firstName"
            error={errors.firstName?.message}
          >
            <Input
              id="firstName"
              aria-invalid={!!errors.firstName}
              {...register("firstName")}
            />
          </FormField>
          <FormField
            label="Last name"
            htmlFor="lastName"
            error={errors.lastName?.message}
          >
            <Input
              id="lastName"
              aria-invalid={!!errors.lastName}
              {...register("lastName")}
            />
          </FormField>
          <FormField label="Email" htmlFor="email" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
          </FormField>
          <FormField
            label="Department"
            htmlFor="department"
            error={errors.department?.message}
          >
            <Input
              id="department"
              aria-invalid={!!errors.department}
              {...register("department")}
            />
          </FormField>
          <FormField
            label="Job title"
            htmlFor="jobTitle"
            error={errors.jobTitle?.message}
          >
            <Input
              id="jobTitle"
              aria-invalid={!!errors.jobTitle}
              {...register("jobTitle")}
            />
          </FormField>
          <FormField label="Status" htmlFor="status" error={errors.status?.message}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <SelectInput
                  id="status"
                  aria-invalid={!!errors.status}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on_leave">On leave</option>
                </SelectInput>
              )}
            />
          </FormField>
          <FormField
            label="Hire date"
            htmlFor="hireDate"
            error={errors.hireDate?.message}
          >
            <Input
              id="hireDate"
              type="date"
              aria-invalid={!!errors.hireDate}
              {...register("hireDate")}
            />
          </FormField>
        </div>
      </FieldGroup>
    </FormModal>
  );
}
