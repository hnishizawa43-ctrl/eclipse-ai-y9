import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
  Timestamp,
} from "firebase/firestore"
import { db } from "./firebase"

// ============================================================
// Types
// ============================================================

export interface Vulnerability {
  id: string
  title: string
  model: string
  category: string
  severity: "critical" | "high" | "medium" | "low"
  status: "open" | "mitigated" | "investigating"
  discoveredAt: string
  cvss: number
  isNew?: boolean
}

export interface TimelineEvent {
  time: string
  action: string
  actor: string
}

export interface Incident {
  id: string
  title: string
  description: string
  severity: "critical" | "high" | "medium" | "low"
  status: "open" | "investigating" | "resolved" | "closed"
  model: string
  assignee: string
  createdAt: string
  updatedAt: string
  timeline: TimelineEvent[]
}

export interface AuditEntry {
  id?: string
  action: string
  target: string
  actor: string
  timestamp: string
  type: "security" | "compliance" | "model" | "system"
}

export interface UserProfile {
  displayName: string
  organization: string
  email: string
  notifications: {
    critical: boolean
    high: boolean
    medium: boolean
    low: boolean
    email: boolean
    slack: boolean
    weekly: boolean
  }
  security: {
    twoFactor: boolean
    sessionTimeout: number
  }
}

// ============================================================
// Helpers for collections scoped to a user
// ============================================================

function userCol(uid: string, col: string) {
  return collection(db, "users", uid, col)
}

function userDoc(uid: string, col: string, docId: string) {
  return doc(db, "users", uid, col, docId)
}

function metaDoc(uid: string) {
  return doc(db, "users", uid, "meta", "seeded")
}

// ============================================================
// Seed Data
// ============================================================

const SEED_VULNERABILITIES: Vulnerability[] = [
  { id: "VLN-001", title: "システムプロンプト上書きによるインジェクション", model: "GPT-4 本番環境", category: "インジェクション", severity: "critical", status: "open", discoveredAt: "2026-02-21 09:15", cvss: 9.8 },
  { id: "VLN-002", title: "反復クエリによる学習データ抽出", model: "Claude-3 内部用", category: "データ漏洩", severity: "high", status: "investigating", discoveredAt: "2026-02-21 08:32", cvss: 8.2 },
  { id: "VLN-003", title: "モデル逆推論攻撃サーフェス検出", model: "レコメンド v3", category: "モデルセキュリティ", severity: "high", status: "mitigated", discoveredAt: "2026-02-20 22:10", cvss: 7.5 },
  { id: "VLN-004", title: "画像分類器における敵対的入力バイパス", model: "Vision Model v2", category: "敵対的攻撃", severity: "medium", status: "open", discoveredAt: "2026-02-20 16:45", cvss: 6.1 },
  { id: "VLN-005", title: "出力トークンにおけるPII露出", model: "カスタマーサポートBot", category: "プライバシー", severity: "critical", status: "investigating", discoveredAt: "2026-02-20 14:20", cvss: 9.1 },
  { id: "VLN-006", title: "ハルシネーション率が閾値を超過", model: "法務文書AI", category: "信頼性", severity: "medium", status: "open", discoveredAt: "2026-02-20 11:05", cvss: 5.4 },
  { id: "VLN-007", title: "意思決定出力におけるバイアス検出", model: "採用評価AI", category: "公平性", severity: "high", status: "investigating", discoveredAt: "2026-02-19 18:30", cvss: 7.8 },
  { id: "VLN-008", title: "エンコーディング経由のジェイルブレイク", model: "GPT-4 本番環境", category: "インジェクション", severity: "low", status: "mitigated", discoveredAt: "2026-02-19 09:00", cvss: 3.2 },
]

