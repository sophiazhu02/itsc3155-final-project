
import { Link, Route, Routes, useLocation } from 'react-router'
import Login from './pages/Login'

function Home() {
  return <h2>Welcome to CareerSquare</h2>
}

function Applications() {
  return <h2>My Applications</h2>
}

function JobListings() {
  return <h2>Job Listings</h2>
}

export default function App() {
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'

  return (
    <>
      {!isLoginPage && (
        <header className="navbar">
          <Link to="/">CareerSquare</Link>
          <nav>
            <Link to="/applications">My Applications</Link>
            <Link to="/jobs">Job Listings</Link>
            <Link to="/login">Log in</Link>
          </nav>
        </header>
      )}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/jobs" element={<JobListings />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </>
  )
}
