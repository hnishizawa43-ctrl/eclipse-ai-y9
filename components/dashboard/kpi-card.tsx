"use client"

import { cn } from "@/lib/utils"
import { type LucideIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

function useCountUp(target: number, duration = 1200) {
  const [current, setCurrent] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const start = performance.now()
    const from = 0

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(from + (target - from) * eased))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])

  return current
}

function extractNumber(value: string): { prefix: string; num: number; suffix: string } | null {
  const match = value.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/)
  if (!match) return null
  return {
    prefix: match[1],
    num: parseFloat(match[2].replace(/,/g, "")),
    suffix: match[3],
  }
}

interface KpiCardProps {
  title: string
  value: string
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: LucideIcon
  description?: string
}

export function KpiCard({ title, value, change, changeType = "neutral", icon: Icon, description }: KpiCardProps) {
  const parsed = extractNumber(value)
  const animatedNum = useCountUp(parsed?.num ?? 0)

  const displayValue = parsed
    ? `${parsed.prefix}${parsed.num % 1 !== 0 ? animatedNum.toFixed(1) : animatedNum.toLocaleString()}${parsed.suffix}`
    : value

  return (
    <div className="group flex flex-col gap-3 rounded-lg border border-border bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_15px_-3px] hover:shadow-primary/10">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 transition-colors group-hover:bg-primary/20">
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
