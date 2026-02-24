"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, AlertCircle, ExternalLink } from "lucide-react"

interface Regulation {
  name: string
  fullName: string
  score: number
  status: "compliant" | "in-progress" | "non-compliant"
  requirements: number
  completed: number
  lastAudit: string
  deadline?: string
}

const regulations: Regulation[] = [
  { name: "EU AI Act", fullName: "欧州連合 人工知能規制法", score: 87, status: "compliant", requirements: 42, completed: 37, lastAudit: "2026-02-18" },
  { name: "米国大統領令", fullName: "安全で安心なAIに関する大統領令", score: 72, status: "in-progress", requirements: 28, completed: 20, lastAudit: "2026-02-15", deadline: "2026-04-01" },
  { name: "AI事業者ガイドライン", fullName: "AI事業者ガイドライン（日本）", score: 94, status: "compliant", requirements: 35, completed: 33, lastAudit: "2026-02-20" },
  { name: "ISO 42001", fullName: "AIマネジメントシステム規格", score: 63, status: "in-progress", requirements: 56, completed: 35, lastAudit: "2026-02-10", deadline: "2026-06-30" },
  { name: "NIST AI RMF", fullName: "AIリスクマネジメントフレームワーク", score: 78, status: "in-progress", requirements: 32, completed: 25, lastAudit: "2026-02-12" },
  { name: "SOC 2 Type II", fullName: "サービス組織統制 2", score: 91, status: "compliant", requirements: 48, completed: 44, lastAudit: "2026-02-19" },
]

const statusConfig = {
  "compliant": { icon: CheckCircle2, label: "準拠", className: "bg-success/15 text-success border-success/30" },
  "in-progress": { icon: Clock, label: "対応中", className: "bg-warning/15 text-warning border-warning/30" },
  "non-compliant": { icon: AlertCircle, label: "非準拠", className: "bg-destructive/15 text-destructive border-destructive/30" },
}

function getScoreColors(score: number) {
  if (score >= 90) return { text: "text-success", glow: "var(--glow-success)" }
  if (score >= 70) return { text: "text-warning", glow: "var(--glow-warning)" }
  return { text: "text-destructive", glow: "var(--glow-destructive)" }
}

export function RegulationCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {regulations.map((reg, index) => {
        const StatusIcon = statusConfig[reg.status].icon
        const scoreColors = getScoreColors(reg.score)
        return (
          <div
            key={reg.name}
            className="group rounded-lg glass-card border-border/30 p-5 flex flex-col gap-4 hover-lift animate-slide-up-fade"
            style={{ animationDelay: `${index * 0.06}s` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{reg.name}</h3>
                  <ExternalLink className="h-3 w-3 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
                </div>
                <p className="text-[11px] text-muted-foreground">{reg.fullName}</p>
              </div>
              <Badge variant="outline" className={cn("text-[10px] shrink-0", statusConfig[reg.status].className)}>
                <StatusIcon className="mr-1 h-3 w-3" />
                {statusConfig[reg.status].label}
              </Badge>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{"コンプライアンススコア"}</span>
                <span className={cn("text-lg font-bold font-mono transition-colors duration-300", scoreColors.text)}>
                  {reg.score}%
                </span>
              </div>
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className={cn("h-full rounded-full transition-all duration-700 ease-out",
                    reg.score >= 90 ? "bg-success" : reg.score >= 70 ? "bg-warning" : "bg-destructive"
                  )}
                  style={{
                    width: `${reg.score}%`,
                    boxShadow: `0 0 8px ${scoreColors.glow}`,
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-muted-foreground">{"要件"}</span>
                <span className="text-xs font-medium text-foreground">
                  {reg.completed}/{reg.requirements} {"完了"}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-muted-foreground">{"最終監査"}</span>
                <span className="text-xs font-medium text-foreground">{reg.lastAudit}</span>
              </div>
            </div>

            {reg.deadline && (
              <div className="flex items-center gap-1.5 rounded-md bg-warning/10 px-3 py-1.5 border border-warning/20">
                <Clock className="h-3 w-3 text-warning" />
                <span className="text-[10px] text-warning">{"期限: "}{reg.deadline}</span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
