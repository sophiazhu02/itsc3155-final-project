import {
  db,
  JobListing,
  NewJobListing,
  JobListingUpdate,
} from "../database/database.js";

export async function getAllJobListings(): Promise<JobListing[]> {
  return await db
    .selectFrom("job_listings")
    .selectAll()
    .orderBy("id", "asc")
    .execute();
}

export async function getJobListingById(
  id: number,
): Promise<JobListing | undefined> {
  return await db
    .selectFrom("job_listings")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
}

export async function getJobListingsByCompany(
  companyId: number,
): Promise<JobListing[]> {
  return await db
    .selectFrom("job_listings")
    .selectAll()
    .where("company_id", "=", companyId)
    .orderBy("id", "asc")
    .execute();
}

export async function getJobListingsByUser(
  userId: number,
): Promise<JobListing[]> {
  return await db
    .selectFrom("job_listings")
    .selectAll()
    .where("created_by", "=", userId)
    .orderBy("id", "asc")
    .execute();
}

export async function getJobListingByNormalizedUrl(
  normalizedUrl: string,
): Promise<JobListing | undefined> {
  return await db
    .selectFrom("job_listings")
    .selectAll()
    .where("normalized_url", "=", normalizedUrl)
    .executeTakeFirst();
}

export async function createJobListing(
  listing: NewJobListing,
): Promise<JobListing> {
  return await db
    .insertInto("job_listings")
    .values(listing)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function updateJobListing(
  id: number,
  updates: JobListingUpdate,
): Promise<JobListing | undefined> {
  return await db
    .updateTable("job_listings")
    .set({ ...updates, updated_at: new Date() })
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
}

export async function deleteJobListing(id: number): Promise<boolean> {
  const result = await db
    .deleteFrom("job_listings")
    .where("id", "=", id)
    .executeTakeFirst();

  return Number(result.numDeletedRows) > 0;
}
