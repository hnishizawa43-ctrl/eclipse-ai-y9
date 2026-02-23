"use client"

import { Bell, Search, User, Settings, LogOut, Shield, AlertTriangle, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

const notifications = [
  {
    id: 1,
    icon: AlertTriangle,
    iconColor: "text-destructive",
    title: "高リスク脆弱性を検出",
    description: "モデル GPT-4o にプロンプトインジェクションの脆弱性が見つかりました。",
    time: "5分前",
    unread: true,
  },
  {
    id: 2,
    icon: Shield,
    iconColor: "text-success",
    title: "スキャン完了",
    description: "定期セキュリティスキャンが正常に完了しました。",
    time: "1時間前",
    unread: true,
  },
  {
    id: 3,
    icon: Info,
    iconColor: "text-primary",
    title: "コンプライアンス更新",
    description: "EU AI Act の新しいガイドラインが公開されました。",
    time: "3時間前",
    unread: true,
  },
]

export function DashboardHeader({ title, description }: { title: string; description?: string }) {
  const { user, logout } = useAuth()

  const displayName = user?.displayName || user?.email?.split("@")[0] || "User"
  const email = user?.email || ""
  const initials = displayName.slice(0, 2).toUpperCase()

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

        {/* Notification Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="relative flex h-9 w-9 items-center justify-center rounded-md border border-border bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground border-0">
                {notifications.length}
              </Badge>
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">通知</h3>
              <button className="text-xs text-primary hover:underline">すべて既読にする</button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors cursor-pointer border-b border-border last:border-b-0"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                    <notification.icon className={`h-4 w-4 ${notification.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{notification.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                  {notification.unread && (
                    <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                  )}
                </div>
              ))}
            </div>
            <div className="border-t border-border px-4 py-2">
              <Link
                href="/dashboard/incidents"
                className="text-xs text-primary hover:underline block text-center"
              >
                すべての通知を見る
              </Link>
            </div>
          </PopoverContent>
        </Popover>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold cursor-pointer hover:opacity-90 transition-opacity">
              {initials}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-foreground">{displayName}</p>
                <p className="text-xs text-muted-foreground">{email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="cursor-pointer">
                  <User className="h-4 w-4" />
                  プロフィール
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="cursor-pointer">
                  <Settings className="h-4 w-4" />
                  設定
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" variant="destructive" onClick={logout}>
              <LogOut className="h-4 w-4" />
              ログアウト
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
