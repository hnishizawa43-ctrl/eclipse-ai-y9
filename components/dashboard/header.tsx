"use client"

import { Bell, Search, User, Settings, LogOut, Shield, AlertTriangle, Info, Activity, Command } from "lucide-react"
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useNotifications, type NotificationLevel } from "@/contexts/notification-context"
import { useState } from "react"

const levelIcons: Record<NotificationLevel, typeof AlertTriangle> = {
  critical: AlertTriangle,
  warning: Activity,
  info: Info,
  success: Shield,
}

const levelIconColors: Record<NotificationLevel, string> = {
  critical: "text-destructive",
  warning: "text-warning",
  info: "text-primary",
  success: "text-success",
}

type CategoryFilter = "all" | "threat" | "compliance" | "system" | "model"
const categoryLabels: Record<CategoryFilter, string> = {
  all: "すべて",
  threat: "脅威",
  compliance: "準拠",
  system: "システム",
  model: "モデル",
}

export function DashboardHeader({ title, description }: { title: string; description?: string }) {
  const { user, logout } = useAuth()
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications()
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all")

  const displayName = user?.displayName || user?.email?.split("@")[0] || "User"
  const email = user?.email || ""
  const initials = displayName.slice(0, 2).toUpperCase()

  const filteredNotifications =
    categoryFilter === "all"
      ? notifications.slice(0, 10)
      : notifications.filter((n) => n.category === categoryFilter).slice(0, 10)

  const handleOpenCommandPalette = () => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))
  }

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {/* Command Palette Trigger */}
        <button
          onClick={handleOpenCommandPalette}
          className="hidden md:flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="text-xs">検索...</span>
          <kbd className="ml-4 flex items-center gap-0.5 rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </button>

        {/* Notification Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="relative flex h-9 w-9 items-center justify-center rounded-md border border-border bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-96 p-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">通知</h3>
              {unreadCount > 0 && (
                <button
                  className="text-xs text-primary hover:underline"
                  onClick={markAllRead}
                >
                  すべて既読にする
                </button>
              )}
            </div>
            <div className="px-3 pt-2 pb-1">
              <Tabs value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as CategoryFilter)}>
                <TabsList className="h-7 w-full">
                  {(Object.keys(categoryLabels) as CategoryFilter[]).map((key) => (
                    <TabsTrigger key={key} value={key} className="text-[10px] px-2 h-5">
                      {categoryLabels[key]}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Bell className="h-8 w-8 text-muted-foreground/30 mb-2" />
                  <p className="text-xs text-muted-foreground">通知はありません</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => {
                  const Icon = levelIcons[notification.level]
                  return (
                    <div
                      key={notification.id}
                      className="flex gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors cursor-pointer border-b border-border/50 last:border-b-0"
                      onClick={() => markRead(notification.id)}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                        <Icon className={`h-4 w-4 ${levelIconColors[notification.level]}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{notification.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.description}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                      {notification.unread && (
                        <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5 animate-pulse" />
                      )}
                    </div>
                  )
                })
              )}
            </div>
            <div className="border-t border-border px-4 py-2">
              <Link
                href="/dashboard/notifications"
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
