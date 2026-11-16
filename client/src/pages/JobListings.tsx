import { useMemo, useState } from 'react'
import { mockJobListings, type JobListing } from '../data/mockJobListings'

type SortOption = 'newest' | 'oldest' | 'most-posts'

function formatPlace(listing: JobListing) {
  if (listing.city && listing.state) return `${listing.city}, ${listing.state}`
  return listing.location ?? listing.city ?? listing.state ?? ''
}

function formatAdded(date: string) {
  // Parse as a local date so "2026-09-30" doesn't shift to Sep 29 in US time zones
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export default function JobListings() {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const [sort, setSort] = useState<SortOption>('newest')

  const listings = mockJobListings

  const types = useMemo(
    () => [...new Set(listings.map((l) => l.employment_type).filter((t): t is string => !!t))].sort(),
    [listings],
  )

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase()

    const filtered = listings.filter((l) => {
      const matchesSearch =
        !query ||
        l.title.toLowerCase().includes(query) ||
        l.company_name.toLowerCase().includes(query)
      const matchesType = type === 'all' || l.employment_type === type
      return matchesSearch && matchesType
    })

    return filtered.sort((a, b) => {
      if (sort === 'most-posts') return b.post_count - a.post_count
      if (sort === 'oldest') return a.created_at.localeCompare(b.created_at)
      return b.created_at.localeCompare(a.created_at)
    })
  }, [listings, search, type, sort])

  return (
    <div className="page">
      <h1 className="page-title">Job Listings</h1>
      <p className="page-subtitle">Every listing has its own discussion board.</p>

      <div className="listing-filters">
        <label className="search-box">
          <span className="visually-hidden">Search</span>
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            placeholder="Search by company or role"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <label className="field field-compact">
          Type
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="all">All types</option>
            {types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>

        <label className="field field-compact">
          Sort
          <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="most-posts">Most posts</option>
          </select>
        </label>
      </div>

      {visible.length === 0 ? (
        <div className="card empty-state">No listings match your search.</div>
      ) : (
        <ul className="listing-list">
          {visible.map((listing) => (
            <li key={listing.id} className="listing-card">
              <div className="listing-main">
                <h2 className="listing-title">{listing.title}</h2>
                <p className="listing-meta">
                  {[listing.company_name, formatPlace(listing), listing.employment_type]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </div>
              <div className="listing-stats">
                <span>{listing.post_count} posts</span>
                <span>Added {formatAdded(listing.created_at)}</span>
                <span className={listing.in_tracker ? 'badge badge-tracked' : 'badge'}>
                  {listing.in_tracker ? 'In your tracker' : 'Not tracked'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
