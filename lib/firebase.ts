import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Check if Firebase config is available
const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

// Initialize Firebase only once and only if configured
let app: FirebaseApp | null = null
let auth: Auth | null = null
let firebaseError: string | null = null

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    auth = getAuth(app)
  } catch (e: unknown) {
    const err = e as { code?: string; message?: string }
    console.error("[v0] Firebase initialization failed:", err.code, err.message)
    firebaseError = err.code === "auth/invalid-api-key"
      ? "Firebase APIキーが無効です。正しいAPIキーを設定してください。"
      : `Firebase初期化エラー: ${err.message}`
    app = null
    auth = null
  }
} else {
  firebaseError = "Firebase環境変数が設定されていません。"
}

export { app, auth, isFirebaseConfigured, firebaseError }
