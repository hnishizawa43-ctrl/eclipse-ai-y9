"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { toast } from "sonner"
import {
  AlertTriangle,
  Shield,
  Clock,
  ChevronDown,
  ChevronUp,
  User,
  Download,
} from "lucide-react"
import type { Incident } from "@/lib/firestore"

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

const ASSIGNEES = ["セキュリティチーム", "データプライバシーチーム", "MLエンジニアリング", "倫理チーム", "インフラチーム"]

function now() {
  const d = new Date()
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`
}

function exportIncidentCSV(incidents: Incident[]) {
  const header = "ID,タイトル,深刻度,ステータス,モデル,担当者,作成日時,更新日時"
  const rows = incidents.map((i) =>
    [i.id, `"${i.title}"`, severityLabels[i.severity], statusConfig[i.status].label, i.model, i.assignee, i.createdAt, i.updatedAt].join(",")
  )
  const csv = [header, ...rows].join("\n")
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `eclipse_incidents_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
  toast.success("インシデントレポートをエクスポートしました")
}

interface IncidentListProps {
  incidents: Incident[]
  onUpdateIncident: (id: string, data: Partial<Incident>) => void
}

export function IncidentList({ incidents, onUpdateIncident }: IncidentListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(incidents[0]?.id ?? null)
  const [assigneePickerId, setAssigneePickerId] = useState<string | null>(null)

  function advanceStatus(id: string) {
    const inc = incidents.find((i) => i.id === id)
    if (!inc) return
    const nextStatus = inc.status === "open" ? "investigating" : "resolved"
    const action = nextStatus === "investigating" ? "調査を開始しました" : "インシデントを解決済みにしました"
    toast.success(`${inc.id}: ${action}`)
    onUpdateIncident(id, {
      status: nextStatus as Incident["status"],
      updatedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      timeline: [...inc.timeline, { time: now(), action, actor: "あなた" }],
    })
  }

  function assignTo(incidentId: string, assignee: string) {
    const inc = incidents.find((i) => i.id === incidentId)
    if (!inc) return
    toast.success(`${inc.id}: ${assignee}に割り当てました`)
    onUpdateIncident(incidentId, {
      assignee,
      updatedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      timeline: [...inc.timeline, { time: now(), action: `担当者を${assignee}に変更`, actor: "あなた" }],
    })
    setAssigneePickerId(null)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <button
          onClick={() => exportIncidentCSV(incidents)}
          className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Download className="h-3 w-3" />
          CSVエクスポート
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
                {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
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
                        {idx < incident.timeline.length - 1 && <div className="w-px flex-1 bg-border my-1" />}
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
                      <button
                        onClick={() => advanceStatus(incident.id)}
                        className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        {incident.status === "open" ? "調査開始" : "解決済みにする"}
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setAssigneePickerId(assigneePickerId === incident.id ? null : incident.id)}
                          className="rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          担当者割当
                        </button>
                        {assigneePickerId === incident.id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setAssigneePickerId(null)} />
                            <div className="absolute bottom-full left-0 z-50 mb-1 w-48 rounded-md border border-border bg-card py-1 shadow-lg">
                              {ASSIGNEES.map((a) => (
                                <button
                                  key={a}
                                  onClick={() => assignTo(incident.id, a)}
                                  className={cn(
                                    "block w-full px-3 py-1.5 text-left text-xs hover:bg-secondary transition-colors",
                                    a === incident.assignee ? "text-primary font-medium" : "text-muted-foreground"
                                  )}
                                >
                                  {a}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  )}
                  <button
                    onClick={() => exportIncidentCSV([incident])}
                    className="rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors ml-auto"
                  >
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
