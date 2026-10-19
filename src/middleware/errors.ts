import type { ErrorRequestHandler, RequestHandler } from "express";

// Throw this from a route to send a specific status code,
// e.g. throw new HttpError(404, "User not found")
export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

export const notFound: RequestHandler = (req, _res, next) => {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

// Express treats middleware with 4 parameters as an error handler
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // express.json() sets status 400 on malformed JSON bodies
  const status = err instanceof HttpError ? err.status : (err.status ?? 500);

  if (status >= 500) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }

  res.status(status).json({ error: err.message });
};
