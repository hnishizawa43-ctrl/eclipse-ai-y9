"use client"

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react"
import { toast } from "sonner"

export type NotificationLevel = "critical" | "warning" | "info" | "success"

export interface Notification {
  id: string
  title: string
  description: string
  level: NotificationLevel
  category: "threat" | "compliance" | "system" | "model"
  time: string
  unread: boolean
  timestamp: number
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (n: Omit<Notification, "id" | "time" | "unread" | "timestamp">) => void
  markRead: (id: string) => void
  markAllRead: () => void
  clearAll: () => void
  simulationEnabled: boolean
  setSimulationEnabled: (enabled: boolean) => void
}

const NotificationContext = createContext<NotificationContextType | null>(null)

const initialNotifications: Notification[] = [
  {
    id: "init-1",
    title: "高リスク脆弱性を検出",
    description: "モデル GPT-4o にプロンプトインジェクションの脆弱性が見つかりました。",
    level: "critical",
    category: "threat",
    time: "5分前",
    unread: true,
    timestamp: Date.now() - 5 * 60 * 1000,
  },
  {
    id: "init-2",
    title: "スキャン完了",
    description: "定期セキュリティスキャンが正常に完了しました。",
    level: "success",
    category: "system",
    time: "1時間前",
    unread: true,
    timestamp: Date.now() - 60 * 60 * 1000,
  },
  {
    id: "init-3",
    title: "コンプライアンス更新",
    description: "EU AI Act の新しいガイドラインが公開されました。",
    level: "info",
    category: "compliance",
    time: "3時間前",
    unread: true,
    timestamp: Date.now() - 3 * 60 * 60 * 1000,
  },
]

const simulatedEvents = [
  { title: "異常トラフィック検出", description: "GPT-4 エンドポイントへの異常なリクエストパターンを検知しました。", level: "warning" as const, category: "threat" as const },
  { title: "モデルドリフト警告", description: "レコメンド v3 の出力分布が基準値から逸脱しています。", level: "warning" as const, category: "model" as const },
  { title: "PII検出アラート", description: "カスタマーサポートBotの出力から個人情報パターンを検出しました。", level: "critical" as const, category: "threat" as const },
  { title: "コンプライアンスチェック完了", description: "ISO 42001 の定期チェックが正常に完了しました。", level: "success" as const, category: "compliance" as const },
  { title: "新規脆弱性レポート", description: "Vision Model v2 に敵対的入力に対する新しい脆弱性が報告されました。", level: "critical" as const, category: "threat" as const },
  { title: "API レート制限警告", description: "内部LLMゲートウェイのAPIレート制限に近づいています。", level: "warning" as const, category: "system" as const },
  { title: "バイアス監査結果", description: "採用評価AIの週次バイアス監査レポートが利用可能です。", level: "info" as const, category: "compliance" as const },
  { title: "セキュリティパッチ適用", description: "入力検証フィルターの最新パッチが適用されました。", level: "success" as const, category: "system" as const },
]

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return "たった今"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}分前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}時間前`
  return `${Math.floor(hours / 24)}日前`
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [simulationEnabled, setSimulationEnabled] = useState(true)
  const eventIndexRef = useRef(0)

  const addNotification = useCallback(
    (n: Omit<Notification, "id" | "time" | "unread" | "timestamp">) => {
      const now = Date.now()
      const newNotification: Notification = {
        ...n,
        id: `notif-${now}-${Math.random().toString(36).slice(2, 7)}`,
        time: "たった今",
        unread: true,
        timestamp: now,
      }

      setNotifications((prev) => [newNotification, ...prev].slice(0, 50))

      const toastFn = n.level === "critical" ? toast.error
        : n.level === "warning" ? toast.warning
        : n.level === "success" ? toast.success
        : toast.info
      toastFn(n.title, {
        description: n.description,
        duration: n.level === "critical" ? 8000 : 5000,
      })
    },
    []
  )

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    )
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  // Update relative times
  useEffect(() => {
    const timer = setInterval(() => {
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, time: formatRelativeTime(n.timestamp) }))
      )
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Simulation engine
  useEffect(() => {
    if (!simulationEnabled) return

    const interval = setInterval(
      () => {
        const event = simulatedEvents[eventIndexRef.current % simulatedEvents.length]
        eventIndexRef.current++
        addNotification(event)
      },
      15000 + Math.random() * 15000
    )

    return () => clearInterval(interval)
  }, [simulationEnabled, addNotification])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount: notifications.filter((n) => n.unread).length,
        addNotification,
        markRead,
        markAllRead,
        clearAll,
        simulationEnabled,
        setSimulationEnabled,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider")
  return ctx
}
