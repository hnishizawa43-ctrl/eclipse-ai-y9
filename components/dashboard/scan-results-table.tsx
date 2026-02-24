"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react"

interface Vulnerability {
  id: string
  title: string
  model: string
  category: string
  severity: "critical" | "high" | "medium" | "low"
  status: "open" | "mitigated" | "investigating"
  discoveredAt: string
  cvss: number
}

const vulnerabilities: Vulnerability[] = [
  {
    id: "VLN-001",
    title: "システムプロンプト上書きによるインジェクション",
    model: "GPT-4 本番環境",
    category: "インジェクション",
    severity: "critical",
    status: "open",
    discoveredAt: "2026-02-21 09:15",
    cvss: 9.8,
  },
  {
    id: "VLN-002",
    title: "反復クエリによる学習データ抽出",
    model: "Claude-3 内部用",
    category: "データ漏洩",
    severity: "high",
    status: "investigating",
    discoveredAt: "2026-02-21 08:32",
    cvss: 8.2,
  },
  {
    id: "VLN-003",
    title: "モデル逆推論攻撃サーフェス検出",
    model: "レコメンド v3",
    category: "モデルセキュリティ",
    severity: "high",
    status: "mitigated",
    discoveredAt: "2026-02-20 22:10",
    cvss: 7.5,
  },
  {
    id: "VLN-004",
    title: "画像分類器における敵対的入力バイパス",
    model: "Vision Model v2",
    category: "敵対的攻撃",
    severity: "medium",
    status: "open",
    discoveredAt: "2026-02-20 16:45",
    cvss: 6.1,
  },
  {
    id: "VLN-005",
    title: "出力トークンにおけるPII露出",
    model: "カスタマーサポートBot",
    category: "プライバシー",
    severity: "critical",
    status: "investigating",
    discoveredAt: "2026-02-20 14:20",
    cvss: 9.1,
  },
  {
    id: "VLN-006",
    title: "ハルシネーション率が閾値を超過",
    model: "法務文書AI",
    category: "信頼性",
    severity: "medium",
    status: "open",
    discoveredAt: "2026-02-20 11:05",
    cvss: 5.4,
  },
  {
    id: "VLN-007",
    title: "意思決定出力におけるバイアス検出",
    model: "採用評価AI",
    category: "公平性",
    severity: "high",
    status: "investigating",
    discoveredAt: "2026-02-19 18:30",
    cvss: 7.8,
  },
  {
    id: "VLN-008",
    title: "エンコーディング経由のジェイルブレイク",
    model: "GPT-4 本番環境",
    category: "インジェクション",
    severity: "low",
    status: "mitigated",
    discoveredAt: "2026-02-19 09:00",
    cvss: 3.2,
  },
]

const severityLabels = { critical: "重大", high: "高", medium: "中", low: "低" }
const statusLabels = { open: "未対応", investigating: "調査中", mitigated: "対処済み" }
const filterLabels = { all: "すべて", critical: "重大", high: "高", medium: "中", low: "低" }

const severityConfig = {
  critical: { className: "bg-destructive/15 text-destructive border-destructive/30", barColor: "bg-destructive" },
  high: { className: "bg-chart-4/15 text-chart-4 border-chart-4/30", barColor: "bg-chart-4" },
  medium: { className: "bg-warning/15 text-warning border-warning/30", barColor: "bg-warning" },
  low: { className: "bg-primary/15 text-primary border-primary/30", barColor: "bg-primary" },
}

const statusConfig = {
  open: { className: "bg-destructive/15 text-destructive border-destructive/30" },
  investigating: { className: "bg-warning/15 text-warning border-warning/30" },
  mitigated: { className: "bg-success/15 text-success border-success/30" },
}

