"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { IncidentList } from "@/components/dashboard/incident-list"
import { useAuth } from "@/lib/auth-context"
import { getIncidents, updateIncident as updateIncidentFirestore, addAuditEntry } from "@/lib/firestore"
import type { Incident } from "@/lib/firestore"
import { AlertTriangle, Clock, CheckCircle2, TrendingDown } from "lucide-react"
import { toast } from "sonner"
import { AiAnalysis } from "@/components/dashboard/ai-analysis"

export default function IncidentsPage() {
  const { user } = useAuth()
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getIncidents(user.uid)
      .then((data) => {
        data.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        setIncidents(data)
      })
      .catch((e) => {
        console.error("Failed to load incidents", e)
        toast.error("インシデントデータの読み込みに失敗しました")
      })
      .finally(() => setLoading(false))
  }, [user])

  const handleUpdateIncident = async (id: string, data: Partial<Incident>) => {
    if (!user) return

    // Update local state immediately
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, ...data } : inc))
    )

    // Persist to Firestore
    try {
      await updateIncidentFirestore(user.uid, id, data)
      if (data.status) {
        await addAuditEntry(user.uid, {
          action: data.status === "investigating" ? "インシデント調査開始" : data.status === "resolved" ? "インシデント解決" : `インシデント更新`,
          target: id,
          actor: user.displayName || user.email || "ユーザー",
          timestamp: new Date().toLocaleString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).replace(/\//g, "-"),
          type: "security",
        })
      }
    } catch (e) {
      console.error("Failed to update incident", e)
      toast.error("インシデントの更新に失敗しました")
    }
  }

  const openCount = incidents.filter((i) => i.status === "open").length
  const investigatingCount = incidents.filter((i) => i.status === "investigating").length
  const resolvedCount = incidents.filter((i) => i.status === "resolved" || i.status === "closed").length

  return (
    <div className="flex flex-col">
      <DashboardHeader title="インシデント管理" description="AIセキュリティインシデントの追跡・調査・解決" />
      <div className="flex flex-col gap-6 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="未対応インシデント"
            value={loading ? "-" : String(openCount)}
            change={openCount > 0 ? `${openCount}件が対応待ち` : "なし"}
            changeType={openCount > 0 ? "negative" : "positive"}
            icon={AlertTriangle}
          />
          <KpiCard
            title="調査中"
            value={loading ? "-" : String(investigatingCount)}
            icon={Clock}
            description="進行中の調査"
          />
          <KpiCard
            title="解決済み"
            value={loading ? "-" : String(resolvedCount)}
            change={resolvedCount > 0 ? `${resolvedCount}件解決` : ""}
            changeType="positive"
            icon={CheckCircle2}
          />
          <KpiCard
            title="平均解決時間"
            value="4.2時間"
            change="-1.3h"
            changeType="positive"
            icon={TrendingDown}
            description="平均対応完了時間"
          />
        </div>

        {!loading && incidents.length > 0 && (
          <AiAnalysis
            label="インシデントをAIで分析"
            context={`以下はAIセキュリティインシデントの一覧です。パターン分析、根本原因の推定、対応優先順位の提案を行ってください。\n\n${incidents.slice(0, 8).map(i => `- [${i.severity.toUpperCase()}/${i.status}] ${i.title} (モデル: ${i.model}, 担当: ${i.assignee}, 作成: ${i.createdAt})`).join("\n")}`}
          />
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64 rounded-lg border border-border bg-card">
            <p className="text-sm text-muted-foreground">読み込み中...</p>
          </div>
        ) : (
          <IncidentList incidents={incidents} onUpdateIncident={handleUpdateIncident} />
        )}
      </div>
    </div>
  )
}
