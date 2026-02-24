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
  Menu,
} from "lucide-react"
import { useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useMobileSidebar } from "@/app/dashboard/layout"

const navItems = [
  {
    label: "概要",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "脆弱性スキャン",
    href: "/dashboard/vulnerabilities",
    icon: Shield,
  },
  {
    label: "モニタリング",
    href: "/dashboard/monitoring",
    icon: Activity,
  },
  {
    label: "コンプライアンス",
    href: "/dashboard/compliance",
    icon: FileCheck,
  },
  {
    label: "インシデント",
    href: "/dashboard/incidents",
    icon: AlertTriangle,
  },
]

function SidebarContent({
  collapsed,
  setCollapsed,
  onLinkClick,
}: {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  onLinkClick?: () => void
}) {
  const pathname = usePathname()

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2" onClick={onLinkClick}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-sidebar-foreground tracking-tight">
              Eclipse
            </span>
          </Link>
        )}
        {collapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary mx-auto">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors",
            collapsed && "hidden"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 p-2">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onLinkClick}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className={cn("h-4 w-4 shrink-0", isActive && "text-sidebar-primary")} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-2">
        <Link
          href="/dashboard/settings"
          onClick={onLinkClick}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/dashboard/settings"
              ? "bg-sidebar-accent text-sidebar-primary"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          )}
        >
          <Settings className={cn("h-4 w-4 shrink-0", pathname === "/dashboard/settings" && "text-sidebar-primary")} />
          {!collapsed && <span>{"設定"}</span>}
        </Link>
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="flex w-full items-center justify-center rounded-md px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors mt-1"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </>
  )
}

export function MobileMenuTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors md:hidden"
      aria-label="メニューを開く"
    >
      <Menu className="h-5 w-5" />
    </button>
  )
}

export function SidebarNav() {
  const [collapsed, setCollapsed] = useState(false)
  const isMobile = useIsMobile()
  const { open: mobileOpen, setOpen: setMobileOpen } = useMobileSidebar()

  if (isMobile) {
    return (
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar border-sidebar-border">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <div className="flex h-full flex-col">
            <SidebarContent
              collapsed={false}
              setCollapsed={() => {}}
              onLinkClick={() => setMobileOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <SidebarContent collapsed={collapsed} setCollapsed={setCollapsed} />
    </aside>
  )
}
