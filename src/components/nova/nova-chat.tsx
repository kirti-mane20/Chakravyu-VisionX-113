'use client'

import * as React from 'react'
import { Send, Sparkles, RotateCcw, TriangleAlert, Bot, User, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ALL_LESSONS, findLesson } from '@/lib/nova/content'
import { NOVA_SUGGESTED_PROMPTS } from '@/lib/nova/knowledge'
import { useNav } from '@/lib/nova/nav'
import { useProgress } from '@/lib/nova/store'
import { RichText } from './shared'
import { cn } from '@/lib/utils'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  source?: 'ai' | 'builtin'
  topic?: string
}

const GREETING: ChatMessage = {
  id: 'greeting',
  role: 'assistant',
  content: `Hi, I'm **NOVA** — your ENTC learning assistant.

Ask me anything about electronics and telecommunication: concepts, formulas, Arduino code, circuit debugging or exam-style practice. I give step-by-step hints rather than dumping answers, so you actually learn.

*Tip: pick a lesson as **topic context** below and I'll keep that material in mind.*`,
}

export function NovaChatView() {
  const go = useNav((s) => s.go)
  const recordNovaQuestion = useProgress((s) => s.recordNovaQuestion)
  const [messages, setMessages] = React.useState<ChatMessage[]>([GREETING])
  const [input, setInput] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [contextLessonId, setContextLessonId] = React.useState<string>('none')
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    setError(null)
    setInput('')
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content: trimmed }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setLoading(true)
    recordNovaQuestion()

    const contextLesson = contextLessonId !== 'none' ? findLesson(contextLessonId) : undefined

    try {
      const res = await fetch('/api/nova', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages
            .filter((m) => m.id !== 'greeting')
            .slice(-10)
            .map((m) => ({ role: m.role, content: m.content })),
          context: contextLesson
            ? `The student is currently studying the lesson "${contextLesson.title}" (${contextLesson.summary})`
            : undefined,
        }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(data?.error ?? `Request failed (${res.status})`)
      }
      const data = (await res.json()) as { reply: string; source: 'ai' | 'builtin'; topic?: string }
      setMessages((m) => [...m, { id: `a-${Date.now()}`, role: 'assistant', content: data.reply, source: data.source, topic: data.topic }])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setMessages([GREETING])
    setError(null)
  }

  const anyAiSource = messages.some((m) => m.source === 'ai')

  return (
    <div className="mx-auto flex h-[calc(100svh-4rem)] w-full max-w-4xl flex-col px-4 pb-4 pt-6 sm:px-6">
      {/* header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight sm:text-2xl">
              NOVA AI
              <Badge variant="outline" className={cn('text-[10px]', anyAiSource ? 'border-emerald-500/40 text-emerald-500' : 'border-cyan-accent/40 text-cyan-accent')}>
                {anyAiSource ? 'AI model connected' : 'Built-in knowledge demo'}
              </Badge>
            </h1>
            <p className="text-sm text-muted-foreground">Beginner-friendly ENTC explanations, hints and practice.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={contextLessonId} onValueChange={setContextLessonId}>
            <SelectTrigger className="h-9 w-[220px] text-xs" aria-label="Topic context">
              <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="Topic context" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No specific lesson</SelectItem>
              {ALL_LESSONS.map((l) => (
                <SelectItem key={l.id} value={l.id}>
                  {l.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={reset} aria-label="Clear conversation" title="Clear conversation">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* messages */}
      <div ref={scrollRef} className="scrollbar-thin mt-4 flex-1 space-y-4 overflow-y-auto rounded-xl border border-border/60 bg-card/40 p-4">
        {messages.map((m) => (
          <div key={m.id} className={cn('flex gap-2.5', m.role === 'user' && 'flex-row-reverse')}>
            <div
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-cyan-accent/15 text-cyan-accent'
              )}
            >
              {m.role === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
            </div>
            <div className={cn('max-w-[85%] sm:max-w-[75%]', m.role === 'user' && 'text-right')}>
              {m.role === 'assistant' && m.source && (
                <div className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                  {m.source === 'ai' ? 'NOVA · AI model' : `NOVA · built-in knowledge${m.topic && m.topic !== 'General' ? ` · ${m.topic}` : ''}`}
                </div>
              )}
              <div
                className={cn(
                  'inline-block rounded-2xl px-4 py-2.5 text-left',
                  m.role === 'user' ? 'bg-primary text-primary-foreground' : 'border border-border/60 bg-card'
                )}
              >
                {m.role === 'user' ? <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</p> : <RichText content={m.content} />}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-accent/15 text-cyan-accent">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-2xl border border-border/60 bg-card px-4 py-3">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-accent [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-accent [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-accent [animation-delay:300ms]" />
              <span className="ml-1.5 text-xs text-muted-foreground">NOVA is thinking…</span>
            </div>
          </div>
        )}

        {error && (
          <div className="fade-up mx-auto flex max-w-md items-start gap-2.5 rounded-lg border border-rose-500/30 bg-rose-500/5 px-3.5 py-3">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
            <div className="text-sm">
              <div className="font-medium">Message failed</div>
              <p className="text-muted-foreground">{error}</p>
              <Button size="sm" variant="outline" className="mt-2" onClick={() => messages.filter((m) => m.role === 'user').slice(-1)[0] && send(messages.filter((m) => m.role === 'user').slice(-1)[0].content)}>
                Retry
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* suggested prompts */}
      <div className="scrollbar-thin mt-3 flex gap-2 overflow-x-auto pb-1">
        {NOVA_SUGGESTED_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => send(p)}
            disabled={loading}
            className="shrink-0 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-50"
          >
            {p}
          </button>
        ))}
      </div>

      {/* input */}
      <form
        className="mt-3 flex items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              send(input)
            }
          }}
          placeholder="Ask about any ENTC concept… (Enter to send, Shift+Enter for a new line)"
          rows={2}
          className="max-h-32 min-h-[44px] resize-none"
          maxLength={2000}
          aria-label="Message to NOVA"
        />
        <Button type="submit" size="icon" className="h-[44px] w-[44px] shrink-0" disabled={loading || !input.trim()} aria-label="Send message">
          <Send className="h-4.5 w-4.5" />
        </Button>
      </form>
      <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
        Without an AI model configured, NOVA answers from a built-in educational knowledge base and clearly labels it.
        Answers are study guidance — always verify against your course material.
      </p>
    </div>
  )
}
