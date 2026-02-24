"use client"

import { useEffect, useState, useCallback } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

function generateInitialData() {
  return Array.from({ length: 12 }, (_, i) => {
    const hour = i * 2
    const threats = Math.floor(Math.random() * 60 + 10)
    return {
      time: `${String(hour).padStart(2, "0")}:00`,
      threats,
      blocked: Math.max(0, threats - Math.floor(Math.random() * 3)),
    }
  })
}

export function ThreatChart() {
  const [data, setData] = useState(() => generateInitialData())

  const updateData = useCallback(() => {
    setData((prev) => {
      const newData = [...prev]
      const lastIdx = newData.length - 1
      const delta = Math.floor(Math.random() * 10 - 3)
      const newThreats = Math.max(5, newData[lastIdx].threats + delta)
      newData[lastIdx] = {
        ...newData[lastIdx],
        threats: newThreats,
        blocked: Math.max(0, newThreats - Math.floor(Math.random() * 3)),
      }
      return newData
    })
  }, [])

  useEffect(() => {
    const interval = setInterval(updateData, 4000)
    return () => clearInterval(interval)
  }, [updateData])

  return (
    <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">脅威検知</h3>
            <div className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
          </div>
          <p className="text-xs text-muted-foreground">過去24時間</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-chart-1" />
            <span className="text-muted-foreground">検知</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-success" />
            <span className="text-muted-foreground">ブロック</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="threatGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="oklch(0.62 0.18 260)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="oklch(0.62 0.18 260)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="blockedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="oklch(0.65 0.17 155)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="oklch(0.65 0.17 155)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 260)" />
          <XAxis dataKey="time" tick={{ fill: "oklch(0.6 0.02 260)", fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: "oklch(0.6 0.02 260)", fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "oklch(0.17 0.008 260)",
              border: "1px solid oklch(0.25 0.01 260)",
              borderRadius: "8px",
              color: "oklch(0.95 0.01 260)",
              fontSize: "12px",
            }}
            labelFormatter={(label) => `時間: ${label}`}
            formatter={(value: number, name: string) => [value, name === "threats" ? "検知" : "ブロック"]}
          />
          <Area type="monotone" dataKey="threats" stroke="oklch(0.62 0.18 260)" fill="url(#threatGradient)" strokeWidth={2} />
          <Area type="monotone" dataKey="blocked" stroke="oklch(0.65 0.17 155)" fill="url(#blockedGradient)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
