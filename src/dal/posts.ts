import {
  db,
  Post,
  NewPost,
  PostUpdate,
} from "../database/database.js";

export async function getAllPosts(): Promise<Post[]> {
  return await db
    .selectFrom("posts")
    .selectAll()
    .orderBy("id", "asc")
    .execute();
}

export async function getPostById(id: number): Promise<Post | undefined> {
  return await db
    .selectFrom("posts")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
}

export async function getPostsByUser(userId: number): Promise<Post[]> {
  return await db
    .selectFrom("posts")
    .selectAll()
    .where("user_id", "=", userId)
    .orderBy("id", "asc")
    .execute();
}

export async function getPostsByJobListing(
  jobListingId: number,
): Promise<Post[]> {
  return await db
    .selectFrom("posts")
    .selectAll()
    .where("job_listing_id", "=", jobListingId)
    .orderBy("id", "asc")
    .execute();
}

export async function createPost(post: NewPost): Promise<Post> {
  return await db
    .insertInto("posts")
    .values(post)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function updatePost(
  id: number,
  updates: PostUpdate,
): Promise<Post | undefined> {
  return await db
    .updateTable("posts")
    .set({ ...updates, updated_at: new Date() })
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
}

export async function deletePost(id: number): Promise<boolean> {
  const result = await db
    .deleteFrom("posts")
    .where("id", "=", id)
    .executeTakeFirst();

  return Number(result.numDeletedRows) > 0;
}
