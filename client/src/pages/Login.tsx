
import { useState, type FormEvent } from 'react'

export default function Login() {
  const [isSignup, setIsSignup] = useState(false)
  const [message, setMessage] = useState('')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage('Authentication is not implemented yet.')
  }

  return (
    <div className="auth-page">
      <section className="auth-left">
        <h2 className="brand">▣ CareerSquare</h2>

        <h1>
          Track every application.
          <br />
          Hear from everyone
          <br />
          applying with you.
        </h1>

        <p>
          Keep your statuses, notes and resumes in one place,
          and see what other applicants are saying about the
          same job listing.
        </p>
      </section>

      <section className="auth-right">
        <div className="auth-form">
          <div className="auth-tabs">
            <button
              className={!isSignup ? 'active' : ''}
              onClick={() => { setIsSignup(false); setMessage('') }}
              type="button"
            >
              Log in
            </button>
            <button
              className={isSignup ? 'active' : ''}
              onClick={() => { setIsSignup(true); setMessage('') }}
              type="button"
            >
              Sign up
            </button>
          </div>

          <h2>{isSignup ? 'Create an account' : 'Welcome back'}</h2>
          <p>{isSignup ? 'Get started with CareerSquare.' : 'Log in to see your applications.'}</p>

          <form onSubmit={handleSubmit}>
            {isSignup && (
              <label>
                Name
                <input type="text" placeholder="Your name" required />
              </label>
            )}

            <label>
              Email
              <input type="email" placeholder="you@charlotte.edu" required />
            </label>

            <label>
              Password
              <input type="password" placeholder="Password" required />
            </label>

            <button className="submit-btn" type="submit">
              {isSignup ? 'Sign up' : 'Log in'}
            </button>
          </form>

          {message && <p role="status">{message}</p>}
        </div>
      </section>
    </div>
  )
}
