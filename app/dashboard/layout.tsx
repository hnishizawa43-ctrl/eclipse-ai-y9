"use client"

import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState, createContext, useContext } from "react"
import { Shield } from "lucide-react"

interface MobileSidebarContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const MobileSidebarContext = createContext<MobileSidebarContextType>({
  open: false,
  setOpen: () => {},
})

export function useMobileSidebar() {
  return useContext(MobileSidebarContext)
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <MobileSidebarContext.Provider value={{ open: mobileOpen, setOpen: setMobileOpen }}>
      <div className="flex h-screen overflow-hidden">
        <SidebarNav />
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
      </div>
    </MobileSidebarContext.Provider>
  )
}
