import { createContext, useContext, useEffect, useMemo, useState } from "react"

const AuthContext = createContext(null)

const STORAGE_KEY = "cms_auth_v1"

function safeJsonParse(value) {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

function readStoredAuth() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  const parsed = safeJsonParse(raw)
  if (!parsed?.token || !parsed?.user) return null
  return parsed
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = readStoredAuth()
    if (stored) {
      setToken(stored.token)
      setUser(stored.user)
    }
  }, [])

  const value = useMemo(() => {
    const role = user?.role ?? null

    function login({ token: nextToken, user: nextUser }) {
      setToken(nextToken)
      setUser(nextUser)
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: nextToken, user: nextUser }))
    }

    function logout() {
      setToken(null)
      setUser(null)
      localStorage.removeItem(STORAGE_KEY)
    }

    return { token, user, role, login, logout }
  }, [token, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

