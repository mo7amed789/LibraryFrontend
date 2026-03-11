import { Link, NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-2 text-sm font-medium transition ${
      isActive ? "bg-white/20 text-white" : "text-indigo-100 hover:bg-white/10 hover:text-white"
    }`

  return (
    <nav className="sticky top-0 z-20 border-b border-indigo-400/30 bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 text-white shadow-lg backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-black tracking-tight">
            📚 Library Ultimate
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            <NavLink to="/" className={navItemClass}>
              Discover
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/my-books" className={navItemClass}>
                My Books
              </NavLink>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          {isAuthenticated ? (
            <>
              <span className="hidden rounded-full bg-white/15 px-3 py-1 font-medium md:block">
                Welcome, {user?.name ?? "Reader"}
              </span>
              <button
                onClick={logout}
                className="rounded-md bg-indigo-900/60 px-4 py-2 font-medium transition hover:bg-indigo-950"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navItemClass}>
                Login
              </NavLink>
              <Link
                to="/register"
                className="rounded-md bg-white px-4 py-2 font-semibold text-indigo-700 transition hover:bg-indigo-50"
              >
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
