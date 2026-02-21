import { DashboardHeader } from "@/components/dashboard/header"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { ThreatChart } from "@/components/dashboard/threat-chart"
import { RecentAlerts } from "@/components/dashboard/recent-alerts"
import { ComplianceOverview } from "@/components/dashboard/compliance-overview"
import { ModelStatus } from "@/components/dashboard/model-status"
import { Shield, AlertTriangle, Activity, FileCheck } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Overview"
        description="AI Security & Governance Dashboard"
      />
      <div className="flex flex-col gap-6 p-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Models Protected"
            value="24"
            change="+3 this week"
            changeType="positive"
            icon={Shield}
            description="Active AI models under monitoring"
          />
          <KpiCard
            title="Threats Blocked"
            value="1,247"
            change="+12.5%"
            changeType="positive"
            icon={AlertTriangle}
            description="Last 30 days"
          />
          <KpiCard
            title="Uptime"
            value="99.97%"
            change="+0.02%"
            changeType="positive"
            icon={Activity}
            description="System availability (30d)"
          />
          <KpiCard
            title="Compliance Score"
            value="84%"
            change="+5pts"
            changeType="positive"
            icon={FileCheck}
            description="Across all regulations"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ThreatChart />
          </div>
          <ComplianceOverview />
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ModelStatus />
          <RecentAlerts />
        </div>
      </div>
    </div>
  )
}
