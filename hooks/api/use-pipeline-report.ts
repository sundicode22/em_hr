"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api/axios";
import type { PaginatedData } from "@/types/api";
import type {
  PipelineOverview,
  PositionActivityRow,
  PositionOption,
  ReportQueryParams,
} from "@/types/report";

export function usePipelineOverview(params: ReportQueryParams = {}) {
  return useQuery({
    queryKey: ["reports", "pipeline", "overview", params],
    queryFn: () =>
      apiGet<PipelineOverview>("/reports/pipeline/overview", params),
  });
}

export function usePipelinePositions(
  params: ReportQueryParams = {},
  page = 1,
  limit = 10,
) {
  return useQuery({
    queryKey: ["reports", "pipeline", "positions", params, page, limit],
    queryFn: () =>
      apiGet<PaginatedData<PositionActivityRow>>("/reports/pipeline/positions", {
        ...params,
        page,
        limit,
      }),
  });
}

export function usePositionOptions() {
  return useQuery({
    queryKey: ["reports", "pipeline", "positions", "options"],
    queryFn: () => apiGet<PositionOption[]>("/reports/pipeline/positions/options"),
  });
}
