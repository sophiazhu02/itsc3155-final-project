// Shape returned by GET /api/job-listings. Field names follow the
// job_listings table; company_name and post_count come from joins.
export type JobListing = {
  id: number
  title: string
  company_name: string | null
  city: string | null
  state: string | null
  location: string | null
  employment_type: string | null
  created_at: string
  post_count: number
  // Needs the logged-in user, so the backend doesn't send it until auth exists
  in_tracker?: boolean
}

export async function fetchJobListings(signal?: AbortSignal): Promise<JobListing[]> {
  const res = await fetch('/api/job-listings', { signal })
  if (!res.ok) {
    throw new Error(`Could not load job listings (${res.status})`)
  }
  return res.json()
}
