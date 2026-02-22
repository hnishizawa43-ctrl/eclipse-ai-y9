"use client"

import { useState } from "react"
import { Sparkles, X, Loader2, Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface AiAnalysisProps {
  context: string
  label?: string
}

export function AiAnalysis({ context, label = "AI分析" }: AiAnalysisProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState("")
  const [copied, setCopied] = useState(false)

  async function runAnalysis() {
    setOpen(true)
    setLoading(true)
    setResult("")

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context }),
      })
      if (!res.ok) throw new Error("Analysis failed")
      if (!res.body) throw new Error("No response body")

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        // Parse SSE data lines
        const lines = chunk.split("\n")
        for (const line of lines) {
          const trimmed = line.trim()
          if (trimmed.startsWith("0:")) {
            // AI SDK text stream protocol
            try {
              const text = JSON.parse(trimmed.slice(2))
              fullText += text
              setResult(fullText)
            } catch {
              // skip
            }
          }
        }
      }
    } catch {
      setResult("分析の実行中にエラーが発生しました。しばらくしてから再試行してください。")
      toast.error("AI分析に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(result)
    setCopied(true)
    toast.success("分析結果をコピーしました")
    setTimeout(() => setCopied(false), 2000)
  }

  if (!open) {
    return (
      <button
        onClick={runAnalysis}
        className="flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
      >
        <Sparkles className="h-3 w-3" />
        {label}
      </button>
    )
  }

  return (
    <div className="rounded-lg border border-primary/20 bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-primary/5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground">AI分析結果</span>
          {loading && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
        </div>
        <div className="flex items-center gap-1">
          {result && !loading && (
            <button
              onClick={handleCopy}
              className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
            </button>
          )}
          <button
            onClick={() => { setOpen(false); setResult("") }}
            className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
      <div className="p-4 max-h-64 overflow-y-auto">
        {result ? (
          <div className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">{result}</div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            データを分析中...
          </div>
        )}
      </div>
      {!loading && result && (
        <div className="px-4 pb-3">
          <button
            onClick={runAnalysis}
            className="text-[10px] text-primary hover:underline"
          >
            再分析する
          </button>
        </div>
      )}
    </div>
  )
}
