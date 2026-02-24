"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Bot, X, Send, Sparkles, Shield, AlertTriangle, FileCheck, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const quickActions = [
  { label: "現在の脅威状況は?", icon: AlertTriangle },
  { label: "脆弱性の対処法は?", icon: Shield },
  { label: "コンプライアンス改善策", icon: FileCheck },
  { label: "モデル監視のベストプラクティス", icon: Activity },
]

const knowledgeBase: { patterns: RegExp; response: string }[] = [
  {
    patterns: /脅威|threat|攻撃|attack/i,
    response: `## 現在の脅威状況サマリー

現在、以下の主要な脅威が検出されています:

- **プロンプトインジェクション攻撃** - GPT-4本番環境で高度な攻撃を検知。Unicodeエンコーディングバイパスが確認されています。
- **データ漏洩リスク** - カスタマーサポートBotでPII露出の可能性。出力モニタリングで検知済み。
- **敵対的入力** - Vision Model v2に対する敵対的サンプルのバイパス試行。

### 推奨アクション
1. 入力検証フィルターの強化（Unicodeエンコーディング対応）
2. 出力スキャンにPII検出パターンの追加
3. Vision Modelの敵対的学習データセットの更新`,
  },
  {
    patterns: /脆弱性|vuln|対処|fix|修正/i,
    response: `## 脆弱性対処の推奨事項

現在8件の脆弱性が検出されており、うち2件が重大（Critical）です。

### 優先対応すべき脆弱性
1. **VLN-001** (CVSS: 9.8) - システムプロンプト上書きインジェクション
   - 対処: 入力サニタイズの多層化、プロンプト境界の強化
2. **VLN-005** (CVSS: 9.1) - PII露出
   - 対処: 出力フィルターにNER (Named Entity Recognition) ベースの検出追加

### 中長期改善策
- Red Teamingの定期実施（月次推奨）
- モデルガードレールの自動テストパイプライン構築
- 脆弱性発見時の自動隔離フローの実装`,
  },
  {
    patterns: /コンプライアンス|compliance|準拠|規制|regulation/i,
    response: `## コンプライアンス改善ガイド

現在のコンプライアンススコア: **73%**（目標: 90%）

### 規制別ステータス
| 規制 | 準拠率 | 優先度 |
|------|--------|--------|
| EU AI Act | 68% | 高 |
| ISO 42001 | 75% | 中 |
| NIST AI RMF | 82% | 中 |

### 改善アクション（優先順）
1. **透明性レポートの自動生成** - EU AI Actの必須要件。自動レポーティング機能を実装することで+8%改善見込み。
2. **リスク評価プロセスの文書化** - ISO 42001要件。テンプレートを活用して効率化。
3. **バイアス監査の頻度向上** - 月次から週次に変更し、継続的モニタリングを実現。`,
  },
  {
    patterns: /モニタリング|監視|monitor|ベストプラクティス|best/i,
    response: `## AI監視のベストプラクティス

### リアルタイム監視の3本柱

**1. 入力監視**
- 異常な入力パターンの検出（レート・内容・パターン）
- プロンプトインジェクション試行のリアルタイム検知
- 地理的・時間的な異常アクセスの監視

**2. 出力品質監視**
- ハルシネーション率のしきい値モニタリング（推奨: 5%未満）
- PII/機密情報の出力スキャン
- バイアススコアの継続的追跡

**3. モデルパフォーマンス監視**
- ドリフト検出（入力・出力の分布変化）
- レイテンシーとスループットの追跡
- エラーレートの異常検知

### アラート設定の推奨
- Critical: 即座に通知（5秒以内）
- Warning: 5分以内に通知
- Info: 日次ダイジェストに集約`,
  },
  {
    patterns: /インシデント|incident|対応|response/i,
    response: `## インシデント対応フロー

### 現在のアクティブインシデント: 3件

**推奨対応フロー:**
1. **検知** - 自動モニタリングによる即座の検知
2. **トリアージ** - 深刻度に基づく優先度付け（15分以内）
3. **封じ込め** - 影響範囲の限定化（Critical: 30分以内）
4. **根本原因分析** - 攻撃ベクターの特定
5. **修復** - パッチ/フィルター適用
6. **事後レビュー** - 再発防止策の策定

### 重要な指標
- 平均検知時間 (MTTD): 4.2分
- 平均対応時間 (MTTR): 2.3時間
- インシデントクローズ率: 76%`,
  },
]

