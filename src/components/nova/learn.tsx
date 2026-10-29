'use client'

import * as React from 'react'
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock, Search, SlidersHorizontal, Lightbulb, KeyRound } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { MODULES, ALL_LESSONS, findLesson, findModuleOf, nextLessonAfter, lessonNumber, searchLessons } from '@/lib/nova/content'
import { useNav } from '@/lib/nova/nav'
import { useProgress } from '@/lib/nova/store'
import { NovaIcon, PageHeader, DifficultyBadge, EmptyState, QuizCard, Term } from './shared'
import { LessonDiagram } from './diagrams'
import type { Difficulty } from '@/lib/nova/types'
import { cn } from '@/lib/utils'

// ─── Library ────────────────────────────────────────────────────────────────

export function LearnView() {
  const go = useNav((s) => s.go)
  const progress = useProgress()
  const [query, setQuery] = React.useState('')
  const [moduleFilter, setModuleFilter] = React.useState<string>('all')
  const [difficultyFilter, setDifficultyFilter] = React.useState<Difficulty | 'all'>('all')

  const results = React.useMemo(() => {
    let lessons = searchLessons(query)
    if (moduleFilter !== 'all') lessons = lessons.filter((l) => l.moduleId === moduleFilter)
    if (difficultyFilter !== 'all') lessons = lessons.filter((l) => l.difficulty === difficultyFilter)
    return lessons
  }, [query, moduleFilter, difficultyFilter])

  const totalDone = Object.keys(progress.completedLessons).length

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-6 sm:px-6">
      <PageHeader
        title="Learn ENTC"
        subtitle={`Searchable library of ${ALL_LESSONS.length} lessons across ${MODULES.length} modules — ${totalDone} completed. Every lesson ends with a knowledge check.`}
        icon="BookOpen"
      />

      {/* Search + filters */}
      <div className="mt-5 space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search topics — try “Ohm”, “XOR”, “sampling”, “Arduino”…"
              className="pl-9"
              aria-label="Search lessons"
            />
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-card px-2">
            <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
            {(['all', 'easy', 'medium', 'hard'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDifficultyFilter(d)}
                className={cn(
                  'rounded-md px-2 py-1.5 text-xs font-medium capitalize transition-colors',
                  difficultyFilter === d ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <div className="scrollbar-thin flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setModuleFilter('all')}
            className={cn(
              'shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              moduleFilter === 'all' ? 'border-primary bg-primary text-primary-foreground' : 'border-border/60 text-muted-foreground hover:text-foreground'
            )}
          >
            All modules
          </button>
          {MODULES.map((m) => (
            <button
              key={m.id}
              onClick={() => setModuleFilter(m.id)}
              className={cn(
                'shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                moduleFilter === m.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border/60 text-muted-foreground hover:text-foreground'
              )}
            >
              {m.title}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No lessons match your search"
            description={`Nothing found for “${query}”. Try a broader term like “LED”, “gate”, “sensor” or “filter”.`}
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery('')
                  setModuleFilter('all')
                  setDifficultyFilter('all')
                }}
              >
                Clear filters
              </Button>
            }
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((lesson) => {
            const mod = findModuleOf(lesson.id)!
            const record = progress.completedLessons[lesson.id]
            const num = lessonNumber(lesson.id)
            return (
              <Card
                key={lesson.id}
                className={cn(
                  'group cursor-pointer border-border/60 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md',
                  record && 'border-emerald-500/25'
                )}
                onClick={() => go('lesson', { lessonId: lesson.id })}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <NovaIcon name={mod.icon} className="h-4.5 w-4.5" />
                    </div>
                    {record ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/12 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" /> {record.score}/{record.total}
                      </span>
                    ) : (
                      <DifficultyBadge difficulty={lesson.difficulty} />
                    )}
                  </div>
                  <div className="mt-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Module {num.module} · Lesson {num.lesson}
                  </div>
                  <h3 className="mt-0.5 font-semibold leading-snug">{lesson.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{lesson.summary}</p>
                  <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {lesson.minutes} min
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <BookOpen className="h-3 w-3" /> {mod.title.split('&')[0]}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Lesson detail ──────────────────────────────────────────────────────────

export function LessonView({ lessonId }: { lessonId: string }) {
  const go = useNav((s) => s.go)
  const progress = useProgress()
  const lesson = findLesson(lessonId)

  if (!lesson) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 pt-10 sm:px-6">
        <EmptyState
          title="Lesson not found"
          description="This lesson does not exist. Return to the library and pick a topic."
          action={<Button onClick={() => go('learn')}>Back to library</Button>}
        />
      </div>
    )
  }

  const mod = findModuleOf(lesson.id)!
  const num = lessonNumber(lesson.id)
  const record = progress.completedLessons[lesson.id]
  const next = nextLessonAfter(lesson.id)

  const handleQuizFinish = (score: number, total: number) => {
    const first = !progress.completedLessons[lesson.id]
    progress.completeLesson(lesson.id, score, total)
    if (score === total) {
      toast.success(first ? `Perfect score! Lesson complete +${25 + 10} points` : `Perfect score on retry!`)
    } else {
      toast.success(`Lesson complete — ${score}/${total} correct`)
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-12 pt-6 sm:px-6">
      {/* breadcrumb / back */}
      <div className="flex items-center justify-between gap-2">
        <Button variant="ghost" size="sm" onClick={() => go('learn')}>
          <ArrowLeft className="h-4 w-4" /> Library
        </Button>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>
            Module {num.module} · Lesson {num.lesson}
          </span>
          {record && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/12 px-2 py-0.5 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3 w-3" /> Completed {record.score}/{record.total}
            </span>
          )}
        </div>
      </div>

      {/* header */}
      <div className="mt-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <NovaIcon name={mod.icon} className="h-4 w-4 text-primary" />
          {mod.title}
        </div>
        <h1 className="mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">{lesson.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <DifficultyBadge difficulty={lesson.difficulty} />
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {lesson.minutes} min read
          </span>
          <span className="inline-flex items-center gap-1">
            <KeyRound className="h-3.5 w-3.5" /> {lesson.terms.length} key terms
          </span>
        </div>
        <p className="mt-3 rounded-lg border-l-2 border-cyan-accent/60 bg-cyan-accent/5 px-3.5 py-2.5 text-sm leading-relaxed text-foreground/90">
          {lesson.summary}
        </p>
      </div>

      {/* sections */}
      <div className="mt-7 space-y-7">
        {lesson.sections.map((sec, i) => (
          <section key={i} aria-label={sec.heading}>
            <h2 className="flex items-center gap-2.5 text-lg font-semibold tracking-tight">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                {i + 1}
              </span>
              {sec.heading}
            </h2>
            <div className="mt-2.5 space-y-3 pl-0.5">
              {sec.body.map((para, j) => {
                // Render terms inside paragraphs with tooltips when exact match found
                return (
                  <p key={j} className="text-[15px] leading-relaxed text-foreground/85">
                    {renderWithTerms(para, lesson.terms)}
                  </p>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      {/* diagram */}
      <Card className="mt-8 border-border/60">
        <CardContent className="p-4 sm:p-5">
          <div className="rounded-lg border border-border/50 bg-card p-3">
            <LessonDiagram kind={lesson.diagram} />
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">{lesson.diagramCaption}</p>
        </CardContent>
      </Card>

      {/* terms + takeaways */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardContent className="p-4 sm:p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <KeyRound className="h-4 w-4 text-cyan-accent" /> Important terms
            </h3>
            <div className="mt-3 space-y-2.5">
              {lesson.terms.map((t) => (
                <div key={t.term} className="rounded-lg bg-muted/50 px-3 py-2 text-sm">
                  <span className="font-medium text-cyan-accent">{t.term}</span>
                  <span className="text-muted-foreground"> — {t.definition}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card className="border-border/60">
            <CardContent className="p-4 sm:p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <CheckCircle2 className="h-4 w-4 text-cyan-accent" /> Key takeaways
              </h3>
              <ul className="mt-3 space-y-2">
                {lesson.takeaways.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                    <span className="leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="border-cyan-accent/25 bg-cyan-accent/5">
            <CardContent className="p-4 sm:p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Lightbulb className="h-4 w-4 text-cyan-accent" /> {lesson.application.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/85">{lesson.application.body}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* quiz */}
      <div className="mt-8">
        <h2 className="mb-3 text-lg font-semibold tracking-tight">Knowledge check</h2>
        <QuizCard questions={lesson.quiz} onFinish={handleQuizFinish} />
      </div>

      {/* next navigation */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="outline"
          onClick={() =>
            go('lab')
          }
        >
          <svg className="mr-1 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M10 2v6L4 20a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3L14 8V2" />
          </svg>
          Try it in the Virtual Lab
        </Button>
        {next && (
          <Button onClick={() => go('lesson', { lessonId: next.id })}>
            Next: {next.title} <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

/** Wrap occurrences of key terms in a paragraph with tooltip Terms. */
function renderWithTerms(text: string, terms: { term: string; definition: string }[]): React.ReactNode {
  const found = terms.find((t) => text.includes(t.term))
  if (!found) return text
  const idx = text.indexOf(found.term)
  const before = text.slice(0, idx)
  const after = text.slice(idx + found.term.length)
  return (
    <>
      {before}
      <Term term={found.term} definition={found.definition} />
      {renderWithTerms(after, terms.filter((t) => t !== found))}
    </>
  )
}
