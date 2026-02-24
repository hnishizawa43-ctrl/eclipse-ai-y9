"use client"

import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Shield } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 animate-slide-up-fade">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Shield className="h-6 w-6 text-primary-foreground" />
            <div className="absolute inset-0 rounded-xl bg-primary/40 animate-glow-pulse" />
          </div>
          <p className="text-sm text-muted-foreground">{"読み込み中..."}</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarNav />
      <main className="relative flex-1 overflow-auto bg-background">
        {/* Subtle grid pattern overlay */}
        <div className="pointer-events-none fixed inset-0 grid-pattern opacity-20" />
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  )
}