const defaultResponse = `ご質問ありがとうございます。Eclipse AIセキュリティプラットフォームのアドバイザーとして、以下の分野でサポートできます:

- **脅威分析** - 現在検出されている脅威の詳細と対策
- **脆弱性管理** - 脆弱性の優先度付けと対処方法
- **コンプライアンス** - 規制準拠の改善策
- **モニタリング** - 監視体制のベストプラクティス
- **インシデント対応** - 対応フローの最適化

具体的なトピックについてお聞きください。`

function getAIResponse(input: string): string {
  for (const entry of knowledgeBase) {
    if (entry.patterns.test(input)) {
      return entry.response
    }
  }
  return defaultResponse
}

interface AiChatProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AiChat({ open, onOpenChange }: AiChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Eclipse AI セキュリティアドバイザーです。脅威分析、脆弱性対策、コンプライアンス改善など、AIセキュリティに関するご質問にお答えします。\n\n以下のクイックアクションから始めるか、自由に質問してください。",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200)
    }
  }, [open])

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim() || isTyping) return

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMsg])
      setInput("")
      setIsTyping(true)

      setTimeout(() => {
        const response = getAIResponse(content)
        const assistantMsg: Message = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: response,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMsg])
        setIsTyping(false)
      }, 800 + Math.random() * 1200)
    },
    [isTyping]
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  if (!open) {
    return (
      <button
        onClick={() => onOpenChange(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
        aria-label="AIアドバイザーを開く"
      >
        <Bot className="h-6 w-6" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex h-[540px] w-[420px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/40">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">AI セキュリティアドバイザー</h3>
            <p className="text-[10px] text-success flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-success inline-block" />
              オンライン
            </p>
          </div>
        </div>
        <button
          onClick={() => onOpenChange(false)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground"
              )}
            >
              <div className="whitespace-pre-wrap break-words [&_h2]:text-xs [&_h2]:font-bold [&_h2]:mb-1.5 [&_h2]:mt-1 [&_h3]:text-xs [&_h3]:font-semibold [&_h3]:mb-1 [&_h3]:mt-2 [&_strong]:font-semibold [&_ul]:ml-3 [&_ul]:list-disc [&_ol]:ml-3 [&_ol]:list-decimal [&_li]:text-xs [&_li]:mb-0.5 [&_p]:text-xs [&_p]:mb-1">
                {msg.content.split("\n").map((line, i) => {
                  if (line.startsWith("## ")) {
                    return <h2 key={i}>{line.slice(3)}</h2>
                  }
                  if (line.startsWith("### ")) {
                    return <h3 key={i}>{line.slice(4)}</h3>
                  }
                  if (line.startsWith("- **")) {
                    const match = line.match(/^- \*\*(.+?)\*\*(.*)$/)
                    if (match) {
                      return (
                        <div key={i} className="flex gap-1 text-xs mb-0.5 ml-2">
                          <span className="text-muted-foreground">{">"}</span>
                          <span><strong>{match[1]}</strong>{match[2]}</span>
                        </div>
                      )
                    }
                  }
                  if (line.startsWith("- ")) {
                    return (
                      <div key={i} className="flex gap-1 text-xs mb-0.5 ml-2">
                        <span className="text-muted-foreground">{">"}</span>
                        <span>{line.slice(2)}</span>
                      </div>
                    )
                  }
                  if (/^\d+\./.test(line)) {
                    return <p key={i} className="text-xs mb-0.5 ml-2">{line}</p>
                  }
                  if (line.startsWith("|")) return null
                  if (line.trim() === "") return <br key={i} />
                  return <p key={i} className="text-xs mb-1">{line}</p>
                })}
              </div>
              <span className="text-[9px] text-muted-foreground mt-1 block opacity-60">
                {msg.timestamp.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-lg bg-secondary px-4 py-3">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-1.5 px-4 pb-2">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => sendMessage(action.label)}
              className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-2.5 py-1.5 text-[11px] text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
            >
              <action.icon className="h-3 w-3" />
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-border p-3">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="セキュリティについて質問..."
            className="flex-1 rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground disabled:opacity-40 hover:bg-primary/90 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
