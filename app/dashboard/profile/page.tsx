"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Shield, Mail, Clock, KeyRound } from "lucide-react"
import { useEffect, useState } from "react"

export default function ProfilePage() {
  const [name, setName] = useState("Eclipse Admin")
  const [email, setEmail] = useState("admin@eclipse-ai.com")

  useEffect(() => {
    const auth = localStorage.getItem("eclipse-auth")
    if (auth) {
      try {
        const parsed = JSON.parse(auth)
        if (parsed.name) setName(parsed.name)
        if (parsed.email) setEmail(parsed.email)
      } catch {
        // ignore
      }
    }
  }, [])

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="プロフィール"
        description="アカウント情報と活動履歴"
      />
      <div className="flex flex-col gap-6 p-6 max-w-3xl">
        {/* User Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                {name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col gap-1">
                <CardTitle className="text-lg">{name}</CardTitle>
                <CardDescription className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {email}
                </CardDescription>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">管理者</Badge>
                  <Badge className="bg-success text-success-foreground text-xs">アクティブ</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Edit Profile */}
        <Card>
          <CardHeader>
            <CardTitle>プロフィール編集</CardTitle>
            <CardDescription>表示名やメールアドレスを変更できます</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="profile-name">表示名</Label>
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-secondary"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="profile-email">メールアドレス</Label>
              <Input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="profile-role">役割</Label>
              <Input
                id="profile-role"
                defaultValue="管理者"
                disabled
                className="bg-secondary opacity-60"
              />
            </div>
            <Button
              className="self-start mt-2"
              onClick={() => {
                localStorage.setItem("eclipse-auth", JSON.stringify({ email, name }))
              }}
            >
              変更を保存
            </Button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle>セキュリティ</CardTitle>
            <CardDescription>パスワードと認証の管理</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary">
                  <KeyRound className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">パスワード</p>
                  <p className="text-xs text-muted-foreground">最終変更: 30日前</p>
                </div>
              </div>
              <Button variant="outline" size="sm">変更</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">二要素認証</p>
                  <p className="text-xs text-muted-foreground">アカウントのセキュリティを強化</p>
                </div>
              </div>
              <Button variant="outline" size="sm">設定</Button>
            </div>
          </CardContent>
        </Card>

        {/* Activity */}
        <Card>
          <CardHeader>
            <CardTitle>最近の活動</CardTitle>
            <CardDescription>直近のアカウント操作</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {[
                { action: "ダッシュボードにログイン", time: "2分前", ip: "192.168.1.1" },
                { action: "セキュリティスキャンを実行", time: "1時間前", ip: "192.168.1.1" },
                { action: "コンプライアンスレポートを出力", time: "3時間前", ip: "192.168.1.1" },
                { action: "新しいモデルを登録", time: "昨日", ip: "10.0.0.5" },
              ].map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-md border border-border px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">IP: {activity.ip}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
