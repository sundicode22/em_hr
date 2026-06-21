"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableHead } from "@/components/ui/table";

type TableSelectAllProps = {
  checked: boolean;
  indeterminate?: boolean;
  onCheckedChange: () => void;
  disabled?: boolean;
};

export function TableSelectAll({
  checked,
  indeterminate,
  onCheckedChange,
  disabled,
}: TableSelectAllProps) {
  return (
    <TableHead className="w-12 text-xs text-muted-foreground">
      <Checkbox
        checked={indeterminate ? "indeterminate" : checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-label="Select all rows"
      />
    </TableHead>
  );
}

type TableSelectRowProps = {
  checked: boolean;
  onCheckedChange: () => void;
  disabled?: boolean;
};

export function TableSelectRow({
  checked,
  onCheckedChange,
  disabled,
}: TableSelectRowProps) {
  return (
    <TableCell>
      <Checkbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-label="Select row"
      />
    </TableCell>
  );
}

export const tableHeadClassName = "text-xs font-medium text-muted-foreground";
