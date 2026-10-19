import 'dotenv/config';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Kysely, PostgresDialect } from 'kysely';
import { FileMigrationProvider, Migrator } from 'kysely/migration';
import pg from 'pg';

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


const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: fileURLToPath(
      new URL('./migrations/', import.meta.url),
    ),
  }),
});

try {
  const { error, results } = await migrator.migrateToLatest();

  for (const result of results ?? []) {
    console.log(`${result.migrationName}: ${result.status}`);
  }

  if (error) {
    throw error;
  }

  console.log('Database migrations are up to date.');
} catch (error) {
  console.error('Migration failed:', error);
  process.exitCode = 1;
} finally {
  await db.destroy();
}