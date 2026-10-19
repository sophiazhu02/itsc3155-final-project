import { Router } from "express";
import { getAllUsers, getUserById, createUser } from "../dal/users.js";
import { HttpError } from "../middleware/errors.js";
import bcrypt from "bcryptjs";

export const usersRouter = Router();

// Postgres error code for a unique constraint violation
function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    (err as { code?: string }).code === "23505"
  );
}

usersRouter.get("/", async (_req, res) => {
  const users = await getAllUsers();
  res.status(200).json(users);
});

usersRouter.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  // 2147483647 is the max value of a Postgres integer column
  if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
    throw new HttpError(404, "User not found");
  }

  const user = await getUserById(id);

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  res.status(200).json(user);
});

usersRouter.post("/", async (req, res) => {
  const { name, email, password } = req.body ?? {};

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    !name.trim() ||
    !email.trim()
  ) {
    throw new HttpError(400, "name, email, and password are required");
  }

  if (password.length < 8) {
    throw new HttpError(400, "password must be at least 8 characters");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const user = await createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password_hash: passwordHash,
    });
    res.status(201).json(user);
  } catch (err) {
    if (isUniqueViolation(err)) {
      throw new HttpError(409, "email already exists");
    }
    throw err;
  }
});