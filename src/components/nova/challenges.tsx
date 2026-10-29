'use client'

import * as React from 'react'
import {
  ArrowLeft, ArrowRight, Play, Timer, Trophy, CheckCircle2, XCircle, RotateCcw,
  ListChecks, BookOpen, Target,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { useNav } from '@/lib/nova/nav'
import { useProgress } from '@/lib/nova/store'
import { CHALLENGE_CATEGORIES, CHALLENGE_QUESTIONS } from '@/lib/nova/challenges'
import { findLesson } from '@/lib/nova/content'
import { NovaIcon, PageHeader, DifficultyBadge } from './shared'
import { cn } from '@/lib/utils'
import type { ChallengeCategory, ChallengeQuestion, Difficulty } from '@/lib/nova/types'

type Phase = 'hub' | 'running' | 'results'

const TIME_PER_QUESTION = 25 // seconds in timed mode

// ─── Hub ────────────────────────────────────────────────────────────────────

function Hub({ onStart }: { onStart: (categoryId: string | 'mixed', difficulty: Difficulty | 'mixed', timed: boolean) => void }) {
  const [category, setCategory] = React.useState<string | 'mixed'>('mixed')
  const [difficulty, setDifficulty] = React.useState<Difficulty | 'mixed'>('mixed')
  const [timed, setTimed] = React.useState(false)

  const pool = CHALLENGE_QUESTIONS.filter(
    (q) => (category === 'mixed' || q.categoryId === category) && (difficulty === 'mixed' || q.difficulty === difficulty)
  )

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-10 pt-6 sm:px-6">
      <PageHeader
        title="Challenge Arena"
        subtitle="Prove your skills across digital logic, electronics theory, component ID, Arduino code and circuit puzzles. Every answer gets instant feedback and an explanation."
        icon="Swords"
      />

      <Card className="mt-5 border-border/60">
        <CardContent className="p-4 sm:p-5">
          <div className="text-sm font-semibold">Session setup</div>
          <div className="mt-3 grid gap-4 lg:grid-cols-2">
            <div>
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Category</div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCategory('mixed')}
                  className={cn(
                    'rounded-lg border px-3 py-1.5 text-sm transition-colors',
                    category === 'mixed' ? 'border-primary bg-primary text-primary-foreground' : 'border-border/60 text-muted-foreground hover:text-foreground'
                  )}
                >
                  Mixed
                </button>
                {CHALLENGE_CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={cn(
                      'rounded-lg border px-3 py-1.5 text-sm transition-colors',
                      category === c.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border/60 text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {c.title}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Difficulty</div>
              <div className="flex flex-wrap gap-2">
                {(['mixed', 'easy', 'medium', 'hard'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={cn(
                      'rounded-lg border px-3 py-1.5 text-sm capitalize transition-colors',
                      difficulty === d ? 'border-primary bg-primary text-primary-foreground' : 'border-border/60 text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex items-center gap-2.5 text-sm">
              <Switch checked={timed} onCheckedChange={setTimed} aria-label="Timed mode" />
              <Timer className="h-4 w-4 text-cyan-accent" />
              Timed mode
              <span className="text-xs text-muted-foreground">({TIME_PER_QUESTION}s per question)</span>
            </label>
            <Button onClick={() => onStart(category, difficulty, timed)} disabled={pool.length === 0}>
              <Play className="h-4 w-4" /> Start session · {pool.length} question{pool.length === 1 ? '' : 's'}
            </Button>
          </div>
          {pool.length === 0 && (
            <p className="mt-2 text-xs text-rose-500">No questions match this combination — try another filter.</p>
          )}
        </CardContent>
      </Card>

      {/* categories overview */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CHALLENGE_CATEGORIES.map((c: ChallengeCategory) => {
          const count = CHALLENGE_QUESTIONS.filter((q) => q.categoryId === c.id).length
          const best = undefined
          return (
            <Card key={c.id} className="border-border/60">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <NovaIcon name={c.icon} className="h-4.5 w-4.5" />
                  </div>
                  <Badge variant="secondary">{count} questions</Badge>
                </div>
                <div className="mt-2.5 font-semibold">{c.title}</div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{c.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// ─── Session runner ─────────────────────────────────────────────────────────

interface SessionSpec {
  categoryId: string | 'mixed'
  difficulty: Difficulty | 'mixed'
  timed: boolean
  questions: ChallengeQuestion[]
}

function Runner({ spec, onExit }: { spec: SessionSpec; onExit: () => void }) {
  const recordChallengeSession = useProgress((s) => s.recordChallengeSession)
  const [index, setIndex] = React.useState(0)
  const [selected, setSelected] = React.useState<number | null>(null)
  const [timedOut, setTimedOut] = React.useState(false)
  const [answers, setAnswers] = React.useState<(number | null)[]>(() => spec.questions.map(() => null))
  const [score, setScore] = React.useState(0)
  const [phase, setPhase] = React.useState<'question' | 'results'>('question')
  const [timeLeft, setTimeLeft] = React.useState(TIME_PER_QUESTION)

  const q = spec.questions[index]
  const finishedRef = React.useRef(false)

  // countdown
  React.useEffect(() => {
    if (!spec.timed || phase !== 'question' || selected !== null) return
    setTimeLeft(TIME_PER_QUESTION)
    const started = Date.now()
    const iv = setInterval(() => {
      const elapsed = (Date.now() - started) / 1000
      const left = Math.max(0, TIME_PER_QUESTION - elapsed)
      setTimeLeft(left)
      if (left <= 0) {
        clearInterval(iv)
        setSelected(-1) // timeout
        setTimedOut(true)
      }
    }, 100)
    return () => clearInterval(iv)
  }, [index, spec.timed, phase, selected])

  const handleSelect = (i: number) => {
    if (selected !== null) return
    setSelected(i)
    setAnswers((a) => {
      const next = [...a]
      next[index] = i
      return next
    })
    if (i === q.correctIndex) setScore((s) => s + 1)
  }

  const next = () => {
    if (index + 1 >= spec.questions.length) {
      setPhase('results')
    } else {
      setIndex((i) => i + 1)
      setSelected(null)
      setTimedOut(false)
    }
  }

  React.useEffect(() => {
    if (phase === 'results' && !finishedRef.current) {
      finishedRef.current = true
      recordChallengeSession({
        categoryId: spec.categoryId as never,
        difficulty: spec.difficulty,
        score,
        total: spec.questions.length,
        timed: spec.timed,
      })
      if (score === spec.questions.length) toast.success('Perfect session!')
    }
     
  }, [phase])

  if (phase === 'results') {
    return <Results spec={spec} answers={answers} score={score} onExit={onExit} />
  }

  const revealed = selected !== null
  const isCorrect = selected === q.correctIndex
  const pctTime = (timeLeft / TIME_PER_QUESTION) * 100

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-10 pt-6 sm:px-6">
      <div className="flex items-center justify-between gap-2">
        <Button variant="ghost" size="sm" onClick={onExit}>
          <ArrowLeft className="h-4 w-4" /> Leave session
        </Button>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {spec.timed && (
            <Badge variant="outline" className={cn('gap-1', timeLeft <= 7 && 'border-rose-500/50 text-rose-500')}>
              <Timer className="h-3 w-3" /> {timeLeft.toFixed(0)}s
            </Badge>
          )}
          <span>
            Question {index + 1} / {spec.questions.length} · score {score}
          </span>
        </div>
      </div>
      <Progress value={((index + (revealed ? 1 : 0)) / spec.questions.length) * 100} className="mt-3 h-1.5" />
      {spec.timed && !revealed && (
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
          <div
            className={cn('h-full transition-none', pctTime > 30 ? 'bg-cyan-accent' : 'bg-rose-500')}
            style={{ width: `${pctTime}%` }}
          />
        </div>
      )}

      <Card className="mt-4 border-border/60">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {CHALLENGE_CATEGORIES.find((c) => c.id === q.categoryId)?.title ?? q.categoryId}
            </Badge>
            <DifficultyBadge difficulty={q.difficulty} />
          </div>

          {q.code && (
            <pre className="scrollbar-thin mt-3 overflow-x-auto rounded-lg border border-border/70 bg-muted/60 p-3 font-mono text-xs leading-relaxed">
              {q.code}
            </pre>
          )}

          <p className="mt-3 text-[15px] font-medium leading-relaxed">{q.prompt}</p>

          <div className="mt-4 grid gap-2">
            {q.options.map((opt, i) => {
              const isRight = i === q.correctIndex
              const isPicked = i === selected
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={revealed}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-left text-sm transition-colors',
                    !revealed && 'border-border/70 hover:border-primary/50 hover:bg-primary/5',
                    revealed && isRight && 'border-emerald-500/50 bg-emerald-500/10',
                    revealed && isPicked && !isRight && 'border-rose-500/50 bg-rose-500/10',
                    revealed && !isRight && !isPicked && 'border-border/50 opacity-60'
                  )}
                >
                  <span
                    className={cn(
                      'flex h-5.5 w-5.5 h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold',
                      revealed && isRight && 'border-emerald-500 bg-emerald-500 text-white',
                      revealed && isPicked && !isRight && 'border-rose-500 bg-rose-500 text-white',
                      !(revealed && (isRight || isPicked)) && 'border-border text-muted-foreground'
                    )}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1">{opt}</span>
                  {revealed && isRight && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />}
                  {revealed && isPicked && !isRight && <XCircle className="h-4 w-4 shrink-0 text-rose-500" />}
                </button>
              )
            })}
          </div>

          {timedOut && (
            <div className="fade-up mt-3 rounded-lg border border-rose-500/30 bg-rose-500/5 px-3.5 py-2.5 text-sm">
              <div className="flex items-center gap-2 font-medium text-rose-500">
                <Timer className="h-4 w-4" /> Time&apos;s up
              </div>
              <p className="mt-1 text-muted-foreground">{q.explanation}</p>
            </div>
          )}
          {revealed && !timedOut && (
            <div
              className={cn(
                'fade-up mt-3 rounded-lg border px-3.5 py-2.5 text-sm',
                isCorrect ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-amber-500/30 bg-amber-500/5'
              )}
            >
              <div className="flex items-center gap-2 font-medium">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Correct — +4 points
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-rose-500" /> Incorrect
                  </>
                )}
              </div>
              <p className="mt-1 text-muted-foreground">{q.explanation}</p>
              {!isCorrect && q.relatedLessonId && (
                <RelatedLessonLink lessonId={q.relatedLessonId} />
              )}
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <Button size="sm" onClick={next} disabled={!revealed}>
              {index + 1 >= spec.questions.length ? 'See results' : 'Next question'} <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function RelatedLessonLink({ lessonId }: { lessonId: string }) {
  const go = useNav((s) => s.go)
  const lesson = findLesson(lessonId)
  if (!lesson) return null
  return (
    <button
      onClick={() => go('lesson', { lessonId })}
      className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
    >
      <BookOpen className="h-3.5 w-3.5" /> Review the lesson: {lesson.title}
    </button>
  )
}

// ─── Results ────────────────────────────────────────────────────────────────

function Results({
  spec,
  answers,
  score,
  onExit,
}: {
  spec: SessionSpec
  answers: (number | null)[]
  score: number
  onExit: () => void
}) {
  const go = useNav((s) => s.go)
  const total = spec.questions.length
  const pct = Math.round((score / total) * 100)

  // recommendations: group wrong answers by category
  const wrongByCategory = new Map<string, number>()
  spec.questions.forEach((q, i) => {
    if (answers[i] !== q.correctIndex) {
      wrongByCategory.set(q.categoryId, (wrongByCategory.get(q.categoryId) ?? 0) + 1)
    }
  })
  const weakest = [...wrongByCategory.entries()].sort((a, b) => b[1] - a[1])

  const recommendation = (() => {
    if (pct === 100) return 'Flawless! Push yourself with a harder difficulty or the mixed timed mode.'
    if (weakest.length > 0) {
      const cat = CHALLENGE_CATEGORIES.find((c) => c.id === weakest[0][0])
      return cat ? `Focus next on ${cat.title} — it caused ${weakest[0][1]} of your ${total - score} miss${total - score === 1 ? '' : 'es'}. Review the linked lessons below.` : 'Review the explanations below and retry this set.'
    }
    return 'Solid result — try the same category with a timer on for extra pressure.'
  })()

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-10 pt-6 sm:px-6">
      <Card className="border-border/60">
        <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
          <div
            className={cn(
              'flex h-14 w-14 items-center justify-center rounded-full',
              pct === 100 ? 'bg-emerald-500/15 text-emerald-500' : pct >= 60 ? 'bg-primary/15 text-primary' : 'bg-amber-500/15 text-amber-500'
            )}
          >
            <Trophy className="h-7 w-7" />
          </div>
          <div className="text-2xl font-bold">
            {score} / {total}
          </div>
          <div className="text-sm text-muted-foreground">
            {spec.categoryId === 'mixed' ? 'Mixed categories' : CHALLENGE_CATEGORIES.find((c) => c.id === spec.categoryId)?.title} ·{' '}
            {spec.difficulty} · {spec.timed ? 'timed' : 'untimed'}
          </div>
          <Progress value={pct} className="mt-1 h-2 w-full max-w-xs" />
          <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-cyan-accent/10 px-3 py-2 text-sm text-cyan-accent">
            <Target className="h-4 w-4" /> {recommendation}
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <Button size="sm" variant="outline" onClick={onExit}>
              <RotateCcw className="h-3.5 w-3.5" /> New session
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* review */}
      <Card className="mt-4 border-border/60">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <ListChecks className="h-4 w-4 text-cyan-accent" /> Answer review
          </div>
          <div className="mt-3 space-y-3">
            {spec.questions.map((q, i) => {
              const picked = answers[i]
              const right = picked === q.correctIndex
              return (
                <div key={q.id} className={cn('rounded-lg border p-3', right ? 'border-emerald-500/25' : 'border-rose-500/25')}>
                  <div className="flex items-start gap-2">
                    {right ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    ) : (
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                    )}
                    <div className="min-w-0">
                      <div className="text-sm font-medium">
                        {i + 1}. {q.prompt}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Your answer:{' '}
                        <span className={right ? 'font-medium text-emerald-500' : 'font-medium text-rose-500'}>
                          {picked === null || picked === -1 ? 'no answer / timed out' : q.options[picked]}
                        </span>
                        {!right && (
                          <>
                            {' '}· Correct: <span className="font-medium text-emerald-500">{q.options[q.correctIndex]}</span>
                          </>
                        )}
                      </div>
                      {!right && <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{q.explanation}</p>}
                      {!right && q.relatedLessonId && <RelatedLessonLink lessonId={q.relatedLessonId} />}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Top-level ──────────────────────────────────────────────────────────────

export function ChallengesView() {
  const [spec, setSpec] = React.useState<SessionSpec | null>(null)

  const start = (categoryId: string | 'mixed', difficulty: Difficulty | 'mixed', timed: boolean) => {
    const pool = CHALLENGE_QUESTIONS.filter(
      (q) => (categoryId === 'mixed' || q.categoryId === categoryId) && (difficulty === 'mixed' || q.difficulty === difficulty)
    )
    // shuffle deterministically per session start (user-triggered, safe)
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    setSpec({ categoryId, difficulty, timed, questions: shuffled })
  }

  if (spec) return <Runner key={spec.questions.map((q) => q.id).join('|')} spec={spec} onExit={() => setSpec(null)} />
  return <Hub onStart={start} />
}
