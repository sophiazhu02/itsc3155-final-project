
# Database ERD

Database design for our job application tracker and job-specific discussion forum.

```mermaid
erDiagram
    USERS {
        int id PK
        string name
        string email UK
        string password_hash
        datetime created_at
        datetime updated_at
    }

    COMPANIES {
        int id PK
        string name
        string website
        datetime created_at
    }

    JOB_LISTINGS {
        int id PK
        int company_id FK
        int created_by FK
        string title
        string description
        string location
        string city
        string state
        string employment_type
        string url
        string normalized_url UK
        string external_job_id
        datetime posted_at
        datetime created_at
        datetime updated_at
    }

    APPLICATIONS {
        int id PK
        int user_id FK
        int job_listing_id FK
        int resume_id FK
        string status
        datetime applied_at
        string notes
        boolean share_insights
        datetime created_at
        datetime updated_at
    }

    APPLICATION_EVENTS {
        int id PK
        int application_id FK
        string event_type
        datetime occurred_at
        string notes
        datetime created_at
    }

    RESUMES {
        int id PK
        int user_id FK
        string name
        string storage_key UK
        string original_filename
        string content_type
        datetime uploaded_at
    }

    POSTS {
        int id PK
        int user_id FK
        int job_listing_id FK
        string title
        string content
        datetime created_at
        datetime updated_at
    }

    COMMENTS {
        int id PK
        int user_id FK
        int post_id FK
        string content
        datetime created_at
        datetime updated_at
    }

    USERS o|--o{ JOB_LISTINGS : submits
    USERS ||--o{ APPLICATIONS : tracks
    USERS ||--o{ RESUMES : owns
    USERS ||--o{ POSTS : creates
    USERS ||--o{ COMMENTS : writes

    COMPANIES ||--o{ JOB_LISTINGS : has

    JOB_LISTINGS ||--o{ APPLICATIONS : associated_with
    JOB_LISTINGS ||--o{ POSTS : has

    RESUMES o|--o{ APPLICATIONS : used_for

    APPLICATIONS ||--o{ APPLICATION_EVENTS : has

    POSTS ||--o{ COMMENTS : contains
```


## Database Design Notes

- **Required CRUD resources:** Users, Posts, and Comments.
- **Job listings:** Users can submit job listings. Duplicate listings will be checked using URLs, company job IDs, and possible matches.
- **Applications:** Each application belongs to one user and one job listing. Applications are private and may optionally reference a resume.
- **Application timelines:** Application events track stages such as applying, interviews, offers, and rejections.
- **Community statistics:** Users can optionally share anonymous hiring insights. `share_insights` defaults to `false`.
- **Resumes:** Files will be stored in object storage, with file information saved in PostgreSQL.
- **Deletion behavior:** Deleting applications removes their events, deleting posts removes their comments, and deleting resumes sets the associated application's `resume_id` to NULL.
- **Authentication:** Passwords will be stored as hashes. Session handling will be implemented in the backend.
