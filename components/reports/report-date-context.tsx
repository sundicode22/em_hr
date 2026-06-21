"use client";

import { createContext, useContext, useState } from "react";
import { getDefaultReportRange } from "@/lib/reports/date-range";
import type { ReportDateRange } from "@/types/report";

type ReportDateContextValue = {
  range: ReportDateRange;
  setRange: (range: ReportDateRange) => void;
};

const ReportDateContext = createContext<ReportDateContextValue | null>(null);

const defaultRange: ReportDateRange = getDefaultReportRange();

export function ReportDateProvider({ children }: { children: React.ReactNode }) {
  const [range, setRange] = useState<ReportDateRange>(defaultRange);

  return (
    <ReportDateContext.Provider value={{ range, setRange }}>
      {children}
    </ReportDateContext.Provider>
  );
}

export function useReportDate() {
  const ctx = useContext(ReportDateContext);
  if (!ctx) {
    throw new Error("useReportDate must be used within ReportDateProvider");
  }
  return ctx;
}

export function useReportDateOptional() {
  return useContext(ReportDateContext);
}
