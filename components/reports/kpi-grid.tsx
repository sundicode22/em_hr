import type { KpiMetric } from "@/types/report";
import {
  cardClassName,
  chartColorSoftClass,
  kpiIconKeys,
} from "@/config/design-system";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Analytics01Icon,
  Calendar03Icon,
  Clock01Icon,
  Mail01Icon,
  Message01Icon,
  StarIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

const kpiIcons: Record<string, typeof Analytics01Icon> = {
  "outreach-effectiveness": Analytics01Icon,
  "time-to-first-reply": Clock01Icon,
  "open-rate": Mail01Icon,
  "reply-rate": Message01Icon,
  "interested-rate": StarIcon,
  "team-response-time": UserGroupIcon,
  "time-to-first-interview": Calendar03Icon,
  "schedule-rate": Analytics01Icon,
};

export function KpiGrid({ metrics }: { metrics: KpiMetric[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const colorKey = kpiIconKeys[metric.id] ?? "chart-1";
        const Icon = kpiIcons[metric.id] ?? Analytics01Icon;

        return (
          <div key={metric.id} className={cn(cardClassName, "p-5")}>
            <div className="flex items-start justify-between gap-3">
              <div
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-xl",
                  chartColorSoftClass[colorKey],
                )}
              >
                <HugeiconsIcon icon={Icon} strokeWidth={2} className="size-4" />
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{metric.label}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              {metric.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{metric.sublabel}</p>
          </div>
        );
      })}
    </div>
  );
}
