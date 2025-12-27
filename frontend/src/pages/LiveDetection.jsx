import React, { useState, useEffect } from "react"
import WebcamFeed from "../components/WebcamFeed.jsx"

export default function LiveDetection() {
  const [timer, setTimer] = useState("00:00")
  const [totalAccumulated, setTotalAccumulated] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://127.0.0.1:5000/api/timer_status")
        .then(res => res.json())
        .then(data => {
            const totalSeconds = Math.floor(data.accumulated_time)
            const minutes = Math.floor(totalSeconds / 60)
            const secs = totalSeconds % 60
            setTimer(`${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`)
            setTotalAccumulated(totalSeconds)
        })
        .catch(() => {})
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Live Detection Panel */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl p-6 border border-slate-800 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />
          
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse" />
              Live Detection
            </h2>
            <WebcamFeed />
          </div>
        </div>

        {/* Session Panel */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl p-8 border border-slate-800 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 bg-gradient-to-bl from-green-500/5 to-emerald-500/5 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-green-500/50 to-transparent opacity-50" />

          <div className="relative z-10 w-full h-full flex flex-col">
            <h2 className="text-xl font-bold text-white mb-6">Session</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <span className="text-slate-400 text-sm font-medium">Status</span>
                <span className="text-white font-medium">Controlled via Start/Stop</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <span className="text-slate-400 text-sm font-medium">Confidence</span>
                <span className="text-white font-medium">N/A</span>
              </div>
            </div>

            <div className="flex-grow flex items-center justify-center">
              <div className="bg-slate-900/80 rounded-2xl p-8 border border-slate-700/50 relative flex items-center justify-center w-full max-w-sm aspect-square">
                 {/* Ambient Glow */}
                 <div className="absolute inset-0 bg-green-500/5 blur-2xl rounded-full" />
                 
                 {/* Meter Container */}
                 <div className="relative w-full h-full flex items-center justify-center">
                   
                   {/* Static Ring Tracks */}
                   <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 100 100">
                     {/* Outer tick marks (simulated with dasharray) */}
                     <circle cx="50" cy="50" r="48" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="1 4" />
                     {/* Inner Track */}
                     <circle cx="50" cy="50" r="40" fill="none" stroke="#0f172a" strokeWidth="4" />
                   </svg>

                   {/* Rotating Arrow/Indicator */}
                   <div 
                      className="absolute inset-0 w-full h-full transition-transform duration-1000 ease-linear p-4"
                      style={{ transform: `rotate(${totalAccumulated * 6}deg)` }}
                   >
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1/2 origin-bottom">
                         {/* The Pointer Tip */}
                         <div className="w-2 h-4 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,1)] absolute top-0 left-1/2 -translate-x-1/2" />
                         {/* The Pointer Tail/Gradient */}
                         <div className="w-0.5 h-12 bg-gradient-to-b from-green-500 to-transparent absolute top-2 left-1/2 -translate-x-1/2" />
                      </div>
                   </div>

                   {/* Center Digital Timer */}
                   <div className="relative z-10 flex flex-col items-center justify-center bg-slate-900 rounded-full w-40 h-40 border border-slate-800 shadow-2xl">
                     <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Wear Time</span>
                     <div className="text-4xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                       {timer}
                     </div>
                   </div>

                 </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Session Log Section */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-800 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="p-6 border-b border-slate-800/50 flex items-center justify-between bg-slate-900/50">
          <h2 className="text-xl font-bold text-white">Session Log</h2>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-sm font-medium flex items-center">1 - 3 of 3</span>
            <button className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/30">
                <th className="p-4 pl-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Confidence</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Start Time</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">End Time</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {[1, 2, 3].map((item) => (
                <tr key={item} className="group hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border border-green-500/30 bg-green-500/10 flex items-center justify-center text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <span className="text-slate-400 font-medium">N/A</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-400">N/A</td>
                  <td className="p-4 text-slate-400">-- : -- AM</td>
                  <td className="p-4 text-slate-400">-- : -- AM</td>
                  <td className="p-4 text-slate-400">-- : -- AM</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
