"use client";

import { useEffect, useState } from "react";
import { FormModal } from "@/components/modal";
import { FieldGroup } from "@/components/ui/field";
import { PIPELINE_STAGE_LABELS, type PipelineStage } from "@/types/pipeline";
import { ALL_PIPELINE_STAGES } from "@/types/report";

type PipelineStageFilterModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStages: PipelineStage[];
  onApply: (stages: PipelineStage[]) => void;
};

export function PipelineStageFilterModal({
  open,
  onOpenChange,
  selectedStages,
  onApply,
}: PipelineStageFilterModalProps) {
  const [draft, setDraft] = useState<PipelineStage[]>(selectedStages);

  useEffect(() => {
    if (open) setDraft(selectedStages);
  }, [open, selectedStages]);

  function toggleStage(stage: PipelineStage) {
    setDraft((prev) =>
      prev.includes(stage) ? prev.filter((s) => s !== stage) : [...prev, stage],
    );
  }

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Filter pipeline stages"
      description="Choose which stages appear in the pipeline overview chart."
      submitLabel="Apply filters"
      onSubmit={(e) => {
        e.preventDefault();
        onApply(draft.length > 0 ? draft : ALL_PIPELINE_STAGES);
        onOpenChange(false);
      }}
    >
      <FieldGroup className="gap-3">
        {ALL_PIPELINE_STAGES.map((stage) => (
          <label key={stage} className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={draft.includes(stage)}
              onChange={() => toggleStage(stage)}
              className="size-4 rounded border-input"
            />
            {PIPELINE_STAGE_LABELS[stage]}
          </label>
        ))}
      </FieldGroup>
    </FormModal>
  );
}
