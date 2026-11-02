import {
  db,
  Company,
  NewCompany,
  CompanyUpdate,
} from "../database/database.js";

export async function getAllCompanies(): Promise<Company[]> {
  return await db
    .selectFrom("companies")
    .selectAll()
    .orderBy("id", "asc")
    .execute();
}

export async function getCompanyById(
  id: number,
): Promise<Company | undefined> {
  return await db
    .selectFrom("companies")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
}

export async function createCompany(company: NewCompany): Promise<Company> {
  return await db
    .insertInto("companies")
    .values(company)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function updateCompany(
  id: number,
  updates: CompanyUpdate,
): Promise<Company | undefined> {
  return await db
    .updateTable("companies")
    .set(updates)
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
}

export async function deleteCompany(id: number): Promise<boolean> {
  const result = await db
    .deleteFrom("companies")
    .where("id", "=", id)
    .executeTakeFirst();

  return Number(result.numDeletedRows) > 0;
}
