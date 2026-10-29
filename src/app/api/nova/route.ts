import { NextRequest, NextResponse } from 'next/server'
import { matchKnowledge, NOVA_FALLBACK_ANSWER, suggestLessonFor } from '@/lib/nova/knowledge'

export const runtime = 'nodejs'
export const maxDuration = 30

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface CompletionShape {
  choices?: { message?: { content?: string } }[]
}

const SYSTEM_PROMPT = `You are NOVA, the learning assistant of ENTC NOVA — a smart learning platform for Electronics and Telecommunication Engineering (ENTC) students.

Your job: explain ENTC concepts clearly for beginners while staying technically accurate.

Rules:
- Use simple English, short paragraphs, and concrete worked examples with numbers where possible.
- Use Markdown: **bold** for key terms, bullet lists for enumerations, and fenced code blocks with the proper language tag for code (arduino, cpp, python, etc.).
- For circuit maths, show the formula first, then substitute values step by step.
- When the user seems stuck, give step-by-step hints rather than the full solution to homework-style problems.
- If asked about something unrelated to electronics, telecom, programming of embedded devices or physics basics, politely steer back to ENTC topics.
- Keep answers under ~350 words unless the user explicitly asks for depth.
- Never claim to control real hardware; all labs and simulations in the platform are software simulations.`

async function tryAiModel(messages: ChatMessage[]): Promise<string | null> {
  try {
    const { default: ZAI } = await import('z-ai-web-dev-sdk')
    const zai = await ZAI.create()
    const completion = (await Promise.race([
      zai.chat.completions.create({
        messages: [
          { role: 'assistant', content: SYSTEM_PROMPT },
          ...messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
        ],
        thinking: { type: 'disabled' },
      }),
      new Promise<null>((_, reject) => setTimeout(() => reject(new Error('AI timeout')), 20000)),
    ])) as CompletionShape | null

    const reply = completion?.choices?.[0]?.message?.content
    return reply && reply.trim().length > 0 ? reply.trim() : null
  } catch (err) {
    console.error('[nova-ai] AI model unavailable, using built-in fallback:', err)
    return null
  }
}

export async function POST(req: NextRequest) {
  let body: { messages?: ChatMessage[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const messages = Array.isArray(body.messages) ? body.messages : []
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.content?.trim()

  if (!lastUser) {
    return NextResponse.json({ error: 'No user message provided' }, { status: 400 })
  }
  if (lastUser.length > 2000) {
    return NextResponse.json({ error: 'Message too long (2000 character limit)' }, { status: 400 })
  }

  // 1) Try the real AI model through the server-side SDK (keys never reach the client).
  const aiReply = await tryAiModel(messages)
  if (aiReply) {
    return NextResponse.json({ reply: aiReply, source: 'ai' })
  }

  // 2) Fallback: deterministic built-in knowledge base (fully offline capable).
  const kb = matchKnowledge(lastUser)
  if (kb) {
    return NextResponse.json({
      reply: kb.answer,
      source: 'builtin',
      topic: kb.title,
    })
  }

  const lesson = suggestLessonFor(lastUser)
  const suffix = lesson
    ? `\n\n**Suggested next step:** open the lesson \u201C${lesson.title}\u201D in the Learn library \u2014 it covers exactly this.`
    : ''
  return NextResponse.json({
    reply: NOVA_FALLBACK_ANSWER + suffix,
    source: 'builtin',
    topic: 'General',
  })
}
