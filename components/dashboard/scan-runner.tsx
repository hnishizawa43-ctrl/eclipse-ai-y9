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

export interface ScanResult {
  id: string
  title: string
  model: string
  category: string
  severity: "critical" | "high" | "medium" | "low"
  status: "open" | "investigating"
  discoveredAt: string
  cvss: number
}

const newFindings: Record<string, ScanResult[]> = {
  injection: [
    { id: "VLN-NEW", title: "Unicode制御文字によるフィルター回避", model: "GPT-4 本番環境", category: "インジェクション", severity: "high", status: "open", discoveredAt: "", cvss: 8.4 },
    { id: "VLN-NEW", title: "マルチターン会話でのコンテキスト操作", model: "Claude-3 内部用", category: "インジェクション", severity: "medium", status: "open", discoveredAt: "", cvss: 6.3 },
  ],
  leakage: [
    { id: "VLN-NEW", title: "Few-shot例文からの個人情報推定", model: "カスタマーサポートBot", category: "プライバシー", severity: "critical", status: "open", discoveredAt: "", cvss: 9.3 },
  ],
  adversarial: [
    { id: "VLN-NEW", title: "微小摂動による分類結果反転", model: "Vision Model v2", category: "敵対的攻撃", severity: "high", status: "investigating", discoveredAt: "", cvss: 7.9 },
  ],
  bias: [
    { id: "VLN-NEW", title: "年齢属性に基づく出力スコア偏差", model: "採用評価AI", category: "公平性", severity: "medium", status: "investigating", discoveredAt: "", cvss: 5.8 },
  ],
}

interface ScanRunnerProps {
  onScanComplete: (results: ScanResult[]) => void
}

export function ScanRunner({ onScanComplete }: ScanRunnerProps) {
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [selectedScans, setSelectedScans] = useState<string[]>(["injection", "leakage"])
  const [foundCount, setFoundCount] = useState(0)

  const toggleScan = (id: string) => {
    setSelectedScans(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const runScan = () => {
    setScanning(true)
    setProgress(0)
    setCompleted(false)
    setFoundCount(0)

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)

          const now = new Date().toLocaleString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).replace(/\//g, "-")
          let counter = 1
          const results: ScanResult[] = []
          selectedScans.forEach(scanId => {
            const findings = newFindings[scanId] || []
            findings.forEach(f => {
              results.push({
                ...f,
                id: `VLN-${String(100 + counter).padStart(3, "0")}`,
                discoveredAt: now,
              })
              counter++
            })
          })

          setFoundCount(results.length)
          onScanComplete(results)

          setTimeout(() => {
            setScanning(false)
            setCompleted(true)
            setTimeout(() => setCompleted(false), 4000)
          }, 500)

          return 100
        }
        return prev + Math.random() * 12
      })
    }, 300)
  }

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Shield className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">セキュリティスキャン実行</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
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

      {completed && (
        <div className="mb-4 flex items-center gap-2 rounded-md border border-success/30 bg-success/10 p-3">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <span className="text-xs text-success">
            スキャン完了 - {foundCount}件の新しい脆弱性を検出しました
          </span>
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
