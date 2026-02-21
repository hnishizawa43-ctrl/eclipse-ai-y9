"use client"

import { Progress } from "@/components/ui/progress"

const regulations = [
  { name: "EU AI Act", score: 87, status: "Compliant" },
  { name: "US Executive Order", score: 72, status: "In Progress" },
  { name: "Japan AI Guidelines", score: 94, status: "Compliant" },
  { name: "ISO 42001", score: 63, status: "In Progress" },
]

export function ComplianceOverview() {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Compliance Status</h3>
        <span className="text-xs text-primary cursor-pointer hover:underline">Details</span>
      </div>
      <div className="flex flex-col gap-4">
        {regulations.map((reg) => (
          <div key={reg.name} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">{reg.name}</span>
              <span className="text-xs font-mono text-muted-foreground">{reg.score}%</span>
            </div>
            <Progress
              value={reg.score}
              className="h-1.5 bg-secondary"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
