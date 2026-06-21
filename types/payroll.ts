export type PayrollStatus = "draft" | "processed" | "paid";

export type PayrollRecord = {
  id: string;
  employeeId: string;
  employeeName: string;
  periodStart: string;
  periodEnd: string;
  grossPay: string;
  netPay: string;
  status: PayrollStatus;
  createdAt: string;
};

export type PayrollInput = {
  employeeId: string;
  periodStart: string;
  periodEnd: string;
  grossPay: string;
  netPay: string;
  status: PayrollStatus;
};

export function payrollToFormValues(record: PayrollRecord): PayrollInput {
  return {
    employeeId: record.employeeId,
    periodStart: record.periodStart,
    periodEnd: record.periodEnd,
    grossPay: record.grossPay,
    netPay: record.netPay,
    status: record.status,
  };
}

export const emptyPayrollForm: PayrollInput = {
  employeeId: "",
  periodStart: "",
  periodEnd: "",
  grossPay: "",
  netPay: "",
  status: "draft",
};
