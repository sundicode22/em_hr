export type Workflow = {
  id: string;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
  createdAt: string;
};

export type WorkflowInput = {
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
};

export function workflowToFormValues(workflow: Workflow): WorkflowInput {
  return {
    name: workflow.name,
    trigger: workflow.trigger,
    action: workflow.action,
    enabled: workflow.enabled,
  };
}

export const emptyWorkflowForm: WorkflowInput = {
  name: "",
  trigger: "",
  action: "",
  enabled: true,
};
