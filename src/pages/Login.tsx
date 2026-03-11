import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      await login(email, password)
      navigate("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="glass auth-card">
        <h2>Welcome Back</h2>
        <p className="helper">Access your futuristic library console.</p>
        <form className="form" onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <button type="submit" disabled={isLoading} className="btn">{isLoading ? "Signing in..." : "Sign in"}</button>
          <p className="helper">Don't have an account? <Link to="/register">Register here</Link></p>
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-violet-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/80 bg-white/90 p-8 shadow-xl backdrop-blur">
        <h2 className="text-center text-3xl font-black tracking-tight text-gray-900">Welcome back</h2>
        <p className="mt-2 text-center text-sm text-gray-600">Sign in to borrow and manage your books.</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-indigo-600 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
