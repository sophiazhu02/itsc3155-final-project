import { Link, NavLink, Route, Routes, useLocation } from 'react-router'
import Login from './pages/Login'
import AccountSettings from './pages/AccountSettings'
import JobListings from './pages/JobListings'

function Home() {
  return <h2>Welcome to CareerSquare</h2>
}

function Applications() {
  return <h2>My Applications</h2>
}

// Placeholder until login is wired up to the backend
const currentUser = { name: 'Jesus Pichardo', email: 'jesus@charlotte.edu' }

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .slice(0, 2)
    .join('')
}

export default function App() {
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'

  return (
    <>
      {!isLoginPage && (
        <header className="navbar">
          <div className="navbar-inner">
            <Link to="/" className="navbar-brand">
              <span className="brand-mark" aria-hidden="true">▣</span>
              CareerSquare
            </Link>
            <nav className="navbar-links">
              <NavLink to="/applications">My Applications</NavLink>
              <NavLink to="/jobs">Job Listings</NavLink>
            </nav>
            <NavLink to="/account" className="avatar" aria-label="Account settings">
              {initials(currentUser.name)}
            </NavLink>
          </div>
        </header>
      )}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/jobs" element={<JobListings />} />
          <Route path="/account" element={<AccountSettings user={currentUser} />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </>
  )
}
