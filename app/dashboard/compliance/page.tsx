import { DashboardHeader } from "@/components/dashboard/header"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { RegulationCards } from "@/components/dashboard/regulation-cards"
import { AuditLog } from "@/components/dashboard/audit-log"
import { FileCheck, ShieldCheck, Clock, FileText } from "lucide-react"

export default function CompliancePage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="コンプライアンス & 監査"
        description="マルチ規制コンプライアンス管理と自動監査レポート"
      />
      <div className="flex flex-col gap-6 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="全体コンプライアンス"
            value="84%"
            change="今月 +5pts"
            changeType="positive"
            icon={FileCheck}
          />
          <KpiCard
            title="追跡中の規制"
            value="6"
            icon={ShieldCheck}
            description="3つの法域にわたる"
          />
          <KpiCard
            title="保留中のアクション"
            value="12"
            change="-3"
            changeType="positive"
            icon={Clock}
            description="残りのアクション項目"
          />
          <KpiCard
            title="生成レポート"
            value="47"
            change="今月 +8"
            changeType="positive"
            icon={FileText}
          />
        </div>

        <RegulationCards />

        <AuditLog />
      </div>
    </div>
  )
}
