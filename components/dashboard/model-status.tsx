import { cn } from "@/lib/utils"

const models = [
  { name: "GPT-4 Production", status: "protected" as const, threats: 3, lastScan: "5 min ago" },
  { name: "Claude-3 Internal", status: "protected" as const, threats: 0, lastScan: "12 min ago" },
  { name: "Recommendation v3", status: "warning" as const, threats: 7, lastScan: "1 hour ago" },
  { name: "Customer Support Bot", status: "protected" as const, threats: 1, lastScan: "20 min ago" },
  { name: "Hiring Assessment AI", status: "critical" as const, threats: 12, lastScan: "3 hours ago" },
]

const statusConfig = {
  protected: { label: "Protected", dotClass: "bg-success" },
  warning: { label: "Warning", dotClass: "bg-warning" },
  critical: { label: "At Risk", dotClass: "bg-destructive" },
}

export function ModelStatus() {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">AI Models</h3>
        <span className="text-xs text-muted-foreground">{models.length} models registered</span>
      </div>
      <div className="flex flex-col">
        <div className="grid grid-cols-4 gap-4 border-b border-border pb-2 mb-2">
          <span className="text-xs font-medium text-muted-foreground">Model</span>
          <span className="text-xs font-medium text-muted-foreground">Status</span>
          <span className="text-xs font-medium text-muted-foreground text-right">Threats</span>
          <span className="text-xs font-medium text-muted-foreground text-right">Last Scan</span>
        </div>
        {models.map((model) => (
          <div
            key={model.name}
            className="grid grid-cols-4 gap-4 py-2.5 border-b border-border/50 last:border-0"
          >
            <span className="text-sm text-foreground truncate">{model.name}</span>
            <div className="flex items-center gap-1.5">
              <div className={cn("h-1.5 w-1.5 rounded-full", statusConfig[model.status].dotClass)} />
              <span className="text-xs text-muted-foreground">{statusConfig[model.status].label}</span>
            </div>
            <span className={cn(
              "text-sm font-mono text-right",
              model.threats > 5 ? "text-destructive" : model.threats > 0 ? "text-warning" : "text-success"
            )}>
              {model.threats}
            </span>
            <span className="text-xs text-muted-foreground text-right">{model.lastScan}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
