import { desc } from "drizzle-orm";
import { db } from "@/server/db";
import { positions } from "@/server/db/schema";

export async function listPositions() {
  return db.select().from(positions).orderBy(desc(positions.createdAt));
}
