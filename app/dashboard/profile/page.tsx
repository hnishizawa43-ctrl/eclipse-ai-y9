"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Shield, Mail, Clock, KeyRound, CheckCircle } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth"

export default function ProfilePage() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.displayName || "")
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState("")

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const email = user?.email || ""
  const initials = (user?.displayName || user?.email?.split("@")[0] || "US").slice(0, 2).toUpperCase()
  const displayName = user?.displayName || user?.email?.split("@")[0] || "User"

  const handleSaveProfile = async () => {
    if (!user) return
    setIsSaving(true)
    setSaveSuccess(false)
    setSaveError("")

    try {
      await updateProfile(user, { displayName: name })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch {
      setSaveError("プロフィールの更新に失敗しました。")
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!user || !user.email) return
    setIsChangingPassword(true)
    setPasswordSuccess(false)
    setPasswordError("")

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword)
      await reauthenticateWithCredential(user, credential)
      await updatePassword(user, newPassword)
      setPasswordSuccess(true)
      setCurrentPassword("")
      setNewPassword("")
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string }
      if (firebaseErr.code === "auth/wrong-password" || firebaseErr.code === "auth/invalid-credential") {
        setPasswordError("現在のパスワードが正しくありません。")
      } else if (firebaseErr.code === "auth/weak-password") {
        setPasswordError("新しいパスワードは6文字以上にしてください。")
      } else {
        setPasswordError("パスワードの変更に失敗しました。")
      }
    } finally {
      setIsChangingPassword(false)
    }
  }

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
                {initials}
              </div>
              <div className="flex flex-col gap-1">
                <CardTitle className="text-lg">{displayName}</CardTitle>
                <CardDescription className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {email}
                </CardDescription>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {user?.emailVerified ? "認証済み" : "未認証"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Edit Profile */}
        <Card>
          <CardHeader>
            <CardTitle>プロフィール編集</CardTitle>
            <CardDescription>表示名を変更できます</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {saveSuccess && (
              <div className="flex items-center gap-2 rounded-md bg-success/10 px-3 py-2 text-sm text-success">
                <CheckCircle className="h-4 w-4" />
                プロフィールを更新しました。
              </div>
            )}
            {saveError && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {saveError}
              </div>
            )}
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
                disabled
                className="bg-secondary opacity-60"
              />
              <p className="text-xs text-muted-foreground">メールアドレスの変更はFirebaseコンソールから行えます</p>
            </div>
            <Button
              className="self-start mt-2"
              onClick={handleSaveProfile}
              disabled={isSaving}
            >
              {isSaving ? "保存中..." : "変更を保存"}
            </Button>
          </CardContent>
        </Card>

        {/* Security - Password Change */}
        <Card>
          <CardHeader>
            <CardTitle>セキュリティ</CardTitle>
            <CardDescription>パスワードの変更</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {passwordSuccess && (
              <div className="flex items-center gap-2 rounded-md bg-success/10 px-3 py-2 text-sm text-success">
                <CheckCircle className="h-4 w-4" />
                パスワードを変更しました。
              </div>
            )}
            {passwordError && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {passwordError}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="current-password">現在のパスワード</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-secondary"
                autoComplete="current-password"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-password">新しいパスワード</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-secondary"
                placeholder="6文字以上"
                autoComplete="new-password"
                minLength={6}
              />
            </div>
            <Button
              variant="outline"
              className="self-start mt-2"
              onClick={handleChangePassword}
              disabled={isChangingPassword || !currentPassword || !newPassword}
            >
              {isChangingPassword ? "変更中..." : "パスワードを変更"}
            </Button>
            <Separator className="my-2" />
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
              <Badge variant="secondary" className="text-xs">近日公開</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Activity */}
        <Card>
          <CardHeader>
            <CardTitle>アカウント情報</CardTitle>
            <CardDescription>Firebaseアカウントの詳細</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between rounded-md border border-border px-4 py-3">
                <div className="flex items-center gap-3">
                  <KeyRound className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">UID</p>
                    <p className="text-xs text-muted-foreground font-mono">{user?.uid || "-"}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border px-4 py-3">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">アカウント作成日</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.metadata.creationTime
                        ? new Date(user.metadata.creationTime).toLocaleDateString("ja-JP")
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border px-4 py-3">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">最終ログイン</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.metadata.lastSignInTime
                        ? new Date(user.metadata.lastSignInTime).toLocaleDateString("ja-JP", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
