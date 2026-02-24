import { cn } from "@/lib/utils"

const models = [
  { name: "GPT-4 本番環境", status: "protected" as const, threats: 3, lastScan: "5分前" },
  { name: "Claude-3 内部用", status: "protected" as const, threats: 0, lastScan: "12分前" },
  { name: "レコメンド v3", status: "warning" as const, threats: 7, lastScan: "1時間前" },
  { name: "カスタマーサポートBot", status: "protected" as const, threats: 1, lastScan: "20分前" },
  { name: "採用評価AI", status: "critical" as const, threats: 12, lastScan: "3時間前" },
]

const statusConfig = {
  protected: { label: "保護中", dotClass: "bg-success", glowVar: "var(--glow-success)" },
  warning: { label: "警告", dotClass: "bg-warning", glowVar: "var(--glow-warning)" },
  critical: { label: "危険", dotClass: "bg-destructive", glowVar: "var(--glow-destructive)" },
}

export function ModelStatus() {
  return (
    <div className="rounded-lg glass-card border-border/30 p-5 animate-slide-up-fade" style={{ animationDelay: "0.15s" }}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{"AIモデル一覧"}</h3>
        <span className="text-xs text-muted-foreground">{models.length}{"モデル登録済み"}</span>
      </div>
      <div className="flex flex-col">
        <div className="grid grid-cols-4 gap-4 border-b border-border/30 pb-2 mb-2">
          <span className="text-xs font-medium text-muted-foreground">{"モデル"}</span>
          <span className="text-xs font-medium text-muted-foreground">{"ステータス"}</span>
          <span className="text-xs font-medium text-muted-foreground text-right">{"脅威数"}</span>
          <span className="text-xs font-medium text-muted-foreground text-right">{"最終スキャン"}</span>
        </div>
        {models.map((model, index) => {
          const config = statusConfig[model.status]
          return (
            <div
              key={model.name}
              className="group grid grid-cols-4 gap-4 py-2.5 border-b border-border/20 last:border-0 rounded-md px-1 -mx-1 transition-all duration-200 hover:bg-secondary/30 animate-slide-up-fade"
              style={{ animationDelay: `${(index + 3) * 0.06}s` }}
            >
              <span className="text-sm text-foreground truncate">{model.name}</span>
              <div className="flex items-center gap-1.5">
                {/* Pulse ring dot for status */}
                <div className="relative h-1.5 w-1.5">
                  <div className={cn("absolute inset-0 rounded-full", config.dotClass)} />
                  {model.status === "critical" && (
                    <div className={cn("absolute inset-0 rounded-full animate-pulse-ring", config.dotClass)} />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{config.label}</span>
              </div>
              <span className={cn(
                "text-sm font-mono text-right transition-colors duration-300",
                model.threats > 5 ? "text-destructive" : model.threats > 0 ? "text-warning" : "text-success"
              )}>
                {model.threats}
              </span>
              <span className="text-xs text-muted-foreground text-right">{model.lastScan}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
