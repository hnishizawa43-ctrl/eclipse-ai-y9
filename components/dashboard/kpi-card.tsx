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
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3.5 md:gap-3 md:p-5 transition-colors hover:bg-card/80">
      <div className="flex items-center justify-between">
        <span className="text-xs md:text-sm font-medium text-muted-foreground truncate pr-2">{title}</span>
        <div className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-md bg-primary/10 shrink-0">
          <Icon className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
        </div>
      </div>
      <div className="flex flex-col gap-0.5 md:flex-row md:items-baseline md:gap-0">
        <span className="text-lg md:text-2xl font-bold text-foreground tabular-nums">{value}</span>
        {change && (
          <span
            className={cn(
              "text-[10px] md:text-xs font-medium md:ml-2",
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
        <p className="text-[10px] md:text-xs text-muted-foreground leading-snug">{description}</p>
      )}
    </div>
  )
}