const SEED_INCIDENTS: Incident[] = [
  {
    id: "INC-2026-047", title: "本番LLMに対する重大プロンプトインジェクション攻撃",
    description: "GPT-4本番エンドポイントを標的とした高度なプロンプトインジェクション攻撃が検出されました。攻撃はシステムプロンプトと内部指示の抽出を試みました。",
    severity: "critical", status: "investigating", model: "GPT-4 本番環境", assignee: "セキュリティチーム",
    createdAt: "2026-02-21 09:12", updatedAt: "2026-02-21 10:45",
    timeline: [
      { time: "09:12", action: "自動モニタリングによりインシデント検知", actor: "システム" },
      { time: "09:14", action: "セキュリティチームにアラート送信", actor: "システム" },
      { time: "09:20", action: "調査開始", actor: "セキュリティチーム" },
      { time: "09:45", action: "攻撃ベクター特定: Unicodeエンコーディングバイパス", actor: "セキュリティチーム" },
      { time: "10:15", action: "一時的な入力フィルターを展開", actor: "セキュリティチーム" },
      { time: "10:45", action: "根本原因分析を進行中", actor: "セキュリティチーム" },
    ],
  },
  {
    id: "INC-2026-046", title: "カスタマーサポートBotでPIIデータ漏洩",
    description: "定期モニタリング中にモデル出力から顧客PIIが検出されました。",
    severity: "high", status: "resolved", model: "カスタマーサポートBot", assignee: "データプライバシーチーム",
    createdAt: "2026-02-20 14:30", updatedAt: "2026-02-21 08:00",
    timeline: [
      { time: "14:30", action: "出力モニタリングでPIIを検出", actor: "システム" },
      { time: "14:35", action: "モデル出力を一時制限", actor: "システム" },
      { time: "15:00", action: "データプライバシーチームに通知", actor: "システム" },
      { time: "16:30", action: "PIIパターン検出用の出力フィルター更新", actor: "データプライバシーチーム" },
      { time: "08:00", action: "修正を検証しモデル復旧", actor: "データプライバシーチーム" },
    ],
  },
  {
    id: "INC-2026-045", title: "レコメンドエンジンでモデルドリフト検出",
    description: "レコメンドモデルで顕著な出力分布のシフトが検出されました。",
    severity: "medium", status: "open", model: "レコメンド v3", assignee: "MLエンジニアリング",
    createdAt: "2026-02-20 11:00", updatedAt: "2026-02-20 11:00",
    timeline: [
      { time: "11:00", action: "ドリフトスコアが閾値超過 (0.18 > 0.10)", actor: "システム" },
      { time: "11:05", action: "MLエンジニアリングにアラート送信", actor: "システム" },
    ],
  },
  {
    id: "INC-2026-044", title: "不正APIアクセス試行",
    description: "不明なIPレンジから内部LLMゲートウェイへの複数の不正アクセス試行が検出されました。",
    severity: "high", status: "closed", model: "内部LLMゲートウェイ", assignee: "セキュリティチーム",
    createdAt: "2026-02-19 22:15", updatedAt: "2026-02-20 09:30",
    timeline: [
      { time: "22:15", action: "異常アクセスパターンを検知", actor: "システム" },
      { time: "22:16", action: "IPレンジを自動ブロック", actor: "システム" },
      { time: "22:30", action: "セキュリティチームにアラート", actor: "システム" },
      { time: "09:00", action: "調査完了 - ブルートフォース試行と確認", actor: "セキュリティチーム" },
      { time: "09:30", action: "IPブラックリスト更新、インシデントクローズ", actor: "セキュリティチーム" },
    ],
  },
  {
    id: "INC-2026-043", title: "採用AIでバイアススコア閾値超過",
    description: "週次公平性監査で、採用評価AIが性別に関連する意思決定パターンで統計的に有意なバイアスを示しました。",
    severity: "high", status: "investigating", model: "採用評価AI", assignee: "倫理チーム",
    createdAt: "2026-02-19 16:00", updatedAt: "2026-02-20 14:00",
    timeline: [
      { time: "16:00", action: "週次公平性監査でバイアスパターン検出", actor: "システム" },
      { time: "16:10", action: "モデルを本番から一時停止", actor: "システム" },
      { time: "17:00", action: "倫理チームによるレビュー開始", actor: "倫理チーム" },
      { time: "14:00", action: "バイアス除去データセットでの再学習進行中", actor: "倫理チーム" },
    ],
  },
]

