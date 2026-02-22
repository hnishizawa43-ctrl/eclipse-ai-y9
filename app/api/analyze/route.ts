import { generateText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { type, data }: { type: "vulnerability" | "incident"; data: string } = await req.json()

  const prompts: Record<string, string> = {
    vulnerability: `あなたはAIセキュリティの専門家です。以下の脆弱性情報を分析し、日本語で簡潔に回答してください。

フォーマット:
**影響度**: （1行で説明）
**根本原因**: （1行で説明）
**推奨対策**: （箇条書き3つ以内）
**優先度**: Critical/High/Medium/Low

脆弱性情報:
${data}`,
    incident: `あなたはAIセキュリティのインシデント対応専門家です。以下のインシデント情報を分析し、日本語で簡潔に回答してください。

フォーマット:
**状況評価**: （1行で説明）
**推定原因**: （1行で説明）
**即時対応**: （箇条書き3つ以内）
**再発防止策**: （箇条書き2つ以内）

インシデント情報:
${data}`,
  }

  const result = await generateText({
    model: "openai/gpt-4o-mini",
    prompt: prompts[type] || prompts.vulnerability,
    abortSignal: req.signal,
  })

  return Response.json({ analysis: result.text })
}
