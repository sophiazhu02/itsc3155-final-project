import { Router } from "express";
import {
  getResumesByUser,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
} from "../dal/resumes.js";
import { HttpError } from "../middleware/errors.js";

export const resumesRouter = Router();

function validateId(raw: string): number {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
    throw new HttpError(404, "Resume not found");
  }
  return id;
}

// GET /api/resumes?user_id=
resumesRouter.get("/", async (req, res) => {
  if (!req.query.user_id) {
    throw new HttpError(400, "user_id query parameter is required");
  }
  const userId = Number(req.query.user_id);
  if (!Number.isInteger(userId) || userId < 1) {
    throw new HttpError(400, "Invalid user_id");
  }
  const resumes = await getResumesByUser(userId);
  res.status(200).json(resumes);
});

// GET /api/resumes/:id
resumesRouter.get("/:id", async (req, res) => {
  const id = validateId(req.params.id);
  const resume = await getResumeById(id);
  if (!resume) throw new HttpError(404, "Resume not found");
  res.status(200).json(resume);
});

// POST /api/resumes
// Note: actual file upload (to object storage) is handled separately.
// This endpoint registers the resume metadata after the file has been stored.
resumesRouter.post("/", async (req, res) => {
  const { user_id, name, storage_key, original_filename, content_type } =
    req.body ?? {};

  if (!user_id) throw new HttpError(400, "user_id is required");
  if (typeof name !== "string" || !name.trim()) {
    throw new HttpError(400, "name is required");
  }
  if (typeof storage_key !== "string" || !storage_key.trim()) {
    throw new HttpError(400, "storage_key is required");
  }
  if (typeof original_filename !== "string" || !original_filename.trim()) {
    throw new HttpError(400, "original_filename is required");
  }
  if (typeof content_type !== "string" || !content_type.trim()) {
    throw new HttpError(400, "content_type is required");
  }

  const resume = await createResume({
    user_id,
    name: name.trim(),
    storage_key: storage_key.trim(),
    original_filename: original_filename.trim(),
    content_type: content_type.trim(),
  });
  res.status(201).json(resume);
});

// PATCH /api/resumes/:id
resumesRouter.patch("/:id", async (req, res) => {
  const id = validateId(req.params.id);
  const { name } = req.body ?? {};

  if (typeof name !== "string" || !name.trim()) {
    throw new HttpError(400, "name is required");
  }

  const resume = await updateResume(id, { name: name.trim() });
  if (!resume) throw new HttpError(404, "Resume not found");
  res.status(200).json(resume);
});

// DELETE /api/resumes/:id
resumesRouter.delete("/:id", async (req, res) => {
  const id = validateId(req.params.id);
  const deleted = await deleteResume(id);
  if (!deleted) throw new HttpError(404, "Resume not found");
  res.status(204).send();
});
