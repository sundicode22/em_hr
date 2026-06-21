import { eq, inArray } from "drizzle-orm";
import { db } from "@/server/db";
import {
  permissions,
  rolePermissions,
  roles,
  userRoles,
} from "@/server/db/schema";
import type { PermissionName, RoleName } from "@/types/permissions";

export async function getUserRoles(userId: string): Promise<RoleName[]> {
  const rows = await db
    .select({ name: roles.name })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(userRoles.userId, userId));

  return rows.map((r) => r.name as RoleName);
}

export async function getUserPermissions(
  userId: string,
): Promise<PermissionName[]> {
  const userRoleRows = await db
    .select({ roleId: userRoles.roleId })
    .from(userRoles)
    .where(eq(userRoles.userId, userId));

  if (userRoleRows.length === 0) return [];

  const roleIds = userRoleRows.map((r) => r.roleId);

  const rows = await db
    .select({ name: permissions.name })
    .from(rolePermissions)
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(inArray(rolePermissions.roleId, roleIds));

  return [...new Set(rows.map((r) => r.name as PermissionName))];
}

export async function assignRoleToUser(
  userId: string,
  roleName: RoleName,
): Promise<void> {
  const [role] = await db
    .select()
    .from(roles)
    .where(eq(roles.name, roleName))
    .limit(1);

  if (!role) {
    throw new Error(`Role "${roleName}" not found`);
  }

  await db
    .insert(userRoles)
    .values({ userId, roleId: role.id })
    .onConflictDoNothing();
}

export async function userHasPermission(
  userId: string,
  permission: PermissionName,
): Promise<boolean> {
  const userPerms = await getUserPermissions(userId);
  return userPerms.includes(permission);
}

export async function ensureRole(name: RoleName): Promise<string> {
  const [existing] = await db
    .select()
    .from(roles)
    .where(eq(roles.name, name))
    .limit(1);

  if (existing) return existing.id;

  const [created] = await db.insert(roles).values({ name }).returning();
  return created.id;
}

export async function ensurePermission(
  name: PermissionName,
): Promise<string> {
  const [existing] = await db
    .select()
    .from(permissions)
    .where(eq(permissions.name, name))
    .limit(1);

  if (existing) return existing.id;

  const [created] = await db
    .insert(permissions)
    .values({ name })
    .returning();
  return created.id;
}

export async function linkRolePermission(
  roleId: string,
  permissionId: string,
): Promise<void> {
  await db
    .insert(rolePermissions)
    .values({ roleId, permissionId })
    .onConflictDoNothing();
}
