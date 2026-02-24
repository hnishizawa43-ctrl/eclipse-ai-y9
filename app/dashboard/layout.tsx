"use client"

import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { CommandPalette } from "@/components/dashboard/command-palette"
import { AiChat } from "@/components/dashboard/ai-chat"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useCallback, useState } from "react"
import { Shield } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [aiChatOpen, setAiChatOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  const handleCommandAction = useCallback(
    (action: string) => {
      switch (action) {
        case "ai-chat":
          setAiChatOpen(true)
          break
        case "scan":
          router.push("/dashboard/vulnerabilities")
          break
        case "export":
          router.push("/dashboard/reports")
          break
        case "search-notifications":
          router.push("/dashboard/notifications")
          break
      }
    },
    [router]
  )

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary animate-pulse">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarNav />
      <main className="flex-1 overflow-auto bg-background">
        {children}
      </main>
      <CommandPalette onAction={handleCommandAction} />
      <AiChat open={aiChatOpen} onOpenChange={setAiChatOpen} />
    </div>
  )
}
