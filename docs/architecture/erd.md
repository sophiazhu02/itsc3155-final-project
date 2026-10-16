
# Database ERD (Draft)

This is the initial database design for our job application tracker. The schema is subject to change as we finalize the application's features.

```mermaid
erDiagram
    USERS {
        int id PK
        string name
        string email UK
        string password_hash
        datetime created_at
    }

    COMPANIES {
        int id PK
        string name
        string website
    }

    JOB_LISTINGS {
        int id PK
        int company_id FK
        string title
        string location
        string employment_type
        string url
        datetime posted_at
    }

    APPLICATIONS {
        int id PK
        int user_id FK
        int job_listing_id FK
        int resume_id FK
        string status
        datetime applied_at
        string notes
        datetime created_at
    }

    RESUMES {
        int id PK
        int user_id FK
        string name
        string storage_key
        datetime uploaded_at
    }

    POSTS {
        int id PK
        int user_id FK
        int job_listing_id FK
        string title
        string content
        datetime created_at
    }

    COMMENTS {
        int id PK
        int user_id FK
        int post_id FK
        string content
        datetime created_at
    }

    USERS ||--o{ APPLICATIONS : tracks
    USERS ||--o{ RESUMES : owns
    USERS ||--o{ POSTS : creates
    USERS ||--o{ COMMENTS : writes

    COMPANIES ||--o{ JOB_LISTINGS : has
    JOB_LISTINGS ||--o{ APPLICATIONS : associated_with
    JOB_LISTINGS ||--o{ POSTS : has

    RESUMES o|--o{ APPLICATIONS : used_for
    POSTS ||--o{ COMMENTS : contains
```

## Questions for the Team

This ERD is an initial draft based on our current project requirements. We can adjust the tables and relationships as we finalize the application's features.

### Application Features
- Should users be able to track applications for jobs that aren't already in the shared job listings database?
- Do we want companies stored in a separate table, or would storing company information directly in job listings be sufficient?
- Should users be able to reply to individual comments, or only comment directly on discussion posts?

### Authentication and File Storage
- How should we handle user authentication and sessions? Will we use password-based authentication with Express sessions or an external authentication provider? (external could count as our "extra feature" but might be more work to implement compared to other "extra feature" options)
- Which object storage service should we use for uploaded resumes (e.g., Amazon S3)? What file information should we store in the database?

### Database Relationships
- Which fields should be required versus optional?
- What should happen to related records when a user, job listing, or discussion post is deleted?
- Should users be able to reuse the same resume across multiple applications?

### Other Project Requirements
- Which extra feature should we implement? One option is automated testing with GitHub Actions, which wouldn't require additional database tables.

We should agree on the main database structure before finalizing the Kysely migrations, but smaller changes can still be made later.