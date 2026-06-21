"use client";

import { useEffect, useMemo, useState } from "react";
import { KpiGrid } from "@/components/reports/kpi-grid";
import { PipelineChart } from "@/components/reports/pipeline-chart";
import { PipelineFiltersProvider, usePipelineFilters } from "@/components/reports/pipeline-filters-context";
import { PipelineInsightsSkeleton } from "@/components/reports/pipeline-insights-skeleton";
import { PositionActivityTable } from "@/components/reports/position-activity-table";
import { useReportDate } from "@/components/reports/report-date-context";
import { Button } from "@/components/ui/button";
import {
  usePipelineOverview,
  usePipelinePositions,
} from "@/hooks/api/use-pipeline-report";

function PipelineInsightsContent() {
  const { range } = useReportDate();
  const { filterParams } = usePipelineFilters();
  const [page, setPage] = useState(1);

  const queryParams = useMemo(
    () => ({
      from: range.from,
      to: range.to,
      ...filterParams,
    }),
    [range, filterParams],
  );

  useEffect(() => {
    setPage(1);
  }, [queryParams]);

  const {
    data: overview,
    isLoading: overviewLoading,
    isError: overviewError,
    refetch: refetchOverview,
  } = usePipelineOverview(queryParams);

  const {
    data: positions,
    isLoading: positionsLoading,
    isError: positionsError,
    refetch: refetchPositions,
  } = usePipelinePositions(queryParams, page, 10);

  if (overviewLoading) {
    return <PipelineInsightsSkeleton />;
  }

  if (overviewError) {
    return (
      <div className="rounded-xl border border-border/70 bg-card p-8 text-center">
        <p className="text-sm text-destructive">Failed to load pipeline insights.</p>
        <Button className="mt-4 shadow-none" onClick={() => refetchOverview()}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {overview && <KpiGrid metrics={overview.kpis} />}
      {overview && <PipelineChart stages={overview.funnel} />}
      {positionsLoading ? (
        <div className="rounded-xl border border-border/70 bg-card p-6">
          <p className="text-sm text-muted-foreground">Loading position activity...</p>
        </div>
      ) : positionsError ? (
        <div className="rounded-xl border border-border/70 bg-card p-8 text-center">
          <p className="text-sm text-destructive">Failed to load position activity.</p>
          <Button className="mt-4 shadow-none" onClick={() => refetchPositions()}>
            Try again
          </Button>
        </div>
      ) : positions ? (
        <PositionActivityTable
          rows={positions.items}
          page={page}
          totalPages={positions.pagination.totalPages}
          onPageChange={setPage}
        />
      ) : null}
    </div>
  );
}

export default function PipelineInsightsPage() {
  return (
    <PipelineFiltersProvider>
      <PipelineInsightsContent />
    </PipelineFiltersProvider>
  );
}
