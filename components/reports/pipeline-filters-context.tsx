"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { PipelineStage } from "@/types/pipeline";
import { ALL_PIPELINE_STAGES } from "@/types/report";
import type { ReportGranularity } from "@/types/report";

type PipelineFiltersContextValue = {
  granularity: ReportGranularity;
  setGranularity: (granularity: ReportGranularity) => void;
  selectedStages: PipelineStage[];
  setSelectedStages: (stages: PipelineStage[]) => void;
  positionIds: string[];
  setPositionIds: (ids: string[]) => void;
  positionSearch: string;
  setPositionSearch: (search: string) => void;
  filterParams: {
    granularity: ReportGranularity;
    positionIds?: string;
    search?: string;
  };
};

const PipelineFiltersContext = createContext<PipelineFiltersContextValue | null>(
  null,
);

export function PipelineFiltersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [granularity, setGranularity] = useState<ReportGranularity>("weekly");
  const [selectedStages, setSelectedStages] =
    useState<PipelineStage[]>(ALL_PIPELINE_STAGES);
  const [positionIds, setPositionIds] = useState<string[]>([]);
  const [positionSearch, setPositionSearch] = useState("");

  const filterParams = useMemo(
    () => ({
      granularity,
      positionIds: positionIds.length > 0 ? positionIds.join(",") : undefined,
      search: positionSearch.trim() || undefined,
    }),
    [granularity, positionIds, positionSearch],
  );

  return (
    <PipelineFiltersContext.Provider
      value={{
        granularity,
        setGranularity,
        selectedStages,
        setSelectedStages,
        positionIds,
        setPositionIds,
        positionSearch,
        setPositionSearch,
        filterParams,
      }}
    >
      {children}
    </PipelineFiltersContext.Provider>
  );
}

export function usePipelineFilters() {
  const ctx = useContext(PipelineFiltersContext);
  if (!ctx) {
    throw new Error("usePipelineFilters must be used within PipelineFiltersProvider");
  }
  return ctx;
}
