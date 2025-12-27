import React, { useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function StreakChart({ items }) {
  const data = useMemo(() => {
    const days = {}
    items.forEach(i => {
      const d = i.timestamp.slice(0, 10)
      days[d] = Math.max(days[d] || 0, i.result ? 1 : 0)
    })
    const arr = Object.keys(days).sort().map(d => ({ date: d, value: days[d] }))
    return arr.slice(-14)
  }, [items])
  return (
    <div className="mt-4">
      <div className="text-sm text-slate-300 mb-2">Daily Helmet Usage</div>
      <div className="h-64">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid stroke="#1f2937" />
            <XAxis dataKey="date" stroke="#93c5fd" />
            <YAxis domain={[0, 1]} stroke="#93c5fd" />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#60a5fa" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
