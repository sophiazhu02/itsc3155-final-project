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

export interface CompaniesTable {
  id: Generated<number>;
  name: string;
  website: string | null;
  created_at: Generated<Date>;
}

export interface JobListingsTable {
  id: Generated<number>;
  company_id: number | null;
  created_by: number | null;
  title: string;
  description: string | null;
  location: string | null;
  city: string | null;
  state: string | null;
  employment_type: string | null;
  url: string | null;
  normalized_url: string | null;
  external_job_id: string | null;
  posted_at: Date | null;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface ApplicationsTable {
  id: Generated<number>;
  user_id: number;
  job_listing_id: number;
  resume_id: number | null;
  status: string;
  applied_at: Date | null;
  notes: string | null;
  share_insights: Generated<boolean>;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface ApplicationEventsTable {
  id: Generated<number>;
  application_id: number;
  event_type: string;
  occurred_at: Date;
  notes: string | null;
  created_at: Generated<Date>;
}

export interface ResumesTable {
  id: Generated<number>;
  user_id: number;
  name: string;
  storage_key: string;
  original_filename: string;
  content_type: string;
  uploaded_at: Generated<Date>;
}

export interface PostsTable {
  id: Generated<number>;
  user_id: number;
  job_listing_id: number | null;
  title: string;
  content: string;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface CommentsTable {
  id: Generated<number>;
  user_id: number;
  post_id: number;
  content: string;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface Database {
  users: UsersTable;
  companies: CompaniesTable;
  job_listings: JobListingsTable;
  applications: ApplicationsTable;
  application_events: ApplicationEventsTable;
  resumes: ResumesTable;
  posts: PostsTable;
  comments: CommentsTable;
}

export type User = Selectable<UsersTable>;
export type PublicUser = Omit<User, "password_hash">;
export type NewUser = Insertable<UsersTable>;
export type UserUpdate = Updateable<UsersTable>;

export type Company = Selectable<CompaniesTable>;
export type NewCompany = Insertable<CompaniesTable>;
export type CompanyUpdate = Updateable<CompaniesTable>;

export type JobListing = Selectable<JobListingsTable>;
export type NewJobListing = Insertable<JobListingsTable>;
export type JobListingUpdate = Updateable<JobListingsTable>;

export type Application = Selectable<ApplicationsTable>;
export type NewApplication = Insertable<ApplicationsTable>;
export type ApplicationUpdate = Updateable<ApplicationsTable>;

export type ApplicationEvent = Selectable<ApplicationEventsTable>;
export type NewApplicationEvent = Insertable<ApplicationEventsTable>;

export type Resume = Selectable<ResumesTable>;
export type NewResume = Insertable<ResumesTable>;
export type ResumeUpdate = Updateable<ResumesTable>;

export type Post = Selectable<PostsTable>;
export type NewPost = Insertable<PostsTable>;
export type PostUpdate = Updateable<PostsTable>;

export type Comment = Selectable<CommentsTable>;
export type NewComment = Insertable<CommentsTable>;
export type CommentUpdate = Updateable<CommentsTable>;

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString:
        process.env.DATABASE_URL ||
        'postgres://postgres:postgres@localhost:5432/forum',
    }),
  }),
});