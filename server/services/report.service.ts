import { and, count, desc, eq, gte, ilike, inArray, lte, sql } from "drizzle-orm";
import { db } from "@/server/db";
import {
  candidates,
  pipelineEvents,
  positions,
} from "@/server/db/schema";
import { buildPaginationMeta } from "@/server/lib/response";
import { resolveEffectiveRange } from "@/lib/reports/date-range";
import type { PaginatedData } from "@/types/api";
import {
  PIPELINE_STAGE_LABELS,
  PIPELINE_STAGES,
  type PipelineStage,
} from "@/types/pipeline";
import type {
  PipelineOverview,
  PositionActivityRow,
  PositionOption,
  ReportQueryParams,
} from "@/types/report";

function pct(n: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((n / total) * 1000) / 10;
}

function formatDays(days: number): string {
  if (!Number.isFinite(days) || days < 0) return "—";
  const rounded = Math.round(days * 10) / 10;
  if (rounded === 0) return "0 days";
  if (rounded === 1) return "1 day";
  return `${rounded} days`;
}

function dateFilter(range: ReportQueryParams) {
  const effective = resolveEffectiveRange(
    { from: range.from, to: range.to },
    range.granularity ?? "monthly",
  );
  const filters = [];
  if (effective.from) {
    filters.push(gte(pipelineEvents.occurredAt, new Date(effective.from)));
  }
  if (effective.to) {
    const end = new Date(effective.to);
    end.setHours(23, 59, 59, 999);
    filters.push(lte(pipelineEvents.occurredAt, end));
  }
  return filters.length > 0 ? and(...filters) : undefined;
}

function parsePositionIds(raw?: string): string[] {
  if (!raw) return [];
  return raw.split(",").map((id) => id.trim()).filter(Boolean);
}

async function countByStage(
  stage: PipelineStage,
  range: ReportQueryParams,
  positionIds: string[] = [],
): Promise<number> {
  const where = dateFilter(range);
  const conditions = [eq(pipelineEvents.stage, stage)];

  if (where) conditions.push(where);

  if (positionIds.length > 0) {
    const [row] = await db
      .select({ value: count() })
      .from(pipelineEvents)
      .innerJoin(candidates, eq(pipelineEvents.candidateId, candidates.id))
      .where(and(...conditions, inArray(candidates.positionId, positionIds)));
    return row?.value ?? 0;
  }

  const [row] = await db
    .select({ value: count() })
    .from(pipelineEvents)
    .where(and(...conditions));
  return row?.value ?? 0;
}

