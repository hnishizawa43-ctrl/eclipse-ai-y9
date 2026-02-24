"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import {
  AlertTriangle,
  Shield,
  Clock,
  ChevronDown,
  ChevronUp,
  User,
  Download,
} from "lucide-react"
import { exportToCSV, exportToJSON } from "@/lib/export-utils"

interface Incident {
  id: string
  title: string
  description: string
  severity: "critical" | "high" | "medium" | "low"
  status: "open" | "investigating" | "resolved" | "closed"
  model: string
  assignee: string
  createdAt: string
  updatedAt: string
  timeline: { time: string; action: string; actor: string }[]
}

const incidents: Incident[] = [
  {
    id: "INC-2026-047",
    title: "本番LLMに対する重大プロンプトインジェクション攻撃",
    description: "GPT-4本番エンドポイントを標的とした高度なプロンプトインジェクション攻撃が検出されました。攻撃はシステムプロンプトと内部指示の抽出を試みました。",
    severity: "critical",
    status: "investigating",
    model: "GPT-4 本番環境",
    assignee: "セキュリティチーム",
    createdAt: "2026-02-21 09:12",
    updatedAt: "2026-02-21 10:45",
    timeline: [
      { time: "09:12", action: "自動モニタリングによりインシデント検知", actor: "システム" },
      { time: "09:14", action: "セキュリティチームにアラート送信", actor: "システム" },
      { time: "09:20", action: "調査開始", actor: "セキュリティチーム" },
      { time: "09:45", action: "攻撃ベクター特定: Unicodeエンコーディングバイパス", actor: "セキュリティチーム" },
      { time: "10:15", action: "一時的な入力フィルターを展開", actor: "セキュリティチーム" },
      { time: "10:45", action: "根本原因分析を進行中", actor: "セキュリティチーム" },
    ],
  },
  {
    id: "INC-2026-046",
    title: "カスタマーサポートBotでPIIデータ漏洩",
    description: "定期モニタリング中にモデル出力から顧客PIIが検出されました。サポートBotが学習データからメールアドレスを不注意に露出しました。",
    severity: "high",
    status: "resolved",
    model: "カスタマーサポートBot",
    assignee: "データプライバシーチーム",
    createdAt: "2026-02-20 14:30",
    updatedAt: "2026-02-21 08:00",
    timeline: [
      { time: "14:30", action: "出力モニタリングでPIIを検出", actor: "システム" },
      { time: "14:35", action: "モデル出力を一時制限", actor: "システム" },
      { time: "15:00", action: "データプライバシーチームに通知", actor: "システム" },
      { time: "16:30", action: "PIIパターン検出用の出力フィルター更新", actor: "データプライバシーチーム" },
      { time: "08:00", action: "修正を検証しモデル復旧", actor: "データプライバシーチーム" },
    ],
  },
  {
    id: "INC-2026-045",
    title: "レコメンドエンジンでモデルドリフト検出",
    description: "レコメンドモデルで顕著な出力分布のシフトが検出されました。パフォーマンス指標が許容閾値を超えて劣化しています。",
    severity: "medium",
    status: "open",
    model: "レコメンド v3",
    assignee: "MLエンジニアリング",
    createdAt: "2026-02-20 11:00",
    updatedAt: "2026-02-20 11:00",
    timeline: [
      { time: "11:00", action: "ドリフトスコアが閾値超過 (0.18 > 0.10)", actor: "システム" },
      { time: "11:05", action: "MLエンジニアリングにアラート送信", actor: "システム" },
    ],
  },
  {
    id: "INC-2026-044",
    title: "不正APIアクセス試行",
    description: "不明なIPレンジから内部LLMゲートウェイへの複数の不正アクセス試行が検出されました。",
    severity: "high",
    status: "closed",
    model: "内部LLMゲートウェイ",
    assignee: "セキュリティチーム",
    createdAt: "2026-02-19 22:15",
    updatedAt: "2026-02-20 09:30",
    timeline: [
      { time: "22:15", action: "異常アクセスパターンを検知", actor: "システム" },
      { time: "22:16", action: "IPレンジを自動ブロック", actor: "システム" },
      { time: "22:30", action: "セキュリティチームにアラート", actor: "システム" },
      { time: "09:00", action: "調査完了 - ブルートフォース試行と確認", actor: "セキュリティチーム" },
      { time: "09:30", action: "IPブラックリスト更新、インシデントクローズ", actor: "セキュリティチーム" },
    ],
  },
  {
    id: "INC-2026-043",
    title: "採用AIでバイアススコア閾値超過",
    description: "週次公平性監査で、採用評価AIが性別に関連する意思決定パターンで統計的に有意なバイアスを示しました。",
    severity: "high",
    status: "investigating",
    model: "採用評価AI",
    assignee: "倫理チーム",
    createdAt: "2026-02-19 16:00",
    updatedAt: "2026-02-20 14:00",
    timeline: [
      { time: "16:00", action: "週次公平性監査でバイアスパターン検出", actor: "システム" },
      { time: "16:10", action: "モデルを本番から一時停止", actor: "システム" },
      { time: "17:00", action: "倫理チームによるレビュー開始", actor: "倫理チーム" },
      { time: "14:00", action: "バイアス除去データセットでの再学習進行中", actor: "倫理チーム" },
    ],
  },
]

