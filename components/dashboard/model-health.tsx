"use client"

import { cn } from "@/lib/utils"
import { Activity, Zap, Brain, Eye } from "lucide-react"

const models = [
  {
    name: "GPT-4 Production",
    icon: Brain,
    metrics: {
      drift: 0.02,
      driftStatus: "normal" as const,
      hallucination: 1.2,
      hallucinationStatus: "normal" as const,
      latency: 124,
      latencyStatus: "normal" as const,
      errorRate: 0.1,
      errorStatus: "normal" as const,
    },
  },
  {
    name: "Claude-3 Internal",
    icon: Zap,
    metrics: {
      drift: 0.05,
      driftStatus: "normal" as const,
      hallucination: 0.8,
      hallucinationStatus: "normal" as const,
      latency: 98,
      latencyStatus: "normal" as const,
      errorRate: 0.05,
      errorStatus: "normal" as const,
    },
  },
  {
    name: "Recommendation v3",
    icon: Activity,
    metrics: {
      drift: 0.18,
      driftStatus: "warning" as const,
      hallucination: 3.1,
      hallucinationStatus: "warning" as const,
      latency: 245,
      latencyStatus: "warning" as const,
      errorRate: 0.8,
      errorStatus: "normal" as const,
    },
  },
  {
    name: "Vision Model v2",
    icon: Eye,
    metrics: {
      drift: 0.03,
      driftStatus: "normal" as const,
      hallucination: 0.5,
      hallucinationStatus: "normal" as const,
      latency: 340,
      latencyStatus: "critical" as const,
      errorRate: 2.1,
      errorStatus: "critical" as const,
    },
  },
]

const statusColor = {
  normal: "text-success",
  warning: "text-warning",
  critical: "text-destructive",
}

const statusDot = {
  normal: "bg-success",
  warning: "bg-warning",
  critical: "bg-destructive",
}

export function ModelHealth() {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Model Health Status</h3>
        <p className="text-xs text-muted-foreground">Real-time model performance indicators</p>
      </div>
      <div className="flex flex-col gap-3">
        {models.map((model) => (
          <div key={model.name} className="rounded-md border border-border bg-secondary/30 p-4">
            <div className="mb-3 flex items-center gap-2">
              <model.icon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{model.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <MetricItem
                label="Drift Score"
                value={model.metrics.drift.toFixed(2)}
                status={model.metrics.driftStatus}
              />
              <MetricItem
                label="Hallucination %"
                value={`${model.metrics.hallucination}%`}
                status={model.metrics.hallucinationStatus}
              />
              <MetricItem
                label="Latency"
                value={`${model.metrics.latency}ms`}
                status={model.metrics.latencyStatus}
              />
              <MetricItem
                label="Error Rate"
                value={`${model.metrics.errorRate}%`}
                status={model.metrics.errorStatus}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MetricItem({ label, value, status }: { label: string; value: string; status: "normal" | "warning" | "critical" }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1.5">
        <div className={cn("h-1.5 w-1.5 rounded-full", statusDot[status])} />
        <span className={cn("text-xs font-mono", statusColor[status])}>{value}</span>
      </div>
    </div>
  )
}
