"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [slackNotifications, setSlackNotifications] = useState(false)
  const [autoScan, setAutoScan] = useState(true)
  const [darkMode, setDarkMode] = useState(true)

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="設定"
        description="システムとアカウントの設定を管理"
      />
      <div className="flex flex-col gap-6 p-6 max-w-3xl">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>プロフィール</CardTitle>
            <CardDescription>アカウント情報の管理</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">表示名</Label>
              <Input id="name" defaultValue="Eclipse Admin" className="bg-secondary" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input id="email" defaultValue="admin@eclipse-ai.com" className="bg-secondary" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="role">役割</Label>
              <Input id="role" defaultValue="管理者" disabled className="bg-secondary opacity-60" />
            </div>
            <Button className="self-start mt-2">変更を保存</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>通知設定</CardTitle>
            <CardDescription>通知の受信方法を設定</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <Label htmlFor="email-notif">メール通知</Label>
                <p className="text-xs text-muted-foreground">重要なアラートをメールで受信</p>
              </div>
              <Switch
                id="email-notif"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <Label htmlFor="slack-notif">Slack通知</Label>
                <p className="text-xs text-muted-foreground">SlackチャネルにアラートをPOST</p>
              </div>
              <Switch
                id="slack-notif"
                checked={slackNotifications}
                onCheckedChange={setSlackNotifications}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle>セキュリティ</CardTitle>
            <CardDescription>セキュリティスキャンと監視の設定</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <Label htmlFor="auto-scan">自動スキャン</Label>
                <p className="text-xs text-muted-foreground">新しいモデルをデプロイ時に自動でスキャン</p>
              </div>
              <Switch
                id="auto-scan"
                checked={autoScan}
                onCheckedChange={setAutoScan}
              />
            </div>
            <Separator />
            <div className="flex flex-col gap-2">
              <Label htmlFor="scan-interval">スキャン間隔</Label>
              <Input id="scan-interval" defaultValue="24" type="number" className="bg-secondary w-32" />
              <p className="text-xs text-muted-foreground">時間単位（次回の定期スキャンまでの間隔）</p>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle>外観</CardTitle>
            <CardDescription>UIの表示設定</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <Label htmlFor="dark-mode">ダークモード</Label>
                <p className="text-xs text-muted-foreground">暗いテーマを使用する</p>
              </div>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
