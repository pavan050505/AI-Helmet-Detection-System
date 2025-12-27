import React from "react"

export default function Rewards() {
  const tiers = [
    { name: "Starter", requirement: "3-day streak", reward: "+10 points", color: "bg-green-500" },
    { name: "Pro", requirement: "7-day streak", reward: "+25 points", color: "bg-purple-500" },
    { name: "Legend", requirement: "30-day streak", reward: "+100 points", color: "bg-yellow-500" }
  ]
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {tiers.map(t => (
        <div key={t.name} className="bg-slate-900 rounded-xl p-6 border border-slate-800">
          <div className="flex items-center mb-3">
            <div className={`w-3 h-3 rounded-full ${t.color} mr-2`} />
            <div className="text-lg font-semibold">{t.name}</div>
          </div>
          <div className="text-sm text-slate-300">{t.requirement}</div>
          <div className="text-sm text-blue-300 mt-1">{t.reward}</div>
        </div>
      ))}
    </div>
  )
}
