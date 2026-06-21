import { count, desc, eq } from "drizzle-orm";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { buildPaginationMeta } from "@/server/lib/response";
import type { PaginatedData } from "@/types/api";
import type { UserPublic } from "@/types/auth";

function toUserPublic(user: typeof users.$inferSelect): UserPublic {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function findUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return user ?? null;
}

export async function findUserById(id: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return user ?? null;
}

export async function createUser(input: {
  email: string;
  name?: string;
  passwordHash?: string;
  image?: string;
}) {
  const [user] = await db
    .insert(users)
    .values({
      email: input.email,
      name: input.name ?? null,
      passwordHash: input.passwordHash ?? null,
      image: input.image ?? null,
    })
    .returning();
  return user;
}

export async function listUsersPaginated(
  page: number,
  limit: number,
  offset: number,
): Promise<PaginatedData<UserPublic>> {
  const [totalRow] = await db.select({ value: count() }).from(users);
  const total = totalRow?.value ?? 0;

  const rows = await db
    .select()
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(limit)
    .offset(offset);

  return {
    items: rows.map(toUserPublic),
    pagination: buildPaginationMeta(page, limit, total),
  };
}
