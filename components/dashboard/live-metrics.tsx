"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

function generateDataPoint(index: number) {
  const time = new Date(Date.now() - (29 - index) * 2000)
  return {
    time: time.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    requests: Math.floor(Math.random() * 200 + 400),
    anomalies: Math.floor(Math.random() * 8),
    latency: Math.floor(Math.random() * 50 + 80),
  }
}

export function LiveMetrics() {
  const [data, setData] = useState(() =>
    Array.from({ length: 30 }, (_, i) => generateDataPoint(i))
  )
  const counterRef = useRef(29)

  const updateData = useCallback(() => {
    counterRef.current += 1
    const newPoint = generateDataPoint(counterRef.current)
    setData((prev) => [...prev.slice(1), newPoint])
  }, [])

  useEffect(() => {
    const interval = setInterval(updateData, 2000)
    return () => clearInterval(interval)
  }, [updateData])

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">リクエストボリューム</h3>
            <p className="text-xs text-muted-foreground">リアルタイムAPIリクエスト数</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-success font-medium">LIVE</span>
            <div className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 260)" />
            <XAxis dataKey="time" tick={{ fill: "oklch(0.6 0.02 260)", fontSize: 10 }} tickLine={false} axisLine={false} interval={5} />
            <YAxis tick={{ fill: "oklch(0.6 0.02 260)", fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.17 0.008 260)",
                border: "1px solid oklch(0.25 0.01 260)",
                borderRadius: "8px",
                color: "oklch(0.95 0.01 260)",
                fontSize: "12px",
              }}
              formatter={(value: number) => [`${value} req`, "リクエスト数"]}
            />
            <Line type="monotone" dataKey="requests" stroke="oklch(0.62 0.18 260)" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">異常検知</h3>
            <p className="text-xs text-muted-foreground">異常パターンの検出状況</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-success font-medium">LIVE</span>
            <div className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 260)" />
            <XAxis dataKey="time" tick={{ fill: "oklch(0.6 0.02 260)", fontSize: 10 }} tickLine={false} axisLine={false} interval={5} />
            <YAxis tick={{ fill: "oklch(0.6 0.02 260)", fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.17 0.008 260)",
                border: "1px solid oklch(0.25 0.01 260)",
                borderRadius: "8px",
                color: "oklch(0.95 0.01 260)",
                fontSize: "12px",
              }}
              formatter={(value: number) => [value, "異常検知数"]}
            />
            <Line type="monotone" dataKey="anomalies" stroke="oklch(0.55 0.22 27)" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
