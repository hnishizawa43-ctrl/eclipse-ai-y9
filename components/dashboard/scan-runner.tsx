"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Shield, Play, CheckCircle2, Loader2, Sparkles, History } from "lucide-react"
import { cn } from "@/lib/utils"

const scanTypes = [
  { id: "injection", label: "プロンプトインジェクション", description: "プロンプトインジェクション脆弱性のテスト", icon: Shield },
  { id: "leakage", label: "データ漏洩", description: "PII及び学習データ露出のチェック", icon: Sparkles },
  { id: "adversarial", label: "敵対的攻撃", description: "敵対的ロバストネステストの実行", icon: Shield },
  { id: "bias", label: "バイアス検出", description: "出力の公平性とバイアスの分析", icon: Sparkles },
]

export function ScanRunner() {
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [selectedScans, setSelectedScans] = useState<string[]>(["injection", "leakage"])

  const toggleScan = (id: string) => {
    setSelectedScans(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const runScan = () => {
    setScanning(true)
    setProgress(0)
    setCompleted(false)
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setScanning(false)
            setCompleted(true)
          }, 500)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 300)
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4 sm:p-5 flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
            <Shield className="h-3.5 w-3.5 text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">スキャン実行</h3>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <History className="h-3 w-3" />
          <span>最終: 2時間前</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        {scanTypes.map((scan) => {
          const isSelected = selectedScans.includes(scan.id)
          return (
            <button
              key={scan.id}
              onClick={() => toggleScan(scan.id)}
              disabled={scanning}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-3 text-left transition-all",
                isSelected
                  ? "border-primary/50 bg-primary/5"
                  : "border-border bg-secondary/30 hover:bg-secondary/60",
                scanning && "opacity-60 cursor-not-allowed"
              )}
            >
              <div className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-colors",
                isSelected ? "bg-primary" : "bg-secondary border border-border"
              )}>
                {isSelected && <CheckCircle2 className="h-3 w-3 text-primary-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <span className={cn(
                  "text-xs font-medium block",
                  isSelected ? "text-foreground" : "text-muted-foreground"
                )}>{scan.label}</span>
                <span className="text-[10px] text-muted-foreground leading-tight block mt-0.5">{scan.description}</span>
              </div>
            </button>
          )
        })}
      </div>

      {scanning && (
        <div className="mb-4 rounded-lg bg-primary/5 border border-primary/20 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
              <span className="text-xs font-medium text-foreground">スキャン実行中...</span>
            </div>
            <span className="text-xs font-mono text-primary tabular-nums">{Math.min(100, Math.round(progress))}%</span>
          </div>
          <Progress value={Math.min(100, progress)} className="h-1.5 bg-secondary" />
          <p className="text-[10px] text-muted-foreground mt-2">
            {selectedScans.length}件のスキャンタイプを実行中
          </p>
        </div>
      )}

      {completed && !scanning && (
        <div className="mb-4 rounded-lg bg-success/5 border border-success/20 p-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
            <span className="text-xs font-medium text-success">スキャン完了</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            {selectedScans.length}件のスキャンが正常に完了しました
          </p>
        </div>
      )}

      <div className="mt-auto">
        <Button
          onClick={runScan}
          disabled={scanning || selectedScans.length === 0}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {scanning ? (
            <>
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              スキャン中...
            </>
          ) : (
            <>
              <Play className="mr-2 h-3.5 w-3.5" />
              {selectedScans.length > 0
                ? `${selectedScans.length}件のスキャンを開始`
                : "スキャンを選択してください"}
            </>
          )}
        </Button>
        {!scanning && selectedScans.length === 0 && (
          <p className="text-center text-[10px] text-muted-foreground mt-2">
            実行するスキャンタイプを選択してください
          </p>
        )}
      </div>
    </div>
  )
}
