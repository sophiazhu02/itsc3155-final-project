// Sample data until the frontend calls GET /api/job-listings.
// Field names follow the job_listings table; company_name, post_count and
// in_tracker will come from joins with companies, posts and applications.
export type JobListing = {
  id: number
  title: string
  company_name: string
  city: string | null
  state: string | null
  location: string | null
  employment_type: string | null
  created_at: string
  post_count: number
  in_tracker: boolean
}

export const mockJobListings: JobListing[] = [
  {
    id: 1,
    title: 'Software Engineer Intern, Summer 2027',
    company_name: 'Northline Bank',
    city: 'Charlotte',
    state: 'NC',
    location: null,
    employment_type: 'Internship',
    created_at: '2026-09-30',
    post_count: 46,
    in_tracker: true,
  },
  {
    id: 2,
    title: 'Data Analyst Intern',
    company_name: 'Piedmont Health',
    city: 'Charlotte',
    state: 'NC',
    location: null,
    employment_type: 'Internship',
    created_at: '2026-09-22',
    post_count: 31,
    in_tracker: true,
  },
  {
    id: 3,
    title: 'Embedded Software Intern',
    company_name: 'Queen City Robotics',
    city: 'Charlotte',
    state: 'NC',
    location: null,
    employment_type: 'Internship',
    created_at: '2026-09-18',
    post_count: 19,
    in_tracker: true,
  },
  {
    id: 4,
    title: 'Frontend Developer Intern',
    company_name: 'Ardent Software',
    city: null,
    state: null,
    location: 'Remote',
    employment_type: 'Internship',
    created_at: '2026-10-03',
    post_count: 12,
    in_tracker: false,
  },
  {
    id: 5,
    title: 'Software Developer, New Grad 2027',
    company_name: 'Harbor Analytics',
    city: 'Raleigh',
    state: 'NC',
    location: null,
    employment_type: 'Full-time',
    created_at: '2026-10-11',
    post_count: 6,
    in_tracker: false,
  },
  {
    id: 6,
    title: 'Cloud Support Co-op, Spring 2027',
    company_name: 'Carolina Telecom',
    city: 'Charlotte',
    state: 'NC',
    location: null,
    employment_type: 'Co-op',
    created_at: '2026-09-09',
    post_count: 5,
    in_tracker: true,
  },
]
