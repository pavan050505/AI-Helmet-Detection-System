import React, { useMemo, useState } from "react"
import { useNavigate, NavLink } from "react-router-dom"
import { useAuth } from "../auth/AuthContext.jsx"
import logo from "../assets/logo.png"

export default function Login() {
  const navigate = useNavigate()
  const origin = useMemo(() => import.meta.env.VITE_API_ORIGIN || "http://127.0.0.1:5000", [])
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch(origin + "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || "Login failed")
        setLoading(false)
        return
      }
      login(json.token)
      navigate("/")
    } catch (err) {
      setError("Network error. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 px-4 relative">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl relative overflow-hidden">
        
        {/* Header / Branding */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="relative mb-4 group">
             <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl group-hover:bg-green-500/30 transition-all duration-500" />
            <img src={logo} alt="Helmet Detection Logo" className="h-16 w-16 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-slate-400 text-sm">Sign in to continue tracking your progress</p>
        </div>

        {/* Login Form */}
        <form onSubmit={onSubmit} className="space-y-6">
          
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 ml-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-green-500/50 focus:bg-slate-800 focus:ring-2 focus:ring-green-500/20 outline-none transition-all text-slate-200 placeholder:text-slate-600"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-slate-300 ml-1">Password</label>
              {/* Optional Forgot Password Link could go here */}
            </div>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-green-500/50 focus:bg-slate-800 focus:ring-2 focus:ring-green-500/20 outline-none transition-all text-slate-200 placeholder:text-slate-600"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {/* Primary CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-2 relative overflow-hidden group"
          >
            <span className="relative z-10">{loading ? "Signing In..." : "Sign In"}</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>

          {/* Secondary Actions */}
          <div className="text-center mt-4">
            <p className="text-slate-400 text-sm">
              Don't have an account?{" "}
              <NavLink to="/signup" className="text-green-400 hover:text-green-300 font-medium hover:underline transition-colors">
                Create Account
              </NavLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
