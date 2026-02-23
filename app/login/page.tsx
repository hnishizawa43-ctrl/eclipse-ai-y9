"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Shield, Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { user, loading, login, loginWithGoogle, register } = useAuth()
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  const getFirebaseErrorMessage = (code: string) => {
    switch (code) {
      case "auth/invalid-email":
        return "メールアドレスの形式が正しくありません。"
      case "auth/user-disabled":
        return "このアカウントは無効化されています。"
      case "auth/user-not-found":
        return "アカウントが見つかりません。"
      case "auth/wrong-password":
        return "パスワードが正しくありません。"
      case "auth/invalid-credential":
        return "メールアドレスまたはパスワードが正しくありません。"
      case "auth/email-already-in-use":
        return "このメールアドレスは既に使用されています。"
      case "auth/weak-password":
        return "パスワードは6文字以上にしてください。"
      case "auth/too-many-requests":
        return "ログイン試行が多すぎます。しばらく待ってからお試しください。"
      default:
        return "認証エラーが発生しました。もう一度お試しください。"
    }
  }

  const handleGoogleLogin = async () => {
    setError("")
    setIsGoogleSubmitting(true)
    try {
      await loginWithGoogle()
      // signInWithRedirect will navigate away, no need to push
    } catch (err: unknown) {
      // Google login error
      const firebaseError = err as { code?: string; message?: string }
      if (firebaseError.code !== "auth/popup-closed-by-user") {
        setError(getFirebaseErrorMessage(firebaseError.code || ""))
      }
    } finally {
      setIsGoogleSubmitting(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      await login(email, password)
      router.push("/dashboard")
    } catch (err: unknown) {
      const firebaseError = err as { code?: string }
      setError(getFirebaseErrorMessage(firebaseError.code || ""))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    if (!displayName.trim()) {
      setError("表示名を入力してください。")
      setIsSubmitting(false)
      return
    }

    try {
      await register(email, password, displayName)
      router.push("/dashboard")
    } catch (err: unknown) {
      const firebaseError = err as { code?: string }
      setError(getFirebaseErrorMessage(firebaseError.code || ""))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show nothing while checking auth state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    )
  }

  // If already logged in, show nothing (will redirect)
  if (user) return null

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Eclipse</h1>
            <p className="text-sm text-muted-foreground mt-1">
              AI Security & Governance Platform
            </p>
          </div>
        </div>

        {/* Login / Register Card */}
        <Card>
          <Tabs defaultValue="login">
            <CardHeader className="pb-3">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">ログイン</TabsTrigger>
                <TabsTrigger value="register">新規登録</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* Login Tab */}
              <TabsContent value="login" className="mt-0">
                <div className="mb-4">
                  <CardTitle className="text-lg">ログイン</CardTitle>
                  <CardDescription>アカウントにサインインしてください</CardDescription>
                </div>
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="login-email">メールアドレス</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="admin@eclipse-ai.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-secondary"
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="login-password">パスワード</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="パスワードを入力"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-secondary pr-10"
                        autoComplete="current-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "パスワードを隠す" : "パスワードを表示"}
                        </span>
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                    {isSubmitting ? "ログイン中..." : "ログイン"}
                  </Button>
                </form>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">または</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleSubmitting}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  {isGoogleSubmitting ? "ログイン中..." : "Googleでログイン"}
                </Button>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="mt-0">
                <div className="mb-4">
                  <CardTitle className="text-lg">新規登録</CardTitle>
                  <CardDescription>アカウントを作成してください</CardDescription>
                </div>
                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="register-name">表示名</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Eclipse Admin"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="bg-secondary"
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="register-email">メールアドレス</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="admin@eclipse-ai.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-secondary"
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="register-password">パスワード</Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="6文字以上"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-secondary pr-10"
                        autoComplete="new-password"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "パスワードを隠す" : "パスワードを表示"}
                        </span>
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                    {isSubmitting ? "登録中..." : "アカウントを作成"}
                  </Button>
                </form>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">または</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleSubmitting}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  {isGoogleSubmitting ? "ログイン中..." : "Googleで登録"}
                </Button>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
