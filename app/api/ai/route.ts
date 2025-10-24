import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { prompt, persona, history } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing OPENAI_API_KEY environment variable' }, { status: 500 });
    }

    const baseSystem = 'You are a mystical spirit speaking through a Ouija board. Reply in short, evocative phrases, stay in-character, avoid modern jargon. End with a brief, intriguing follow-up question.';
    const system = persona ? `${baseSystem} Persona: ${persona}` : baseSystem;

    const historyMessages = Array.isArray(history)
      ? history
          .filter((m: any) => m && typeof m.content === 'string' && (m.role === 'user' || m.role === 'assistant'))
          .map((m: any) => ({ role: m.role, content: m.content }))
      : [];

    const messages = [
      { role: 'system', content: system },
      ...historyMessages,
      { role: 'user', content: prompt }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.9,
        max_tokens: 200
      })
    });

    if (!response.ok) {
      let errText = '';
      try { errText = await response.text(); } catch {}
      console.error('OpenAI error:', errText || response.statusText);
      return NextResponse.json({ error: 'AI request failed', details: errText || undefined }, { status: 500 });
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content?.trim();

    return NextResponse.json({ text: text || 'The veil is unclear. Ask again.' });
  } catch (error: any) {
    console.error('AI route error:', error?.message || error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok' });
}