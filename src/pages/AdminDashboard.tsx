import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useAuth } from "../context/AuthContext"

function AdminDashboard() {
  const { isAuthenticated } = useAuth()
  const [stats, setStats] = useState({
    totalBooks: 0,
    borrowedBooks: 0,
    totalUsers: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalBooks: 150,
        borrowedBooks: 45,
        totalUsers: 28,
      })
      setIsLoading(false)
    }, 500)
  }, [])

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="mb-2 text-4xl font-black text-gray-900">Admin Dashboard</h1>
          <p className="mb-8 text-gray-600">A quick snapshot of your library system.</p>

          {isLoading ? (
            <div className="py-12 text-center text-gray-600">Loading dashboard...</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">Total Books</h3>
                <p className="text-4xl font-bold text-indigo-600">{stats.totalBooks}</p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">Borrowed Books</h3>
                <p className="text-4xl font-bold text-amber-600">{stats.borrowedBooks}</p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">Total Users</h3>
                <p className="text-4xl font-bold text-emerald-600">{stats.totalUsers}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default AdminDashboard
