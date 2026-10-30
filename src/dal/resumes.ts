import {
  db,
  Resume,
  NewResume,
  ResumeUpdate,
} from "../database/database.js";

export async function getResumesByUser(userId: number): Promise<Resume[]> {
  return await db
    .selectFrom("resumes")
    .selectAll()
    .where("user_id", "=", userId)
    .orderBy("id", "asc")
    .execute();
}

export async function getResumeById(
  id: number,
): Promise<Resume | undefined> {
  return await db
    .selectFrom("resumes")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
}

export async function createResume(resume: NewResume): Promise<Resume> {
  return await db
    .insertInto("resumes")
    .values(resume)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function updateResume(
  id: number,
  updates: ResumeUpdate,
): Promise<Resume | undefined> {
  return await db
    .updateTable("resumes")
    .set(updates)
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
}

export async function deleteResume(id: number): Promise<boolean> {
  const result = await db
    .deleteFrom("resumes")
    .where("id", "=", id)
    .executeTakeFirst();

  return Number(result.numDeletedRows) > 0;
}
