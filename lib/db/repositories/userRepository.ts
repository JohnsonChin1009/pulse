import { db } from "@/lib/db/connection";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type UserInsert = typeof users.$inferInsert;
type UserRow = typeof users.$inferSelect;

export const usersRepository = {
  // Creating a new user
  async create(data: UserInsert): Promise<UserRow> {
    const [row] = await db.insert(users).values(data).returning();
    return row;
  },

  async getById(id: string): Promise<UserRow | null> {
    const [row] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return row ?? null;
  },

  async list(): Promise<UserRow[]> {
    return db.select().from(users);
  },

  async update(id: string, data: Partial<UserInsert>): Promise<UserRow | null> {
    const [row] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return row ?? null;
  },

  async remove(id: string): Promise<UserRow | null> {
    const [row] = await db.delete(users).where(eq(users.id, id)).returning();
    return row ?? null;
  },

  // Selecting all user from the database to Create Chat Session
  async listUser(): Promise<
    { id: string; username: string; profile_picture_url: string | null; online_status: boolean }[]
  > {
    return db
      .select({
        id: users.id,
        username: users.username,
        profile_picture_url: users.profile_picture_url,
        online_status: users.online_status,
      })
      .from(users);
  },
};
