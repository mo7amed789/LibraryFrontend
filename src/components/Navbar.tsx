import { Link, NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <nav className="nav">
      <div className="nav-inner">
        <div className="nav-links">
          <Link to="/" className="brand">
            🚀 Library Future
          </Link>
          <NavLink to="/" className={({ isActive }) => `pill ${isActive ? "active" : ""}`}>
            Discover
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/my-books" className={({ isActive }) => `pill ${isActive ? "active" : ""}`}>
              My Books
            </NavLink>
          )}
        </div>

        <div className="nav-auth">
          {isAuthenticated ? (
            <>
              <span className="pill">{user?.name ?? "Reader"}</span>
              <button onClick={logout} className="pill">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => `pill ${isActive ? "active" : ""}`}>
                Login
              </NavLink>
              <Link to="/register" className="pill cta">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
