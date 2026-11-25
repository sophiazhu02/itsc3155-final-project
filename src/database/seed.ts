// Fills an empty local database with sample data for development.
// Run with: npm run db:seed   (after npm run db:migrate)
import bcrypt from "bcryptjs";
import { db } from "./database.js";

const DEMO_EMAIL = "demo@careersquare.dev";
const DEMO_PASSWORD = "password123";

const companies = [
  { name: "Northline Bank", website: "https://example.com/northline" },
  { name: "Piedmont Health", website: "https://example.com/piedmont" },
  { name: "Queen City Robotics", website: "https://example.com/qcr" },
  { name: "Ardent Software", website: "https://example.com/ardent" },
  { name: "Harbor Analytics", website: "https://example.com/harbor" },
  { name: "Carolina Telecom", website: "https://example.com/carolina" },
];

const listings = [
  { company: "Northline Bank", title: "Software Engineer Intern, Summer 2027", city: "Charlotte", state: "NC", location: null, employment_type: "Internship" },
  { company: "Piedmont Health", title: "Data Analyst Intern", city: "Charlotte", state: "NC", location: null, employment_type: "Internship" },
  { company: "Queen City Robotics", title: "Embedded Software Intern", city: "Charlotte", state: "NC", location: null, employment_type: "Internship" },
  { company: "Ardent Software", title: "Frontend Developer Intern", city: null, state: null, location: "Remote", employment_type: "Internship" },
  { company: "Harbor Analytics", title: "Software Developer, New Grad 2027", city: "Raleigh", state: "NC", location: null, employment_type: "Full-time" },
  { company: "Carolina Telecom", title: "Cloud Support Co-op, Spring 2027", city: "Charlotte", state: "NC", location: null, employment_type: "Co-op" },
];

// [listing index, title, content]
const posts: [number, string, string][] = [
  [0, "OA timeline?", "Applied two weeks ago. Has anyone received the online assessment yet?"],
  [0, "Final round format", "Three back-to-back interviews: two technical, one behavioral."],
  [0, "Referral worth it?", "Did a referral speed things up for anyone?"],
  [1, "SQL questions", "The technical screen was mostly SQL joins and window functions."],
  [1, "Heard back", "Got an offer email last Friday, good luck everyone!"],
  [2, "C or C++?", "Does anyone know which language the coding round uses?"],
  [3, "Fully remote?", "Is this remote within the US only?"],
];

async function seed() {
  const existing = await db
    .selectFrom("companies")
    .select("id")
    .limit(1)
    .executeTakeFirst();

  if (existing) {
    console.log("Database already has data, skipping seed.");
    return;
  }

  await db.transaction().execute(async (trx) => {
    const demoUser =
      (await trx
        .selectFrom("users")
        .select("id")
        .where("email", "=", DEMO_EMAIL)
        .executeTakeFirst()) ??
      (await trx
        .insertInto("users")
        .values({
          name: "Demo User",
          email: DEMO_EMAIL,
          password_hash: await bcrypt.hash(DEMO_PASSWORD, 10),
        })
        .returning("id")
        .executeTakeFirstOrThrow());

    const insertedCompanies = await trx
      .insertInto("companies")
      .values(companies)
      .returning(["id", "name"])
      .execute();
    const companyIds = new Map(insertedCompanies.map((c) => [c.name, c.id]));

    const insertedListings = await trx
      .insertInto("job_listings")
      .values(
        listings.map(({ company, ...listing }) => ({
          ...listing,
          company_id: companyIds.get(company)!,
          created_by: demoUser.id,
        })),
      )
      .returning("id")
      .execute();

    await trx
      .insertInto("posts")
      .values(
        posts.map(([listingIndex, title, content]) => ({
          user_id: demoUser.id,
          job_listing_id: insertedListings[listingIndex].id,
          title,
          content,
        })),
      )
      .execute();
  });

  console.log(
    `Seeded ${companies.length} companies, ${listings.length} job listings and ${posts.length} posts.`,
  );
  console.log(`Demo login: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
}

try {
  await seed();
} catch (error) {
  console.error("Seed failed:", error);
  process.exitCode = 1;
} finally {
  await db.destroy();
}