function CvssBar({ value }: { value: number }) {
  const percentage = (value / 10) * 100
  const color =
    value >= 9 ? "bg-destructive" : value >= 7 ? "bg-chart-4" : value >= 4 ? "bg-warning" : "bg-success"
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-secondary overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${percentage}%` }} />
      </div>
      <span className={cn(
        "text-xs font-mono font-bold tabular-nums",
        value >= 9 ? "text-destructive" : value >= 7 ? "text-chart-4" : value >= 4 ? "text-warning" : "text-success"
      )}>
        {value.toFixed(1)}
      </span>
    </div>
  )
}

function VulnCard({ vuln }: { vuln: Vulnerability }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className={cn(
        "rounded-lg border bg-secondary/20 transition-colors hover:bg-secondary/40",
        vuln.severity === "critical" ? "border-destructive/30" :
        vuln.severity === "high" ? "border-chart-4/20" : "border-border"
      )}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-start gap-3 p-3.5 text-left"
      >
        <div className={cn(
          "mt-0.5 h-2 w-2 shrink-0 rounded-full",
          severityConfig[vuln.severity].barColor
        )} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-primary">{vuln.id}</span>
            <Badge variant="outline" className={cn("text-[10px]", severityConfig[vuln.severity].className)}>
              {severityLabels[vuln.severity]}
            </Badge>
            <Badge variant="outline" className={cn("text-[10px]", statusConfig[vuln.status].className)}>
              {statusLabels[vuln.status]}
            </Badge>
          </div>
          <p className="text-sm font-medium text-foreground leading-snug">{vuln.title}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[11px] text-muted-foreground">{vuln.model}</span>
            <span className="text-muted-foreground/40">{"/"}</span>
            <span className="text-[11px] text-muted-foreground">{vuln.category}</span>
          </div>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-1.5">
          <CvssBar value={vuln.cvss} />
          {expanded ? (
            <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </div>
      </button>
      {expanded && (
        <div className="border-t border-border/50 px-3.5 py-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-muted-foreground">検出日時</span>
              <p className="text-foreground font-mono mt-0.5">{vuln.discoveredAt}</p>
            </div>
            <div>
              <span className="text-muted-foreground">対象モデル</span>
              <p className="text-foreground mt-0.5">{vuln.model}</p>
            </div>
            <div>
              <span className="text-muted-foreground">カテゴリ</span>
              <p className="text-foreground mt-0.5">{vuln.category}</p>
            </div>
            <div>
              <span className="text-muted-foreground">CVSS スコア</span>
              <p className={cn(
                "font-mono font-bold mt-0.5",
                vuln.cvss >= 9 ? "text-destructive" : vuln.cvss >= 7 ? "text-chart-4" : vuln.cvss >= 4 ? "text-warning" : "text-success"
              )}>
                {vuln.cvss.toFixed(1)} / 10.0
              </p>
            </div>
          </div>
          <button className="mt-3 flex items-center gap-1.5 text-xs text-primary hover:underline">
            <ExternalLink className="h-3 w-3" />
            詳細レポートを表示
          </button>
        </div>
      )}
    </div>
  )
}

function DesktopTable({ filtered }: { filtered: Vulnerability[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-secondary/30">
            <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">ID</th>
            <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">脆弱性</th>
            <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">モデル</th>
            <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">深刻度</th>
            <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">CVSS</th>
            <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">ステータス</th>
            <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">検出日</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((vuln) => (
            <tr
              key={vuln.id}
              className={cn(
                "border-b border-border/50 transition-colors cursor-default",
                vuln.severity === "critical"
                  ? "hover:bg-destructive/5"
                  : "hover:bg-secondary/40"
              )}
            >
              <td className="px-4 py-3 text-xs font-mono text-primary whitespace-nowrap">{vuln.id}</td>
              <td className="px-4 py-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">{vuln.title}</span>
                  <span className="text-[11px] text-muted-foreground">{vuln.category}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{vuln.model}</td>
              <td className="px-4 py-3">
                <Badge variant="outline" className={cn("text-[10px]", severityConfig[vuln.severity].className)}>
                  {severityLabels[vuln.severity]}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <CvssBar value={vuln.cvss} />
              </td>
              <td className="px-4 py-3">
                <Badge variant="outline" className={cn("text-[10px]", statusConfig[vuln.status].className)}>
                  {statusLabels[vuln.status]}
                </Badge>
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap font-mono">{vuln.discoveredAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ScanResultsTable() {
  const [filter, setFilter] = useState<"all" | "critical" | "high" | "medium" | "low">("all")

  const filtered = filter === "all" ? vulnerabilities : vulnerabilities.filter(v => v.severity === filter)

  const counts = {
    all: vulnerabilities.length,
    critical: vulnerabilities.filter(v => v.severity === "critical").length,
    high: vulnerabilities.filter(v => v.severity === "high").length,
    medium: vulnerabilities.filter(v => v.severity === "medium").length,
    low: vulnerabilities.filter(v => v.severity === "low").length,
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-3.5">
        <div>
          <h3 className="text-sm font-semibold text-foreground">スキャン結果</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{filtered.length}件表示 / {vulnerabilities.length}件中</p>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 sm:rounded-lg sm:border sm:border-border sm:bg-secondary/50 sm:p-1">
          {(["all", "critical", "high", "medium", "low"] as const).map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-xs font-medium transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5",
                filter === level
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {filterLabels[level]}
              <span className={cn(
                "text-[10px] rounded-full min-w-[18px] px-1 py-0.5 tabular-nums leading-none text-center",
                filter === level
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted/80 text-muted-foreground"
              )}>
                {counts[level]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile: Card list */}
      <div className="flex flex-col gap-2.5 p-3 md:hidden">
        {filtered.map((vuln) => (
          <VulnCard key={vuln.id} vuln={vuln} />
        ))}
        {filtered.length === 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            該当する脆弱性はありません
          </div>
        )}
      </div>

      {/* Desktop: Table */}
      <div className="hidden md:block">
        <DesktopTable filtered={filtered} />
        {filtered.length === 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            該当する脆弱性はありません
          </div>
        )}
      </div>
    </div>
  )
}
