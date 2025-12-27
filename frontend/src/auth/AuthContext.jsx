import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("helmet_token") || "")
  const [user, setUser] = useState(null)
  const isAuthenticated = !!token
  const origin = useMemo(() => import.meta.env.VITE_API_ORIGIN || "http://127.0.0.1:5000", [])

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "helmet_token") {
        setToken(e.newValue || "")
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const login = (t) => {
    localStorage.setItem("helmet_token", t)
    setToken(t)
  }
  const logout = () => {
    localStorage.removeItem("helmet_token")
    setToken("")
    setUser(null)
  }

  const fetchWithAuth = async (path, options = {}) => {
    const headers = new Headers(options.headers || {})
    if (token) headers.set("Authorization", "Bearer " + token)
    const res = await fetch(origin + path, { ...options, headers })
    if (res.status === 401) {
      logout()
    }
    return res
  }

  useEffect(() => {
    const t = localStorage.getItem("helmet_token")
    if (!t) return
    ;(async () => {
      try {
        const res = await fetch(origin + "/api/auth/me", {
          headers: { Authorization: "Bearer " + t }
        })
        if (!res.ok) throw new Error()
        const json = await res.json()
        setUser(json)
      } catch {
        localStorage.removeItem("helmet_token")
        setUser(null)
        setToken("")
      }
    })()
  }, [origin])

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout, origin, fetchWithAuth, user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
