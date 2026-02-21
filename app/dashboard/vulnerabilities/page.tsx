import { DashboardHeader } from "@/components/dashboard/header"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { ScanResultsTable } from "@/components/dashboard/scan-results-table"
import { ScanRunner } from "@/components/dashboard/scan-runner"
import { Shield, AlertTriangle, Bug, Clock } from "lucide-react"

export default function VulnerabilitiesPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Vulnerability Scan"
        description="Detect and assess security vulnerabilities in your AI models"
      />
      <div className="flex flex-col gap-6 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Total Vulnerabilities"
            value="23"
            change="-4 from last scan"
            changeType="positive"
            icon={Bug}
          />
          <KpiCard
            title="Critical Issues"
            value="3"
            change="+1"
            changeType="negative"
            icon={AlertTriangle}
          />
          <KpiCard
            title="Models Scanned"
            value="18/24"
            icon={Shield}
            description="6 pending initial scan"
          />
          <KpiCard
            title="Last Full Scan"
            value="2h ago"
            icon={Clock}
            description="Next scheduled: 4h"
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
