import {
  db,
  Application,
  NewApplication,
  ApplicationUpdate,
} from "../database/database.js";

export async function getApplicationsByUser(
  userId: number,
): Promise<Application[]> {
  return await db
    .selectFrom("applications")
    .selectAll()
    .where("user_id", "=", userId)
    .orderBy("id", "asc")
    .execute();
}

export async function getApplicationById(
  id: number,
): Promise<Application | undefined> {
  return await db
    .selectFrom("applications")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
}

export async function createApplication(
  application: NewApplication,
): Promise<Application> {
  return await db
    .insertInto("applications")
    .values(application)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function updateApplication(
  id: number,
  updates: ApplicationUpdate,
): Promise<Application | undefined> {
  return await db
    .updateTable("applications")
    .set({ ...updates, updated_at: new Date() })
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
}

export async function deleteApplication(id: number): Promise<boolean> {
  const result = await db
    .deleteFrom("applications")
    .where("id", "=", id)
    .executeTakeFirst();

  return Number(result.numDeletedRows) > 0;
}
