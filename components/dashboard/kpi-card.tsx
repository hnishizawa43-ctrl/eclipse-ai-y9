"use client"

import { cn } from "@/lib/utils"
import { type LucideIcon } from "lucide-react"
import { useCountUp } from "@/hooks/use-count-up"

interface KpiCardProps {
  title: string
  value: string
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: LucideIcon
  description?: string
  index?: number
}

function parseNumericValue(value: string): { num: number; prefix: string; suffix: string; decimals: number } {
  const match = value.match(/^([^0-9]*)([0-9,]+\.?[0-9]*)(.*)$/)
  if (!match) return { num: 0, prefix: "", suffix: value, decimals: 0 }
  const prefix = match[1]
  const numStr = match[2].replace(/,/g, "")
  const suffix = match[3]
  const num = parseFloat(numStr)
  const decimalPart = numStr.split(".")[1]
  const decimals = decimalPart ? decimalPart.length : 0
  return { num, prefix, suffix, decimals }
}

function formatWithCommas(num: string): string {
  const parts = num.split(".")
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return parts.join(".")
}

function AnimatedValue({ value }: { value: string }) {
  const { num, prefix, suffix, decimals } = parseNumericValue(value)
  const animated = useCountUp(num, 1400, decimals)
  const formatted = formatWithCommas(animated)
  return <>{prefix}{formatted}{suffix}</>
}

export function KpiCard({ title, value, change, changeType = "neutral", icon: Icon, description, index = 0 }: KpiCardProps) {
  return (
    <div
      className="group relative flex flex-col gap-3 rounded-lg glass-card border-border/30 p-5 hover-lift animate-slide-up-fade overflow-hidden"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Shimmer on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer" />

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className="relative flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 transition-all duration-300 group-hover:bg-primary/15">
          <Icon className="h-4 w-4 text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_6px_var(--glow-primary)]" />
          <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-glow-pulse" style={{ boxShadow: "0 0 12px var(--glow-primary)" }} />
        </div>
      </div>
      <div>
        <span className="text-2xl font-bold text-foreground font-mono">
          <AnimatedValue value={value} />
        </span>
        {change && (
          <span
            className={cn(
              "ml-2 text-xs font-medium transition-colors duration-300",
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
