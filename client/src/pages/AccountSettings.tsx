import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'

type Props = {
  user: { name: string; email: string }
}

export default function AccountSettings({ user }: Props) {
  const navigate = useNavigate()
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage('')
    setError('')

    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.')
      return
    }
    // Matches the backend rule in src/routes/users.ts
    if (password && password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    // TODO: PATCH /api/users/:id once that route and auth exist
    setPassword('')
    setMessage('Changes saved.')
  }

  function handleDelete() {
    // TODO: DELETE /api/users/:id once that route and auth exist
    navigate('/login')
  }

  return (
    <div className="page page-narrow">
      <div className="page-header">
        <h1 className="page-title">Account settings</h1>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/login')}>
          Log out
        </button>
      </div>

      <form className="card" onSubmit={handleSave} noValidate>
        <div className="form-grid">
          <label className="field">
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </label>

          <label className="field">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>

          <label className="field">
            New password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <span className="field-hint">Leave blank to keep your current password</span>
          </label>
        </div>

        <div className="card-footer">
          <p className={error ? 'form-error' : 'form-success'} role="status">
            {error || message}
          </p>
          <button type="submit" className="btn btn-primary">Save changes</button>
        </div>
      </form>

      <section className="card card-danger">
        <div>
          <h2 className="danger-title">Delete account</h2>
          <p className="danger-text">
            Permanently removes your applications, resumes, posts and comments.
          </p>
        </div>

        {confirmingDelete ? (
          <div className="danger-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setConfirmingDelete(false)}>
              Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={handleDelete}>
              Yes, delete it
            </button>
          </div>
        ) : (
          <button type="button" className="btn btn-danger" onClick={() => setConfirmingDelete(true)}>
            Delete my account
          </button>
        )}
      </section>
    </div>
  )
}
