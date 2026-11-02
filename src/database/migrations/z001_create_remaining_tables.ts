import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {

  //companies table
  //job_listings table
  //resumes table
  //applications table
  //application_events table
  await db.schema
    .createTable('companies')
    .addColumn('id', 'integer', (col) =>
      col.generatedAlwaysAsIdentity().primaryKey(),
    )
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('website', 'text')
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

    //job_listings table
  await db.schema
    .createTable('job_listings')
    .addColumn('id', 'integer', (col) =>
      col.generatedAlwaysAsIdentity().primaryKey(),
    )
    .addColumn('company_id', 'integer', (col) => col.notNull().references('companies.id').onDelete('restrict'))
    .addColumn('created_by', 'integer', (col) => col.references('users.id').onDelete('restrict'))
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('location', 'text')
    .addColumn('city', 'text')
    .addColumn('state', 'text')
    .addColumn('employment_type', 'text')
    .addColumn('url', 'text')
    .addColumn('normalized_url', 'text', (col) => col.unique())
    .addColumn('external_job_id', 'text')
    .addColumn('posted_at', 'timestamptz')
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createIndex('job_listings_company_id_idx')
    .on('job_listings')
    .column('company_id')
    .execute();

  await db.schema
    .createIndex('job_listings_created_by_idx')
    .on('job_listings')
    .column('created_by')
    .execute();

    //resumes table
  await db.schema
    .createTable('resumes')
    .addColumn('id', 'integer', (col) =>
      col.generatedAlwaysAsIdentity().primaryKey(),
    )
    .addColumn('user_id', 'integer', (col) => col.notNull().references('users.id').onDelete('restrict'))
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('storage_key', 'text', (col) => col.notNull().unique())
    .addColumn('original_filename', 'text', (col) => col.notNull())
    .addColumn('content_type', 'text', (col) => col.notNull())
    .addColumn('uploaded_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createIndex('resumes_user_id_idx')
    .on('resumes')
    .column('user_id')
    .execute();

    //applications table
  await db.schema
    .createTable('applications')
    .addColumn('id', 'integer', (col) =>
      col.generatedAlwaysAsIdentity().primaryKey(),
    )
    .addColumn('user_id', 'integer', (col) => col.notNull().references('users.id').onDelete('restrict'))
    .addColumn('job_listing_id', 'integer', (col) => col.notNull().references('job_listings.id').onDelete('restrict'))
    .addColumn('resume_id', 'integer', (col) => col.references('resumes.id').onDelete('set null'))
    .addColumn('status', 'text', (col) => col.notNull())
    .addColumn('applied_at', 'timestamptz')
    .addColumn('notes', 'text')
    .addColumn('share_insights', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createIndex('applications_user_id_idx')
    .on('applications')
    .column('user_id')
    .execute();

  await db.schema
    .createIndex('applications_job_listing_id_idx')
    .on('applications')
    .column('job_listing_id')
    .execute();

  await db.schema
    .createIndex('applications_resume_id_idx')
    .on('applications')
    .column('resume_id')
    .execute();


  await db.schema
    .createTable('application_events')
    .addColumn('id', 'integer', (col) =>
      col.generatedAlwaysAsIdentity().primaryKey(),
    )
    .addColumn('application_id', 'integer', (col) => col.notNull().references('applications.id').onDelete('cascade'))
    .addColumn('event_type', 'text', (col) => col.notNull())
    .addColumn('occurred_at', 'timestamptz', (col) => col.notNull())
    .addColumn('notes', 'text')
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createIndex('application_events_application_id_idx')
    .on('application_events')
    .column('application_id')
    .execute();

    //posts table
  await db.schema
    .createTable('posts')
    .addColumn('id', 'integer', (col) =>
      col.generatedAlwaysAsIdentity().primaryKey(),
    )
    .addColumn('user_id', 'integer', (col) => col.notNull().references('users.id').onDelete('restrict'))
    .addColumn('job_listing_id', 'integer', (col) => col.notNull().references('job_listings.id').onDelete('restrict'))
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('content', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createIndex('posts_user_id_idx')
    .on('posts')
    .column('user_id')
    .execute();

  await db.schema
    .createIndex('posts_job_listing_id_idx')
    .on('posts')
    .column('job_listing_id')
    .execute();

    //comments table
  await db.schema
    .createTable('comments')
    .addColumn('id', 'integer', (col) =>
      col.generatedAlwaysAsIdentity().primaryKey(),
    )
    .addColumn('user_id', 'integer', (col) => col.notNull().references('users.id').onDelete('restrict'))
    .addColumn('post_id', 'integer', (col) => col.notNull().references('posts.id').onDelete('cascade'))
    .addColumn('content', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createIndex('comments_user_id_idx')
    .on('comments')
    .column('user_id')
    .execute();

  await db.schema
    .createIndex('comments_post_id_idx')
    .on('comments')
    .column('post_id')
    .execute();

}

// drop tables 
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('comments').execute();
  await db.schema.dropTable('posts').execute();
  await db.schema.dropTable('application_events').execute();
  await db.schema.dropTable('applications').execute();
  await db.schema.dropTable('resumes').execute();
  await db.schema.dropTable('job_listings').execute();
  await db.schema.dropTable('companies').execute();
}
