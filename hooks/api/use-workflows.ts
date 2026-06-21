"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPatch, apiPost } from "@/lib/api/axios";
import type { PaginatedData } from "@/types/api";
import type { Workflow, WorkflowInput } from "@/types/workflow";

type UseWorkflowsParams = {
  page?: number;
  limit?: number;
};

export function useWorkflows({ page = 1, limit = 10 }: UseWorkflowsParams = {}) {
  return useQuery({
    queryKey: ["workflows", page, limit],
    queryFn: () =>
      apiGet<PaginatedData<Workflow>>("/workflows", { page, limit }),
  });
}

export function useCreateWorkflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: WorkflowInput) =>
      apiPost<Workflow>("/workflows", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
    },
  });
}

export function useUpdateWorkflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: WorkflowInput }) =>
      apiPatch<Workflow>(`/workflows/${id}`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
    },
  });
}
