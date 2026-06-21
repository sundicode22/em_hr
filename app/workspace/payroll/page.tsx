"use client";

import { useMemo, useState } from "react";
import { PayrollFormModal } from "@/components/payroll/payroll-form-modal";
import { TablePagination } from "@/components/data-table/table-pagination";
import {
  TableSelectAll,
  TableSelectRow,
  tableHeadClassName,
} from "@/components/data-table/table-selection";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cardClassName } from "@/config/design-system";
import { usePayroll } from "@/hooks/api/use-payroll";
import { useTableSelection } from "@/hooks/use-table-selection";
import { cn } from "@/lib/utils";
import type { PayrollRecord } from "@/types/payroll";

function statusLabel(status: PayrollRecord["status"]) {
  switch (status) {
    case "draft":
      return "Draft";
    case "processed":
      return "Processed";
    case "paid":
      return "Paid";
  }
}

export default function PayrollPage() {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PayrollRecord | null>(null);
  const { data, isLoading, isError } = usePayroll({ page, limit: 10 });

  const rowIds = useMemo(
    () => data?.items.map((record) => record.id) ?? [],
    [data?.items],
  );
  const selection = useTableSelection(rowIds);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(record: PayrollRecord) {
    setEditing(record);
    setModalOpen(true);
  }

  return (
    <>
      <div className={cn(cardClassName, "p-6")}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Payroll</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              View and manage payroll records.
            </p>
          </div>
          <Button className="shadow-none" onClick={openCreate}>
            Add payroll record
          </Button>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading payroll records...</p>
        ) : isError ? (
          <p className="text-sm text-destructive">Failed to load payroll records.</p>
        ) : (
          <>
            <Table className="min-w-[720px]">
              <TableHeader>
                <TableRow>
                  <TableSelectAll
                    checked={selection.allSelected}
                    indeterminate={selection.someSelected}
                    onCheckedChange={selection.toggleAll}
                    disabled={rowIds.length === 0}
                  />
                  <TableHead className={tableHeadClassName}>Employee</TableHead>
                  <TableHead className={tableHeadClassName}>Period</TableHead>
                  <TableHead className={tableHeadClassName}>Gross pay</TableHead>
                  <TableHead className={tableHeadClassName}>Net pay</TableHead>
                  <TableHead className={tableHeadClassName}>Status</TableHead>
                  <TableHead className={tableHeadClassName}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.items.map((record) => (
                  <TableRow
                    key={record.id}
                    data-state={selection.isSelected(record.id) ? "selected" : undefined}
                  >
                    <TableSelectRow
                      checked={selection.isSelected(record.id)}
                      onCheckedChange={() => selection.toggleRow(record.id)}
                    />
                    <TableCell className="font-medium text-foreground">
                      {record.employeeName}
                    </TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">
                      {record.periodStart} – {record.periodEnd}
                    </TableCell>
                    <TableCell className="tabular-nums">${record.grossPay}</TableCell>
                    <TableCell className="tabular-nums">${record.netPay}</TableCell>
                    <TableCell>{statusLabel(record.status)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="shadow-none"
                        onClick={() => openEdit(record)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {data && (
              <TablePagination
                page={page}
                totalPages={data.pagination.totalPages}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>

      <PayrollFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        record={editing}
      />
    </>
  );
}
