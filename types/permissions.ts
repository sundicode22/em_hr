export const ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];

export const PERMISSIONS = {
  USERS_READ: "users:read",
  USERS_WRITE: "users:write",
  WORKSPACE_ACCESS: "workspace:access",
  EMPLOYEES_READ: "employees:read",
  EMPLOYEES_WRITE: "employees:write",
  PAYROLL_READ: "payroll:read",
  PAYROLL_WRITE: "payroll:write",
  REPORTS_READ: "reports:read",
  SETTINGS_READ: "settings:read",
  SETTINGS_WRITE: "settings:write",
  WORKFLOWS_READ: "workflows:read",
  WORKFLOWS_WRITE: "workflows:write",
} as const;

export type PermissionName =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS = Object.values(PERMISSIONS);

export const DEFAULT_ROLE_PERMISSIONS: Record<
  RoleName,
  PermissionName[]
> = {
  [ROLES.ADMIN]: ALL_PERMISSIONS,
  [ROLES.USER]: [
    PERMISSIONS.WORKSPACE_ACCESS,
    PERMISSIONS.REPORTS_READ,
    PERMISSIONS.EMPLOYEES_READ,
    PERMISSIONS.SETTINGS_READ,
  ],
};
