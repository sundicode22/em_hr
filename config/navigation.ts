import type { PermissionName } from "@/types/permissions";

export type NavItem = {
  title: string;
  href: string;
  permission?: PermissionName;
};

export type NavGroup = {
  title: string;
  permission?: PermissionName;
  items: NavItem[];
};

export type NavEntry =
  | ({ type: "link" } & NavItem)
  | ({ type: "group" } & NavGroup);

export const mainNavigation: NavEntry[] = [
  { type: "link", title: "Dashboard", href: "/workspace/dashboard" },
  {
    type: "link",
    title: "Employee",
    href: "/workspace/employees",
    permission: "employees:read",
  },
  {
    type: "link",
    title: "Payroll",
    href: "/workspace/payroll",
    permission: "payroll:read",
  },
  {
    type: "group",
    title: "Reports",
    permission: "reports:read",
    items: [
      {
        title: "Communications insights",
        href: "/workspace/reports/communications",
      },
      { title: "Pipeline insights", href: "/workspace/reports/pipeline" },
      { title: "Team activity", href: "/workspace/reports/team-activity" },
    ],
  },
  {
    type: "link",
    title: "HR settings",
    href: "/workspace/settings/hr",
  },
  {
    type: "link",
    title: "Workflow automation",
    href: "/workspace/workflow-automation",
    permission: "workflows:read",
  },
];

export const footerNavigation: NavItem[] = [
  { title: "Profile", href: "/workspace/profile" },
  { title: "Help and resource", href: "/workspace/help" },
];

export type BreadcrumbSegment = {
  label: string;
  href?: string;
};

export const routeBreadcrumbs: Record<string, BreadcrumbSegment[]> = {
  "/workspace/dashboard": [{ label: "Dashboard" }],
  "/workspace/employees": [{ label: "Employee" }],
  "/workspace/payroll": [{ label: "Payroll" }],
  "/workspace/reports/communications": [
    { label: "Reports", href: "/workspace/reports/pipeline" },
    { label: "Communications insights" },
  ],
  "/workspace/reports/pipeline": [
    { label: "Reports", href: "/workspace/reports/pipeline" },
    { label: "Pipeline insights" },
  ],
  "/workspace/reports/team-activity": [
    { label: "Reports", href: "/workspace/reports/pipeline" },
    { label: "Team activity" },
  ],
  "/workspace/settings/hr": [{ label: "HR settings" }],
  "/workspace/workflow-automation": [{ label: "Workflow automation" }],
  "/workspace/profile": [{ label: "Profile" }],
  "/workspace/help": [{ label: "Help and resource" }],
};

export function getBreadcrumbs(pathname: string): BreadcrumbSegment[] {
  return routeBreadcrumbs[pathname] ?? [{ label: "Workspace" }];
}