async function avgDaysBetweenStages(
  fromStage: PipelineStage,
  toStage: PipelineStage,
  range: ReportQueryParams,
): Promise<number | null> {
  const where = dateFilter(range);
  const positionIds = parsePositionIds(range.positionIds);

  const rows = await db
    .select({
      candidateId: pipelineEvents.candidateId,
      stage: pipelineEvents.stage,
      occurredAt: pipelineEvents.occurredAt,
      positionId: candidates.positionId,
    })
    .from(pipelineEvents)
    .innerJoin(candidates, eq(pipelineEvents.candidateId, candidates.id))
    .where(
      where
        ? and(
            where,
            inArray(pipelineEvents.stage, [fromStage, toStage]),
            positionIds.length > 0
              ? inArray(candidates.positionId, positionIds)
              : sql`true`,
          )
        : and(
            inArray(pipelineEvents.stage, [fromStage, toStage]),
            positionIds.length > 0
              ? inArray(candidates.positionId, positionIds)
              : sql`true`,
          ),
    )
    .orderBy(pipelineEvents.candidateId, pipelineEvents.occurredAt);

  const byCandidate = new Map<string, { from?: Date; to?: Date }>();

  for (const row of rows) {
    const entry = byCandidate.get(row.candidateId) ?? {};
    if (row.stage === fromStage && !entry.from) {
      entry.from = row.occurredAt;
    }
    if (row.stage === toStage && entry.from && !entry.to) {
      if (row.occurredAt >= entry.from) {
        entry.to = row.occurredAt;
      }
    }
    byCandidate.set(row.candidateId, entry);
  }

  const deltas: number[] = [];
  for (const { from, to } of byCandidate.values()) {
    if (from && to) {
      deltas.push((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
    }
  }

  if (deltas.length === 0) return null;
  return deltas.reduce((sum, d) => sum + d, 0) / deltas.length;
}

export async function listPositionOptions(): Promise<PositionOption[]> {
  const rows = await db
    .select({ id: positions.id, title: positions.title })
    .from(positions)
    .orderBy(desc(positions.createdAt));
  return rows;
}

export async function getPipelineOverview(
  range: ReportQueryParams = {},
): Promise<PipelineOverview> {
  const positionIds = parsePositionIds(range.positionIds);

  const reviewed = await countByStage("reviewed", range, positionIds);
  const accepted = await countByStage("accepted", range, positionIds);
  const outreached = await countByStage("outreached", range, positionIds);
  const emailOpened = await countByStage("email_opened", range, positionIds);
  const replied = await countByStage("replied", range, positionIds);
  const interested = await countByStage("interested", range, positionIds);
  const scheduled = await countByStage("scheduled", range, positionIds);

  const timeToFirstReply = await avgDaysBetweenStages(
    "outreached",
    "replied",
    range,
  );
  const teamResponseTime = await avgDaysBetweenStages("replied", "interested", range);
  const timeToFirstInterview = await avgDaysBetweenStages(
    "interested",
    "scheduled",
    range,
  );

  const kpis = [
    {
      id: "outreach-effectiveness",
      label: "Outreach effectiveness",
      value: `Avg ${pct(outreached, reviewed)}%`,
      sublabel: "Candidates outreached vs reviewed",
    },
    {
      id: "time-to-first-reply",
      label: "Time to first reply",
      value: timeToFirstReply !== null ? formatDays(timeToFirstReply) : "—",
      sublabel: "Avg days from outreach to reply",
    },
    {
      id: "open-rate",
      label: "Open rate",
      value: `Avg ${pct(emailOpened, outreached)}%`,
      sublabel: "Emails opened vs outreached",
    },
    {
      id: "reply-rate",
      label: "Reply rate",
      value: `Avg ${pct(replied, outreached)}%`,
      sublabel: "Replies vs outreached",
    },
    {
      id: "interested-rate",
      label: "Interested rate",
      value: `${pct(interested, reviewed)}%`,
      sublabel: "Interested vs reviewed",
    },
    {
      id: "team-response-time",
      label: "Team response time",
      value: teamResponseTime !== null ? formatDays(teamResponseTime) : "—",
      sublabel: "Avg days from reply to interested",
    },
    {
      id: "time-to-first-interview",
      label: "Time to first interview",
      value: timeToFirstInterview !== null ? formatDays(timeToFirstInterview) : "—",
      sublabel: "Avg days from interested to scheduled",
    },
    {
      id: "schedule-rate",
      label: "Schedule rate",
      value: `Avg ${pct(scheduled, outreached)}%`,
      sublabel: "Schedules vs outreached",
    },
  ];

  const funnelColors: Record<PipelineStage, string> = {
    reviewed: "chart-1",
    accepted: "chart-2",
    outreached: "chart-3",
    email_opened: "chart-4",
    replied: "chart-5",
    interested: "chart-2",
    scheduled: "chart-3",
  };

  const stageCounts: Record<PipelineStage, number> = {
    reviewed,
    accepted,
    outreached,
    email_opened: emailOpened,
    replied,
    interested,
    scheduled,
  };

  const funnel = PIPELINE_STAGES.map((stage) => ({
    stage,
    label: PIPELINE_STAGE_LABELS[stage],
    count: stageCounts[stage],
    percentage: pct(stageCounts[stage], reviewed || 1),
    colorKey: funnelColors[stage],
  }));

  return { kpis, funnel };
}

export async function getPositionActivity(
  range: ReportQueryParams = {},
  page = 1,
  limit = 10,
): Promise<PaginatedData<PositionActivityRow>> {
  const offset = (page - 1) * limit;
  const where = dateFilter(range);
  const positionIds = parsePositionIds(range.positionIds);
  const search = range.search?.trim();

  const positionConditions = [];
  if (positionIds.length > 0) {
    positionConditions.push(inArray(positions.id, positionIds));
  }
  if (search) {
    positionConditions.push(ilike(positions.title, `%${search}%`));
  }

  const positionWhere =
    positionConditions.length > 0 ? and(...positionConditions) : undefined;

  const [totalRow] = await db
    .select({ value: count() })
    .from(positions)
    .where(positionWhere);
  const total = totalRow?.value ?? 0;

  const positionRows = await db
    .select()
    .from(positions)
    .where(positionWhere)
    .orderBy(desc(positions.createdAt))
    .limit(limit)
    .offset(offset);

  const items: PositionActivityRow[] = [];

  for (const position of positionRows) {
    const stageCounts: Partial<Record<PipelineStage, number>> = {};

    for (const stage of PIPELINE_STAGES) {
      const conditions = [
        eq(candidates.positionId, position.id),
        eq(pipelineEvents.stage, stage),
      ];
      if (where) conditions.push(where);

      const [row] = await db
        .select({ value: count() })
        .from(pipelineEvents)
        .innerJoin(candidates, eq(pipelineEvents.candidateId, candidates.id))
        .where(and(...conditions));

      stageCounts[stage] = row?.value ?? 0;
    }

    const reviewed = stageCounts.reviewed ?? 0;
    const base = reviewed || 1;

    items.push({
      positionId: position.id,
      position: position.title,
      colorKey: position.colorKey,
      reviewed: { count: reviewed, percentage: pct(reviewed, base) },
      accepted: {
        count: stageCounts.accepted ?? 0,
        percentage: pct(stageCounts.accepted ?? 0, base),
      },
      outreached: {
        count: stageCounts.outreached ?? 0,
        percentage: pct(stageCounts.outreached ?? 0, base),
      },
      read: {
        count: stageCounts.email_opened ?? 0,
        percentage: pct(stageCounts.email_opened ?? 0, base),
      },
      replies: {
        count: stageCounts.replied ?? 0,
        percentage: pct(stageCounts.replied ?? 0, base),
      },
      interested: {
        count: stageCounts.interested ?? 0,
        percentage: pct(stageCounts.interested ?? 0, base),
      },
      schedules: {
        count: stageCounts.scheduled ?? 0,
        percentage: pct(stageCounts.scheduled ?? 0, base),
      },
    });
  }

  return {
    items,
    pagination: buildPaginationMeta(page, limit, total),
  };
}
