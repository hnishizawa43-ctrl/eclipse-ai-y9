"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { AlertTriangle, Shield, Info, Activity, Bell, Trash2, CheckCheck } from "lucide-react"
import { useState } from "react"

type NotificationLevel = "critical" | "warning" | "info" | "success"

interface Notification {
  id: string
  title: string
  description: string
  level: NotificationLevel
  category: "threat" | "compliance" | "system" | "model"
  time: string
  unread: boolean
}

const levelIcons: Record<NotificationLevel, typeof AlertTriangle> = {
  critical: AlertTriangle,
  warning: Activity,
  info: Info,
  success: Shield,
}

const levelColors: Record<NotificationLevel, string> = {
  critical: "text-destructive",
  warning: "text-warning",
  info: "text-primary",
  success: "text-success",
}

const levelBgColors: Record<NotificationLevel, string> = {
  critical: "bg-destructive/10 border-destructive/20",
  warning: "bg-warning/10 border-warning/20",
  info: "bg-primary/10 border-primary/20",
  success: "bg-success/10 border-success/20",
}

const levelLabels: Record<NotificationLevel, string> = {
  critical: "重大",
  warning: "警告",
  info: "情報",
  success: "成功",
}

const categoryLabels: Record<string, string> = {
  threat: "脅威",
  compliance: "準拠",
  system: "システム",
  model: "モデル",
}

type FilterLevel = "all" | NotificationLevel

const staticNotifications: Notification[] = [
  { id: "init-1", title: "高リスク脆弱性を検出", description: "モデル GPT-4o にプロンプトインジェクションの脆弱性が見つかりました。", level: "critical", category: "threat", time: "5分前", unread: true },
  { id: "init-2", title: "スキャン完了", description: "定期セキュリティスキャンが正常に完了しました。", level: "success", category: "system", time: "1時間前", unread: true },
  { id: "init-3", title: "コンプライアンス更新", description: "EU AI Act の新しいガイドラインが公開されました。", level: "info", category: "compliance", time: "3時間前", unread: false },
  { id: "init-4", title: "異常トラフィック検出", description: "GPT-4 エンドポイントへの異常なリクエストパターンを検知しました。", level: "warning", category: "threat", time: "5時間前", unread: false },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(staticNotifications)
  const [simulationEnabled, setSimulationEnabled] = useState(false)
  const [filterLevel, setFilterLevel] = useState<FilterLevel>("all")
  const unreadCount = notifications.filter(n => n.unread).length
  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n))
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  const clearAll = () => setNotifications([])

  const filtered =
    filterLevel === "all" ? notifications : notifications.filter((n) => n.level === filterLevel)

  return (
    <div>
      <DashboardHeader title="通知センター" description="セキュリティイベントとシステム通知の管理" />
      <div className="p-6 flex flex-col gap-4">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {(["all", "critical", "warning", "info", "success"] as FilterLevel[]).map((level) => (
              <button
                key={level}
                onClick={() => setFilterLevel(level)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  filterLevel === level
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                {level === "all" ? `すべて (${notifications.length})` : levelLabels[level]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={simulationEnabled}
                onChange={(e) => setSimulationEnabled(e.target.checked)}
                className="rounded border-border"
              />
              ライブシミュレーション
            </label>
            <div className="h-5 w-px bg-border" />
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <CheckCheck className="h-3 w-3" />
                すべて既読
              </button>
            )}
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              クリア
            </button>
          </div>
        </div>

        {/* Notification List */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-lg border border-border bg-card">
            <Bell className="h-12 w-12 text-muted-foreground/20 mb-3" />
            <p className="text-sm text-muted-foreground">通知はありません</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              新しいセキュリティイベントが発生すると、ここに表示されます
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((notification) => {
              const Icon = levelIcons[notification.level]
              return (
                <div
                  key={notification.id}
                  onClick={() => markRead(notification.id)}
                  className={cn(
                    "flex items-start gap-4 rounded-lg border bg-card px-5 py-4 transition-all cursor-pointer hover:bg-secondary/30",
                    notification.unread && "border-l-2 border-l-primary"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
                      levelBgColors[notification.level]
                    )}
                  >
                    <Icon className={cn("h-4 w-4", levelColors[notification.level])} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-foreground">{notification.title}</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px]",
                          levelBgColors[notification.level],
                          levelColors[notification.level]
                        )}
                      >
                        {levelLabels[notification.level]}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] bg-secondary text-muted-foreground">
                        {categoryLabels[notification.category]}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{notification.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">{notification.time}</span>
                    {notification.unread && (
                      <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
