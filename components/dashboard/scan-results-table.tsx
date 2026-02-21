"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

interface Vulnerability {
  id: string
  title: string
  model: string
  category: string
  severity: "critical" | "high" | "medium" | "low"
  status: "open" | "mitigated" | "investigating"
  discoveredAt: string
  cvss: number
}

const vulnerabilities: Vulnerability[] = [
  {
    id: "VLN-001",
    title: "Prompt Injection via System Prompt Override",
    model: "GPT-4 Production",
    category: "Injection",
    severity: "critical",
    status: "open",
    discoveredAt: "2026-02-21 09:15",
    cvss: 9.8,
  },
  {
    id: "VLN-002",
    title: "Training Data Extraction via Repeated Queries",
    model: "Claude-3 Internal",
    category: "Data Leakage",
    severity: "high",
    status: "investigating",
    discoveredAt: "2026-02-21 08:32",
    cvss: 8.2,
  },
  {
    id: "VLN-003",
    title: "Model Inversion Attack Surface Detected",
    model: "Recommendation v3",
    category: "Model Security",
    severity: "high",
    status: "mitigated",
    discoveredAt: "2026-02-20 22:10",
    cvss: 7.5,
  },
  {
    id: "VLN-004",
    title: "Adversarial Input Bypass in Image Classifier",
    model: "Vision Model v2",
    category: "Adversarial",
    severity: "medium",
    status: "open",
    discoveredAt: "2026-02-20 16:45",
    cvss: 6.1,
  },
  {
    id: "VLN-005",
    title: "PII Exposure in Output Tokens",
    model: "Customer Support Bot",
    category: "Privacy",
    severity: "critical",
    status: "investigating",
    discoveredAt: "2026-02-20 14:20",
    cvss: 9.1,
  },
  {
    id: "VLN-006",
    title: "Hallucination Rate Exceeds Threshold",
    model: "Legal Document AI",
    category: "Reliability",
    severity: "medium",
    status: "open",
    discoveredAt: "2026-02-20 11:05",
    cvss: 5.4,
  },
  {
    id: "VLN-007",
    title: "Bias Detected in Decision Outputs",
    model: "Hiring Assessment AI",
    category: "Fairness",
    severity: "high",
    status: "investigating",
    discoveredAt: "2026-02-19 18:30",
    cvss: 7.8,
  },
  {
    id: "VLN-008",
    title: "Jailbreak Vulnerability via Encoding",
    model: "GPT-4 Production",
    category: "Injection",
    severity: "low",
    status: "mitigated",
    discoveredAt: "2026-02-19 09:00",
    cvss: 3.2,
  },
]

const severityConfig = {
  critical: { className: "bg-destructive/15 text-destructive border-destructive/30" },
  high: { className: "bg-chart-4/15 text-chart-4 border-chart-4/30" },
  medium: { className: "bg-warning/15 text-warning border-warning/30" },
  low: { className: "bg-primary/15 text-primary border-primary/30" },
}

const statusConfig = {
  open: { className: "bg-destructive/15 text-destructive border-destructive/30" },
  investigating: { className: "bg-warning/15 text-warning border-warning/30" },
  mitigated: { className: "bg-success/15 text-success border-success/30" },
}

export function ScanResultsTable() {
  const [filter, setFilter] = useState<"all" | "critical" | "high" | "medium" | "low">("all")

  const filtered = filter === "all" ? vulnerabilities : vulnerabilities.filter(v => v.severity === filter)

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Scan Results</h3>
          <p className="text-xs text-muted-foreground">{vulnerabilities.length} vulnerabilities found</p>
        </div>
        <div className="flex items-center gap-2">
          {(["all", "critical", "high", "medium", "low"] as const).map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                filter === level
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {level === "all" ? "All" : level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">ID</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Vulnerability</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Model</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Category</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Severity</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">CVSS</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((vuln) => (
              <tr key={vuln.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                <td className="px-5 py-3 text-xs font-mono text-primary">{vuln.id}</td>
                <td className="px-5 py-3">
                  <span className="text-sm text-foreground">{vuln.title}</span>
                </td>
                <td className="px-5 py-3 text-sm text-muted-foreground">{vuln.model}</td>
                <td className="px-5 py-3">
                  <span className="text-xs text-muted-foreground">{vuln.category}</span>
                </td>
                <td className="px-5 py-3">
                  <Badge variant="outline" className={cn("text-[10px]", severityConfig[vuln.severity].className)}>
                    {vuln.severity.toUpperCase()}
                  </Badge>
                </td>
                <td className="px-5 py-3">
                  <span className={cn(
                    "text-sm font-mono font-bold",
                    vuln.cvss >= 9 ? "text-destructive" : vuln.cvss >= 7 ? "text-chart-4" : vuln.cvss >= 4 ? "text-warning" : "text-success"
                  )}>
                    {vuln.cvss.toFixed(1)}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <Badge variant="outline" className={cn("text-[10px]", statusConfig[vuln.status].className)}>
                    {vuln.status.charAt(0).toUpperCase() + vuln.status.slice(1)}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
