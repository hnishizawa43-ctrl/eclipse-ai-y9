/*
 * Firebase client configuration
 * Updated: force cache invalidation
 */

import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDZ5j6RbD-AINCWijE_2eTn8nW2GXV32GI",
  authDomain: "eclipse-84c3a.firebaseapp.com",
  projectId: "eclipse-84c3a",
  storageBucket: "eclipse-84c3a.firebasestorage.app",
  messagingSenderId: "768670029809",
  appId: "1:768670029809:web:d65a98e81b00ecfc535650",
  measurementId: "G-5RPNM74KFN",
}

let app: FirebaseApp | null = null
let auth: Auth | null = null
let firebaseError: string | null = null
const isFirebaseConfigured = true

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  auth = getAuth(app)
} catch (e: unknown) {
  const err = e as { code?: string; message?: string }
  console.error("Firebase init error:", err.code, err.message)
  firebaseError =
    err.code === "auth/invalid-api-key"
      ? "Firebase APIキーが無効です。正しいAPIキーを設定してください。"
      : `Firebase初期化エラー: ${err.message}`
  app = null
  auth = null
}

export { app, auth, isFirebaseConfigured, firebaseError }
