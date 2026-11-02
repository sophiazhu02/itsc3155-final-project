import { Router } from "express";
import {
  getCommentById,
  updateComment,
  deleteComment,
} from "../dal/comments.js";
import { HttpError } from "../middleware/errors.js";

export const commentsRouter = Router();

function validateId(raw: string): number {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
    throw new HttpError(404, "Comment not found");
  }
  return id;
}

// GET /api/comments/:id
commentsRouter.get("/:id", async (req, res) => {
  const id = validateId(req.params.id);
  const comment = await getCommentById(id);
  if (!comment) throw new HttpError(404, "Comment not found");
  res.status(200).json(comment);
});

// PATCH /api/comments/:id
commentsRouter.patch("/:id", async (req, res) => {
  const id = validateId(req.params.id);
  const { content } = req.body ?? {};

  if (typeof content !== "string" || !content.trim()) {
    throw new HttpError(400, "content is required");
  }

  const comment = await updateComment(id, { content: content.trim() });
  if (!comment) throw new HttpError(404, "Comment not found");
  res.status(200).json(comment);
});

// DELETE /api/comments/:id
commentsRouter.delete("/:id", async (req, res) => {
  const id = validateId(req.params.id);
  const deleted = await deleteComment(id);
  if (!deleted) throw new HttpError(404, "Comment not found");
  res.status(204).send();
});