const SEED_AUDIT: AuditEntry[] = [
  { action: "脆弱性スキャン実行", target: "GPT-4 本番環境", actor: "セキュリティチーム", timestamp: "2026-02-21 10:30", type: "security" },
  { action: "コンプライアンスレポート生成", target: "EU AI Act", actor: "コンプライアンス部門", timestamp: "2026-02-21 09:00", type: "compliance" },
  { action: "モデルバージョン更新", target: "レコメンド v3 → v3.1", actor: "MLエンジニアリング", timestamp: "2026-02-20 18:45", type: "model" },
  { action: "アクセス権限変更", target: "内部LLMゲートウェイ", actor: "セキュリティチーム", timestamp: "2026-02-20 16:30", type: "security" },
  { action: "インシデント対応完了", target: "INC-2026-044", actor: "セキュリティチーム", timestamp: "2026-02-20 09:30", type: "security" },
  { action: "バイアス監査実施", target: "採用評価AI", actor: "倫理チーム", timestamp: "2026-02-19 16:00", type: "compliance" },
  { action: "システムバックアップ完了", target: "全サービス", actor: "システム", timestamp: "2026-02-19 03:00", type: "system" },
  { action: "新規モデル登録", target: "法務文書AI v1.2", actor: "MLエンジニアリング", timestamp: "2026-02-18 14:15", type: "model" },
]

// ============================================================
// Seed function
// ============================================================

export async function seedIfNeeded(uid: string) {
  const snap = await getDoc(metaDoc(uid))
  if (snap.exists()) return false // already seeded

  const batch = writeBatch(db)

  // vulnerabilities
  SEED_VULNERABILITIES.forEach((v) => {
    batch.set(userDoc(uid, "vulnerabilities", v.id), v)
  })

  // incidents
  SEED_INCIDENTS.forEach((inc) => {
    batch.set(userDoc(uid, "incidents", inc.id), inc)
  })

  // audit log
  SEED_AUDIT.forEach((entry, i) => {
    batch.set(doc(userCol(uid, "audit"), `seed-${i}`), entry)
  })

  // default profile
  batch.set(userDoc(uid, "profile", "main"), {
    displayName: "",
    organization: "",
    notifications: { critical: true, high: true, medium: false, low: false, email: true, slack: false, weekly: false },
    security: { twoFactor: false, sessionTimeout: 30 },
  })

  // mark as seeded
  batch.set(metaDoc(uid), { seeded: true, createdAt: serverTimestamp() })

  await batch.commit()
  return true
}

// ============================================================
// Vulnerabilities CRUD
// ============================================================

export async function getVulnerabilities(uid: string): Promise<Vulnerability[]> {
  const snap = await getDocs(query(userCol(uid, "vulnerabilities")))
  return snap.docs.map((d) => d.data() as Vulnerability)
}

export async function addVulnerability(uid: string, vuln: Vulnerability) {
  await setDoc(userDoc(uid, "vulnerabilities", vuln.id), vuln)
}

export async function addVulnerabilities(uid: string, vulns: Vulnerability[]) {
  const batch = writeBatch(db)
  vulns.forEach((v) => batch.set(userDoc(uid, "vulnerabilities", v.id), v))
  await batch.commit()
}

// ============================================================
// Incidents CRUD
// ============================================================

export async function getIncidents(uid: string): Promise<Incident[]> {
  const snap = await getDocs(query(userCol(uid, "incidents")))
  return snap.docs.map((d) => d.data() as Incident)
}

export async function updateIncident(uid: string, incidentId: string, data: Partial<Incident>) {
  await updateDoc(userDoc(uid, "incidents", incidentId), data as Record<string, unknown>)
}

// ============================================================
// Audit Log CRUD
// ============================================================

export async function getAuditLog(uid: string): Promise<AuditEntry[]> {
  const snap = await getDocs(query(userCol(uid, "audit")))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AuditEntry))
}

export async function addAuditEntry(uid: string, entry: Omit<AuditEntry, "id">) {
  await addDoc(userCol(uid, "audit"), entry)
}

// ============================================================
// Profile CRUD
// ============================================================

export async function getProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(userDoc(uid, "profile", "main"))
  return snap.exists() ? (snap.data() as UserProfile) : null
}

export async function updateProfile(uid: string, data: Partial<UserProfile>) {
  await updateDoc(userDoc(uid, "profile", "main"), data as Record<string, unknown>)
}
