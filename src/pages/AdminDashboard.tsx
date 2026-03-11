import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useAuth } from "../context/AuthContext"

function AdminDashboard() {
  const { isAuthenticated } = useAuth()
  const [stats, setStats] = useState({ totalBooks: 0, borrowedBooks: 0, totalUsers: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setStats({ totalBooks: 150, borrowedBooks: 45, totalUsers: 28 })
      setIsLoading(false)
    }, 500)
  }, [])

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <>
      <Navbar />
      <div className="page">
        <header className="section-title">
          <h1>Admin Dashboard</h1>
          <p className="helper">Operational pulse for your library system.</p>
        </header>

        {isLoading ? (
          <div className="empty">Loading dashboard...</div>
        ) : (
          <div className="stats">
            <div className="stat glass"><p className="label">Total Books</p><p className="value">{stats.totalBooks}</p></div>
            <div className="stat glass"><p className="label">Borrowed Books</p><p className="value">{stats.borrowedBooks}</p></div>
            <div className="stat glass"><p className="label">Total Users</p><p className="value">{stats.totalUsers}</p></div>
          </div>
        )}
      </div>
    </>
  )
}

export default AdminDashboard
