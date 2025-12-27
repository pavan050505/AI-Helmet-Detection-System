import React, { useMemo, useState, useEffect } from "react"
import { useNavigate, NavLink } from "react-router-dom"
import { useAuth } from "../auth/AuthContext.jsx"
import logo from "../assets/logo.png"

export default function Signup() {
  const navigate = useNavigate()
  const origin = useMemo(() => import.meta.env.VITE_API_ORIGIN || "http://127.0.0.1:5000", [])
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [passStrength, setPassStrength] = useState(0) // 0-4
  
  const { login } = useAuth()

  // Password strength calculation
  useEffect(() => {
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    setPassStrength(strength)
  }, [password])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // 1. Validation
    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your first and last name")
      return
    }
    
    // Password Rules: Min 8 chars, 1 number & 1 symbol
    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }
    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number")
      return
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      setError("Password must contain at least one symbol")
      return
    }

    if (password !== confirm) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(origin + "/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || "Signup failed")
        setLoading(false)
        return
      }
      
      // Auto-login after signup
      const res2 = await fetch(origin + "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      const json2 = await res2.json()
      if (res2.ok && json2.token) {
        login(json2.token)
        try {
          // Store additional profile info locally as backend doesn't support it yet
          localStorage.setItem("helmet_profile", JSON.stringify({ 
            firstName: firstName.trim(), 
            lastName: lastName.trim(), 
            email: email.trim() 
          }))
        } catch {}
        navigate("/")
      } else {
        navigate("/login")
      }
    } catch {
      setError("Network error. Please try again.")
      setLoading(false)
    }
  }

  const passwordsMatch = password && confirm && password === confirm

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 px-4 relative">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl relative overflow-hidden">
        
        {/* Header / Branding */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="relative mb-4 group">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl group-hover:bg-green-500/30 transition-all duration-500" />
            <img src={logo} alt="Helmet Detection Logo" className="h-16 w-16 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Your Account</h1>
          <p className="text-slate-400 text-sm">Start tracking helmet usage and earn rewards</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={onSubmit} className="space-y-5">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 ml-1">First Name <span className="text-red-400">*</span></label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-green-500/50 focus:bg-slate-800 focus:ring-2 focus:ring-green-500/20 outline-none transition-all text-slate-200 placeholder:text-slate-600"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 ml-1">Last Name <span className="text-red-400">*</span></label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-green-500/50 focus:bg-slate-800 focus:ring-2 focus:ring-green-500/20 outline-none transition-all text-slate-200 placeholder:text-slate-600"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 ml-1">Email <span className="text-red-400">*</span></label>
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
            <label className="text-xs font-medium text-slate-300 ml-1">Password <span className="text-red-400">*</span></label>
            <div className="relative">
              <input
                type="password"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-green-500/50 focus:bg-slate-800 focus:ring-2 focus:ring-green-500/20 outline-none transition-all text-slate-200 placeholder:text-slate-600"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {/* Strength Indicator Dot */}
              {password && (
                 <div className={`absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-colors ${
                    passStrength <= 2 ? 'bg-red-500' : passStrength === 3 ? 'bg-yellow-500' : 'bg-green-500'
                 }`} />
              )}
            </div>
            {/* Password Rules Helper */}
            <div className="text-[10px] text-slate-500 ml-1 flex flex-wrap gap-2">
               <span className={password.length >= 8 ? "text-green-400" : ""}>Min 8 chars</span>
               <span>•</span>
               <span className={/[0-9]/.test(password) ? "text-green-400" : ""}>1 number</span>
               <span>•</span>
               <span className={/[^A-Za-z0-9]/.test(password) ? "text-green-400" : ""}>1 symbol</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 ml-1">Confirm Password <span className="text-red-400">*</span></label>
            <div className="relative">
              <input
                type="password"
                className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border focus:bg-slate-800 focus:ring-2 outline-none transition-all text-slate-200 placeholder:text-slate-600 ${
                  passwordsMatch ? 'border-green-500/50 focus:ring-green-500/20' : 'border-slate-700 focus:border-green-500/50 focus:ring-green-500/20'
                }`}
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              {/* Checkmark Animation */}
              {passwordsMatch && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              )}
            </div>
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
            <span className="relative z-10">{loading ? "Creating Account..." : "Create Account"}</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>

          {/* Secondary Actions */}
          <div className="text-center mt-4">
            <p className="text-slate-400 text-sm">
              Already have an account?{" "}
              <NavLink to="/login" className="text-green-400 hover:text-green-300 font-medium hover:underline transition-colors">
                Login
              </NavLink>
            </p>
          </div>
        </form>

        {/* Legal Consent */}
        <div className="mt-8 text-center px-4">
          <p className="text-[10px] text-slate-500 leading-relaxed">
            By creating an account, you agree to our<br/>
            <a href="#" className="text-slate-400 hover:text-slate-300 hover:underline">Terms & Conditions</a>
            {" "}and{" "}
            <a href="#" className="text-slate-400 hover:text-slate-300 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}
