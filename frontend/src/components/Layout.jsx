import React from "react"
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../auth/AuthContext.jsx"
import logo from "../assets/logo.png"

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, logout } = useAuth()

  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup"

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-green-500/30 flex flex-col">
      
      {/* Navigation Bar */}
      <div className="px-4 py-6 flex justify-center sticky top-0 z-50">
        <header className="w-full max-w-6xl bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-full px-6 py-3 flex items-center justify-between shadow-2xl relative overflow-hidden">
          
          {/* Top Green Glow Effect */}
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-70 shadow-[0_0_15px_rgba(74,222,128,0.5)]" />

          {/* Logo Section */}
          <div className="flex items-center gap-3 z-10">
            <img src={logo} alt="Helmet Detection Logo" className="h-10 w-10 object-contain drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]" />
            <div className="font-bold text-lg tracking-wide text-white">
              Helmet Detection
            </div>
          </div>

          {/* Navigation Links - Hidden on Auth Pages */}
          {!isAuthPage && (
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium z-10">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `relative py-2 transition-colors duration-300 ${isActive ? "text-white" : "text-slate-400 hover:text-slate-200"}`
                }
              >
                {({ isActive }) => (
                  <>
                    Dashboard
                    {isActive && (
                      <span className="absolute -bottom-[18px] left-0 right-0 h-[2px] bg-green-500 shadow-[0_0_10px_rgba(34,197,94,1)] rounded-full transform scale-x-100 transition-transform" />
                    )}
                  </>
                )}
              </NavLink>
              
              <NavLink 
                to="/live" 
                className={({ isActive }) => 
                  `relative py-2 transition-colors duration-300 ${isActive ? "text-white" : "text-slate-400 hover:text-slate-200"}`
                }
              >
                {({ isActive }) => (
                  <>
                    Live Detection
                    {isActive && (
                      <span className="absolute -bottom-[18px] left-0 right-0 h-[2px] bg-green-500 shadow-[0_0_10px_rgba(34,197,94,1)] rounded-full transform scale-x-100 transition-transform" />
                    )}
                  </>
                )}
              </NavLink>

              <NavLink 
                to="/rewards" 
                className={({ isActive }) => 
                  `relative py-2 transition-colors duration-300 ${isActive ? "text-white" : "text-slate-400 hover:text-slate-200"}`
                }
              >
                {({ isActive }) => (
                  <>
                    Rewards
                    {isActive && (
                      <span className="absolute -bottom-[18px] left-0 right-0 h-[2px] bg-green-500 shadow-[0_0_10px_rgba(34,197,94,1)] rounded-full transform scale-x-100 transition-transform" />
                    )}
                  </>
                )}
              </NavLink>

              <NavLink 
                to="/history" 
                className={({ isActive }) => 
                  `relative py-2 transition-colors duration-300 ${isActive ? "text-white" : "text-slate-400 hover:text-slate-200"}`
                }
              >
                {({ isActive }) => (
                  <>
                    History
                    {isActive && (
                      <span className="absolute -bottom-[18px] left-0 right-0 h-[2px] bg-green-500 shadow-[0_0_10px_rgba(34,197,94,1)] rounded-full transform scale-x-100 transition-transform" />
                    )}
                  </>
                )}
              </NavLink>
            </nav>
          )}

          {/* Right Side (Auth/Profile) */}
          <div className="flex items-center gap-4 z-10">
            {!isAuthenticated ? (
              <>
                <NavLink to="/login" className="text-sm text-slate-300 hover:text-white transition-colors">Login</NavLink>
                <NavLink to="/signup" className="text-sm px-4 py-2 rounded-full bg-green-600 hover:bg-green-500 text-white font-medium transition-all shadow-lg shadow-green-900/20">
                  Signup
                </NavLink>
              </>
            ) : (
              <>
                {/* Notification Bell */}
                <button className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                  {/* Optional notification dot */}
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-slate-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                {/* User Avatar */}
                <div className="relative group cursor-pointer" onClick={() => navigate("/account")}>
                  <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600 overflow-hidden relative">
                     {/* Placeholder Avatar or User Initials */}
                     <div className="w-full h-full flex items-center justify-center text-slate-300 font-semibold bg-gradient-to-br from-slate-700 to-slate-800">
                        U
                     </div>
                  </div>
                  {/* Online Dot */}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                  
                  {/* Dropdown (Simple logout) */}
                  <div className="absolute right-0 top-full mt-2 w-32 bg-slate-900 border border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50 overflow-hidden">
                    <button 
                      onClick={(e) => { e.stopPropagation(); logout(); navigate("/login"); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

        </header>
      </div>

      <main className="max-w-7xl mx-auto px-6 pb-24 flex-grow w-full">
        <Outlet />
      </main>

      {/* Footer - Hidden on Auth Pages */}
      {!isAuthPage && (
        <footer className="w-full bg-slate-900/50 border-t border-slate-800 pt-16 pb-8 relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-green-500/50 to-transparent blur-sm" />

          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              
              {/* Column 1: Brand / About */}
              <div className="space-y-6">
                <div className="flex flex-col gap-4">
                   <div className="relative w-12 h-12">
                      <img src={logo} alt="Helmet Detection" className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                      <svg className="absolute inset-0 w-full h-full text-green-500/30 -z-10 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <circle cx="12" cy="12" r="10" strokeDasharray="4 4" />
                      </svg>
                   </div>
                   <div>
                     <h3 className="text-xl font-bold text-white tracking-tight">Helmet Detection System</h3>
                     <div className="h-1 w-12 bg-green-500 rounded-full mt-2" />
                   </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                  An AI-powered safety platform that monitors helmet usage in real time, tracks wear time, rewards consistency, and promotes safer riding habits.
                </p>
              </div>

              {/* Column 2: Connect With Us */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-6">Connect With Us</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 group">
                    <div className="p-2 rounded-lg bg-slate-800 text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <span className="text-slate-300 text-sm mt-1.5">Pune, Maharashtra, India</span>
                  </div>
                  
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 rounded-lg bg-slate-800 text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </div>
                    <span className="text-slate-300 text-sm">+91 9XXXXXXXXX</span>
                  </div>

                  <div className="flex items-center gap-3 group">
                    <div className="p-2 rounded-lg bg-slate-800 text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    </div>
                    <span className="text-slate-300 text-sm">support@helmetdetection.ai</span>
                  </div>
                </div>
              </div>

              {/* Column 3: Legal */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-6">Legal</h4>
                <ul className="space-y-3 text-sm text-slate-400">
                  {['Terms & Conditions', 'Privacy Policy', 'Cookie Policy', 'Data Security'].map((item) => (
                    <li key={item}>
                      <a href="#" className="hover:text-green-400 transition-colors duration-300 flex items-center gap-2 group">
                        <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-green-500 transition-colors" />
                        <span className="group-hover:translate-x-1 transition-transform">{item}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 4: Social / Extra */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-6">Social / Extra</h4>
                <div className="flex gap-4">
                  {[
                    { icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>, label: "Email" },
                    { icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0 3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>, label: "GitHub" },
                    { icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>, label: "LinkedIn" },
                    { icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>, label: "Twitter" }
                  ].map((social, idx) => (
                    <a 
                      key={idx}
                      href="#" 
                      className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-green-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.6)] transition-all duration-300 transform hover:-translate-y-1"
                      aria-label={social.label}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Footer Bar */}
            <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <div className="text-center md:text-left">
                © 2025 Helmet Detection System. All rights reserved.
              </div>
              <div className="flex gap-6">
                <a href="#" className="hover:text-green-400 transition-colors">Terms</a>
                <a href="#" className="hover:text-green-400 transition-colors">Privacy</a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
