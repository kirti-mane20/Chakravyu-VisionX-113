'use client'

import * as React from 'react'
import { CheckCircle2, HelpCircle, Trophy, XCircle, RotateCcw, ArrowRight, Lightbulb } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { QuizQuestion, Difficulty } from '@/lib/nova/types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

// ─── Icons by name (explicit map, keeps bundle lean) ───────────────────────

import {
  Zap, Binary, Cpu, Radar, RadioTower, AudioWaveform, Network, Search, Code2, Puzzle,
  Home, Lock, Wifi, BookOpen, FlaskConical, Sparkles, Stethoscope, Swords, Lightbulb as Bulb,
  Gauge, Activity, Footprints, GraduationCap, Award, Target, Blocks, MessageCircle, type LucideIcon,
} from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  Zap, Binary, Cpu, Radar, RadioTower, AudioWaveform, Network, Search, Code2, Puzzle,
  Home, Lock, Wifi, BookOpen, FlaskConical, Sparkles, Stethoscope, Swords, Lightbulb: Bulb,
  Gauge, Activity, Footprints, GraduationCap, Award, Target, Blocks, MessageCircle,
}

export function NovaIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Zap
  return <Icon className={className} aria-hidden />
}

// ─── Small building blocks ──────────────────────────────────────────────────

export function PageHeader({
  title,
  subtitle,
  icon,
  actions,
}: {
  title: string
  subtitle?: string
  icon?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <NovaIcon name={icon} className="h-5 w-5" />
          </div>
        )}
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
          {subtitle && <p className="mt-0.5 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}

export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string
  value: React.ReactNode
  hint?: string
  icon?: string
}) {
  return (
    <Card className="border-border/60">
      <CardContent className="flex items-center gap-3 p-4">
        {icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <NovaIcon name={icon} className="h-4.5 w-4.5" />
          </div>
        )}
        <div className="min-w-0">
          <div className="text-lg font-semibold leading-tight">{value}</div>
          <div className="truncate text-xs text-muted-foreground">{label}</div>
          {hint && <div className="mt-0.5 truncate text-xs text-cyan-accent">{hint}</div>}
        </div>
      </CardContent>
    </Card>
  )
}

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  easy: 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
  medium: 'bg-amber-500/12 text-amber-600 dark:text-amber-400 border-amber-500/25',
  hard: 'bg-rose-500/12 text-rose-600 dark:text-rose-400 border-rose-500/25',
}

export function DifficultyBadge({ difficulty, className }: { difficulty: Difficulty; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize',
        DIFFICULTY_STYLES[difficulty],
        className
      )}
    >
      {difficulty}
    </span>
  )
}

