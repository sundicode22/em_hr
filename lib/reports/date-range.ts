import type { ReportDateRange, ReportGranularity } from "@/types/report";

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getDefaultReportRange(): ReportDateRange {
  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - 31);
  return { from: toIsoDate(from), to: toIsoDate(to) };
}

export function resolveEffectiveRange(
  range: ReportDateRange,
  granularity: ReportGranularity = "monthly",
): ReportDateRange {
  if (!range.to) return range;

  const end = new Date(range.to);
  const start = new Date(end);

  if (granularity === "weekly") {
    start.setDate(start.getDate() - 6);
  } else if (granularity === "daily") {
    // same day
  } else {
    if (range.from) return range;
    start.setDate(start.getDate() - 30);
  }

  const from = range.from
    ? new Date(Math.max(new Date(range.from).getTime(), start.getTime()))
    : start;

  return {
    from: toIsoDate(from),
    to: toIsoDate(end),
  };
}

export const DATE_RANGE_PRESETS = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
] as const;

export function presetRange(days: number): ReportDateRange {
  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - days);
  return { from: toIsoDate(from), to: toIsoDate(to) };
}
