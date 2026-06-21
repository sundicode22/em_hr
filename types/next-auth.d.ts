import type { PermissionName, RoleName } from "./permissions";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      roles: RoleName[];
      permissions: PermissionName[];
    };
  }

  interface User {
    roles?: RoleName[];
    permissions?: PermissionName[];
  }
}

export type AppJwt = {
  id?: string;
  roles?: RoleName[];
  permissions?: PermissionName[];
};
