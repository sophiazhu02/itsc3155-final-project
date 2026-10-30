import { Router } from "express";
import {
  getApplicationsByUser,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
} from "../dal/applications.js";
import {
  getEventsByApplication,
  createApplicationEvent,
  deleteApplicationEvent,
} from "../dal/applicationEvents.js";
import { HttpError } from "../middleware/errors.js";

export const applicationsRouter = Router();

function validateId(raw: string, label = "Application"): number {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
    throw new HttpError(404, `${label} not found`);
  }
  return id;
}

// GET /api/applications?user_id=
applicationsRouter.get("/", async (req, res) => {
  if (!req.query.user_id) {
    throw new HttpError(400, "user_id query parameter is required");
  }
  const userId = Number(req.query.user_id);
  if (!Number.isInteger(userId) || userId < 1) {
    throw new HttpError(400, "Invalid user_id");
  }
  const applications = await getApplicationsByUser(userId);
  res.status(200).json(applications);
});

// GET /api/applications/:id
applicationsRouter.get("/:id", async (req, res) => {
  const id = validateId(req.params.id);
  const application = await getApplicationById(id);
  if (!application) throw new HttpError(404, "Application not found");
  res.status(200).json(application);
});

// POST /api/applications
applicationsRouter.post("/", async (req, res) => {
  const { user_id, job_listing_id, resume_id, status, applied_at, notes, share_insights } =
    req.body ?? {};

  if (!user_id || !job_listing_id) {
    throw new HttpError(400, "user_id and job_listing_id are required");
  }
  if (typeof status !== "string" || !status.trim()) {
    throw new HttpError(400, "status is required");
  }

  const application = await createApplication({
    user_id,
    job_listing_id,
    resume_id: resume_id ?? null,
    status: status.trim(),
    applied_at: applied_at ? new Date(applied_at) : null,
    notes: notes ?? null,
    share_insights: share_insights ?? undefined,
  });
  res.status(201).json(application);
});

// PATCH /api/applications/:id
applicationsRouter.patch("/:id", async (req, res) => {
  const id = validateId(req.params.id);
  const { status, resume_id, notes, share_insights, applied_at } = req.body ?? {};

  const updates: Record<string, unknown> = {};
  if (typeof status === "string") updates.status = status.trim();
  if ("resume_id" in (req.body ?? {})) updates.resume_id = resume_id ?? null;
  if ("notes" in (req.body ?? {})) updates.notes = notes ?? null;
  if (typeof share_insights === "boolean") updates.share_insights = share_insights;
  if ("applied_at" in (req.body ?? {})) updates.applied_at = applied_at ? new Date(applied_at) : null;

  if (Object.keys(updates).length === 0) {
    throw new HttpError(400, "No valid fields to update");
  }

  const application = await updateApplication(id, updates);
  if (!application) throw new HttpError(404, "Application not found");
  res.status(200).json(application);
});

// DELETE /api/applications/:id
applicationsRouter.delete("/:id", async (req, res) => {
  const id = validateId(req.params.id);
  const deleted = await deleteApplication(id);
  if (!deleted) throw new HttpError(404, "Application not found");
  res.status(204).send();
});

// ── Application Events (nested) ───────────────────────────────────────────────

// GET /api/applications/:id/events
applicationsRouter.get("/:id/events", async (req, res) => {
  const id = validateId(req.params.id);
  const application = await getApplicationById(id);
  if (!application) throw new HttpError(404, "Application not found");
  const events = await getEventsByApplication(id);
  res.status(200).json(events);
});

// POST /api/applications/:id/events
applicationsRouter.post("/:id/events", async (req, res) => {
  const applicationId = validateId(req.params.id);
  const application = await getApplicationById(applicationId);
  if (!application) throw new HttpError(404, "Application not found");

  const { event_type, occurred_at, notes } = req.body ?? {};

  if (typeof event_type !== "string" || !event_type.trim()) {
    throw new HttpError(400, "event_type is required");
  }
  if (!occurred_at) {
    throw new HttpError(400, "occurred_at is required");
  }

  const event = await createApplicationEvent({
    application_id: applicationId,
    event_type: event_type.trim(),
    occurred_at: new Date(occurred_at),
    notes: notes ?? null,
  });
  res.status(201).json(event);
});

// DELETE /api/applications/:id/events/:eventId
applicationsRouter.delete("/:id/events/:eventId", async (req, res) => {
  validateId(req.params.id); // ensure parent app id is valid
  const eventId = validateId(req.params.eventId, "Application event");
  const deleted = await deleteApplicationEvent(eventId);
  if (!deleted) throw new HttpError(404, "Application event not found");
  res.status(204).send();
});
