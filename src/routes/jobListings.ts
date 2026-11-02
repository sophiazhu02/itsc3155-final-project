import { Router } from "express";
import {
  getAllJobListings,
  getJobListingById,
  getJobListingsByCompany,
  getJobListingsByUser,
  createJobListing,
  updateJobListing,
  deleteJobListing,
} from "../dal/jobListings.js";
import { HttpError } from "../middleware/errors.js";

export const jobListingsRouter = Router();

function validateId(raw: string, label = "Job listing"): number {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
    throw new HttpError(404, `${label} not found`);
  }
  return id;
}

// GET /api/job-listings?company_id=&created_by=
jobListingsRouter.get("/", async (req, res) => {
  if (req.query.company_id) {
    const companyId = Number(req.query.company_id);
    if (!Number.isInteger(companyId) || companyId < 1) {
      throw new HttpError(400, "Invalid company_id");
    }
    const listings = await getJobListingsByCompany(companyId);
    return res.status(200).json(listings);
  }

  if (req.query.created_by) {
    const userId = Number(req.query.created_by);
    if (!Number.isInteger(userId) || userId < 1) {
      throw new HttpError(400, "Invalid created_by");
    }
    const listings = await getJobListingsByUser(userId);
    return res.status(200).json(listings);
  }

  const listings = await getAllJobListings();
  res.status(200).json(listings);
});

// GET /api/job-listings/:id
jobListingsRouter.get("/:id", async (req, res) => {
  const id = validateId(req.params.id);
  const listing = await getJobListingById(id);
  if (!listing) throw new HttpError(404, "Job listing not found");
  res.status(200).json(listing);
});

// POST /api/job-listings
jobListingsRouter.post("/", async (req, res) => {
  const {
    company_id,
    created_by,
    title,
    description,
    location,
    city,
    state,
    employment_type,
    url,
    normalized_url,
    external_job_id,
    posted_at,
  } = req.body ?? {};

  if (typeof title !== "string" || !title.trim()) {
    throw new HttpError(400, "title is required");
  }

  const listing = await createJobListing({
    company_id: company_id ?? null,
    created_by: created_by ?? null,
    title: title.trim(),
    description: description ?? null,
    location: location ?? null,
    city: city ?? null,
    state: state ?? null,
    employment_type: employment_type ?? null,
    url: url ?? null,
    normalized_url: normalized_url ?? null,
    external_job_id: external_job_id ?? null,
    posted_at: posted_at ? new Date(posted_at) : null,
  });
  res.status(201).json(listing);
});

// PATCH /api/job-listings/:id
jobListingsRouter.patch("/:id", async (req, res) => {
  const id = validateId(req.params.id);

  const allowedFields = [
    "title",
    "description",
    "location",
    "city",
    "state",
    "employment_type",
    "url",
    "normalized_url",
    "external_job_id",
    "posted_at",
    "company_id",
  ] as const;

  const updates: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (field in (req.body ?? {})) {
      updates[field] = req.body[field] ?? null;
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new HttpError(400, "No valid fields to update");
  }

  const listing = await updateJobListing(id, updates);
  if (!listing) throw new HttpError(404, "Job listing not found");
  res.status(200).json(listing);
});

// DELETE /api/job-listings/:id
jobListingsRouter.delete("/:id", async (req, res) => {
  const id = validateId(req.params.id);
  const deleted = await deleteJobListing(id);
  if (!deleted) throw new HttpError(404, "Job listing not found");
  res.status(204).send();
});
