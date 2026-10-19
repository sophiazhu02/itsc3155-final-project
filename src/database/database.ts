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
  name: string;
  email: string;
  password_hash: string;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface Database {
  users: UsersTable;
}

export type User = Selectable<UsersTable>;
export type PublicUser = Omit<User, "password_hash">;
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