import express from "express";
import { healthRouter } from "./routes/health.js";
import { usersRouter } from "./routes/users.js";
import { errorHandler, notFound } from "./middleware/errors.js";

export const app = express();

// Parse JSON request bodies into req.body
app.use(express.json());

// API routes
app.use("/api/health", healthRouter);
app.use("/api/users", usersRouter); // Role 4 | Done

// These must stay last: anything not matched above is a 404,
// and any error thrown above ends up in errorHandler
app.use(notFound);
app.use(errorHandler);
