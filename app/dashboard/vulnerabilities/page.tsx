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
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard
            title="脆弱性総数"
            value="23"
            change="前回比 -4"
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
            title="スキャン済み"
            value="18/24"
            icon={Shield}
            description="6モデルが未スキャン"
          />
          <KpiCard
            title="最終スキャン"
            value="2時間前"
            icon={Clock}
            description="次回: 4時間後"
          />
        </div>

        <div className="flex flex-col gap-4 md:gap-6 xl:flex-row">
          <div className="flex-1 min-w-0">
            <ScanResultsTable />
          </div>
          <div className="w-full xl:w-80 shrink-0">
            <ScanRunner />
          </div>
        </div>
      </div>
    </div>
  )
}
