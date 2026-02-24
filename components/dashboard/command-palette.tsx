"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  LayoutDashboard,
  Shield,
  Activity,
  FileCheck,
  AlertTriangle,
  Settings,
  User,
  Search,
  FileBarChart,
  Bell,
  Bot,
  Scan,
  Download,
} from "lucide-react"

const pages = [
  { label: "概要ダッシュボード", href: "/dashboard", icon: LayoutDashboard, shortcut: "G D" },
  { label: "脆弱性スキャン", href: "/dashboard/vulnerabilities", icon: Shield, shortcut: "G V" },
  { label: "モニタリング", href: "/dashboard/monitoring", icon: Activity, shortcut: "G M" },
  { label: "コンプライアンス", href: "/dashboard/compliance", icon: FileCheck, shortcut: "G C" },
  { label: "インシデント", href: "/dashboard/incidents", icon: AlertTriangle, shortcut: "G I" },
  { label: "通知", href: "/dashboard/notifications", icon: Bell, shortcut: "G N" },
  { label: "レポート", href: "/dashboard/reports", icon: FileBarChart, shortcut: "G R" },
  { label: "プロフィール", href: "/dashboard/profile", icon: User, shortcut: "G P" },
  { label: "設定", href: "/dashboard/settings", icon: Settings, shortcut: "G S" },
]

const actions = [
  { label: "新規スキャンを実行", icon: Scan, action: "scan" },
  { label: "AIアドバイザーを開く", icon: Bot, action: "ai-chat" },
  { label: "レポートをエクスポート", icon: Download, action: "export" },
  { label: "通知を検索", icon: Search, action: "search-notifications" },
]

interface CommandPaletteProps {
  onAction?: (action: string) => void
}

export function CommandPalette({ onAction }: CommandPaletteProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handlePageSelect = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  const handleActionSelect = (action: string) => {
    setOpen(false)
    onAction?.(action)
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="コマンドパレット"
      description="ページやアクションを検索..."
    >
      <CommandInput placeholder="ページやアクションを検索..." />
      <CommandList>
        <CommandEmpty>結果が見つかりません。</CommandEmpty>
        <CommandGroup heading="ページ">
          {pages.map((page) => (
            <CommandItem
              key={page.href}
              onSelect={() => handlePageSelect(page.href)}
              className="gap-3"
            >
              <page.icon className="h-4 w-4 text-muted-foreground" />
              <span>{page.label}</span>
              <CommandShortcut>{page.shortcut}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="アクション">
          {actions.map((action) => (
            <CommandItem
              key={action.action}
              onSelect={() => handleActionSelect(action.action)}
              className="gap-3"
            >
              <action.icon className="h-4 w-4 text-muted-foreground" />
              <span>{action.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
