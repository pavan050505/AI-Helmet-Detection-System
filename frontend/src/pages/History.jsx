import React from "react"

export default function History() {
  const items = [
    { date: "2025-12-20", result: "Helmet On" },
    { date: "2025-12-21", result: "Helmet On" },
    { date: "2025-12-22", result: "No Helmet" }
  ]
  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
      <div className="text-lg font-semibold mb-2">Recent Activity</div>
      <div className="text-sm text-slate-300">Sample entries for demo purposes.</div>
      <div className="mt-4 space-y-2">
        {items.map(i => (
          <div key={i.date} className="flex items-center justify-between text-sm">
            <div className="text-slate-300">{i.date}</div>
            <div className={i.result === "Helmet On" ? "text-green-400" : "text-red-400"}>{i.result}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
