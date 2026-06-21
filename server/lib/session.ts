import { auth } from "@/auth";
import {
  getUserPermissions,
  getUserRoles,
} from "@/server/services/permission.service";
import type { AuthSessionUser } from "@/types/auth";

export async function getSessionUser(): Promise<AuthSessionUser | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const roles = session.user.roles ?? (await getUserRoles(session.user.id));
  const permissions =
    session.user.permissions ?? (await getUserPermissions(session.user.id));

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name ?? null,
    image: session.user.image ?? null,
    roles,
    permissions,
  };
}
