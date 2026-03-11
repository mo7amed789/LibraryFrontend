import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="font-bold text-xl">
              Library
            </Link>
            <Link to="/" className="hover:text-indigo-200">
              Books
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span>Welcome, {user.name}</span>
                <button
                  onClick={logout}
                  className="bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-indigo-200">
                  Login
                </Link>
                <Link to="/register" className="bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-md">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
