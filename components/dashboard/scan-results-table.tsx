"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Download } from "lucide-react"
import { toast } from "sonner"
import type { Vulnerability } from "@/lib/firestore"

const severityLabels = { critical: "重大", high: "高", medium: "中", low: "低" }
const statusLabels = { open: "未対応", investigating: "調査中", mitigated: "対処済み" }
const filterLabels = { all: "すべて", critical: "重大", high: "高", medium: "中", low: "低" }

const severityConfig = {
  critical: { className: "bg-destructive/15 text-destructive border-destructive/30" },
  high: { className: "bg-chart-4/15 text-chart-4 border-chart-4/30" },
  medium: { className: "bg-warning/15 text-warning border-warning/30" },
  low: { className: "bg-primary/15 text-primary border-primary/30" },
}

const statusConfig = {
  open: { className: "bg-destructive/15 text-destructive border-destructive/30" },
  investigating: { className: "bg-warning/15 text-warning border-warning/30" },
  mitigated: { className: "bg-success/15 text-success border-success/30" },
}

function exportVulnCSV(vulns: Vulnerability[]) {
  const header = "ID,タイトル,モデル,カテゴリ,深刻度,CVSS,ステータス,検出日時"
  const rows = vulns.map((v) =>
    [v.id, `"${v.title}"`, v.model, v.category, severityLabels[v.severity], v.cvss.toFixed(1), statusLabels[v.status], v.discoveredAt].join(",")
  )
  const csv = [header, ...rows].join("\n")
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `eclipse_vulnerabilities_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
  toast.success("脆弱性レポートをCSVでエクスポートしました")
}

interface ScanResultsTableProps {
  vulnerabilities: Vulnerability[]
}

export function ScanResultsTable({ vulnerabilities }: ScanResultsTableProps) {
  const [filter, setFilter] = useState<"all" | "critical" | "high" | "medium" | "low">("all")

  const filtered = filter === "all" ? vulnerabilities : vulnerabilities.filter(v => v.severity === filter)

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">スキャン結果</h3>
          <p className="text-xs text-muted-foreground">{vulnerabilities.length}件の脆弱性を検出</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportVulnCSV(filtered)}
            className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mr-2"
          >
            <Download className="h-3 w-3" />
            CSV
          </button>
          {(["all", "critical", "high", "medium", "low"] as const).map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                filter === level
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {filterLabels[level]}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">ID</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">脆弱性</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">モデル</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">カテゴリ</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">深刻度</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">CVSS</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">ステータス</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((vuln) => (
              <tr
                key={vuln.id + vuln.title}
                className={cn(
                  "border-b border-border/50 transition-colors",
                  vuln.isNew
                    ? "bg-primary/5 animate-in fade-in slide-in-from-top-2 duration-500"
                    : "hover:bg-secondary/30"
                )}
              >
                <td className="px-5 py-3 text-xs font-mono text-primary">
                  <span className="flex items-center gap-1.5">
                    {vuln.isNew && <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary" />}
                    {vuln.id}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className="text-sm text-foreground">{vuln.title}</span>
                </td>
                <td className="px-5 py-3 text-sm text-muted-foreground">{vuln.model}</td>
                <td className="px-5 py-3">
                  <span className="text-xs text-muted-foreground">{vuln.category}</span>
                </td>
                <td className="px-5 py-3">
                  <Badge variant="outline" className={cn("text-[10px]", severityConfig[vuln.severity].className)}>
                    {severityLabels[vuln.severity]}
                  </Badge>
                </td>
                <td className="px-5 py-3">
                  <span className={cn(
                    "text-sm font-mono font-bold",
                    vuln.cvss >= 9 ? "text-destructive" : vuln.cvss >= 7 ? "text-chart-4" : vuln.cvss >= 4 ? "text-warning" : "text-success"
                  )}>
                    {vuln.cvss.toFixed(1)}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <Badge variant="outline" className={cn("text-[10px]", statusConfig[vuln.status].className)}>
                    {statusLabels[vuln.status]}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
