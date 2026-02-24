"use client"

import { cn } from "@/lib/utils"

const regulations = [
  { name: "EU AI Act", score: 87, status: "準拠" },
  { name: "米国大統領令", score: 72, status: "対応中" },
  { name: "AI事業者ガイドライン", score: 94, status: "準拠" },
  { name: "ISO 42001", score: 63, status: "対応中" },
]

function getScoreColor(score: number) {
  if (score >= 85) return { bar: "bg-success", glow: "var(--glow-success)", text: "text-success" }
  if (score >= 70) return { bar: "bg-warning", glow: "var(--glow-warning)", text: "text-warning" }
  return { bar: "bg-destructive", glow: "var(--glow-destructive)", text: "text-destructive" }
}

export function ComplianceOverview() {
  return (
    <div className="rounded-lg glass-card border-border/30 p-5 animate-slide-up-fade" style={{ animationDelay: "0.1s" }}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{"コンプライアンス状況"}</h3>
        <span className="text-xs text-primary cursor-pointer hover:underline transition-colors">{"詳細"}</span>
      </div>
      <div className="flex flex-col gap-4">
        {regulations.map((reg, index) => {
          const colors = getScoreColor(reg.score)
          return (
            <div
              key={reg.name}
              className="group flex flex-col gap-1.5 rounded-md px-2 py-1.5 -mx-2 transition-all duration-200 hover:bg-secondary/30 animate-slide-up-fade"
              style={{ animationDelay: `${(index + 2) * 0.08}s` }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">{reg.name}</span>
                <span className={cn("text-xs font-mono transition-colors duration-300", colors.text)}>
                  {reg.score}%
                </span>
              </div>
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700 ease-out",
                    colors.bar
                  )}
                  style={{
                    width: `${reg.score}%`,
                    boxShadow: `0 0 8px ${colors.glow}`,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
