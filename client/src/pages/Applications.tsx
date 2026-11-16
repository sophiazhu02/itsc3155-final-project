import { useState } from 'react'

type Application = {
  id: number
  role: string
  company: string
  status: string
  appliedAt: string
  resume: string
}

const sampleApplications: Application[] = [
  {
    id: 1,
    role: 'Software Engineer Intern',
    company: 'Northline Bank',
    status: 'Applied',
    appliedAt: '2026-10-21',
    resume: 'Resume_SWE.pdf',
  },
  {
    id: 2,
    role: 'Data Analyst Intern',
    company: 'Piedmont Health',
    status: 'Interviewing',
    appliedAt: '2026-10-09',
    resume: 'Resume_Data.pdf',
  },
  {
    id: 3,
    role: 'IT Intern',
    company: 'Lakeview Logistics',
    status: 'Offer',
    appliedAt: '2026-09-20',
    resume: 'Resume_IT.pdf',
  },
]

const statuses = [
  'All',
  'Saved',
  'Applied',
  'Online Assessment',
  'Interviewing',
  'Offer',
  'Rejected',
]

export default function Applications() {
  const [applications, setApplications] = useState(sampleApplications)
  const [statusFilter, setStatusFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const [status, setStatus] = useState('Saved')
  const [appliedAt, setAppliedAt] = useState('')

  const filteredApplications = applications.filter(
    (application) =>
      statusFilter === 'All' || application.status === statusFilter
  )


    function handleSaveApplication(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!role.trim() || !company.trim()) {
        return
    }

    if (editingId !== null) {
        setApplications((current) =>
        current.map((application) =>
            application.id === editingId
            ? {
                ...application,
                role: role.trim(),
                company: company.trim(),
                status,
                appliedAt,
                }
            : application
        )
        )
    } else {
        const newApplication: Application = {
        id: Math.max(0, ...applications.map((app) => app.id)) + 1,
        role: role.trim(),
        company: company.trim(),
        status,
        appliedAt,
        resume: 'None',
        }

        setApplications((current) => [...current, newApplication])
    }

    resetForm()
    setStatusFilter('All')
    }

    function handleEditApplication(application: Application) {
    setEditingId(application.id)
    setRole(application.role)
    setCompany(application.company)
    setStatus(application.status)
    setAppliedAt(application.appliedAt)
    setShowForm(true)
    }

    function handleDeleteApplication(id: number) {
    if (!window.confirm('Are you sure you want to delete this application?')) {
        return
    }

    setApplications((current) =>
        current.filter((application) => application.id !== id)
    )
    }

    function resetForm() {
    setRole('')
    setCompany('')
    setStatus('Saved')
    setAppliedAt('')
    setEditingId(null)
    setShowForm(false)
    }


  return (
    <section className="applications-page">
      <h1>My Applications</h1>
      <p>Track and manage your job applications.</p>

      <button
        type="button"
        className="add-application-button"
        onClick={() => setShowForm(!showForm)}
      >
        + Add Application
      </button>

      {showForm && (
        <form className="application-form" onSubmit={handleSaveApplication}>
          <h2>{editingId !== null ? 'Edit Application' : 'Add Application'}</h2>

          <label htmlFor="application-role">Job Title</label>
          <input
            id="application-role"
            type="text"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            required
          />

          <label htmlFor="application-company">Company</label>
          <input
            id="application-company"
            type="text"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            required
          />

          <label htmlFor="application-status">Status</label>
          <select
            id="application-status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            {statuses.filter((s) => s !== 'All').map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <label htmlFor="application-date">Date Applied</label>
          <input
            id="application-date"
            type="date"
            value={appliedAt}
            onChange={(event) => setAppliedAt(event.target.value)}
          />

            <div className="form-actions">
            <button type="submit">
                {editingId !== null ? 'Save Changes' : 'Save Application'}
            </button>

            <button type="button" onClick={resetForm}>
                Cancel
            </button>
            </div>
        </form>
      )}

      <div className="status-filters">
        {statuses.map((s) => (
          <button
            key={s}
            type="button"
            className={statusFilter === s ? 'active' : ''}
            onClick={() => setStatusFilter(s)}
          >
            {s} ({
              s === 'All'
                ? applications.length
                : applications.filter((app) => app.status === s).length
            })
          </button>
        ))}
      </div>

      <table className="applications-table">
        <thead>
          <tr>
            <th>Role</th>
            <th>Status</th>
            <th>Applied</th>
            <th>Resume</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredApplications.map((application) => (
            <tr key={application.id}>
              <td>
                <strong>{application.role}</strong>
                <div>{application.company}</div>
              </td>
              <td>{application.status}</td>
              <td>{application.appliedAt || '—'}</td>
              <td>{application.resume}</td>
                <td>
                <div className="application-actions">
                    <button
                    type="button"
                    onClick={() => handleEditApplication(application)}
                    >
                    Edit
                    </button>

                    <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDeleteApplication(application.id)}
                    >
                    Delete
                    </button>
                </div>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

