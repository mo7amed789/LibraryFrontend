/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import { loginUser, logout as logoutApi, registerUser } from "../api/authApi"

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const USER_STORAGE_KEY = "library_user"

const readTokenPayload = () => {
  const token = localStorage.getItem("token")
  if (!token) return null

  try {
    const [, payload] = token.split(".")
    if (!payload) return null
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

const normalizeUser = (rawData: unknown): User | null => {
  if (!rawData || typeof rawData !== "object") return null

  const data = rawData as Record<string, unknown>
  const id = String(data.id ?? data.sub ?? crypto.randomUUID())
  const email = String(data.email ?? data.unique_name ?? "")
  const name = String(data.name ?? data.given_name ?? email.split("@")[0] ?? "Reader")

  if (!email) return null

  return { id, email, name }
}

const initializeUser = (): User | null => {
  const cachedUser = localStorage.getItem(USER_STORAGE_KEY)

  if (cachedUser) {
    try {
      return JSON.parse(cachedUser) as User
    } catch {
      localStorage.removeItem(USER_STORAGE_KEY)
    }
  }

  const parsedUser = normalizeUser(readTokenPayload())
  if (parsedUser) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(parsedUser))
  }

  return parsedUser
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(initializeUser)

  const login = async (email: string, password: string) => {
    const response = await loginUser(email, password)
    const payload = normalizeUser(response.user) ?? normalizeUser(readTokenPayload())

    if (payload) {
      setUser(payload)
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(payload))
      return
    }

    const fallbackUser: User = {
      id: crypto.randomUUID(),
      email,
      name: email.split("@")[0] || "Reader",
    }

    setUser(fallbackUser)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(fallbackUser))
  }

  const register = async (email: string, password: string, name: string) => {
    const response = await registerUser(email, password, name)
    const payload = normalizeUser(response.user) ?? normalizeUser(readTokenPayload())

    const newUser = payload ?? {
      id: crypto.randomUUID(),
      email,
      name,
    }

    setUser(newUser)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser))
  }

  const logout = () => {
    logoutApi()
    localStorage.removeItem(USER_STORAGE_KEY)
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user || !!localStorage.getItem("token"), login, register, logout }),
    [user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
