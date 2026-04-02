"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth"
import { auth, isFirebaseConfigured, firebaseError } from "@/lib/firebase"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  register: (email: string, password: string, displayName: string) => Promise<void>
  logout: () => Promise<void>
}

const googleProvider = new GoogleAuthProvider()

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      console.warn("[v0] Firebase not available, skipping auth listener")
      setLoading(false)
      return
    }

    getRedirectResult(auth).catch(() => {
      // Handle redirect error silently
    })

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const ensureAuth = () => {
    if (!auth) {
      const err = new Error(
        firebaseError || "Firebase is not configured."
      ) as Error & { code?: string }
      err.code = "auth/configuration-error"
      throw err
    }
    return auth
  }

  const login = async (email: string, password: string) => {
    const a = ensureAuth()
    await signInWithEmailAndPassword(a, email, password)
  }

  const loginWithGoogle = async () => {
    const a = ensureAuth()
    await signInWithRedirect(a, googleProvider)
  }

  const register = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    const a = ensureAuth()
    const credential = await createUserWithEmailAndPassword(a, email, password)
    await updateProfile(credential.user, { displayName })
  }

  const logout = async () => {
    const a = ensureAuth()
    await signOut(a)
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, loginWithGoogle, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
