"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Shield, Play, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

const scanTypes = [
  { id: "injection", label: "プロンプトインジェクション", description: "プロンプトインジェクション脆弱性のテスト" },
  { id: "leakage", label: "データ漏洩", description: "PII及び学習データ露出のチェック" },
  { id: "adversarial", label: "敵対的攻撃", description: "敵対的ロバストネステストの実行" },
  { id: "bias", label: "バイアス検出", description: "出力の公平性とバイアスの分析" },
]

export function ScanRunner() {
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [selectedScans, setSelectedScans] = useState<string[]>(["injection", "leakage"])

  const toggleScan = (id: string) => {
    setSelectedScans(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const runScan = () => {
    setScanning(true)
    setProgress(0)
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setScanning(false), 500)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 300)
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <Shield className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">セキュリティスキャン実行</h3>
      </div>

      <div className="grid grid-cols-1 gap-2 mb-4 sm:grid-cols-2 sm:gap-3">
        {scanTypes.map((scan) => (
          <button
            key={scan.id}
            onClick={() => toggleScan(scan.id)}
            disabled={scanning}
            className={cn(
              "flex flex-col items-start gap-1 rounded-md border p-3 text-left transition-colors",
              selectedScans.includes(scan.id)
                ? "border-primary bg-primary/10"
                : "border-border bg-secondary/50 hover:border-border hover:bg-secondary"
            )}
          >
            <div className="flex items-center gap-2">
              {selectedScans.includes(scan.id) ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              ) : (
                <div className="h-3.5 w-3.5 rounded-full border border-muted-foreground" />
              )}
              <span className="text-xs font-medium text-foreground">{scan.label}</span>
            </div>
            <span className="text-[10px] text-muted-foreground pl-5.5">{scan.description}</span>
          </button>
        ))}
      </div>

      {scanning && (
        <div className="mb-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">スキャン実行中...</span>
            <span className="text-xs font-mono text-primary">{Math.min(100, Math.round(progress))}%</span>
          </div>
          <Progress value={Math.min(100, progress)} className="h-1.5 bg-secondary" />
        </div>
      )}

      <Button
        onClick={runScan}
        disabled={scanning || selectedScans.length === 0}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Play className="mr-2 h-3.5 w-3.5" />
        {scanning ? "スキャン中..." : "スキャン開始"}
      </Button>
    </div>
  )
}
