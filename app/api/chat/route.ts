import { consumeStream, convertToModelMessages, streamText, UIMessage } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, context }: { messages: UIMessage[]; context?: string } = await req.json()

  const systemPrompt = `あなたは「Eclipse」AIセキュリティプラットフォームのAIアシスタントです。名前は「Eclipse AI」です。
日本語で回答してください。

あなたの専門分野:
- AIモデルのセキュリティ脆弱性の分析と修正提案
- プロンプトインジェクション、データ漏洩、敵対的攻撃、モデルバイアスの検出と対策
- EU AI Act、日本AI事業者ガイドライン、NIST AI RMF、ISO 42001等の規制コンプライアンス
- インシデント対応のベストプラクティス
- AIガバナンスとリスク管理

回答のスタイル:
- 簡潔かつ実用的に回答する
- 深刻度（Critical/High/Medium/Low）を明示する
- 具体的な対策手順を提示する
- 必要に応じてコード例を含める

${context ? `\n現在のコンテキスト情報:\n${context}` : ""}`

  const result = streamText({
    model: "openai/gpt-4o-mini",
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    consumeSseStream: consumeStream,
  })
}
