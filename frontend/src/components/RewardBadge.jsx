import React from "react"

function label(streak) {
  if (streak >= 30) return "Legend"
  if (streak >= 7) return "Pro"
  if (streak >= 3) return "Starter"
  return "Newbie"
}

export default function RewardBadge({ streak }) {
  const tier = label(streak)
  const color =
    tier === "Legend" ? "bg-yellow-500" : tier === "Pro" ? "bg-purple-500" : tier === "Starter" ? "bg-green-500" : "bg-slate-600"
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full ${color} mr-2`} />
        <div className="text-sm text-slate-300">Tier {tier}</div>
      </div>
      <div className="text-sm text-slate-300">Current Streak {streak}</div>
    </div>
  )
}
