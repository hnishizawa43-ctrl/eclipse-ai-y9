import { DashboardHeader } from "@/components/dashboard/header"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { IncidentList } from "@/components/dashboard/incident-list"
import { AlertTriangle, Clock, CheckCircle2, TrendingDown } from "lucide-react"

export default function IncidentsPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Incident Management"
        description="Track, investigate, and resolve AI security incidents"
      />
      <div className="flex flex-col gap-6 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Open Incidents"
            value="3"
            change="+1 today"
            changeType="negative"
            icon={AlertTriangle}
          />
          <KpiCard
            title="Investigating"
            value="2"
            icon={Clock}
            description="Active investigations"
          />
          <KpiCard
            title="Resolved (30d)"
            value="18"
            change="+5"
            changeType="positive"
            icon={CheckCircle2}
          />
          <KpiCard
            title="Avg Resolution"
            value="4.2h"
            change="-1.3h"
            changeType="positive"
            icon={TrendingDown}
            description="Mean time to resolution"
          />
        </div>

        <IncidentList />
      </div>
    </div>
  )
}
