"use client";

import { useMemo, useState } from "react";
import { EmployeeFormModal } from "@/components/employees/employee-form-modal";
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
import { useEmployees } from "@/hooks/api/use-employees";
import { useTableSelection } from "@/hooks/use-table-selection";
import { cn } from "@/lib/utils";
import type { Employee } from "@/types/employee";

function statusLabel(status: Employee["status"]) {
  switch (status) {
    case "active":
      return "Active";
    case "inactive":
      return "Inactive";
    case "on_leave":
      return "On leave";
  }
}

export default function EmployeesPage() {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const { data, isLoading, isError } = useEmployees({ page, limit: 10 });

  const rowIds = useMemo(
    () => data?.items.map((employee) => employee.id) ?? [],
    [data?.items],
  );
  const selection = useTableSelection(rowIds);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(employee: Employee) {
    setEditing(employee);
    setModalOpen(true);
  }

  return (
    <>
      <div className={cn(cardClassName, "p-6")}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Employee</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage employee records and information.
            </p>
          </div>
          <Button className="shadow-none" onClick={openCreate}>
            Add employee
          </Button>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading employees...</p>
        ) : isError ? (
          <p className="text-sm text-destructive">Failed to load employees.</p>
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
                  <TableHead className={tableHeadClassName}>Name</TableHead>
                  <TableHead className={tableHeadClassName}>Email</TableHead>
                  <TableHead className={tableHeadClassName}>Department</TableHead>
                  <TableHead className={tableHeadClassName}>Job title</TableHead>
                  <TableHead className={tableHeadClassName}>Status</TableHead>
                  <TableHead className={tableHeadClassName}>Hire date</TableHead>
                  <TableHead className={tableHeadClassName}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.items.map((employee) => (
                  <TableRow
                    key={employee.id}
                    data-state={selection.isSelected(employee.id) ? "selected" : undefined}
                  >
                    <TableSelectRow
                      checked={selection.isSelected(employee.id)}
                      onCheckedChange={() => selection.toggleRow(employee.id)}
                    />
                    <TableCell className="font-medium text-foreground">
                      {employee.firstName} {employee.lastName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{employee.email}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.jobTitle}</TableCell>
                    <TableCell>{statusLabel(employee.status)}</TableCell>
                    <TableCell className="tabular-nums">{employee.hireDate}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="shadow-none"
                        onClick={() => openEdit(employee)}
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

      <EmployeeFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        employee={editing}
      />
    </>
  );
}
