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
    // Simulate loading admin stats
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

  // Check if user is admin (you would need to add role to your user type)
  // For now, we'll just show the dashboard to authenticated users
  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage the library system</p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Books</h3>
                <p className="text-4xl font-bold text-indigo-600">{stats.totalBooks}</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Borrowed Books</h3>
                <p className="text-4xl font-bold text-yellow-600">{stats.borrowedBooks}</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
                <p className="text-4xl font-bold text-green-600">{stats.totalUsers}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default AdminDashboard
