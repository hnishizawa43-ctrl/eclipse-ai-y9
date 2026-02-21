"use client"

import { useState } from "react"
import { Bell, Search, ShieldAlert, AlertTriangle, FileCheck, Info, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { UserMenu } from "@/components/dashboard/user-menu"

const INITIAL_NOTIFICATIONS = [
  {
    id: "1",
    type: "critical" as const,
    title: "プロンプトインジェクション検出",
    description: "GPT-4モデルで重大な脆弱性が検出されました",
    time: "3分前",
    read: false,
  },
  {
    id: "2",
    type: "warning" as const,
    title: "モデルドリフト警告",
    description: "Sentiment-v2の精度が閾値を下回りました",
    time: "18分前",
    read: false,
  },
  {
    id: "3",
    type: "info" as const,
    title: "コンプライアンス更新",
    description: "EU AI Act対応レポートが生成されました",
    time: "1時間前",
    read: false,
  },
]

const typeConfig = {
  critical: { icon: ShieldAlert, color: "text-destructive", bg: "bg-destructive/10" },
  warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
  info: { icon: FileCheck, color: "text-primary", bg: "bg-primary/10" },
  success: { icon: Info, color: "text-success", bg: "bg-success/10" },
}

export function DashboardHeader({ title, description }: { title: string; description?: string }) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)

  const unreadCount = notifications.filter((n) => !n.read).length

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  function dismiss(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="検索..."
            className="w-64 pl-9 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="relative flex h-9 w-9 items-center justify-center rounded-md border border-border bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground border-0">
                {unreadCount}
              </Badge>
            )}
          </button>

          {/* Notification dropdown */}
          {open && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-border bg-card shadow-xl">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <h3 className="text-sm font-semibold text-foreground">通知</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                      すべて既読にする
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                      通知はありません
                    </div>
                  ) : (
                    notifications.map((n) => {
                      const config = typeConfig[n.type]
                      const Icon = config.icon
                      return (
                        <div
                          key={n.id}
                          className={`group flex gap-3 px-4 py-3 border-b border-border/50 last:border-0 transition-colors ${
                            n.read ? "opacity-60" : "bg-secondary/30"
                          }`}
                        >
                          <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${config.bg}`}>
                            <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{n.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.description}</p>
                            <p className="text-xs text-muted-foreground/60 mt-1">{n.time}</p>
                          </div>
                          <button
                            onClick={() => dismiss(n.id)}
                            className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <UserMenu />
      </div>
    </header>
  )
}
