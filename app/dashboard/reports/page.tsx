"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  FileBarChart,
  Shield,
  AlertTriangle,
  FileCheck,
  Download,
  TrendingDown,
  TrendingUp,
  Calendar,
  Clock,
} from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { exportToJSON } from "@/lib/export-utils"

const monthlyThreatData = [
  { month: "9月", threats: 12, mitigated: 10, incidents: 3 },
  { month: "10月", threats: 18, mitigated: 15, incidents: 5 },
  { month: "11月", threats: 24, mitigated: 22, incidents: 4 },
  { month: "12月", threats: 15, mitigated: 14, incidents: 2 },
  { month: "1月", threats: 21, mitigated: 19, incidents: 6 },
  { month: "2月", threats: 28, mitigated: 23, incidents: 5 },
]

const vulnerabilityByCategory = [
  { name: "インジェクション", value: 35, color: "oklch(0.55 0.22 27)" },
  { name: "データ漏洩", value: 22, color: "oklch(0.75 0.18 80)" },
  { name: "敵対的攻撃", value: 18, color: "oklch(0.62 0.18 260)" },
  { name: "バイアス/公平性", value: 15, color: "oklch(0.65 0.2 310)" },
  { name: "信頼性", value: 10, color: "oklch(0.7 0.15 170)" },
]

const complianceTrend = [
  { month: "9月", score: 58 },
  { month: "10月", score: 62 },
  { month: "11月", score: 65 },
  { month: "12月", score: 68 },
  { month: "1月", score: 71 },
  { month: "2月", score: 73 },
]

const reports = [
  {
    id: "RPT-2026-012",
    title: "2026年2月 月次セキュリティレポート",
    type: "monthly",
    status: "生成中",
    statusColor: "bg-warning/15 text-warning border-warning/30",
    date: "2026-02-21",
    icon: FileBarChart,
  },
  {
    id: "RPT-2026-011",
    title: "2026年1月 月次セキュリティレポート",
    type: "monthly",
    status: "完了",
    statusColor: "bg-success/15 text-success border-success/30",
    date: "2026-02-01",
    icon: FileBarChart,
  },
  {
    id: "RPT-2026-010",
    title: "EU AI Act コンプライアンス評価レポート",
    type: "compliance",
    status: "完了",
    statusColor: "bg-success/15 text-success border-success/30",
    date: "2026-01-28",
    icon: FileCheck,
  },
  {
    id: "RPT-2026-009",
    title: "Q4 2025 脆弱性トレンド分析",
    type: "analysis",
    status: "完了",
    statusColor: "bg-success/15 text-success border-success/30",
    date: "2026-01-15",
    icon: Shield,
  },
  {
    id: "RPT-2026-008",
    title: "インシデント対応パフォーマンス報告",
    type: "incident",
    status: "完了",
    statusColor: "bg-success/15 text-success border-success/30",
    date: "2026-01-10",
    icon: AlertTriangle,
  },
]

const kpiSummary = [
  {
    label: "検出脅威 (今月)",
    value: "28",
    change: "+33%",
    changeType: "negative" as const,
    icon: AlertTriangle,
  },
  {
    label: "対処済み率",
    value: "82%",
    change: "+5%",
    changeType: "positive" as const,
    icon: Shield,
  },
  {
    label: "平均対応時間",
    value: "2.3h",
    change: "-18%",
    changeType: "positive" as const,
    icon: Clock,
  },
  {
    label: "コンプライアンス",
    value: "73%",
    change: "+2%",
    changeType: "positive" as const,
    icon: FileCheck,
  },
]

export default function ReportsPage() {
  return (
    <div>
      <DashboardHeader title="レポート & 分析" description="セキュリティインサイトと月次レポートの管理" />
      <div className="p-6 flex flex-col gap-6">
        {/* KPI Summary Row */}
        <div className="grid grid-cols-4 gap-4">
          {kpiSummary.map((kpi) => (
            <div key={kpi.label} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <kpi.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-foreground">{kpi.value}</span>
                  <span
                    className={cn(
                      "flex items-center gap-0.5 text-[10px] font-medium",
                      kpi.changeType === "positive" ? "text-success" : "text-destructive"
                    )}
                  >
                    {kpi.changeType === "positive" ? (
                      <TrendingDown className="h-3 w-3" />
                    ) : (
                      <TrendingUp className="h-3 w-3" />
                    )}
                    {kpi.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Threat Trend */}
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">脅威トレンド (6ヶ月)</h3>
                <p className="text-xs text-muted-foreground">検出・対処・インシデント数の推移</p>
              </div>
              <button
                onClick={() => exportToJSON(monthlyThreatData, "threat-trend")}
                className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Download className="h-3 w-3" />
                JSON
              </button>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={monthlyThreatData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 260)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "oklch(0.6 0.02 260)" }} />
                <YAxis tick={{ fontSize: 11, fill: "oklch(0.6 0.02 260)" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.17 0.008 260)",
                    border: "1px solid oklch(0.25 0.01 260)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "oklch(0.95 0.01 260)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="threats"
                  name="検出脅威"
                  stroke="oklch(0.55 0.22 27)"
                  fill="oklch(0.55 0.22 27)"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="mitigated"
                  name="対処済み"
                  stroke="oklch(0.65 0.17 155)"
                  fill="oklch(0.65 0.17 155)"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="incidents"
                  name="インシデント"
                  stroke="oklch(0.75 0.17 70)"
                  fill="oklch(0.75 0.17 70)"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Vulnerability Distribution + Compliance Trend */}
          <div className="flex flex-col gap-4">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-1">脆弱性カテゴリ分布</h3>
              <p className="text-xs text-muted-foreground mb-3">検出された脆弱性のカテゴリ別割合</p>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width={120} height={120}>
                  <PieChart>
                    <Pie
                      data={vulnerabilityByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={55}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {vulnerabilityByCategory.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-1.5 flex-1">
                  {vulnerabilityByCategory.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: cat.color }} />
                        <span className="text-xs text-muted-foreground">{cat.name}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-foreground">{cat.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-1">コンプライアンススコア推移</h3>
              <p className="text-xs text-muted-foreground mb-3">6ヶ月間の総合コンプライアンススコア</p>
              <ResponsiveContainer width="100%" height={80}>
                <BarChart data={complianceTrend}>
                  <Bar dataKey="score" fill="oklch(0.62 0.18 260)" radius={[3, 3, 0, 0]} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "oklch(0.6 0.02 260)" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.17 0.008 260)",
                      border: "1px solid oklch(0.25 0.01 260)",
                      borderRadius: "8px",
                      fontSize: "12px",
                      color: "oklch(0.95 0.01 260)",
                    }}
                    formatter={(value) => [`${value}%`, "スコア"]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">レポート一覧</h3>
              <p className="text-xs text-muted-foreground">生成済みおよび作成中のレポート</p>
            </div>
          </div>
          <div className="flex flex-col">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center gap-4 border-b border-border/50 px-5 py-4 hover:bg-secondary/30 transition-colors last:border-b-0"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                  <report.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{report.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-mono text-muted-foreground">{report.id}</span>
                    <span className="text-[10px] text-muted-foreground/50">|</span>
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {report.date}
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className={cn("text-[10px]", report.statusColor)}>
                  {report.status}
                </Badge>
                {report.status === "完了" && (
                  <button className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Download className="h-3 w-3" />
                    ダウンロード
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
