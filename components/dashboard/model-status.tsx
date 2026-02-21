import { cn } from "@/lib/utils"

const models = [
  { name: "GPT-4 本番環境", status: "protected" as const, threats: 3, lastScan: "5分前" },
  { name: "Claude-3 内部用", status: "protected" as const, threats: 0, lastScan: "12分前" },
  { name: "レコメンド v3", status: "warning" as const, threats: 7, lastScan: "1時間前" },
  { name: "カスタマーサポートBot", status: "protected" as const, threats: 1, lastScan: "20分前" },
  { name: "採用評価AI", status: "critical" as const, threats: 12, lastScan: "3時間前" },
]

const statusConfig = {
  protected: { label: "保護中", dotClass: "bg-success" },
  warning: { label: "警告", dotClass: "bg-warning" },
  critical: { label: "危険", dotClass: "bg-destructive" },
}

export function ModelStatus() {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">AIモデル一覧</h3>
        <span className="text-xs text-muted-foreground">{models.length}モデル登録済み</span>
      </div>
      <div className="flex flex-col">
        <div className="grid grid-cols-4 gap-4 border-b border-border pb-2 mb-2">
          <span className="text-xs font-medium text-muted-foreground">モデル</span>
          <span className="text-xs font-medium text-muted-foreground">ステータス</span>
          <span className="text-xs font-medium text-muted-foreground text-right">脅威数</span>
          <span className="text-xs font-medium text-muted-foreground text-right">最終スキャン</span>
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
