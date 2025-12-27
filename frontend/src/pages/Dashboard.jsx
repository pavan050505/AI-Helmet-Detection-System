import React from "react"
import { useNavigate } from "react-router-dom"
import detectionImg from "../assets/detection.png"

export default function Dashboard() {
  const navigate = useNavigate()
  
  // Static values for new users as requested
  const streak = 0
  const totalDetections = 0
  const complianceRate = 0
  const rewards = 0
  const wearTime = "00:00"

  return (
    <div className="flex flex-col gap-8">
      
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-start justify-between gap-8 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Helmet Detection System</h1>
          <p className="text-slate-400 text-lg">AI-powered real-time safety monitoring</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Image Section */}
        <div className="lg:col-span-5 relative group">
          <div className="relative rounded-3xl overflow-hidden border-2 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
            <img 
              src={detectionImg} 
              alt="Helmet Detection" 
              className="w-full h-full object-cover"
            />
            {/* Overlay Elements (simulating the UI in the image) */}
            <div className="absolute top-4 right-4 bg-red-500/80 backdrop-blur-sm px-3 py-1 rounded-full border border-red-400/50 text-xs font-bold text-white shadow-lg animate-pulse">
              Wear The Helmet
            </div>
            {/* Green corners/frame effect */}
            <div className="absolute inset-0 border-2 border-green-500/30 rounded-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-green-400 to-green-500 shadow-[0_0_20px_rgba(34,197,94,0.8)]" />
          </div>
        </div>

        {/* Right Stats & Controls Section */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Start Button */}
          <button 
            onClick={() => navigate("/live")}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xl font-bold py-4 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-400/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Start Live Detection
          </button>

          {/* Timer Card */}
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 flex items-center justify-between relative overflow-hidden group">
            {/* Glow effect */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-all" />
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span className="text-sm font-medium uppercase tracking-wide">Helmet Wear Time Today</span>
              </div>
              <div className="text-5xl font-mono font-bold text-white tracking-wider drop-shadow-lg">
                {wearTime}
              </div>
            </div>

            {/* Circular Progress (Visual only) */}
            <div className="relative w-24 h-24 flex items-center justify-center">
               <svg className="w-full h-full transform -rotate-90">
                 <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                 <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset="251.2" className="text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
               </svg>
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-green-400 transform rotate-45" />
               </div>
            </div>

             {/* Small Stat Box inside Timer Card */}
            <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700 min-w-[100px]">
               <div className="text-[10px] text-slate-400 uppercase mb-1">Session Score</div>
               <div className="flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                 <span className="text-2xl font-bold text-white">0</span>
               </div>
            </div>
          </div>

          {/* Bottom Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Streak */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden hover:border-green-500/30 transition-colors group">
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <div className="p-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Current Streak</span>
              </div>
              <div className="text-2xl font-bold text-white">{streak} <span className="text-sm text-slate-500 font-normal">Days</span></div>
            </div>

            {/* Card 2: Total Detections */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden hover:border-cyan-500/30 transition-colors group">
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-2 text-cyan-400 mb-2">
                <div className="p-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Total Detections</span>
              </div>
              <div className="text-2xl font-bold text-white">{totalDetections}</div>
            </div>

            {/* Card 3: Compliance Rate */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden hover:border-blue-500/30 transition-colors group">
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <div className="p-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Compliance Rate</span>
              </div>
              <div className="text-2xl font-bold text-white">{complianceRate}%</div>
            </div>

            {/* Card 4: Rewards */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden hover:border-yellow-500/30 transition-colors group">
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-2 text-yellow-400 mb-2">
                <div className="p-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Rewards</span>
              </div>
              <div className="text-2xl font-bold text-white">{rewards}</div>
            </div>

          </div>
        </div>

      </div>

      {/* Recent Stats Section */}
      <div className="mt-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Recent Stats</h2>
          
          {/* Time Filter */}
          <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800">
            <button className="px-4 py-1.5 rounded-lg text-sm font-medium bg-slate-800 text-white shadow-[0_0_10px_rgba(34,197,94,0.2)] border border-slate-700/50 relative overflow-hidden group">
              <span className="relative z-10">Today</span>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
            </button>
            <button className="px-4 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors">
              7 Days
            </button>
            <button className="px-4 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors">
              30 Days
            </button>
          </div>
        </div>

        {/* Stats Cards Container */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Coupons (Purple/Pink) */}
            <div className="flex flex-col items-center gap-4 group cursor-pointer">
              <div className="relative w-full aspect-[1.8/1] rounded-2xl border border-purple-500/30 bg-slate-900/80 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(168,85,247,0.1)] group-hover:border-purple-500/60 group-hover:shadow-[0_0_25px_rgba(168,85,247,0.2)] transition-all">
                {/* Glow Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
                
                {/* Ticket Icon SVG */}
                <svg width="80" height="50" viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
                  <path d="M10 5C10 7.76142 7.76142 10 5 10H0V40H5C7.76142 40 10 42.2386 10 45V50H70V45C70 42.2386 72.2386 40 75 40H80V10H75C72.2386 10 70 7.76142 70 5V0H10V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M25 25L30 20L35 25L30 30L25 25Z" fill="currentColor" fillOpacity="0.5"/>
                  <circle cx="40" cy="25" r="3" fill="currentColor"/>
                  <circle cx="50" cy="25" r="3" fill="currentColor"/>
                  <circle cx="30" cy="25" r="3" fill="currentColor"/>
                  <path d="M20 0V50" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
                </svg>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span className="text-sm font-medium tracking-wide">Coupons</span>
              </div>
            </div>

            {/* Card 2: 100 Stars (Gold/Center Highlight) */}
            <div className="flex flex-col items-center gap-4 group cursor-pointer transform md:-translate-y-2">
              <div className="relative w-full aspect-[1.8/1] rounded-2xl border-2 border-amber-500/50 bg-slate-900/90 flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.25)] group-hover:border-amber-400 group-hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] transition-all">
                {/* Glow Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent" />
                <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,1)]" />
                
                {/* Star Icon SVG */}
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="rgba(251, 191, 36, 0.2)"/>
                  <path d="M7 14.14L2 9.27L8.91 8.26L12 2M22 9.27L17 14.14M18.18 21.02L12 17.77" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
                </svg>
                
                {/* Horizontal Lines Decoration */}
                <div className="absolute left-4 top-1/2 w-8 h-[2px] bg-amber-500/30" />
                <div className="absolute right-4 top-1/2 w-8 h-[2px] bg-amber-500/30" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 font-bold text-xs shadow-[0_0_10px_rgba(245,158,11,0.8)]">
                  $
                </div>
                <span className="text-2xl font-bold text-white tracking-wide">100</span>
              </div>
            </div>

            {/* Card 3: Rewards (Green/Cyan) */}
            <div className="flex flex-col items-center gap-4 group cursor-pointer">
              <div className="relative w-full aspect-[1.8/1] rounded-2xl border border-emerald-500/30 bg-slate-900/80 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.1)] group-hover:border-emerald-500/60 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] transition-all">
                {/* Glow Background */}
                <div className="absolute inset-0 bg-gradient-to-bl from-emerald-500/5 to-cyan-500/5" />
                
                {/* Ticket/Reward Icon SVG */}
                <svg width="80" height="50" viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                  <path d="M5 10C7.76142 10 10 7.76142 10 5V0H70V5C70 7.76142 72.2386 10 75 10H80V40H75C72.2386 40 70 42.2386 70 45V50H10V45C10 42.2386 7.76142 40 5 40H0V10H5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M40 30L35 25L40 20L45 25L40 30Z" fill="currentColor" fillOpacity="0.5"/>
                  <path d="M15 25H25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                  <path d="M55 25H65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                  <path d="M20 0V50" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2" opacity="0.3"/>
                </svg>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                <span className="text-sm font-medium tracking-wide">Rewards</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Recent History Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Recent History</h2>
          <button 
            onClick={() => navigate("/history")}
            className="text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
          >
            View All
          </button>
        </div>
        
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50">
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">ID</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Time</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {[1, 2, 3, 4, 5].map((item) => (
                  <tr key={item} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="p-4 text-slate-300 font-mono text-sm">#{2024000 + item}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        item % 3 === 0 
                          ? "bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(248,113,113,0.2)]" 
                          : "bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.2)]"
                      }`}>
                        {item % 3 === 0 ? "No Helmet" : "Helmet On"}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 text-sm">Dec {20 + item}, 2025</td>
                    <td className="p-4 text-slate-300 text-sm">{10 + item}:30 AM</td>
                    <td className="p-4 text-right">
                      <button className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  )
}
