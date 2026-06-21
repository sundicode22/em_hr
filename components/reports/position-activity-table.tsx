"use client";

import { useMemo, useState } from "react";
import { PositionActivityFilterModal } from "@/components/reports/position-activity-filter-modal";
import { usePipelineFilters } from "@/components/reports/pipeline-filters-context";
import { TablePagination } from "@/components/data-table/table-pagination";
import {
  TableSelectAll,
  TableSelectRow,
  tableHeadClassName,
} from "@/components/data-table/table-selection";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PositionActivityRow, ReportGranularity } from "@/types/report";
import { cardClassName, chartColorClass } from "@/config/design-system";
import { downloadCsv } from "@/lib/reports/export-csv";
import { useTableSelection } from "@/hooks/use-table-selection";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, FilterIcon, MoreHorizontalIcon } from "@hugeicons/core-free-icons";

const GRANULARITY_LABELS: Record<ReportGranularity, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  daily: "Daily",
};

function Cell({ count, percentage }: { count: number; percentage: number }) {
  return (
    <div className="text-sm tabular-nums">
      <span className="font-medium text-foreground">{count}</span>{" "}
      <span className="text-muted-foreground">{percentage}%</span>
    </div>
  );
}

export function PositionActivityTable({
  rows,
  page,
  totalPages,
  onPageChange,
}: {
  rows: PositionActivityRow[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const {
    granularity,
    setGranularity,
    positionIds,
    setPositionIds,
    positionSearch,
    setPositionSearch,
  } = usePipelineFilters();
  const [filterOpen, setFilterOpen] = useState(false);
  const hasFilter = positionIds.length > 0 || positionSearch.length > 0;

  const rowIds = useMemo(() => rows.map((row) => row.positionId), [rows]);
  const selection = useTableSelection(rowIds);

  function exportCsv() {
    downloadCsv("position-activity.csv", [
      [
        "Position",
        "Reviewed",
        "Accepted",
        "Outreached",
        "Read",
        "Replies",
        "Interested",
        "Schedules",
      ],
      ...rows.map((row) => [
        row.position,
        String(row.reviewed.count),
        String(row.accepted.count),
        String(row.outreached.count),
        String(row.read.count),
        String(row.replies.count),
        String(row.interested.count),
        String(row.schedules.count),
      ]),
    ]);
  }

  function clearFilters() {
    setPositionIds([]);
    setPositionSearch("");
  }

  return (
    <>
      <div className={cn(cardClassName, "p-6")}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-foreground">Position activity</h2>
            {hasFilter ? (
              <span className="rounded-xl bg-primary/10 px-2 py-0.5 text-xs text-primary">
                Filtered
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1 shadow-none"
                >
                  {GRANULARITY_LABELS[granularity]}
                  <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} className="size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuRadioGroup
                  value={granularity}
                  onValueChange={(value) => setGranularity(value as ReportGranularity)}
                >
                  {(Object.keys(GRANULARITY_LABELS) as ReportGranularity[]).map((key) => (
                    <DropdownMenuRadioItem key={key} value={key}>
                      {GRANULARITY_LABELS[key]}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
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
                <DropdownMenuItem onClick={clearFilters}>Clear filters</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableSelectAll
                checked={selection.allSelected}
                indeterminate={selection.someSelected}
                onCheckedChange={selection.toggleAll}
                disabled={rowIds.length === 0}
              />
              <TableHead className={tableHeadClassName}>Position</TableHead>
              <TableHead className={tableHeadClassName}>Reviewed</TableHead>
              <TableHead className={tableHeadClassName}>Accepted</TableHead>
              <TableHead className={tableHeadClassName}>Outreached</TableHead>
              <TableHead className={tableHeadClassName}>Read</TableHead>
              <TableHead className={tableHeadClassName}>Replies</TableHead>
              <TableHead className={tableHeadClassName}>Interested</TableHead>
              <TableHead className={tableHeadClassName}>Schedules</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                  No positions match your filters for this date range.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={row.positionId}
                  data-state={selection.isSelected(row.positionId) ? "selected" : undefined}
                >
                  <TableSelectRow
                    checked={selection.isSelected(row.positionId)}
                    onCheckedChange={() => selection.toggleRow(row.positionId)}
                  />
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "size-2.5 shrink-0 rounded-full",
                          chartColorClass[row.colorKey] ?? "bg-primary",
                        )}
                      />
                      <span className="font-medium text-foreground">{row.position}</span>
                    </div>
                  </TableCell>
                  <TableCell><Cell {...row.reviewed} /></TableCell>
                  <TableCell><Cell {...row.accepted} /></TableCell>
                  <TableCell><Cell {...row.outreached} /></TableCell>
                  <TableCell><Cell {...row.read} /></TableCell>
                  <TableCell><Cell {...row.replies} /></TableCell>
                  <TableCell><Cell {...row.interested} /></TableCell>
                  <TableCell><Cell {...row.schedules} /></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
      </div>

      <PositionActivityFilterModal
        open={filterOpen}
        onOpenChange={setFilterOpen}
        positionIds={positionIds}
        positionSearch={positionSearch}
        onApply={({ positionIds: ids, positionSearch: search }) => {
          setPositionIds(ids);
          setPositionSearch(search);
        }}
      />
    </>
  );
}
