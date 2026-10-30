import {
  db,
  ApplicationEvent,
  NewApplicationEvent,
} from "../database/database.js";

export async function getEventsByApplication(
  applicationId: number,
): Promise<ApplicationEvent[]> {
  return await db
    .selectFrom("application_events")
    .selectAll()
    .where("application_id", "=", applicationId)
    .orderBy("occurred_at", "asc")
    .execute();
}

export async function getApplicationEventById(
  id: number,
): Promise<ApplicationEvent | undefined> {
  return await db
    .selectFrom("application_events")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
}

export async function createApplicationEvent(
  event: NewApplicationEvent,
): Promise<ApplicationEvent> {
  return await db
    .insertInto("application_events")
    .values(event)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function deleteApplicationEvent(id: number): Promise<boolean> {
  const result = await db
    .deleteFrom("application_events")
    .where("id", "=", id)
    .executeTakeFirst();

  return Number(result.numDeletedRows) > 0;
}
