import type { PipelineStage } from "@/types/pipeline";

export type ReportGranularity = "weekly" | "monthly" | "daily";

export type KpiMetric = {
  id: string;
  label: string;
  value: string;
  sublabel: string;
};

export type PipelineFunnelStage = {
  stage: string;
  label: string;
  count: number;
  percentage: number;
  colorKey: string;
};

export type PositionActivityRow = {
  positionId: string;
  position: string;
  colorKey: string;
  reviewed: { count: number; percentage: number };
  accepted: { count: number; percentage: number };
  outreached: { count: number; percentage: number };
  read: { count: number; percentage: number };
  replies: { count: number; percentage: number };
  interested: { count: number; percentage: number };
  schedules: { count: number; percentage: number };
};

export type PositionOption = {
  id: string;
  title: string;
};

export type PipelineOverview = {
  kpis: KpiMetric[];
  funnel: PipelineFunnelStage[];
};

export type ReportDateRange = {
  from?: string;
  to?: string;
};

export type ReportQueryParams = ReportDateRange & {
  granularity?: ReportGranularity;
  positionIds?: string;
  search?: string;
};

export type PipelineStageFilter = PipelineStage[];

export const ALL_PIPELINE_STAGES: PipelineStage[] = [
  "reviewed",
  "accepted",
  "outreached",
  "email_opened",
  "replied",
  "interested",
  "scheduled",
];
