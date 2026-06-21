"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPatch, apiPost } from "@/lib/api/axios";
import type { PaginatedData } from "@/types/api";
import type { PayrollInput, PayrollRecord } from "@/types/payroll";

type UsePayrollParams = {
  page?: number;
  limit?: number;
};

export function usePayroll({ page = 1, limit = 10 }: UsePayrollParams = {}) {
  return useQuery({
    queryKey: ["payroll", page, limit],
    queryFn: () =>
      apiGet<PaginatedData<PayrollRecord>>("/payroll", { page, limit }),
  });
}

export function useCreatePayroll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PayrollInput) =>
      apiPost<PayrollRecord>("/payroll", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll"] });
    },
  });
}

export function useUpdatePayroll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: PayrollInput }) =>
      apiPatch<PayrollRecord>(`/payroll/${id}`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll"] });
    },
  });
}
