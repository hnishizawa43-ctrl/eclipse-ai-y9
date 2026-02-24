import { DashboardHeader } from "@/components/dashboard/header"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { IncidentList } from "@/components/dashboard/incident-list"
import { AlertTriangle, Clock, CheckCircle2, TrendingDown } from "lucide-react"

export default function IncidentsPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="インシデント管理"
        description="AIセキュリティインシデントの追跡・調査・解決"
      />
      <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="未対応インシデント"
            value="3"
            change="本日 +1"
            changeType="negative"
            icon={AlertTriangle}
          />
          <KpiCard
            title="調査中"
            value="2"
            icon={Clock}
            description="進行中の調査"
          />
          <KpiCard
            title="解決済み (30日)"
            value="18"
            change="+5"
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

        <IncidentList />
      </div>
    </div>
  )
}
