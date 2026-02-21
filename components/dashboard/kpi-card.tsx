"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { type LucideIcon } from "lucide-react"

interface KpiCardProps {
  title: string
  value: string
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: LucideIcon
  description?: string
  delay?: number
}

function parseNumericValue(val: string): { num: number; prefix: string; suffix: string } {
  const match = val.match(/^([^\d]*)([\d,.]+)(.*)$/)
  if (!match) return { num: 0, prefix: "", suffix: val }
  return {
    prefix: match[1],
    num: parseFloat(match[2].replace(/,/g, "")),
    suffix: match[3],
  }
}

function formatNumber(n: number, decimals: number): string {
  const fixed = n.toFixed(decimals)
  const [int, dec] = fixed.split(".")
  const formatted = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return dec ? `${formatted}.${dec}` : formatted
}

export function KpiCard({ title, value, change, changeType = "neutral", icon: Icon, description, delay = 0 }: KpiCardProps) {
  const [displayValue, setDisplayValue] = useState("--")
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!visible) return
    const { num, prefix, suffix } = parseNumericValue(value)
    const decimals = value.includes(".") ? (value.split(".")[1]?.replace(/[^\d]/g, "").length || 0) : 0
    const duration = 1200
    const start = performance.now()

    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * num
      setDisplayValue(prefix + formatNumber(current, decimals) + suffix)
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [visible, value])

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-border bg-card p-5 transition-all duration-700",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <div>
        <span className="text-2xl font-bold text-foreground tabular-nums">{displayValue}</span>
        {change && (
          <span
            className={cn(
              "ml-2 text-xs font-medium",
              changeType === "positive" && "text-success",
              changeType === "negative" && "text-destructive",
              changeType === "neutral" && "text-muted-foreground"
            )}
          >
            {change}
          </span>
        )}
      </div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
