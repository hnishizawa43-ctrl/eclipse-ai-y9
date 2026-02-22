"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { getProfile, updateProfile, addAuditEntry } from "@/lib/firestore"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  User,
  Bell,
  Key,
  Shield,
  Copy,
  RefreshCw,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils"

const settingsSections = [
  { id: "profile", label: "プロフィール", icon: User },
  { id: "notifications", label: "通知", icon: Bell },
  { id: "api", label: "APIキー", icon: Key },
  { id: "security", label: "セキュリティ", icon: Shield },
  { id: "danger", label: "デンジャーゾーン", icon: AlertTriangle },
]

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState("profile")

  const [displayName, setDisplayName] = useState(user?.displayName || "")
  const [organization, setOrganization] = useState("")
  const [role] = useState("管理者")

  const [notifCritical, setNotifCritical] = useState(true)
  const [notifWarning, setNotifWarning] = useState(true)
  const [notifInfo, setNotifInfo] = useState(false)
  const [notifEmail, setNotifEmail] = useState(true)
  const [notifSlack, setNotifSlack] = useState(false)
  const [notifWeekly, setNotifWeekly] = useState(false)

  const [apiKeys] = useState([
    { id: "key-1", name: "本番環境", key: "eclp_sk_prod_a1b2c3d4e5f6g7h8i9j0", created: "2026-01-15", lastUsed: "2026-02-22" },
    { id: "key-2", name: "ステージング", key: "eclp_sk_stg_k1l2m3n4o5p6q7r8s9t0", created: "2026-02-01", lastUsed: "2026-02-20" },
  ])
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({})

  const [twoFactor, setTwoFactor] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState("30")

  // Load profile from Firestore
  useEffect(() => {
    if (!user) return
    getProfile(user.uid).then((profile) => {
      if (!profile) return
      if (profile.displayName) setDisplayName(profile.displayName)
      if (profile.organization) setOrganization(profile.organization)
      setNotifCritical(profile.notifications?.critical ?? true)
      setNotifWarning(profile.notifications?.high ?? true)
      setNotifInfo(profile.notifications?.medium ?? false)
      setNotifEmail(profile.notifications?.email ?? true)
      setNotifSlack(profile.notifications?.slack ?? false)
      setNotifWeekly(profile.notifications?.weekly ?? false)
      setTwoFactor(profile.security?.twoFactor ?? false)
      setSessionTimeout(String(profile.security?.sessionTimeout ?? 30))
    }).catch(console.error)
  }, [user])

  const handleSaveProfile = async () => {
    if (!user) return
    try {
      await updateProfile(user.uid, { displayName, organization } as Record<string, unknown>)
      await addAuditEntry(user.uid, {
        action: "プロフィール更新",
        target: displayName || "プロフィール",
        actor: user.email || "ユーザー",
        timestamp: new Date().toLocaleString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).replace(/\//g, "-"),
        type: "system",
      })
      toast.success("プロフィールをFirestoreに保存しました")
    } catch {
      toast.error("保存に失敗しました")
    }
  }

  const handleSaveNotifications = async () => {
    if (!user) return
    try {
      await updateProfile(user.uid, {
        notifications: { critical: notifCritical, high: notifWarning, medium: notifInfo, low: false, email: notifEmail, slack: notifSlack, weekly: notifWeekly },
      } as Record<string, unknown>)
      toast.success("通知設定をFirestoreに保存しました")
    } catch {
      toast.error("保存に失敗しました")
    }
  }

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    toast.success("APIキーをクリップボードにコピーしました")
  }

  const handleRegenerateKey = (name: string) => {
    toast.success(`${name}のAPIキーを再生成しました`)
  }

  const handleSaveSecurity = async () => {
    if (!user) return
    try {
      await updateProfile(user.uid, {
        security: { twoFactor, sessionTimeout: parseInt(sessionTimeout) || 30 },
      } as Record<string, unknown>)
      toast.success("セキュリティ設定をFirestoreに保存しました")
    } catch {
      toast.error("保存に失敗しました")
    }
  }

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const maskKey = (key: string) => {
    return key.slice(0, 12) + "..." + key.slice(-4)
  }

  return (
    <main className="flex-1 overflow-auto">
      <DashboardHeader title="設定" description="アカウントとプラットフォームの設定を管理" />

      <div className="flex gap-0 min-h-[calc(100vh-65px)]">
        {/* Settings sidebar nav */}
        <nav className="w-56 shrink-0 border-r border-border p-4">
          <ul className="flex flex-col gap-1">
            {settingsSections.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    activeSection === section.id
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  <section.icon className="h-4 w-4 shrink-0" />
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Settings content */}
        <div className="flex-1 p-6 max-w-3xl">
          {/* Profile */}
          {activeSection === "profile" && (
            <div className="flex flex-col gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">{"プロフィール"}</CardTitle>
                  <CardDescription>{"アカウントの基本情報を編集します"}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                      {displayName ? displayName[0].toUpperCase() : user?.email?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{user?.email}</p>
                      <p className="text-xs text-muted-foreground">{"Firebase Auth UID: "}{user?.uid?.slice(0, 12)}...</p>
                    </div>
                  </div>

                  <Separator className="bg-border" />

                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="displayName" className="text-foreground">{"表示名"}</Label>
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="表示名を入力"
                        className="bg-secondary border-border text-foreground"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email" className="text-foreground">{"メールアドレス"}</Label>
                      <Input
                        id="email"
                        value={user?.email || ""}
                        disabled
                        className="bg-secondary/50 border-border text-muted-foreground"
                      />
                      <p className="text-xs text-muted-foreground">{"メールアドレスはFirebase Authで管理されています"}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="org" className="text-foreground">{"組織名"}</Label>
                        <Input
                          id="org"
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                          className="bg-secondary border-border text-foreground"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="role" className="text-foreground">{"ロール"}</Label>
                        <Input
                          id="role"
                          value={role}
                          disabled
                          className="bg-secondary/50 border-border text-muted-foreground"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleSaveProfile} className="bg-primary text-primary-foreground hover:bg-primary/90">
                      {"保存"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Notifications */}
          {activeSection === "notifications" && (
            <div className="flex flex-col gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">{"アラート通知"}</CardTitle>
                  <CardDescription>{"どの深刻度のアラートを受け取るか設定します"}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-destructive/20 text-destructive border-0 text-xs">{"重大"}</Badge>
                      <span className="text-sm text-foreground">{"重大なセキュリティ脅威"}</span>
                    </div>
                    <Switch checked={notifCritical} onCheckedChange={setNotifCritical} />
                  </div>
                  <Separator className="bg-border" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-warning/20 text-warning border-0 text-xs">{"警告"}</Badge>
                      <span className="text-sm text-foreground">{"中程度のリスク検出"}</span>
                    </div>
                    <Switch checked={notifWarning} onCheckedChange={setNotifWarning} />
                  </div>
                  <Separator className="bg-border" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-primary/20 text-primary border-0 text-xs">{"情報"}</Badge>
                      <span className="text-sm text-foreground">{"一般的な情報通知"}</span>
                    </div>
                    <Switch checked={notifInfo} onCheckedChange={setNotifInfo} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">{"通知チャネル"}</CardTitle>
                  <CardDescription>{"通知の配信先を設定します"}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{"メール通知"}</p>
                      <p className="text-xs text-muted-foreground">{user?.email || "未設定"}</p>
                    </div>
                    <Switch checked={notifEmail} onCheckedChange={setNotifEmail} />
                  </div>
                  <Separator className="bg-border" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{"Slack連携"}</p>
                      <p className="text-xs text-muted-foreground">{"#eclipse-alerts チャンネル"}</p>
                    </div>
                    <Switch checked={notifSlack} onCheckedChange={setNotifSlack} />
                  </div>
                  <Separator className="bg-border" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{"週次レポート"}</p>
                      <p className="text-xs text-muted-foreground">{"毎週月曜日にサマリーを送信"}</p>
                    </div>
                    <Switch checked={notifWeekly} onCheckedChange={setNotifWeekly} />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  {"保存"}
                </Button>
              </div>
            </div>
          )}

          {/* API Keys */}
          {activeSection === "api" && (
            <div className="flex flex-col gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">{"APIキー"}</CardTitle>
                  <CardDescription>{"外部システムとの連携に使用するAPIキーを管理します。キーは安全な場所に保管してください。"}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {apiKeys.map((apiKey) => (
                    <div key={apiKey.id} className="rounded-lg border border-border bg-secondary/30 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">{apiKey.name}</p>
                          <p className="text-xs text-muted-foreground">{"作成日: "}{apiKey.created}{" / 最終使用: "}{apiKey.lastUsed}</p>
                        </div>
                        <Badge variant="outline" className="border-success/30 text-success text-xs">{"有効"}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 rounded-md bg-background px-3 py-2 text-xs font-mono text-muted-foreground border border-border">
                          {visibleKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                        </code>
                        <button
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={visibleKeys[apiKey.id] ? "キーを隠す" : "キーを表示"}
                        >
                          {visibleKeys[apiKey.id] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                        <button
                          onClick={() => handleCopyKey(apiKey.key)}
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="コピー"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleRegenerateKey(apiKey.name)}
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="再生成"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">{"Webhook設定"}</CardTitle>
                  <CardDescription>{"イベント発生時に外部URLへ通知を送信します"}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="webhook-url" className="text-foreground">{"Webhook URL"}</Label>
                    <Input
                      id="webhook-url"
                      placeholder="https://your-service.com/webhook"
                      className="bg-secondary border-border text-foreground font-mono text-sm"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{"インシデント発生時に通知"}</p>
                      <p className="text-xs text-muted-foreground">{"新しいインシデント作成時にPOSTリクエストを送信"}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator className="bg-border" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{"スキャン完了時に通知"}</p>
                      <p className="text-xs text-muted-foreground">{"��弱性スキャン完了後にPOSTリクエストを送信"}</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={() => toast.success("Webhook設定を保存しました")}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {"保存"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Security */}
          {activeSection === "security" && (
            <div className="flex flex-col gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">{"認証設定"}</CardTitle>
                  <CardDescription>{"アカウントのセキュリティオプションを管理します"}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{"二要素認証 (2FA)"}</p>
                      <p className="text-xs text-muted-foreground">{"ログイン時に追加の認証コードを要求します"}</p>
                    </div>
                    <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
                  </div>
                  <Separator className="bg-border" />
                  <div className="grid gap-2">
                    <Label htmlFor="session-timeout" className="text-foreground">{"セッションタイムアウト（分）"}</Label>
                    <Input
                      id="session-timeout"
                      type="number"
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                      className="bg-secondary border-border text-foreground w-32"
                    />
                    <p className="text-xs text-muted-foreground">{"無操作時にセッションを自動終了するまでの時間"}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">{"ログイン履歴"}</CardTitle>
                  <CardDescription>{"最近のログインアクティビティ"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    {[
                      { device: "Chrome / macOS", ip: "192.168.1.10", time: "2026-02-22 14:30", current: true },
                      { device: "Safari / iOS", ip: "192.168.1.25", time: "2026-02-21 09:15", current: false },
                      { device: "Chrome / Windows", ip: "10.0.0.42", time: "2026-02-20 18:45", current: false },
                    ].map((session, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground">{session.device}</p>
                            {session.current && (
                              <Badge className="bg-success/20 text-success border-0 text-[10px]">{"現在のセッション"}</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{"IP: "}{session.ip}{" / "}{session.time}</p>
                        </div>
                        {!session.current && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-destructive text-xs"
                            onClick={() => toast.success("セッションを終了しました")}
                          >
                            {"終了"}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSaveSecurity} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  {"保存"}
                </Button>
              </div>
            </div>
          )}

          {/* Danger Zone */}
          {activeSection === "danger" && (
            <div className="flex flex-col gap-6">
              <Card className="border-destructive/30 bg-card">
                <CardHeader>
                  <CardTitle className="text-destructive flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    {"デンジャーゾーン"}
                  </CardTitle>
                  <CardDescription>{"以下の操作は取り消すことができません。十分注意してください。"}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{"全データのリセット"}</p>
                      <p className="text-xs text-muted-foreground">{"スキャン結果、インシデント、監査ログをすべて削除します"}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-destructive/50 text-destructive hover:bg-destructive/10"
                      onClick={() => toast.error("この操作は本番環境では無効です")}
                    >
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                      {"リセット"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{"アカウントの削除"}</p>
                      <p className="text-xs text-muted-foreground">{"アカウントと関連する全データを完全に削除します"}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-destructive/50 text-destructive hover:bg-destructive/10"
                      onClick={() => toast.error("この操作は本番環境では無効です")}
                    >
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                      {"削除"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
