"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPatch, apiPost } from "@/lib/api/axios";
import type { PaginatedData } from "@/types/api";
import type { Employee, EmployeeInput } from "@/types/employee";

type UseEmployeesParams = {
  page?: number;
  limit?: number;
};

export function useEmployees({ page = 1, limit = 10 }: UseEmployeesParams = {}) {
  return useQuery({
    queryKey: ["employees", page, limit],
    queryFn: () =>
      apiGet<PaginatedData<Employee>>("/employees", { page, limit }),
  });
}

export function useEmployeeOptions() {
  return useQuery({
    queryKey: ["employees", "options"],
    queryFn: () =>
      apiGet<PaginatedData<Employee>>("/employees", { page: 1, limit: 100 }),
    select: (data) => data.items,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: EmployeeInput) =>
      apiPost<Employee>("/employees", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: EmployeeInput }) =>
      apiPatch<Employee>(`/employees/${id}`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}
