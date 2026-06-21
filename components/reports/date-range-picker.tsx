"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DATE_RANGE_PRESETS, presetRange } from "@/lib/reports/date-range";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon } from "@hugeicons/core-free-icons";
import type { ReportDateRange } from "@/types/report";

function formatDisplayDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function DateRangePicker({
  range,
  onChange,
}: {
  range: ReportDateRange;
  onChange: (range: ReportDateRange) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ReportDateRange>(range);
  const label = `${formatDisplayDate(range.from)} - ${formatDisplayDate(range.to)}`;

  function applyRange(next: ReportDateRange) {
    onChange(next);
    setDraft(next);
    setOpen(false);
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setDraft(range);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-9 gap-2 border-border bg-card px-3 font-normal text-foreground shadow-none"
        >
          <HugeiconsIcon
            icon={Calendar03Icon}
            strokeWidth={2}
            className="size-4 text-muted-foreground"
          />
          <span className="hidden text-sm sm:inline">{label}</span>
          <span className="text-sm sm:hidden">Dates</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto rounded-xl p-4" align="end">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {DATE_RANGE_PRESETS.map((preset) => (
              <Button
                key={preset.label}
                type="button"
                variant="outline"
                size="sm"
                className="shadow-none"
                onClick={() => applyRange(presetRange(preset.days))}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="space-y-1.5">
              <label htmlFor="from" className="text-xs font-medium text-muted-foreground">
                From
              </label>
              <Input
                id="from"
                type="date"
                className="h-9 w-full sm:w-40"
                value={draft.from?.slice(0, 10) ?? ""}
                onChange={(e) => setDraft({ ...draft, from: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="to" className="text-xs font-medium text-muted-foreground">
                To
              </label>
              <Input
                id="to"
                type="date"
                className="h-9 w-full sm:w-40"
                value={draft.to?.slice(0, 10) ?? ""}
                onChange={(e) => setDraft({ ...draft, to: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shadow-none"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              className="shadow-none"
              onClick={() => applyRange(draft)}
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
