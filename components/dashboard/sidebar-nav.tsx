"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Shield,
  Activity,
  FileCheck,
  AlertTriangle,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"

const navItems = [
  { label: "概要", href: "/dashboard", icon: LayoutDashboard },
  { label: "脆弱性スキャン", href: "/dashboard/vulnerabilities", icon: Shield },
  { label: "モニタリング", href: "/dashboard/monitoring", icon: Activity },
  { label: "コンプライアンス", href: "/dashboard/compliance", icon: FileCheck },
  { label: "インシデント", href: "/dashboard/incidents", icon: AlertTriangle },
]

export function SidebarNav() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "flex flex-col glass-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border/40">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary transition-shadow duration-300 group-hover:shadow-[0_0_20px_var(--glow-primary)]">
              <Shield className="h-4 w-4 text-primary-foreground" />
              <div className="absolute inset-0 rounded-lg animate-glow-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ boxShadow: "0 0 15px var(--glow-primary)" }} />
            </div>
            <span className="text-lg font-bold text-sidebar-foreground tracking-tight">
              Eclipse
            </span>
          </Link>
        )}
        {collapsed && (
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary mx-auto">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-all duration-200",
            collapsed && "hidden"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-2">
        <ul className="flex flex-col gap-1">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <li
                key={item.href}
                className="animate-slide-up-fade"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground hover:translate-x-0.5"
                  )}
                >
                  {/* Active glow left border */}
                  {isActive && (
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-primary"
                      style={{ boxShadow: "0 0 8px var(--glow-primary)" }}
                    />
                  )}
                  <item.icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors duration-200",
                      isActive && "text-sidebar-primary drop-shadow-[0_0_4px_var(--glow-primary)]"
                    )}
                  />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Settings */}
      <div className="border-t border-sidebar-border/40 p-2">
        <Link
          href="/dashboard/settings"
          className={cn(
            "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
            pathname === "/dashboard/settings"
              ? "bg-sidebar-accent text-sidebar-primary"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground hover:translate-x-0.5"
          )}
        >
          {pathname === "/dashboard/settings" && (
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-primary"
              style={{ boxShadow: "0 0 8px var(--glow-primary)" }}
            />
          )}
          <Settings
            className={cn(
              "h-4 w-4 shrink-0 transition-colors duration-200",
              pathname === "/dashboard/settings" && "text-sidebar-primary drop-shadow-[0_0_4px_var(--glow-primary)]"
            )}
          />
          {!collapsed && <span>{"設定"}</span>}
        </Link>
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="flex w-full items-center justify-center rounded-md px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-all duration-200 mt-1"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </aside>
  )
}
