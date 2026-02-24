import { cn } from "@/lib/utils"
import { type LucideIcon } from "lucide-react"

interface KpiCardProps {
  title: string
  value: string
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: LucideIcon
  description?: string
}

export function KpiCard({ title, value, change, changeType = "neutral", icon: Icon, description }: KpiCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3.5 sm:gap-3 sm:p-5 transition-colors hover:bg-card/80">
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate pr-2">{title}</span>
        <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md bg-primary/10 shrink-0">
          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
        </div>
      </div>
      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-0">
        <span className="text-lg sm:text-2xl font-bold text-foreground tabular-nums">{value}</span>
        {change && (
          <span
            className={cn(
              "text-[10px] sm:text-xs font-medium sm:ml-2",
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
        <p className="text-[10px] sm:text-xs text-muted-foreground leading-snug">{description}</p>
      )}
    </div>
  )
}
