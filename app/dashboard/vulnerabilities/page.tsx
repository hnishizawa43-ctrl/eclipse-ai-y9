import { DashboardHeader } from "@/components/dashboard/header"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { ScanResultsTable } from "@/components/dashboard/scan-results-table"
import { ScanRunner } from "@/components/dashboard/scan-runner"
import { Shield, AlertTriangle, Bug, Clock } from "lucide-react"

export default function VulnerabilitiesPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="脆弱性スキャン"
        description="AIモデルのセキュリティ脆弱性を検出・評価"
      />
      <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="脆弱性総数"
            value="23"
            change="前回スキャン比 -4"
            changeType="positive"
            icon={Bug}
          />
          <KpiCard
            title="重大な問題"
            value="3"
            change="+1"
            changeType="negative"
            icon={AlertTriangle}
          />
          <KpiCard
            title="スキャン済みモデル"
            value="18/24"
            icon={Shield}
            description="6モデルが初回スキャン待ち"
          />
          <KpiCard
            title="最終フルスキャン"
            value="2時間前"
            icon={Clock}
            description="次回予定: 4時間後"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ScanResultsTable />
          </div>
          <ScanRunner />
        </div>
      </div>
    </div>
  )
}
