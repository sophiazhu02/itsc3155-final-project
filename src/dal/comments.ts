import {
  db,
  Comment,
  NewComment,
  CommentUpdate,
} from "../database/database.js";

export async function getCommentsByPost(postId: number): Promise<Comment[]> {
  return await db
    .selectFrom("comments")
    .selectAll()
    .where("post_id", "=", postId)
    .orderBy("id", "asc")
    .execute();
}

export async function getCommentById(
  id: number,
): Promise<Comment | undefined> {
  return await db
    .selectFrom("comments")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
}

export async function createComment(comment: NewComment): Promise<Comment> {
  return await db
    .insertInto("comments")
    .values(comment)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function updateComment(
  id: number,
  updates: CommentUpdate,
): Promise<Comment | undefined> {
  return await db
    .updateTable("comments")
    .set({ ...updates, updated_at: new Date() })
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
}

export async function deleteComment(id: number): Promise<boolean> {
  const result = await db
    .deleteFrom("comments")
    .where("id", "=", id)
    .executeTakeFirst();

  return Number(result.numDeletedRows) > 0;
}
