import api from "./axios"

type AuthResponse = {
  token?: string
  accessToken?: string
  jwt?: string
  user?: unknown
}

const extractToken = (data: AuthResponse) => data.token ?? data.accessToken ?? data.jwt

export const loginUser = async (email: string, password: string) => {
  const res = await api.post<AuthResponse>("/auth/login", { email, password })
  const token = extractToken(res.data)

  if (token) {
    localStorage.setItem("token", token)
  }

  return res.data
}

export const registerUser = async (email: string, password: string, name: string) => {
  const res = await api.post<AuthResponse>("/auth/register", { email, password, name })
  const token = extractToken(res.data)

  if (token) {
    localStorage.setItem("token", token)
  }

  return res.data
}

export const logout = () => {
  localStorage.removeItem("token")
}