const severityConfig = {
  critical: { className: "bg-destructive/15 text-destructive border-destructive/30", icon: AlertTriangle },
  high: { className: "bg-chart-4/15 text-chart-4 border-chart-4/30", icon: AlertTriangle },
  medium: { className: "bg-warning/15 text-warning border-warning/30", icon: Shield },
  low: { className: "bg-primary/15 text-primary border-primary/30", icon: Shield },
}

const severityLabels = { critical: "重大", high: "高", medium: "中", low: "低" }

const statusConfig = {
  open: { label: "未対応", className: "bg-destructive/15 text-destructive border-destructive/30" },
  investigating: { label: "調査中", className: "bg-warning/15 text-warning border-warning/30" },
  resolved: { label: "解決済み", className: "bg-success/15 text-success border-success/30" },
  closed: { label: "クローズ", className: "bg-muted text-muted-foreground border-border" },
}

export function IncidentList() {
  const [expandedId, setExpandedId] = useState<string | null>(incidents[0].id)

  const handleExport = () => {
    exportToCSV(
      incidents.map((i) => ({
        ID: i.id,
        タイトル: i.title,
        深刻度: severityLabels[i.severity],
        ステータス: statusConfig[i.status].label,
        モデル: i.model,
        担当者: i.assignee,
        作成日時: i.createdAt,
        更新日時: i.updatedAt,
      })),
      "incidents"
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Download className="h-3 w-3" />
          CSVエクスポート
        </button>
        <button
          onClick={() => exportToJSON(incidents, "incidents")}
          className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Download className="h-3 w-3" />
          JSON
        </button>
      </div>
      {incidents.map((incident) => {
        const isExpanded = expandedId === incident.id
        const SeverityIcon = severityConfig[incident.severity].icon

        return (
          <div key={incident.id} className="rounded-lg border border-border bg-card overflow-hidden">
            <button
              onClick={() => setExpandedId(isExpanded ? null : incident.id)}
              className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-secondary/30 transition-colors"
            >
              <SeverityIcon className={cn(
                "h-4 w-4 shrink-0",
                incident.severity === "critical" ? "text-destructive" :
                incident.severity === "high" ? "text-chart-4" :
                incident.severity === "medium" ? "text-warning" : "text-primary"
              )} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-primary">{incident.id}</span>
                  <span className="text-sm font-medium text-foreground truncate">{incident.title}</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[11px] text-muted-foreground">{incident.model}</span>
                  <span className="text-[11px] text-muted-foreground/50">|</span>
                  <span className="text-[11px] text-muted-foreground">{incident.createdAt}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="outline" className={cn("text-[10px]", severityConfig[incident.severity].className)}>
                  {severityLabels[incident.severity]}
                </Badge>
                <Badge variant="outline" className={cn("text-[10px]", statusConfig[incident.status].className)}>
                  {statusConfig[incident.status].label}
                </Badge>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </button>

            {isExpanded && (
              <div className="border-t border-border px-5 py-4">
                <p className="text-sm text-muted-foreground mb-4">{incident.description}</p>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-foreground">{incident.assignee}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">更新: {incident.updatedAt}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-0 pl-2">
                  <h4 className="text-xs font-semibold text-foreground mb-3">タイムライン</h4>
                  {incident.timeline.map((event, idx) => (
                    <div key={idx} className="flex gap-3 relative">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "h-2 w-2 rounded-full shrink-0 mt-1.5",
                          idx === incident.timeline.length - 1 ? "bg-primary" : "bg-muted-foreground/40"
                        )} />
                        {idx < incident.timeline.length - 1 && (
                          <div className="w-px flex-1 bg-border my-1" />
                        )}
                      </div>
                      <div className="pb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-muted-foreground">{event.time}</span>
                          <span className="text-[10px] text-primary">{event.actor}</span>
                        </div>
                        <p className="text-xs text-foreground mt-0.5">{event.action}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-2 pt-3 border-t border-border">
                  {incident.status !== "closed" && incident.status !== "resolved" && (
                    <>
                      <button className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                        {incident.status === "open" ? "調査開始" : "解決済みにする"}
                      </button>
                      <button className="rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                        担当者割当
                      </button>
                    </>
                  )}
                  <button className="rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors ml-auto">
                    詳細レポート
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
