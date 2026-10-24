
import { Link, Routes, Route } from 'react-router'
import './App.css'

function Home() {
  return <h2>Welcome to Job Tracker</h2>
}

function Applications() {
  return <h2>My Applications</h2>
}

function JobListings() {
  return <h2>Job Listings</h2>
}

function Login() {
  return <h2>Login</h2>
}

function App() {
  return (
    <>
      <header>
        <h1>Job Tracker</h1>
        <nav>
          <Link to="/">Home</Link> |{' '}
          <Link to="/applications">My Applications</Link> |{' '}
          <Link to="/jobs">Job Listings</Link> |{' '}
          <Link to="/login">Login</Link>
        </nav>
      </header>

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

export default App
