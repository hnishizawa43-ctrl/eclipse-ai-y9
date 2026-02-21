"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import {
  AlertTriangle,
  Shield,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  User,
} from "lucide-react"

interface Incident {
  id: string
  title: string
  description: string
  severity: "critical" | "high" | "medium" | "low"
  status: "open" | "investigating" | "resolved" | "closed"
  model: string
  assignee: string
  createdAt: string
  updatedAt: string
  timeline: { time: string; action: string; actor: string }[]
}

const incidents: Incident[] = [
  {
    id: "INC-2026-047",
    title: "Critical Prompt Injection Attack on Production LLM",
    description: "A sophisticated prompt injection attack was detected targeting the GPT-4 production endpoint. The attack attempted to extract system prompts and internal instructions.",
    severity: "critical",
    status: "investigating",
    model: "GPT-4 Production",
    assignee: "Security Team",
    createdAt: "2026-02-21 09:12",
    updatedAt: "2026-02-21 10:45",
    timeline: [
      { time: "09:12", action: "Incident detected by automated monitoring", actor: "System" },
      { time: "09:14", action: "Alert sent to security team", actor: "System" },
      { time: "09:20", action: "Investigation started", actor: "Security Team" },
      { time: "09:45", action: "Attack vector identified: encoded unicode bypass", actor: "Security Team" },
      { time: "10:15", action: "Temporary input filter deployed", actor: "Security Team" },
      { time: "10:45", action: "Root cause analysis in progress", actor: "Security Team" },
    ],
  },
  {
    id: "INC-2026-046",
    title: "PII Data Leakage in Customer Support Bot",
    description: "Customer PII was detected in model outputs during routine monitoring. The support bot inadvertently exposed email addresses from training data.",
    severity: "high",
    status: "resolved",
    model: "Customer Support Bot",
    assignee: "Data Privacy Team",
    createdAt: "2026-02-20 14:30",
    updatedAt: "2026-02-21 08:00",
    timeline: [
      { time: "14:30", action: "PII detected in output monitoring", actor: "System" },
      { time: "14:35", action: "Model output temporarily restricted", actor: "System" },
      { time: "15:00", action: "Data privacy team notified", actor: "System" },
      { time: "16:30", action: "Output filter updated to catch PII patterns", actor: "Data Privacy Team" },
      { time: "08:00", action: "Fix verified and model restored", actor: "Data Privacy Team" },
    ],
  },
  {
    id: "INC-2026-045",
    title: "Model Drift Detected in Recommendation Engine",
    description: "Significant output distribution shift detected in the recommendation model. Performance metrics degraded beyond acceptable thresholds.",
    severity: "medium",
    status: "open",
    model: "Recommendation v3",
    assignee: "ML Engineering",
    createdAt: "2026-02-20 11:00",
    updatedAt: "2026-02-20 11:00",
    timeline: [
      { time: "11:00", action: "Drift score exceeded threshold (0.18 > 0.10)", actor: "System" },
      { time: "11:05", action: "Alert sent to ML engineering", actor: "System" },
    ],
  },
  {
    id: "INC-2026-044",
    title: "Unauthorized API Access Attempt",
    description: "Multiple unauthorized access attempts detected on the internal LLM gateway from an unrecognized IP range.",
    severity: "high",
    status: "closed",
    model: "Internal LLM Gateway",
    assignee: "Security Team",
    createdAt: "2026-02-19 22:15",
    updatedAt: "2026-02-20 09:30",
    timeline: [
      { time: "22:15", action: "Unusual access pattern detected", actor: "System" },
      { time: "22:16", action: "IP range blocked automatically", actor: "System" },
      { time: "22:30", action: "Security team alerted", actor: "System" },
      { time: "09:00", action: "Investigation completed - brute force attempt confirmed", actor: "Security Team" },
      { time: "09:30", action: "IP blacklist updated, incident closed", actor: "Security Team" },
    ],
  },
  {
    id: "INC-2026-043",
    title: "Bias Score Threshold Exceeded in Hiring AI",
    description: "The hiring assessment AI showed statistically significant bias in gender-related decision patterns during the weekly fairness audit.",
    severity: "high",
    status: "investigating",
    model: "Hiring Assessment AI",
    assignee: "Ethics Team",
    createdAt: "2026-02-19 16:00",
    updatedAt: "2026-02-20 14:00",
    timeline: [
      { time: "16:00", action: "Weekly fairness audit flagged bias patterns", actor: "System" },
      { time: "16:10", action: "Model suspended from production", actor: "System" },
      { time: "17:00", action: "Ethics team review initiated", actor: "Ethics Team" },
      { time: "14:00", action: "Retraining with debiased dataset in progress", actor: "Ethics Team" },
    ],
  },
]

