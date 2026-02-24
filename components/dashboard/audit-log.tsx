import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { FileText, CheckCircle2, AlertCircle, Download } from "lucide-react"

const auditEntries = [
  { id: "AUD-042", action: "コンプライアンスレポート生成", regulation: "EU AI Act", user: "system", timestamp: "2026-02-21 10:30", type: "report" as const },
  { id: "AUD-041", action: "リスク評価更新", regulation: "ISO 42001", user: "admin@eclipse.ai", timestamp: "2026-02-21 09:15", type: "update" as const },
  { id: "AUD-040", action: "非準拠アラート解決", regulation: "米国大統領令", user: "admin@eclipse.ai", timestamp: "2026-02-20 18:45", type: "resolve" as const },
  { id: "AUD-039", action: "新規要件追加", regulation: "NIST AI RMF", user: "system", timestamp: "2026-02-20 14:20", type: "update" as const },
  { id: "AUD-038", action: "フル監査レポートエクスポート", regulation: "SOC 2 Type II", user: "admin@eclipse.ai", timestamp: "2026-02-20 11:00", type: "report" as const },
  { id: "AUD-037", action: "バイアス評価完了", regulation: "AI事業者ガイドライン", user: "system", timestamp: "2026-02-19 22:30", type: "resolve" as const },
]

const typeConfig = {
  report: { icon: FileText, className: "text-primary" },
  update: { icon: AlertCircle, className: "text-warning" },
  resolve: { icon: CheckCircle2, className: "text-success" },
}

export function AuditLog() {
  return (
    <div className="rounded-lg glass-card border-border/30 p-5 animate-slide-up-fade" style={{ animationDelay: "0.1s" }}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{"監査ログ"}</h3>
          <p className="text-xs text-muted-foreground">{"最近のコンプライアンス活動"}</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-md border border-border/30 bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-all duration-200 hover:bg-secondary">
          <Download className="h-3 w-3" />
          {"エクスポート"}
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {auditEntries.map((entry, index) => {
          const Icon = typeConfig[entry.type].icon
          return (
            <div
              key={entry.id}
              className="flex items-center gap-3 rounded-md border border-border/20 bg-secondary/20 px-4 py-3 transition-all duration-200 hover:bg-secondary/40 animate-slide-up-fade"
              style={{ animationDelay: `${(index + 2) * 0.05}s` }}
            >
              <Icon className={cn("h-4 w-4 shrink-0", typeConfig[entry.type].className)} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground truncate">{entry.action}</span>
                  <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30 shrink-0">
                    {entry.regulation}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-muted-foreground">{entry.user}</span>
                  <span className="text-[10px] text-muted-foreground/50">|</span>
                  <span className="text-[10px] text-muted-foreground">{entry.timestamp}</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground shrink-0">{entry.id}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
