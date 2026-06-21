export type HrSettings = {
  companyName: string;
  defaultWorkHours: string;
  ptoAllowanceDays: string;
  probationPeriodDays: string;
  defaultCurrency: "USD" | "EUR" | "GBP";
  hrContactEmail: string;
};

export const defaultHrSettings: HrSettings = {
  companyName: "EM Management",
  defaultWorkHours: "40",
  ptoAllowanceDays: "20",
  probationPeriodDays: "90",
  defaultCurrency: "USD",
  hrContactEmail: "hr@example.com",
};
