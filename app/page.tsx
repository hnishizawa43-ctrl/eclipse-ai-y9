"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Shield } from "lucide-react"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/login")
  }, [router])

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
