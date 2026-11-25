import { sql } from "kysely";
import {
  db,
  JobListing,
  NewJobListing,
  JobListingUpdate,
} from "../database/database.js";

// A listing plus the extra fields the Job Listings page shows
export type JobListingSummary = JobListing & {
  company_name: string | null;
  post_count: number;
};

export async function getJobListingSummaries(
  filters: { companyId?: number; createdBy?: number } = {},
): Promise<JobListingSummary[]> {
  let query = db
    .selectFrom("job_listings as jl")
    .leftJoin("companies as c", "c.id", "jl.company_id")
    .leftJoin("posts as p", "p.job_listing_id", "jl.id")
    .selectAll("jl")
    .select([
      "c.name as company_name",
      sql<number>`count(p.id)::int`.as("post_count"),
    ])
    .groupBy(["jl.id", "c.id"])
    .orderBy("jl.id", "asc");

  if (filters.companyId !== undefined) {
    query = query.where("jl.company_id", "=", filters.companyId);
  }
  if (filters.createdBy !== undefined) {
    query = query.where("jl.created_by", "=", filters.createdBy);
  }

  return await query.execute();
}

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
