"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { ScanResultsTable } from "@/components/dashboard/scan-results-table"
import type { Vulnerability } from "@/components/dashboard/scan-results-table"
import { ScanRunner } from "@/components/dashboard/scan-runner"
import type { ScanResult } from "@/components/dashboard/scan-runner"
import { Shield, AlertTriangle, Bug, Clock } from "lucide-react"

export default function VulnerabilitiesPage() {
  const [newVulnerabilities, setNewVulnerabilities] = useState<Vulnerability[]>([])
  const [scanCount, setScanCount] = useState(0)

  const handleScanComplete = (results: ScanResult[]) => {
    const mapped: Vulnerability[] = results.map(r => ({ ...r, isNew: true }))
    setNewVulnerabilities(prev => [...mapped, ...prev.map(v => ({ ...v, isNew: false }))])
    setScanCount(prev => prev + 1)
  }

  const totalNew = newVulnerabilities.length
  const criticalNew = newVulnerabilities.filter(v => v.severity === "critical").length

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="脆弱性スキャン"
        description="AIモデルのセキュリティ脆弱性を検出・評価"
      />
      <div className="flex flex-col gap-6 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="脆弱性総数"
            value={String(8 + totalNew)}
            change={totalNew > 0 ? `スキャンで +${totalNew}件検出` : "前回スキャン比 -4"}
            changeType={totalNew > 0 ? "negative" : "positive"}
            icon={Bug}
          />
          <KpiCard
            title="重大な問題"
            value={String(2 + criticalNew)}
            change={criticalNew > 0 ? `+${criticalNew}` : "+0"}
            changeType={criticalNew > 0 ? "negative" : "positive"}
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ScanResultsTable extraVulnerabilities={newVulnerabilities} />
          </div>
          <ScanRunner onScanComplete={handleScanComplete} />
        </div>
      </div>
    </div>
  )
}
