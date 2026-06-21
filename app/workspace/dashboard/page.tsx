"use client";

import { usePipelineOverview } from "@/hooks/api/use-pipeline-report";
import { KpiGrid } from "@/components/reports/kpi-grid";

export default function DashboardPage() {
  const { data: overview, isLoading } = usePipelineOverview();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your HR analytics</p>
      </div>
      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : overview ? (
        <KpiGrid metrics={overview.kpis.slice(0, 4)} />
      ) : null}
    </div>
  );
}
