"use client"

import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
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
  {
    name: "EU AI Act",
    fullName: "European Union Artificial Intelligence Act",
    score: 87,
    status: "compliant",
    requirements: 42,
    completed: 37,
    lastAudit: "2026-02-18",
  },
  {
    name: "US Executive Order",
    fullName: "Executive Order on Safe, Secure AI",
    score: 72,
    status: "in-progress",
    requirements: 28,
    completed: 20,
    lastAudit: "2026-02-15",
    deadline: "2026-04-01",
  },
  {
    name: "Japan AI Guidelines",
    fullName: "AI Utilization Guidelines (Japan)",
    score: 94,
    status: "compliant",
    requirements: 35,
    completed: 33,
    lastAudit: "2026-02-20",
  },
  {
    name: "ISO 42001",
    fullName: "AI Management System Standard",
    score: 63,
    status: "in-progress",
    requirements: 56,
    completed: 35,
    lastAudit: "2026-02-10",
    deadline: "2026-06-30",
  },
  {
    name: "NIST AI RMF",
    fullName: "AI Risk Management Framework",
    score: 78,
    status: "in-progress",
    requirements: 32,
    completed: 25,
    lastAudit: "2026-02-12",
  },
  {
    name: "SOC 2 Type II",
    fullName: "Service Organization Control 2",
    score: 91,
    status: "compliant",
    requirements: 48,
    completed: 44,
    lastAudit: "2026-02-19",
  },
]

const statusConfig = {
  "compliant": { icon: CheckCircle2, label: "Compliant", className: "bg-success/15 text-success border-success/30" },
  "in-progress": { icon: Clock, label: "In Progress", className: "bg-warning/15 text-warning border-warning/30" },
  "non-compliant": { icon: AlertCircle, label: "Non-Compliant", className: "bg-destructive/15 text-destructive border-destructive/30" },
}

export function RegulationCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {regulations.map((reg) => {
        const StatusIcon = statusConfig[reg.status].icon
        return (
          <div key={reg.name} className="rounded-lg border border-border bg-card p-5 flex flex-col gap-4">
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
                <span className="text-xs text-muted-foreground">Compliance Score</span>
                <span className={cn(
                  "text-lg font-bold font-mono",
                  reg.score >= 90 ? "text-success" : reg.score >= 70 ? "text-warning" : "text-destructive"
                )}>
                  {reg.score}%
                </span>
              </div>
              <Progress value={reg.score} className="h-1.5 bg-secondary" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-muted-foreground">Requirements</span>
                <span className="text-xs font-medium text-foreground">
                  {reg.completed}/{reg.requirements} completed
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-muted-foreground">Last Audit</span>
                <span className="text-xs font-medium text-foreground">{reg.lastAudit}</span>
              </div>
            </div>

            {reg.deadline && (
              <div className="flex items-center gap-1.5 rounded-md bg-warning/10 px-3 py-1.5">
                <Clock className="h-3 w-3 text-warning" />
                <span className="text-[10px] text-warning">Deadline: {reg.deadline}</span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
