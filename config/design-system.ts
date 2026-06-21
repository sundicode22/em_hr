/** Design tokens extracted from the Pipeline Insights mockup */

export const designTokens = {
  colors: {
    canvas: "#FFFFFF",
    surface: "#FFFFFF",
    primary: "#4FB0C6",
    primaryHover: "#3FA0B6",
    textPrimary: "#111827",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
  },
  radius: {
    card: "0.75rem", // rounded-xl
    control: "0.375rem", // rounded-md (~8px with base)
    modal: "0",
  },
} as const;

/** Primary action button — dark vertical gradient */
export const primaryButtonClassName =
  "bg-gradient-to-b from-zinc-800 to-zinc-950 text-white font-semibold shadow-sm hover:from-zinc-700 hover:to-black border border-black/10";

/** Outline / social-style button */
export const outlineButtonClassName =
  "border border-border bg-white text-foreground shadow-none hover:bg-zinc-50";

export const cardClassName =
  "rounded-xl border border-border/70 bg-white shadow-none";

export const chartColorClass: Record<string, string> = {
  "chart-1": "bg-[#4FB0C6]",
  "chart-2": "bg-[#6BCB77]",
  "chart-3": "bg-[#5B9BD5]",
  "chart-4": "bg-[#9B87F5]",
  "chart-5": "bg-[#F687B3]",
};

export const chartColorSoftClass: Record<string, string> = {
  "chart-1": "bg-[#4FB0C6]/15 text-[#2D8FA5]",
  "chart-2": "bg-[#6BCB77]/15 text-[#3D9E52]",
  "chart-3": "bg-[#5B9BD5]/15 text-[#3D7AB8]",
  "chart-4": "bg-[#9B87F5]/15 text-[#7B67D5]",
  "chart-5": "bg-[#F687B3]/15 text-[#D66793]",
};

export const kpiIconKeys: Record<string, keyof typeof chartColorSoftClass> = {
  "outreach-effectiveness": "chart-1",
  "time-to-first-reply": "chart-3",
  "open-rate": "chart-4",
  "reply-rate": "chart-5",
  "interested-rate": "chart-2",
  "team-response-time": "chart-1",
  "time-to-first-interview": "chart-3",
  "schedule-rate": "chart-4",
};
