"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Shield, Scan, Activity, FileCheck, AlertTriangle, Zap, Lock, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

function useCountUp(end: number, duration: number = 2000, suffix: string = "") {
  const [value, setValue] = useState("0" + suffix)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const startTime = performance.now()
          const animate = (now: number) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            const current = Math.round(eased * end)
            setValue(current.toLocaleString() + suffix)
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end, duration, suffix])

  return { value, ref }
}

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  const stat1 = useCountUp(99, 2000, ".97%")
  const stat2 = useCountUp(1247, 2500)
  const stat3 = useCountUp(24, 1800)
  const stat4 = useCountUp(84, 2200, "%")

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <nav
        className="fixed top-0 z-50 w-full border-b transition-all duration-300"
        style={{
          borderColor: scrollY > 50 ? "var(--border)" : "transparent",
          backgroundColor: scrollY > 50 ? "rgba(13, 13, 26, 0.9)" : "transparent",
          backdropFilter: scrollY > 50 ? "blur(12px)" : "none",
        }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">Eclipse</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {"機能"}
            </a>
            <a href="#stats" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {"実績"}
            </a>
            <a href="#security" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {"セキュリティ"}
            </a>
          </div>
          <Link href="/login">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              ログイン
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center px-6 pt-16">

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-sm">
            <span className="inline-flex h-2 w-2 rounded-full bg-success" />
            <span className="text-muted-foreground">{"全システム稼働中"}</span>
          </div>

          <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-foreground">{"すべてのAIリスクを、"}</span>
            <br />
            <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              {"ここで制御する"}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {"Eclipse は企業のAIモデルを24時間体制で監視し、脆弱性検出、コンプライアンス管理、インシデント対応をひとつのプラットフォームに統合します。"}
          </p>



          {/* Dashboard preview */}
          <div className="relative mx-auto mt-16 max-w-3xl">
            <div className="overflow-hidden rounded-xl border border-border bg-card/80 p-1 shadow-2xl shadow-primary/5 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 border-b border-border px-3 py-2">
                <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-warning/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-success/60" />
                <span className="ml-2 text-xs text-muted-foreground font-mono">{"eclipse.app/dashboard"}</span>
              </div>
              <div className="grid grid-cols-4 gap-3 p-4">
                {[
                  { label: "保護モデル", val: "24", color: "bg-primary/10 text-primary" },
                  { label: "脅威ブロック", val: "1,247", color: "bg-chart-4/10 text-chart-4" },
                  { label: "稼働率", val: "99.97%", color: "bg-success/10 text-success" },
                  { label: "準拠率", val: "84%", color: "bg-chart-2/10 text-chart-2" },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg border border-border bg-secondary/50 p-3">
                    <div className="text-[10px] text-muted-foreground">{s.label}</div>
                    <div className={`mt-1 text-lg font-bold ${s.color.split(" ")[1]}`}>{s.val}</div>
                  </div>
                ))}
              </div>
              <div className="mx-4 mb-4 h-32 rounded-lg border border-border bg-secondary/30 flex items-end px-4 pb-4 gap-1">
                {[35, 52, 68, 45, 78, 62, 40, 55, 82, 48, 70, 58, 90, 42, 65, 75, 38, 85, 50, 72, 60, 88, 44, 76].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-primary/60"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="border-t border-border py-20">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
          {[
            { ref: stat1.ref, value: stat1.value, label: "システム稼働率" },
            { ref: stat2.ref, value: stat2.value, label: "脅威ブロック / 月" },
            { ref: stat3.ref, value: stat3.value, label: "監視中AIモデル" },
            { ref: stat4.ref, value: stat4.value, label: "コンプライアンス準拠" },
          ].map((s) => (
            <div key={s.label} ref={s.ref} className="text-center">
              <div className="text-3xl font-bold text-foreground sm:text-4xl">{s.value}</div>
              <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              {"AIセキュリティの全領域をカバー"}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
              {"脆弱性スキャンからリアルタイム監視、コンプライアンス管理まで。ひとつのプラットフォームですべてを管理します。"}
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Scan,
                title: "脆弱性スキャン",
                desc: "プロンプ��インジェクション、データ漏洩、敵対的攻撃、バイアス検出を自動でスキャン。CVSS準拠のスコアリングで優先度を明確化。",
              },
              {
                icon: Activity,
                title: "リアルタイム監視",
                desc: "AIモデルのリクエスト、レスポンス、異常パターンを24/7で監視。ドリフト検知やハルシネーション率のトラッキングも。",
              },
              {
                icon: FileCheck,
                title: "コンプライアンス管理",
                desc: "EU AI Act、NIST AI RMF、ISO 42001、内閣府AIガイドラインなど主要規制への準拠状況をダッシュボードで一元管理。",
              },
              {
                icon: AlertTriangle,
                title: "インシデント対応",
                desc: "セキュリティインシデントの検出から調査、解決までのワークフローを自動化。詳細なタイムラインで根本原因を迅速に特定。",
              },
              {
                icon: Lock,
                title: "アクセス制御",
                desc: "ロールベースのアクセス制御で、チーム内の権限を細かく管理。監査ログですべての操作を記録。",
              },
              {
                icon: Eye,
                title: "AI透明性レポート",
                desc: "モデルの意思決定プロセスを可視化。バイアス分析、公平性評価、説明可能性レポートを自動生成。",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group relative flex flex-col gap-4 rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:bg-card/80"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security / Trust */}
      <section id="security" className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                {"エンタープライズグレードの"}
                <br />
                {"セキュリティ基盤"}
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                {"SOC 2 Type II準拠のインフラストラクチャ上で動作し、お客様のデータを最高水準のセキュリティで保護します。"}
              </p>
              <div className="mt-8 flex flex-col gap-4">
                {[
                  "エンドツーエンド暗号化 (AES-256)",
                  "SOC 2 Type II 準拠",
                  "99.99% SLA保証",
                  "日本国内データセンター対応",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/10">
                      <Zap className="h-3.5 w-3.5 text-success" />
                    </div>
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="relative h-72 w-72 sm:h-80 sm:w-80">
                <div className="absolute inset-0 rounded-full border border-border/40" />
                <div className="absolute inset-6 rounded-full border border-primary/20" />
                <div className="absolute inset-12 rounded-full border border-chart-2/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                    <Shield className="h-10 w-10 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            {"AIリスク管理を、ここから始める"}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
            {"Eclipseは企業のAIモデルを包括的に保護するセキュリティ・ガバナンスプラットフォームです。"}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Eclipse</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {"&copy; 2026 Eclipse Inc. All rights reserved."}
          </p>
        </div>
      </footer>
    </div>
  )
}
