import api from "./axios"

export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password })
  if (res.data.token) {
    localStorage.setItem("token", res.data.token)
  }
  return res.data
}

export const registerUser = async (email: string, password: string, name: string) => {
  const res = await api.post("/auth/register", { email, password, name })
  if (res.data.token) {
    localStorage.setItem("token", res.data.token)
  }
  return res.data
}

export const logout = () => {
  localStorage.removeItem("token")
}
