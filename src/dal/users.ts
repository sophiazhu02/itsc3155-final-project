import { db, User, NewUser, UserUpdate } from "../database/database.js";

export async function getAllUsers(): Promise<User[]> {
  return await db
    .selectFrom("users")
    .selectAll()
    .orderBy("id", "asc")
    .execute();
}

export async function getUserById(id: number): Promise<User | undefined> {
  return await db
    .selectFrom("users")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
}

export async function getUserByUsername(
  username: string,
): Promise<User | undefined> {
  return await db
    .selectFrom("users")
    .selectAll()
    .where("username", "=", username)
    .executeTakeFirst();
}

export async function getUserByEmail(
  email: string,
): Promise<User | undefined> {
  return await db
    .selectFrom("users")
    .selectAll()
    .where("email", "=", email)
    .executeTakeFirst();
}

export async function createUser(user: NewUser): Promise<User> {
  return await db
    .insertInto("users")
    .values(user)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function updateUser(
  id: number,
  updates: UserUpdate,
): Promise<User | undefined> {
  return await db
    .updateTable("users")
    .set(updates)
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
}

export async function deleteUser(id: number): Promise<boolean> {
  const result = await db
    .deleteFrom("users")
    .where("id", "=", id)
    .executeTakeFirst();

  return Number(result.numDeletedRows) > 0;
}