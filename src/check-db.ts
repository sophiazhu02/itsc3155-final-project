import 'dotenv/config';
import { Kysely, PostgresDialect, sql } from 'kysely';
import pg from 'pg';

// Check if the DATABASE_URL environment variable is set
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing from .env');
}

const db = new Kysely<{}>({
  dialect: new PostgresDialect({
    pool: new pg.Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
});

try {
  const result = await sql<{ database: string }>`
    SELECT current_database() AS database
  `.execute(db);

  console.log('Connected to:', result.rows[0]?.database);
} catch (error) {
  console.error('Database connection failed:', error);
  process.exitCode = 1;
} finally {
  await db.destroy();
}