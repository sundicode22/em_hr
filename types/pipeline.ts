export type PipelineStage =
  | "reviewed"
  | "accepted"
  | "outreached"
  | "email_opened"
  | "replied"
  | "interested"
  | "scheduled";

export const PIPELINE_STAGES: PipelineStage[] = [
  "reviewed",
  "accepted",
  "outreached",
  "email_opened",
  "replied",
  "interested",
  "scheduled",
];

export const PIPELINE_STAGE_LABELS: Record<PipelineStage, string> = {
  reviewed: "Candidate Reviewed",
  accepted: "Candidate Accepted",
  outreached: "Candidate Outreached",
  email_opened: "Email Opened",
  replied: "Replies",
  interested: "Interested",
  scheduled: "Schedules",
};
