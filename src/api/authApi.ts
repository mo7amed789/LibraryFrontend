import axios from "axios"
import api from "./axios"

type AuthResponse = {
  token?: string
  accessToken?: string
  jwt?: string
  user?: unknown
}

const LOGIN_ENDPOINTS = ["/auth/login", "/Auth/login"] as const
const REGISTER_ENDPOINTS = ["/auth/register", "/Auth/register"] as const

const extractToken = (data: AuthResponse) => data.token ?? data.accessToken ?? data.jwt

const extractApiErrorMessage = (error: unknown, fallback: string) => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback
  }

  const payload = error.response?.data

  if (typeof payload === "string" && payload.trim().length > 0) {
    return payload
  }

  if (payload && typeof payload === "object") {
    const data = payload as Record<string, unknown>

    const errors = data.errors
    if (errors && typeof errors === "object") {
      const parts = Object.values(errors as Record<string, unknown>)
        .flatMap((value) => (Array.isArray(value) ? value.map(String) : [String(value)]))
        .filter((part) => part.trim().length > 0)

      if (parts.length > 0) {
        return parts.join(" ")
      }
    }

    const message = data.message ?? data.error ?? data.title ?? data.detail
    if (typeof message === "string" && message.trim().length > 0) {
      return message
    }
  }

  return error.message || fallback
}

const postWithFallback = async (
  endpoints: readonly string[],
  payloads: Record<string, unknown>[],
  fallbackMessage: string
): Promise<AuthResponse> => {
  let lastError: unknown

  for (const endpoint of endpoints) {
    for (const payload of payloads) {
      try {
        const response = await api.post<AuthResponse>(endpoint, payload)
        return response.data
      } catch (error) {
        lastError = error
        const status = axios.isAxiosError(error) ? error.response?.status : undefined

        if (status && ![400, 404, 405, 415, 422].includes(status)) {
          throw new Error(extractApiErrorMessage(error, fallbackMessage))
        }
      }
    }
  }

  throw new Error(extractApiErrorMessage(lastError, fallbackMessage))
}

export const loginUser = async (email: string, password: string) => {
  const data = await postWithFallback(LOGIN_ENDPOINTS, [{ email, password }], "Login failed")
  const token = extractToken(data)

  if (token) {
    localStorage.setItem("token", token)
  }

  return data
}

export const registerUser = async (email: string, password: string, name: string, phoneNumber: string) => {
  const payloads = [
    { email, password, name, phoneNumber },
    { email, password, fullName: name, phoneNumber },
    { email, password, userName: name, phoneNumber },
    { email, password, username: name, phoneNumber },
    { email, password, name, phoneNumber, confirmPassword: password },
  ]

  const data = await postWithFallback(REGISTER_ENDPOINTS, payloads, "Registration failed")
  const token = extractToken(data)

  if (token) {
    localStorage.setItem("token", token)
  }

  return data
}

export const logout = () => {
  localStorage.removeItem("token")
}
