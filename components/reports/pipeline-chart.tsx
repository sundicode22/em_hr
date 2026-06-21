"use client";

import { useState } from "react";
import { PipelineStageFilterModal } from "@/components/reports/pipeline-stage-filter-modal";
import { usePipelineFilters } from "@/components/reports/pipeline-filters-context";
import type { PipelineFunnelStage } from "@/types/report";
import { ALL_PIPELINE_STAGES } from "@/types/report";
import { cardClassName, chartColorClass } from "@/config/design-system";
import { downloadCsv } from "@/lib/reports/export-csv";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import { FilterIcon, MoreHorizontalIcon } from "@hugeicons/core-free-icons";

export function PipelineChart({ stages }: { stages: PipelineFunnelStage[] }) {
  const { selectedStages, setSelectedStages } = usePipelineFilters();
  const [filterOpen, setFilterOpen] = useState(false);

  const visibleStages = stages.filter((stage) =>
    selectedStages.includes(stage.stage as (typeof selectedStages)[number]),
  );
  const maxCount = Math.max(...visibleStages.map((s) => s.count), 1);
  const hasFilter = selectedStages.length < stages.length;

  function exportCsv() {
    downloadCsv("pipeline-overview.csv", [
      ["Stage", "Count", "Percentage"],
      ...visibleStages.map((stage) => [
        stage.label,
        String(stage.count),
        `${stage.percentage}%`,
      ]),
    ]);
  }

  function copySummary() {
    const text = visibleStages
      .map((stage) => `${stage.label}: ${stage.count} (${stage.percentage}%)`)
      .join("\n");
    void navigator.clipboard.writeText(text);
  }

  return (
    <>
      <div className={cn(cardClassName, "p-6")}>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-foreground">Pipeline overview</h2>
            {hasFilter ? (
              <span className="rounded-xl bg-primary/10 px-2 py-0.5 text-xs text-primary">
                Filtered
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 shadow-none"
              onClick={() => setFilterOpen(true)}
            >
              <HugeiconsIcon icon={FilterIcon} strokeWidth={2} className="size-3.5" />
              Filter
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon-sm" className="shadow-none">
                  <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem onClick={exportCsv}>Export CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={copySummary}>Copy summary</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStages(ALL_PIPELINE_STAGES)}>
                  Reset stage filters
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {visibleStages.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No stages selected. Open Filter to choose pipeline stages.
          </p>
        ) : (
          <div className="space-y-4">
            {visibleStages.map((stage) => (
              <div
                key={stage.stage}
                className="grid grid-cols-[minmax(120px,160px)_1fr_auto] items-center gap-4"
              >
                <span className="text-sm font-medium text-foreground">{stage.label}</span>
                <div className="h-8 overflow-hidden rounded-full bg-muted/80">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      chartColorClass[stage.colorKey] ?? "bg-primary",
                    )}
                    style={{
                      width: `${Math.max((stage.count / maxCount) * 100, stage.count > 0 ? 6 : 0)}%`,
                    }}
                  />
                </div>
                <span className="min-w-[72px] text-right text-sm text-muted-foreground">
                  {stage.count}{" "}
                  <span className="text-foreground/70">({stage.percentage}%)</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <PipelineStageFilterModal
        open={filterOpen}
        onOpenChange={setFilterOpen}
        selectedStages={selectedStages}
        onApply={setSelectedStages}
      />
    </>
  );
}
