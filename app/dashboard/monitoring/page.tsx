import { DashboardHeader } from "@/components/dashboard/header"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { LiveMetrics } from "@/components/dashboard/live-metrics"
import { ModelHealth } from "@/components/dashboard/model-health"
import { Activity, Zap, Clock, TrendingDown } from "lucide-react"

export default function MonitoringPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Real-time Monitoring"
        description="Live monitoring of AI model performance and anomaly detection"
      />
      <div className="flex flex-col gap-6 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Active Requests"
            value="1,432"
            change="Real-time"
            changeType="neutral"
            icon={Activity}
          />
          <KpiCard
            title="Avg Latency"
            value="127ms"
            change="-8ms"
            changeType="positive"
            icon={Clock}
          />
          <KpiCard
            title="Anomalies (24h)"
            value="14"
            change="-23%"
            changeType="positive"
            icon={TrendingDown}
          />
          <KpiCard
            title="Throughput"
            value="2.4K/s"
            change="+12%"
            changeType="positive"
            icon={Zap}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <LiveMetrics />
          </div>
          <ModelHealth />
        </div>
      </div>
    </div>
  )
}
