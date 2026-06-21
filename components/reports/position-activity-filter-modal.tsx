"use client";

import { useEffect, useState } from "react";
import { FormModal } from "@/components/modal";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { usePositionOptions } from "@/hooks/api/use-pipeline-report";

type PositionActivityFilterModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  positionIds: string[];
  positionSearch: string;
  onApply: (values: { positionIds: string[]; positionSearch: string }) => void;
};

export function PositionActivityFilterModal({
  open,
  onOpenChange,
  positionIds,
  positionSearch,
  onApply,
}: PositionActivityFilterModalProps) {
  const { data: options } = usePositionOptions();
  const [draftIds, setDraftIds] = useState<string[]>(positionIds);
  const [draftSearch, setDraftSearch] = useState(positionSearch);

  useEffect(() => {
    if (open) {
      setDraftIds(positionIds);
      setDraftSearch(positionSearch);
    }
  }, [open, positionIds, positionSearch]);

  function togglePosition(id: string) {
    setDraftIds((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
    );
  }

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Filter position activity"
      description="Search positions or limit the table to specific roles."
      submitLabel="Apply filters"
      onSubmit={(e) => {
        e.preventDefault();
        onApply({ positionIds: draftIds, positionSearch: draftSearch });
        onOpenChange(false);
      }}
    >
      <FieldGroup className="gap-5">
        <Field>
          <FieldLabel htmlFor="positionSearch">Search positions</FieldLabel>
          <Input
            id="positionSearch"
            placeholder="e.g. Software Engineer"
            value={draftSearch}
            onChange={(e) => setDraftSearch(e.target.value)}
          />
        </Field>
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Positions</p>
          {options?.map((option) => (
            <label key={option.id} className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={draftIds.includes(option.id)}
                onChange={() => togglePosition(option.id)}
                className="size-4 rounded border-input"
              />
              {option.title}
            </label>
          ))}
        </div>
      </FieldGroup>
    </FormModal>
  );
}
