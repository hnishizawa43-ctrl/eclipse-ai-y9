"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { time: "00:00", threats: 12, blocked: 12 },
  { time: "02:00", threats: 8, blocked: 8 },
  { time: "04:00", threats: 15, blocked: 14 },
  { time: "06:00", threats: 23, blocked: 22 },
  { time: "08:00", threats: 45, blocked: 43 },
  { time: "10:00", threats: 67, blocked: 65 },
  { time: "12:00", threats: 52, blocked: 51 },
  { time: "14:00", threats: 78, blocked: 76 },
  { time: "16:00", threats: 62, blocked: 60 },
  { time: "18:00", threats: 43, blocked: 42 },
  { time: "20:00", threats: 31, blocked: 30 },
  { time: "22:00", threats: 18, blocked: 18 },
]

export function ThreatChart() {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Threat Detection</h3>
          <p className="text-xs text-muted-foreground">Last 24 hours</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-chart-1" />
            <span className="text-muted-foreground">Detected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-success" />
            <span className="text-muted-foreground">Blocked</span>
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
          />
          <Area type="monotone" dataKey="threats" stroke="oklch(0.62 0.18 260)" fill="url(#threatGradient)" strokeWidth={2} />
          <Area type="monotone" dataKey="blocked" stroke="oklch(0.65 0.17 155)" fill="url(#blockedGradient)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
