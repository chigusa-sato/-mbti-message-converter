import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // リクエストボディからメッセージとMBTIタイプを取得
    const { message, mbtiType } = await req.json();

    if (!message || !mbtiType) {
      return NextResponse.json({ error: 'メッセージとMBTIタイプは必須です' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json({ error: 'OpenAI APIキーが設定されていません' }, { status: 500 });
    }

    // OpenAI APIに送信するプロンプトを作成
    const prompt = `あなたはMBTIの専門家です。以下のメッセージを、相手のMBTIタイプである「${mbtiType}」の人が受け入れやすいように、その性格特性（例: ${mbtiType}の人は論理的、感情的、内向的、外向的など）を考慮して、より丁寧で効果的な表現に変換してください。必要に応じて絵文字を使用してください（必ずしもつける必要はありません）。変換後のメッセージのみを出力してください。\n\n元のメッセージ:\n"${message}"`;

    // OpenAI API を呼び出す
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7, // 生成されるテキストの創造性を調整 (0に近いほど決定的)
      max_tokens: 150, // 生成されるテキストの最大長
    });

    const convertedText = completion.choices[0]?.message?.content?.trim();

    if (!convertedText) {
        return NextResponse.json({ error: 'AIからの応答がありませんでした' }, { status: 500 });
    }

    // 変換後のメッセージをクライアントに返す
    return NextResponse.json({ convertedMessage: convertedText });

  } catch (error) {
    console.error("API Route Error:", error);
    const errorMessage = 'メッセージの変換中にエラーが発生しました';
    if (error instanceof Error) {
        // OpenAI APIからのエラーレスポンスなどを考慮
        // errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 