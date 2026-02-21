"use client"

import { cn } from "@/lib/utils"
import { Activity, Zap, Brain, Eye } from "lucide-react"
import { useEffect, useState, useCallback } from "react"

interface ModelMetrics {
  drift: number
  driftStatus: "normal" | "warning" | "critical"
  hallucination: number
  hallucinationStatus: "normal" | "warning" | "critical"
  latency: number
  latencyStatus: "normal" | "warning" | "critical"
  errorRate: number
  errorStatus: "normal" | "warning" | "critical"
}

interface Model {
  name: string
  icon: typeof Brain
  metrics: ModelMetrics
}

function getStatus(val: number, warnThreshold: number, critThreshold: number): "normal" | "warning" | "critical" {
  if (val >= critThreshold) return "critical"
  if (val >= warnThreshold) return "warning"
  return "normal"
}

function generateMetrics(base: { drift: number; hall: number; latency: number; err: number }): ModelMetrics {
  const drift = Math.max(0, base.drift + (Math.random() - 0.5) * 0.02)
  const hallucination = Math.max(0, base.hall + (Math.random() - 0.5) * 0.4)
  const latency = Math.max(50, base.latency + Math.floor((Math.random() - 0.5) * 30))
  const errorRate = Math.max(0, base.err + (Math.random() - 0.5) * 0.3)
  return {
    drift: parseFloat(drift.toFixed(2)),
    driftStatus: getStatus(drift, 0.1, 0.25),
    hallucination: parseFloat(hallucination.toFixed(1)),
    hallucinationStatus: getStatus(hallucination, 2, 5),
    latency: Math.round(latency),
    latencyStatus: getStatus(latency, 200, 400),
    errorRate: parseFloat(errorRate.toFixed(2)),
    errorStatus: getStatus(errorRate, 1, 3),
  }
}

const initialModels: Model[] = [
  { name: "GPT-4 本番環境", icon: Brain, metrics: generateMetrics({ drift: 0.02, hall: 1.2, latency: 124, err: 0.1 }) },
  { name: "Claude-3 内部用", icon: Zap, metrics: generateMetrics({ drift: 0.05, hall: 0.8, latency: 98, err: 0.05 }) },
  { name: "レコメンド v3", icon: Activity, metrics: generateMetrics({ drift: 0.18, hall: 3.1, latency: 245, err: 0.8 }) },
  { name: "Vision Model v2", icon: Eye, metrics: generateMetrics({ drift: 0.03, hall: 0.5, latency: 340, err: 2.1 }) },
]

const baselines = [
  { drift: 0.02, hall: 1.2, latency: 124, err: 0.1 },
  { drift: 0.05, hall: 0.8, latency: 98, err: 0.05 },
  { drift: 0.18, hall: 3.1, latency: 245, err: 0.8 },
  { drift: 0.03, hall: 0.5, latency: 340, err: 2.1 },
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
  const [models, setModels] = useState<Model[]>(initialModels)

  const updateMetrics = useCallback(() => {
    setModels((prev) =>
      prev.map((model, i) => ({
        ...model,
        metrics: generateMetrics(baselines[i]),
      }))
    )
  }, [])

  useEffect(() => {
    const interval = setInterval(updateMetrics, 3000)
    return () => clearInterval(interval)
  }, [updateMetrics])

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">モデルヘルスステータス</h3>
          <p className="text-xs text-muted-foreground">リアルタイムモデル性能指標</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-success font-medium">LIVE</span>
          <div className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {models.map((model) => (
          <div key={model.name} className="rounded-md border border-border bg-secondary/30 p-4">
            <div className="mb-3 flex items-center gap-2">
              <model.icon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{model.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <MetricItem label="ドリフトスコア" value={model.metrics.drift.toFixed(2)} status={model.metrics.driftStatus} />
              <MetricItem label="ハルシネーション率" value={`${model.metrics.hallucination}%`} status={model.metrics.hallucinationStatus} />
              <MetricItem label="レイテンシ" value={`${model.metrics.latency}ms`} status={model.metrics.latencyStatus} />
              <MetricItem label="エラー率" value={`${model.metrics.errorRate}%`} status={model.metrics.errorStatus} />
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
        <div className={cn("h-1.5 w-1.5 rounded-full transition-colors", statusDot[status])} />
        <span className={cn("text-xs font-mono transition-colors", statusColor[status])}>{value}</span>
      </div>
    </div>
  )
}
