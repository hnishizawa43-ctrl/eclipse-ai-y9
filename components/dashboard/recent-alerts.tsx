import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const alerts = [
  {
    id: 1,
    title: "Prompt Injection Detected",
    model: "GPT-4 Production",
    severity: "critical" as const,
    time: "2 min ago",
  },
  {
    id: 2,
    title: "Model Drift Anomaly",
    model: "Recommendation Engine v3",
    severity: "warning" as const,
    time: "15 min ago",
  },
  {
    id: 3,
    title: "PII Leakage Attempt",
    model: "Customer Support Bot",
    severity: "critical" as const,
    time: "32 min ago",
  },
  {
    id: 4,
    title: "Bias Score Threshold Exceeded",
    model: "Hiring Assessment AI",
    severity: "warning" as const,
    time: "1 hour ago",
  },
  {
    id: 5,
    title: "Unauthorized API Access",
    model: "Internal LLM Gateway",
    severity: "info" as const,
    time: "2 hours ago",
  },
]

const severityConfig = {
  critical: { label: "Critical", className: "bg-destructive/15 text-destructive border-destructive/30" },
  warning: { label: "Warning", className: "bg-warning/15 text-warning border-warning/30" },
  info: { label: "Info", className: "bg-primary/15 text-primary border-primary/30" },
}

export function RecentAlerts() {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Recent Alerts</h3>
        <span className="text-xs text-primary cursor-pointer hover:underline">View All</span>
      </div>
      <div className="flex flex-col gap-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-center justify-between rounded-md border border-border bg-secondary/50 px-3 py-2.5"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground">{alert.title}</span>
              <span className="text-xs text-muted-foreground">{alert.model}</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className={cn("text-[10px] font-medium", severityConfig[alert.severity].className)}
              >
                {severityConfig[alert.severity].label}
              </Badge>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{alert.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
