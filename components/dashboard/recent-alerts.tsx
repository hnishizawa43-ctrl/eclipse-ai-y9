"use client"

import { useEffect, useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface Alert {
  id: number
  title: string
  model: string
  severity: "critical" | "warning" | "info"
  time: string
}

const initialAlerts: Alert[] = [
  { id: 1, title: "プロンプトインジェクション検知", model: "GPT-4 本番環境", severity: "critical", time: "2分前" },
  { id: 2, title: "モデルドリフト異常", model: "レコメンドエンジン v3", severity: "warning", time: "15分前" },
  { id: 3, title: "PII漏洩試行", model: "カスタマーサポートBot", severity: "critical", time: "32分前" },
  { id: 4, title: "バイアススコア閾値超過", model: "採用評価AI", severity: "warning", time: "1時間前" },
  { id: 5, title: "不正APIアクセス", model: "内部LLMゲートウェイ", severity: "info", time: "2時間前" },
]

const newAlertPool: Omit<Alert, "id" | "time">[] = [
  { title: "トークン異常消費検知", model: "GPT-4 本番環境", severity: "warning" },
  { title: "出力フィルター回避試行", model: "カスタマーサポートBot", severity: "critical" },
  { title: "モデル推論レイテンシ急上昇", model: "Vision Model v2", severity: "warning" },
  { title: "学習データ抽出攻撃", model: "Claude-3 内部用", severity: "critical" },
  { title: "ハルシネーション率上昇", model: "法務文書AI", severity: "info" },
  { title: "敵対的入力パターン検知", model: "レコメンドエンジン v3", severity: "critical" },
]

const severityConfig = {
  critical: { label: "重大", className: "bg-destructive/15 text-destructive border-destructive/30", glowVar: "var(--glow-destructive)" },
  warning: { label: "警告", className: "bg-warning/15 text-warning border-warning/30", glowVar: "var(--glow-warning)" },
  info: { label: "情報", className: "bg-primary/15 text-primary border-primary/30", glowVar: "var(--glow-primary)" },
}

export function RecentAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)
  const [nextId, setNextId] = useState(6)

  const addAlert = useCallback(() => {
    const pool = newAlertPool[Math.floor(Math.random() * newAlertPool.length)]
    setAlerts((prev) => {
      const newAlert: Alert = {
        ...pool,
        id: nextId,
        time: "たった今",
      }
      setNextId((id) => id + 1)
      return [newAlert, ...prev.slice(0, 4)]
    })
  }, [nextId])

  useEffect(() => {
    const interval = setInterval(addAlert, 8000)
    return () => clearInterval(interval)
  }, [addAlert])

  return (
    <div className="rounded-lg glass-card border-border/30 p-5 animate-slide-up-fade" style={{ animationDelay: "0.2s" }}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">{"最新アラート"}</h3>
          <div className="relative h-2 w-2">
            <div className="absolute inset-0 rounded-full bg-success" />
            <div className="absolute inset-0 rounded-full bg-success animate-pulse-ring" />
          </div>
        </div>
        <span className="text-xs text-primary cursor-pointer hover:underline transition-colors">{"すべて表示"}</span>
      </div>
      <div className="flex flex-col gap-3">
        {alerts.map((alert, index) => {
          const config = severityConfig[alert.severity]
          return (
            <div
              key={alert.id}
              className="group flex items-center justify-between rounded-md border border-border/30 bg-secondary/30 px-3 py-2.5 transition-all duration-300 hover:bg-secondary/50 animate-slide-up-fade"
              style={{
                animationDelay: `${index * 0.05}s`,
                borderLeftWidth: "2px",
                borderLeftColor: alert.severity === "critical" ? "oklch(0.55 0.22 27)" : alert.severity === "warning" ? "oklch(0.75 0.17 70)" : "oklch(0.62 0.18 260)",
              }}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">{alert.title}</span>
                <span className="text-xs text-muted-foreground">{alert.model}</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className={cn("text-[10px] font-medium", config.className)}
                >
                  {config.label}
                </Badge>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{alert.time}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
