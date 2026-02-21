import { DashboardHeader } from "@/components/dashboard/header"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { RegulationCards } from "@/components/dashboard/regulation-cards"
import { AuditLog } from "@/components/dashboard/audit-log"
import { FileCheck, ShieldCheck, Clock, FileText } from "lucide-react"

export default function CompliancePage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Compliance & Audit"
        description="Multi-regulation compliance management and automated audit reporting"
      />
      <div className="flex flex-col gap-6 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Overall Compliance"
            value="84%"
            change="+5pts this month"
            changeType="positive"
            icon={FileCheck}
          />
          <KpiCard
            title="Regulations Tracked"
            value="6"
            icon={ShieldCheck}
            description="Across 3 jurisdictions"
          />
          <KpiCard
            title="Pending Actions"
            value="12"
            change="-3"
            changeType="positive"
            icon={Clock}
            description="Action items remaining"
          />
          <KpiCard
            title="Reports Generated"
            value="47"
            change="+8 this month"
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
