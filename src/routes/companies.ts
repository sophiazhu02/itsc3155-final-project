import { Router } from "express";
import {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../dal/companies.js";
import { HttpError } from "../middleware/errors.js";

export const companiesRouter = Router();

function validateId(raw: string): number {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
    throw new HttpError(404, "Company not found");
  }
  return id;
}

// GET /api/companies
companiesRouter.get("/", async (_req, res) => {
  const companies = await getAllCompanies();
  res.status(200).json(companies);
});

// GET /api/companies/:id
companiesRouter.get("/:id", async (req, res) => {
  const id = validateId(req.params.id);
  const company = await getCompanyById(id);
  if (!company) throw new HttpError(404, "Company not found");
  res.status(200).json(company);
});

// POST /api/companies
companiesRouter.post("/", async (req, res) => {
  const { name, website } = req.body ?? {};

  if (typeof name !== "string" || !name.trim()) {
    throw new HttpError(400, "name is required");
  }

  const company = await createCompany({
    name: name.trim(),
    website: typeof website === "string" ? website.trim() || null : null,
  });
  res.status(201).json(company);
});

// PATCH /api/companies/:id
companiesRouter.patch("/:id", async (req, res) => {
  const id = validateId(req.params.id);
  const { name, website } = req.body ?? {};

  const updates: { name?: string; website?: string | null } = {};
  if (typeof name === "string") updates.name = name.trim();
  if (typeof website === "string") updates.website = website.trim() || null;

  if (Object.keys(updates).length === 0) {
    throw new HttpError(400, "No valid fields to update");
  }

  const company = await updateCompany(id, updates);
  if (!company) throw new HttpError(404, "Company not found");
  res.status(200).json(company);
});

// DELETE /api/companies/:id
companiesRouter.delete("/:id", async (req, res) => {
  const id = validateId(req.params.id);
  const deleted = await deleteCompany(id);
  if (!deleted) throw new HttpError(404, "Company not found");
  res.status(204).send();
});
