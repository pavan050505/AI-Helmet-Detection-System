import React, { useEffect, useState } from "react"
import { useAuth } from "../auth/AuthContext.jsx"

export default function Account() {
  const { fetchWithAuth, logout } = useAuth()
  const [user, setUser] = useState(null)
  const [error, setError] = useState("")
  const [profile, setProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("helmet_profile") || "{}")
    } catch {
      return {}
    }
  })

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetchWithAuth("/api/auth/me", { method: "GET" })
        const json = await res.json()
        if (!res.ok) {
          setError(json.error || "Failed to load profile")
          return
        }
        if (mounted) setUser(json)
      } catch {
        setError("Network error")
      }
    })()
    return () => { mounted = false }
  }, [fetchWithAuth])

  return (
    <div className="max-w-md mx-auto bg-slate-900 rounded-xl p-6 border border-slate-800">
      <div className="text-lg font-semibold mb-4">Account</div>
      {error && <div className="text-red-400 text-sm mb-3">{error}</div>}
      {!user ? (
        <div className="text-slate-300 text-sm">Loading...</div>
      ) : (
        <div className="space-y-2 text-sm text-slate-300">
          <div><span className="text-slate-400">First Name:</span> {profile.firstName || "N/A"}</div>
          <div><span className="text-slate-400">Last Name:</span> {profile.lastName || "N/A"}</div>
          <div><span className="text-slate-400">Email:</span> {user.email || profile.email || "N/A"}</div>
          <div><span className="text-slate-400">Created:</span> {user.created_at}</div>
          <button className="mt-4 px-3 py-2 rounded bg-slate-800 hover:bg-slate-700" onClick={logout}>
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
