import type { PermissionName, RoleName } from "./permissions";

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
};

export type AuthSessionUser = AuthUser & {
  roles: RoleName[];
  permissions: PermissionName[];
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type UserPublic = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  createdAt: string;
};
