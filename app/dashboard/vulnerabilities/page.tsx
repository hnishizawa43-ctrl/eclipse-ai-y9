"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { ScanResultsTable } from "@/components/dashboard/scan-results-table"
import { ScanRunner } from "@/components/dashboard/scan-runner"
import type { ScanResult } from "@/components/dashboard/scan-runner"
import { useAuth } from "@/lib/auth-context"
import { getVulnerabilities, addVulnerabilities, addAuditEntry } from "@/lib/firestore"
import type { Vulnerability } from "@/lib/firestore"
import { Shield, AlertTriangle, Bug, Clock } from "lucide-react"
import { toast } from "sonner"
import { AiAnalysis } from "@/components/dashboard/ai-analysis"

export default function VulnerabilitiesPage() {
  const { user } = useAuth()
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([])
  const [loading, setLoading] = useState(true)
  const [scanCount, setScanCount] = useState(0)
  const [lastScanNew, setLastScanNew] = useState(0)

  // Load from Firestore
  useEffect(() => {
    if (!user) return
    getVulnerabilities(user.uid)
      .then((data) => {
        // Sort by discoveredAt descending
        data.sort((a, b) => b.discoveredAt.localeCompare(a.discoveredAt))
        setVulnerabilities(data)
      })
      .catch((e) => {
        console.error("Failed to load vulnerabilities", e)
        toast.error("脆弱性データの読み込みに失敗しました")
      })
      .finally(() => setLoading(false))
  }, [user])

  const handleScanComplete = async (results: ScanResult[]) => {
    if (!user) return

    const newVulns: Vulnerability[] = results.map((r) => ({ ...r, isNew: true }))

    // Save to Firestore
    try {
      await addVulnerabilities(user.uid, newVulns)
      await addAuditEntry(user.uid, {
        action: "脆弱性スキャン実行",
        target: `${newVulns.length}件検出`,
        actor: user.displayName || user.email || "ユーザー",
        timestamp: new Date().toLocaleString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).replace(/\//g, "-"),
        type: "security",
      })
    } catch (e) {
      console.error("Failed to save scan results", e)
    }

    // Update local state, mark existing as not new
    setVulnerabilities((prev) => [
      ...newVulns,
      ...prev.map((v) => ({ ...v, isNew: false })),
    ])
    setScanCount((prev) => prev + 1)
    setLastScanNew(newVulns.length)
  }

  const total = vulnerabilities.length
  const criticalCount = vulnerabilities.filter((v) => v.severity === "critical").length

  return (
    <div className="flex flex-col">
      <DashboardHeader title="脆弱性スキャン" description="AIモデルのセキュリティ脆弱性を検出・評価" />
      <div className="flex flex-col gap-6 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="脆弱性総数"
            value={loading ? "-" : String(total)}
            change={lastScanNew > 0 ? `スキャンで +${lastScanNew}件検出` : "Firestoreから読込済"}
            changeType={lastScanNew > 0 ? "negative" : "positive"}
            icon={Bug}
          />
          <KpiCard
            title="重大な問題"
            value={loading ? "-" : String(criticalCount)}
            change={criticalCount > 0 ? `${criticalCount}件の重大な脆弱性` : "なし"}
            changeType={criticalCount > 0 ? "negative" : "positive"}
            icon={AlertTriangle}
          />
          <KpiCard
            title="スキャン済みモデル"
            value="18/24"
            icon={Shield}
            description="6モデルが初回スキャン待ち"
          />
          <KpiCard
            title="実行済みスキャン"
            value={scanCount > 0 ? `${scanCount}回` : "2時間前"}
            icon={Clock}
            description={scanCount > 0 ? "今セッション中" : "次回予定: 4時間後"}
          />
        </div>

        {!loading && vulnerabilities.length > 0 && (
          <AiAnalysis
            label="脆弱性をAIで分析"
            context={`以下はAIモデルの脆弱性スキャン結果です。重大度別に分析し、優先対応すべき項目と具体的な修正方法を提案してください。\n\n${vulnerabilities.slice(0, 10).map(v => `- [${v.severity.toUpperCase()}] ${v.title} (モデル: ${v.model}, CVSS: ${v.cvss}, カテゴリ: ${v.category})`).join("\n")}`}
          />
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex items-center justify-center h-64 rounded-lg border border-border bg-card">
                <p className="text-sm text-muted-foreground">読み込み中...</p>
              </div>
            ) : (
              <ScanResultsTable vulnerabilities={vulnerabilities} />
            )}
          </div>
          <ScanRunner onScanComplete={handleScanComplete} />
        </div>
      </div>
    </div>
  )
}
