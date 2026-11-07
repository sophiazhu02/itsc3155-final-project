import 'dotenv/config';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Kysely, PostgresDialect } from 'kysely';
import { Migrator, type Migration, type MigrationProvider } from 'kysely/migration';
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


const migrationFolder = fileURLToPath(new URL('./migrations/', import.meta.url));

// Kysely's FileMigrationProvider imports plain paths like C:\...\file.ts,
// which Node rejects on Windows. Importing file:// URLs works on every OS.
const provider: MigrationProvider = {
  async getMigrations() {
    const migrations: Record<string, Migration> = {};

    for (const fileName of await fs.readdir(migrationFolder)) {
      if (!/\.(ts|js)$/.test(fileName) || fileName.endsWith('.d.ts')) continue;

      const fileUrl = pathToFileURL(path.join(migrationFolder, fileName)).href;
      const migration = await import(fileUrl);
      migrations[fileName.replace(/\.(ts|js)$/, '')] = migration;
    }

    return migrations;
  },
};

const migrator = new Migrator({ db, provider });

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