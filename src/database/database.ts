import 'dotenv/config';
import {
  Kysely,
  PostgresDialect,
  Generated,
  Selectable,
  Insertable,
  Updateable,
} from 'kysely';
import pg from 'pg';

const { Pool } = pg;

export interface UsersTable {
  id: Generated<number>;
  username: string;
  email: string;
  created_at: Generated<Date>;
}

export interface Database {
  users: UsersTable;
}

export type User = Selectable<UsersTable>;
export type NewUser = Insertable<UsersTable>;
export type UserUpdate = Updateable<UsersTable>;

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString:
        process.env.DATABASE_URL ||
        'postgres://postgres:postgres@localhost:5432/forum',
    }),
  }),
});