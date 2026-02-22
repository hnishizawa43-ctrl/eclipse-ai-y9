"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { FileText, CheckCircle2, AlertCircle, Download, Shield } from "lucide-react"
import { toast } from "sonner"
import type { AuditEntry } from "@/lib/firestore"

const typeConfig = {
  security: { icon: Shield, className: "text-destructive" },
  compliance: { icon: FileText, className: "text-primary" },
  model: { icon: AlertCircle, className: "text-warning" },
  system: { icon: CheckCircle2, className: "text-success" },
}

const typeLabels = {
  security: "セキュリティ",
  compliance: "コンプライアンス",
  model: "モデル",
  system: "システム",
}

function exportAuditCSV(entries: AuditEntry[]) {
  const header = "アクション,対象,実行者,日時,カテゴリ"
  const rows = entries.map((e) =>
    [`"${e.action}"`, `"${e.target}"`, e.actor, e.timestamp, typeLabels[e.type]].join(",")
  )
  const csv = [header, ...rows].join("\n")
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `eclipse_audit_log_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
  toast.success("監査ログをCSVでエクスポートしました")
}

interface AuditLogProps {
  entries: AuditEntry[]
  loading?: boolean
}

export function AuditLog({ entries, loading }: AuditLogProps) {
  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">監査ログ</h3>
        <div className="flex items-center justify-center h-32">
          <p className="text-sm text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">監査ログ</h3>
          <p className="text-xs text-muted-foreground">{entries.length}件のコンプライアンス活動</p>
        </div>
        <button
          onClick={() => exportAuditCSV(entries)}
          className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Download className="h-3 w-3" />
          エクスポート
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {entries.map((entry, idx) => {
          const config = typeConfig[entry.type]
          const Icon = config.icon
          return (
            <div
              key={entry.id ?? idx}
              className="flex items-center gap-3 rounded-md border border-border/50 bg-secondary/30 px-4 py-3"
            >
              <Icon className={cn("h-4 w-4 shrink-0", config.className)} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground truncate">{entry.action}</span>
                  <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30 shrink-0">
                    {typeLabels[entry.type]}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-muted-foreground">{entry.target}</span>
                  <span className="text-[10px] text-muted-foreground/50">|</span>
                  <span className="text-[10px] text-muted-foreground">{entry.actor}</span>
                  <span className="text-[10px] text-muted-foreground/50">|</span>
                  <span className="text-[10px] text-muted-foreground">{entry.timestamp}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
