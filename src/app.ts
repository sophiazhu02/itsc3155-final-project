import express from "express";
import { healthRouter } from "./routes/health.js";
import { usersRouter } from "./routes/users.js";
import { companiesRouter } from "./routes/companies.js";
import { jobListingsRouter } from "./routes/jobListings.js";
import { applicationsRouter } from "./routes/applications.js";
import { resumesRouter } from "./routes/resumes.js";
import { postsRouter } from "./routes/posts.js";
import { commentsRouter } from "./routes/comments.js";
import { errorHandler, notFound } from "./middleware/errors.js";

export const app = express();

// Parse JSON request bodies into req.body
app.use(express.json());

// API routes
app.use("/api/health", healthRouter);
app.use("/api/users", usersRouter);           // Role 4 | Done
app.use("/api/companies", companiesRouter);
app.use("/api/job-listings", jobListingsRouter);
app.use("/api/applications", applicationsRouter);
app.use("/api/resumes", resumesRouter);
app.use("/api/posts", postsRouter);
app.use("/api/comments", commentsRouter);

// These must stay last: anything not matched above is a 404,
// and any error thrown above ends up in errorHandler
app.use(notFound);
app.use(errorHandler);

