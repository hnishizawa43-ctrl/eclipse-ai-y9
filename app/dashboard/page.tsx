"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { ThreatChart } from "@/components/dashboard/threat-chart"
import { RecentAlerts } from "@/components/dashboard/recent-alerts"
import { ComplianceOverview } from "@/components/dashboard/compliance-overview"
import { ModelStatus } from "@/components/dashboard/model-status"
import { Shield, AlertTriangle, Activity, FileCheck } from "lucide-react"
import { cn } from "@/lib/utils"

function FadeIn({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])
  return (
    <div className={cn("transition-all duration-700", visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6", className)}>
      {children}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="概要"
        description="AIセキュリティ & ガバナンス ダッシュボード"
      />
      <div className="flex flex-col gap-6 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="保護中モデル"
            value="24"
            change="今週 +3"
            changeType="positive"
            icon={Shield}
            description="監視対象のAIモデル"
            delay={0}
          />
          <KpiCard
            title="脅威ブロック"
            value="1,247"
            change="+12.5%"
            changeType="positive"
            icon={AlertTriangle}
            description="過去30日間"
            delay={100}
          />
          <KpiCard
            title="稼働率"
            value="99.97%"
            change="+0.02%"
            changeType="positive"
            icon={Activity}
            description="システム可用性 (30日)"
            delay={200}
          />
          <KpiCard
            title="コンプライアンススコア"
            value="84%"
            change="+5pts"
            changeType="positive"
            icon={FileCheck}
            description="全規制対応"
            delay={300}
          />
        </div>

        <FadeIn delay={400} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ThreatChart />
          </div>
          <ComplianceOverview />
        </FadeIn>

        <FadeIn delay={600} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ModelStatus />
          <RecentAlerts />
        </FadeIn>
      </div>
    </div>
  )
}