const severityConfig = {
  critical: { className: "bg-destructive/15 text-destructive border-destructive/30", icon: AlertTriangle },
  high: { className: "bg-chart-4/15 text-chart-4 border-chart-4/30", icon: AlertTriangle },
  medium: { className: "bg-warning/15 text-warning border-warning/30", icon: Shield },
  low: { className: "bg-primary/15 text-primary border-primary/30", icon: Shield },
}

const statusConfig = {
  open: { label: "Open", className: "bg-destructive/15 text-destructive border-destructive/30" },
  investigating: { label: "Investigating", className: "bg-warning/15 text-warning border-warning/30" },
  resolved: { label: "Resolved", className: "bg-success/15 text-success border-success/30" },
  closed: { label: "Closed", className: "bg-muted text-muted-foreground border-border" },
}

export function IncidentList() {
  const [expandedId, setExpandedId] = useState<string | null>(incidents[0].id)

  return (
    <div className="flex flex-col gap-3">
      {incidents.map((incident) => {
        const isExpanded = expandedId === incident.id
        const SeverityIcon = severityConfig[incident.severity].icon

        return (
          <div key={incident.id} className="rounded-lg border border-border bg-card overflow-hidden">
            {/* Header */}
            <button
              onClick={() => setExpandedId(isExpanded ? null : incident.id)}
              className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-secondary/30 transition-colors"
            >
              <SeverityIcon className={cn(
                "h-4 w-4 shrink-0",
                incident.severity === "critical" ? "text-destructive" :
                incident.severity === "high" ? "text-chart-4" :
                incident.severity === "medium" ? "text-warning" : "text-primary"
              )} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-primary">{incident.id}</span>
                  <span className="text-sm font-medium text-foreground truncate">{incident.title}</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[11px] text-muted-foreground">{incident.model}</span>
                  <span className="text-[11px] text-muted-foreground/50">|</span>
                  <span className="text-[11px] text-muted-foreground">{incident.createdAt}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="outline" className={cn("text-[10px]", severityConfig[incident.severity].className)}>
                  {incident.severity.toUpperCase()}
                </Badge>
                <Badge variant="outline" className={cn("text-[10px]", statusConfig[incident.status].className)}>
                  {statusConfig[incident.status].label}
                </Badge>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="border-t border-border px-5 py-4">
                <p className="text-sm text-muted-foreground mb-4">{incident.description}</p>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-foreground">{incident.assignee}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Updated: {incident.updatedAt}</span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex flex-col gap-0 pl-2">
                  <h4 className="text-xs font-semibold text-foreground mb-3">Timeline</h4>
                  {incident.timeline.map((event, idx) => (
                    <div key={idx} className="flex gap-3 relative">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "h-2 w-2 rounded-full shrink-0 mt-1.5",
                          idx === incident.timeline.length - 1 ? "bg-primary" : "bg-muted-foreground/40"
                        )} />
                        {idx < incident.timeline.length - 1 && (
                          <div className="w-px flex-1 bg-border my-1" />
                        )}
                      </div>
                      <div className="pb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-muted-foreground">{event.time}</span>
                          <span className="text-[10px] text-primary">{event.actor}</span>
                        </div>
                        <p className="text-xs text-foreground mt-0.5">{event.action}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-2 pt-3 border-t border-border">
                  {incident.status !== "closed" && incident.status !== "resolved" && (
                    <>
                      <button className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                        {incident.status === "open" ? "Start Investigation" : "Mark Resolved"}
                      </button>
                      <button className="rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Assign
                      </button>
                    </>
                  )}
                  <button className="rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors ml-auto">
                    View Full Report
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
