import {
  db,
  User,
  NewUser,
  UserUpdate,
  PublicUser,
} from "../database/database.js";

// Everything except password_hash
const publicColumns = [
  "id",
  "name",
  "email",
  "created_at",
  "updated_at",
] as const;

export async function getAllUsers(): Promise<PublicUser[]> {
  return await db
    .selectFrom("users")
    .select(publicColumns)
    .orderBy("id", "asc")
    .execute();
}

export async function getUserById(id: number): Promise<PublicUser | undefined> {
  return await db
    .selectFrom("users")
    .select(publicColumns)
    .where("id", "=", id)
    .executeTakeFirst();
}

export async function getUserByEmail(
  email: string,
): Promise<PublicUser | undefined> {
  return await db
    .selectFrom("users")
    .select(publicColumns)
    .where("email", "=", email)
    .executeTakeFirst();
}

// For login only: this one returns password_hash, so never send it to a client
export async function getUserAuthByEmail(
  email: string,
): Promise<User | undefined> {
  return await db
    .selectFrom("users")
    .selectAll()
    .where("email", "=", email)
    .executeTakeFirst();
}

export async function createUser(user: NewUser): Promise<PublicUser> {
  return await db
    .insertInto("users")
    .values(user)
    .returning(publicColumns)
    .executeTakeFirstOrThrow();
}

export async function updateUser(
  id: number,
  updates: UserUpdate,
): Promise<PublicUser | undefined> {
  return await db
    .updateTable("users")
    .set({ ...updates, updated_at: new Date() })
    .where("id", "=", id)
    .returning(publicColumns)
    .executeTakeFirst();
}

export async function deleteUser(id: number): Promise<boolean> {
  const result = await db
    .deleteFrom("users")
    .where("id", "=", id)
    .executeTakeFirst();

  return Number(result.numDeletedRows) > 0;
}