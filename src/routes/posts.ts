import { Router } from "express";
import {
  getAllPosts,
  getPostById,
  getPostsByUser,
  getPostsByJobListing,
  createPost,
  updatePost,
  deletePost,
} from "../dal/posts.js";
import {
  getCommentsByPost,
  createComment,
} from "../dal/comments.js";
import { HttpError } from "../middleware/errors.js";

export const postsRouter = Router();

function validateId(raw: string, label = "Post"): number {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
    throw new HttpError(404, `${label} not found`);
  }
  return id;
}

// GET /api/posts?user_id=&job_listing_id=
postsRouter.get("/", async (req, res) => {
  if (req.query.user_id) {
    const userId = Number(req.query.user_id);
    if (!Number.isInteger(userId) || userId < 1) {
      throw new HttpError(400, "Invalid user_id");
    }
    const posts = await getPostsByUser(userId);
    return res.status(200).json(posts);
  }

  if (req.query.job_listing_id) {
    const jobListingId = Number(req.query.job_listing_id);
    if (!Number.isInteger(jobListingId) || jobListingId < 1) {
      throw new HttpError(400, "Invalid job_listing_id");
    }
    const posts = await getPostsByJobListing(jobListingId);
    return res.status(200).json(posts);
  }

  const posts = await getAllPosts();
  res.status(200).json(posts);
});

// GET /api/posts/:id
postsRouter.get("/:id", async (req, res) => {
  const id = validateId(req.params.id);
  const post = await getPostById(id);
  if (!post) throw new HttpError(404, "Post not found");
  res.status(200).json(post);
});

// POST /api/posts
postsRouter.post("/", async (req, res) => {
  const { user_id, job_listing_id, title, content } = req.body ?? {};

  if (!user_id) throw new HttpError(400, "user_id is required");
  if (typeof title !== "string" || !title.trim()) {
    throw new HttpError(400, "title is required");
  }
  if (typeof content !== "string" || !content.trim()) {
    throw new HttpError(400, "content is required");
  }

  const post = await createPost({
    user_id,
    job_listing_id: job_listing_id ?? null,
    title: title.trim(),
    content: content.trim(),
  });
  res.status(201).json(post);
});

// PATCH /api/posts/:id
postsRouter.patch("/:id", async (req, res) => {
  const id = validateId(req.params.id);
  const { title, content } = req.body ?? {};

  const updates: { title?: string; content?: string } = {};
  if (typeof title === "string") updates.title = title.trim();
  if (typeof content === "string") updates.content = content.trim();

  if (Object.keys(updates).length === 0) {
    throw new HttpError(400, "No valid fields to update");
  }

  const post = await updatePost(id, updates);
  if (!post) throw new HttpError(404, "Post not found");
  res.status(200).json(post);
});

// DELETE /api/posts/:id
postsRouter.delete("/:id", async (req, res) => {
  const id = validateId(req.params.id);
  const deleted = await deletePost(id);
  if (!deleted) throw new HttpError(404, "Post not found");
  res.status(204).send();
});

// ── Comments (nested under posts) ─────────────────────────────────────────────

// GET /api/posts/:id/comments
postsRouter.get("/:id/comments", async (req, res) => {
  const id = validateId(req.params.id);
  const post = await getPostById(id);
  if (!post) throw new HttpError(404, "Post not found");
  const comments = await getCommentsByPost(id);
  res.status(200).json(comments);
});

// POST /api/posts/:id/comments
postsRouter.post("/:id/comments", async (req, res) => {
  const postId = validateId(req.params.id);
  const post = await getPostById(postId);
  if (!post) throw new HttpError(404, "Post not found");

  const { user_id, content } = req.body ?? {};
  if (!user_id) throw new HttpError(400, "user_id is required");
  if (typeof content !== "string" || !content.trim()) {
    throw new HttpError(400, "content is required");
  }

  const comment = await createComment({
    post_id: postId,
    user_id,
    content: content.trim(),
  });
  res.status(201).json(comment);
});
