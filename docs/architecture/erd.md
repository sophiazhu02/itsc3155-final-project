
# Database ERD (Draft)

This is the initial database design for our job application tracker. The schema is subject to change as we finalize the application's features.

```mermaid
erDiagram
    USERS {
        int id PK
        string name
        string email
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
        string file_path
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

- Should users be able to track applications without an existing job listing?
- Should companies have their own table?
- How should resumes be stored and associated with applications?
- Should comments support replies to other comments?
- What fields should be required or optional?
- What should happen to related records when a user, listing, or post is deleted?

These decisions need to be reviewed before the schema is finalized and migrations are implemented.
