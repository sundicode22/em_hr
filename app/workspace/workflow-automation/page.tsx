"use client";

import { useMemo, useState } from "react";
import { WorkflowFormModal } from "@/components/workflows/workflow-form-modal";
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
import { useWorkflows } from "@/hooks/api/use-workflows";
import { useTableSelection } from "@/hooks/use-table-selection";
import { cn } from "@/lib/utils";
import type { Workflow } from "@/types/workflow";

export default function WorkflowAutomationPage() {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Workflow | null>(null);
  const { data, isLoading, isError } = useWorkflows({ page, limit: 10 });

  const rowIds = useMemo(
    () => data?.items.map((workflow) => workflow.id) ?? [],
    [data?.items],
  );
  const selection = useTableSelection(rowIds);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(workflow: Workflow) {
    setEditing(workflow);
    setModalOpen(true);
  }

  return (
    <>
      <div className={cn(cardClassName, "p-6")}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Workflow automation</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Automate HR and recruitment workflows.
            </p>
          </div>
          <Button className="shadow-none" onClick={openCreate}>
            Add workflow
          </Button>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading workflows...</p>
        ) : isError ? (
          <p className="text-sm text-destructive">Failed to load workflows.</p>
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
                  <TableHead className={tableHeadClassName}>Trigger</TableHead>
                  <TableHead className={tableHeadClassName}>Action</TableHead>
                  <TableHead className={tableHeadClassName}>Status</TableHead>
                  <TableHead className={tableHeadClassName}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.items.map((workflow) => (
                  <TableRow
                    key={workflow.id}
                    data-state={selection.isSelected(workflow.id) ? "selected" : undefined}
                  >
                    <TableSelectRow
                      checked={selection.isSelected(workflow.id)}
                      onCheckedChange={() => selection.toggleRow(workflow.id)}
                    />
                    <TableCell className="font-medium text-foreground">{workflow.name}</TableCell>
                    <TableCell className="text-muted-foreground">{workflow.trigger}</TableCell>
                    <TableCell>{workflow.action}</TableCell>
                    <TableCell>{workflow.enabled ? "Enabled" : "Disabled"}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="shadow-none"
                        onClick={() => openEdit(workflow)}
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

      <WorkflowFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        workflow={editing}
      />
    </>
  );
}