export function EmptyState({
  icon = 'Search',
  title,
  description,
  action,
}: {
  icon?: string
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <NovaIcon name={icon} className="h-5 w-5" />
      </div>
      <h3 className="mt-3 text-sm font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

/** Technical term with an interactive tooltip. */
export function Term({ term, definition }: { term: string; definition: string }) {
  return (
    <TooltipProvider delayDuration={120}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex cursor-help items-center gap-1 border-b border-dotted border-cyan-accent/60 font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Definition of ${term}`}
          >
            {term}
            <HelpCircle className="h-3 w-3 text-cyan-accent" aria-hidden />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed">
          {definition}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// ─── Lightweight markdown renderer (chat + explanations) ────────────────────

export function RichText({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn('text-sm leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="my-2">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-2">
              {children}
            </a>
          ),
          ul: ({ children }) => <ul className="my-2 list-disc space-y-1 pl-5">{children}</ul>,
          ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>,
          li: ({ children }) => <li className="pl-0.5">{children}</li>,
          h1: ({ children }) => <h1 className="mt-4 mb-2 text-base font-semibold">{children}</h1>,
          h2: ({ children }) => <h2 className="mt-4 mb-2 text-base font-semibold">{children}</h2>,
          h3: ({ children }) => <h3 className="mt-3 mb-1.5 text-sm font-semibold">{children}</h3>,
          blockquote: ({ children }) => (
            <blockquote className="my-2 rounded-r-md border-l-2 border-cyan-accent/60 bg-cyan-accent/5 px-3 py-1.5 text-muted-foreground">
              {children}
            </blockquote>
          ),
          code: ({ className: cls, children, ...rest }) => {
            const isBlock = /language-/.test(cls ?? '')
            if (isBlock) {
              return (
                <code className={cn('block font-mono text-xs leading-relaxed', cls)} {...rest}>
                  {String(children).replace(/\n$/, '')}
                </code>
              )
            }
            return (
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12.5px] text-cyan-accent" {...rest}>
                {children}
              </code>
            )
          },
          pre: ({ children }) => (
            <pre className="scrollbar-thin my-2 overflow-x-auto rounded-lg border border-border/70 bg-muted/60 p-3">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="scrollbar-thin my-2 overflow-x-auto rounded-lg border border-border/70">
              <table className="w-full border-collapse text-xs">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-border/70 bg-muted/50 px-2.5 py-1.5 text-left font-semibold">{children}</th>
          ),
          td: ({ children }) => <td className="border-b border-border/50 px-2.5 py-1.5 align-top">{children}</td>,
          hr: () => <hr className="my-3 border-border/60" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

// ─── Reusable quiz engine ───────────────────────────────────────────────────

export interface QuizCardHandle {
  reset: () => void
}

export function QuizCard({
  questions,
  title = 'Knowledge check',
  onFinish,
  compact = false,
}: {
  questions: QuizQuestion[]
  title?: string
  onFinish?: (score: number, total: number) => void
  compact?: boolean
}) {
  const [index, setIndex] = React.useState(0)
  const [selected, setSelected] = React.useState<number | null>(null)
  const [score, setScore] = React.useState(0)
  const [finished, setFinished] = React.useState(false)

  const q = questions[index]
  const questionKey = questions.map((x) => x.id).join('|')

  React.useEffect(() => {
    setIndex(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
     
  }, [questionKey])

  if (questions.length === 0) return null

  const handleSelect = (i: number) => {
    if (selected !== null) return
    setSelected(i)
    if (i === q.correctIndex) setScore((s) => s + 1)
  }

  const handleNext = () => {
    if (index + 1 >= questions.length) {
      setFinished(true)
      onFinish?.(score, questions.length)
    } else {
      setIndex((i) => i + 1)
      setSelected(null)
    }
  }

  const handleRetry = () => {
    setIndex(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    const perfect = score === questions.length
    return (
      <Card className="fade-up border-border/60">
        <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-full',
              perfect ? 'bg-emerald-500/15 text-emerald-500' : pct >= 50 ? 'bg-primary/15 text-primary' : 'bg-amber-500/15 text-amber-500'
            )}
          >
            {perfect ? <Trophy className="h-6 w-6" /> : pct >= 50 ? <CheckCircle2 className="h-6 w-6" /> : <Lightbulb className="h-6 w-6" />}
          </div>
          <div>
            <div className="text-lg font-semibold">
              {score} / {questions.length} correct
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {perfect
                ? 'Perfect! You have mastered this check.'
                : pct >= 50
                  ? 'Good work \u2014 review the explanations below and try again for a perfect run.'
                  : 'Revisit the lesson sections above, then retry \u2014 repetition builds intuition.'}
            </p>
          </div>
          <Progress value={pct} className="h-2 w-full max-w-xs" />
          <Button variant="outline" size="sm" onClick={handleRetry} className="mt-1">
            <RotateCcw className="h-3.5 w-3.5" /> Retry quiz
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/60">
      <CardContent className={cn('p-4 sm:p-5', compact && 'p-4')}>
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Trophy className="h-4 w-4 text-cyan-accent" aria-hidden />
            {title}
          </div>
          <span className="text-xs text-muted-foreground">
            Question {index + 1} of {questions.length} · Score {score}
          </span>
        </div>
        <Progress value={((index + (selected !== null ? 1 : 0)) / questions.length) * 100} className="mb-4 h-1.5" />

        <p className="text-sm font-medium leading-relaxed">{q.question}</p>

        <div className="mt-3 grid gap-2">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.correctIndex
            const isSelected = i === selected
            const revealed = selected !== null
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleSelect(i)}
                disabled={revealed}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
                  !revealed && 'border-border/70 hover:border-primary/50 hover:bg-primary/5',
                  revealed && isCorrect && 'border-emerald-500/50 bg-emerald-500/10',
                  revealed && isSelected && !isCorrect && 'border-rose-500/50 bg-rose-500/10',
                  revealed && !isCorrect && !isSelected && 'border-border/50 opacity-60'
                )}
              >
                <span
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold',
                    revealed && isCorrect ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-border text-muted-foreground',
                    revealed && isSelected && !isCorrect && 'border-rose-500 bg-rose-500 text-white'
                  )}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{opt}</span>
                {revealed && isCorrect && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />}
                {revealed && isSelected && !isCorrect && <XCircle className="h-4 w-4 shrink-0 text-rose-500" />}
              </button>
            )
          })}
        </div>

        {selected !== null && (
          <div
            className={cn(
              'fade-up mt-3 rounded-lg border px-3 py-2.5 text-sm',
              selected === q.correctIndex
                ? 'border-emerald-500/30 bg-emerald-500/5'
                : 'border-amber-500/30 bg-amber-500/5'
            )}
          >
            <div className="flex items-center gap-1.5 font-medium">
              {selected === q.correctIndex ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Correct!
                </>
              ) : (
                <>
                  <XCircle className="h-3.5 w-3.5 text-rose-500" /> Not quite — here’s why:
                </>
              )}
            </div>
            <p className="mt-1 text-muted-foreground">{q.explanation}</p>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Button size="sm" onClick={handleNext} disabled={selected === null}>
            {index + 1 >= questions.length ? 'Finish quiz' : 'Next question'}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Simulated-data disclaimer chip (used across sims) ──────────────────────

export function SimBadge({ label = 'Simulation' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-cyan-accent/30 bg-cyan-accent/10 px-2 py-0.5 text-[11px] font-medium text-cyan-accent">
      <Activity className="h-3 w-3" aria-hidden />
      {label}
    </span>
  )
}

