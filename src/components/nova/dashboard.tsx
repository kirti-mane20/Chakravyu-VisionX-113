'use client'

import * as React from 'react'
import {
  ArrowRight, BookOpen, FlaskConical, Sparkles, Stethoscope, Swords, Lightbulb,
  Trophy, History, Play, Target, TrendingUp, RotateCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { MODULES, ALL_LESSONS, findLesson, findModuleOf, nextLessonAfter } from '@/lib/nova/content'
import { useNav } from '@/lib/nova/nav'
import { useProgress, overallLessonPercent, ACHIEVEMENTS, POINTS } from '@/lib/nova/store'
import { DOCTOR_CASES } from '@/lib/nova/doctor'
import { NovaIcon, PageHeader, StatCard, DifficultyBadge } from './shared'
import type { ActivityEvent } from '@/lib/nova/types'

const ACTIVITY_ICON: Record<ActivityEvent['kind'], string> = {
  lesson: 'BookOpen',
  lab: 'FlaskConical',
  gate: 'Binary',
  doctor: 'Stethoscope',
  challenge: 'Swords',
  project: 'Lightbulb',
  nova: 'Sparkles',
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} h ago`
  const days = Math.floor(hrs / 24)
  return `${days} d ago`
}

export function Dashboard() {
  const go = useNav((s) => s.go)
  const progress = useProgress()

  const doneCount = Object.keys(progress.completedLessons).length
  const lessonPct = overallLessonPercent(progress)

  // Continue learning: last opened lesson if not complete, else first incomplete
  const lastLesson = progress.lastLessonId ? findLesson(progress.lastLessonId) : undefined
  const lastDone = lastLesson ? !!progress.completedLessons[lastLesson.id] : true
  const nextIncomplete = ALL_LESSONS.find((l) => !progress.completedLessons[l.id])
  const continueLesson = lastLesson && !lastDone ? lastLesson : (nextIncomplete ?? lastLesson)
  const continueModule = continueLesson ? findModuleOf(continueLesson.id) : undefined

  // Recommendation: first lesson of the module with fewest completions, following curriculum order
  const recommended = nextIncomplete ?? ALL_LESSONS[0]
  const recommendedModule = findModuleOf(recommended.id)
  const recommendedReason =
    doneCount === 0
      ? 'Start at the beginning — this builds the foundation every other module uses.'
      : recommended.moduleId === 'basics' && doneCount < 2
        ? 'Finish the basics module before moving on.'
        : nextIncomplete && progress.completedLessons[nextIncomplete.id] === undefined
          ? 'Next in your curriculum path, based on what you have completed.'
          : 'All lessons complete — revisit any module to refresh.'

  const doctorSolved = Object.values(progress.doctorResults).filter((r) => r.solved).length
  const lastChallenge = progress.challengeSessions[0]
  const recentQuizResults = Object.entries(progress.completedLessons)
    .sort((a, b) => b[1].at - a[1].at)
    .slice(0, 3)
    .map(([id, r]) => ({ lesson: findLesson(id), record: r }))
    .filter((x) => x.lesson)

  const projectsDone = Object.values(progress.projectActivities).filter((p) => p.quizDone).length
  const achievements = ACHIEVEMENTS.filter((a) => progress.achievements.includes(a.id))

  const isNewUser = doneCount === 0 && progress.labRuns === 0 && progress.challengeSessions.length === 0 && progress.novaQuestions === 0

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-6 sm:px-6">
      <PageHeader
        title={isNewUser ? 'Welcome to ENTC NOVA' : 'Your learning dashboard'}
        subtitle={
          isNewUser
            ? 'Everything you need to understand electronics — start with a lesson or jump straight into the lab.'
            : 'Pick up where you left off, or follow the recommendation below.'
        }
        icon="Gauge"
        actions={
          <Button variant="outline" size="sm" onClick={() => go('learn')}>
            <BookOpen className="h-4 w-4" /> Browse lessons
          </Button>
        }
      />

      {isNewUser && (
        <Card className="fade-up mt-5 border-primary/30 bg-primary/5">
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-semibold">New here? The 4-step quick start</div>
              <ol className="mt-1.5 list-decimal space-y-0.5 pl-5 text-sm text-muted-foreground">
                <li>Complete the first lesson — Voltage, Current &amp; Ohm&apos;s Law</li>
                <li>Rebuild the circuit yourself in the Virtual Lab</li>
                <li>Ask NOVA anything that confused you</li>
                <li>Prove your skills in the Challenge Arena</li>
              </ol>
            </div>
            <Button onClick={() => go('lesson', { lessonId: 'basics-ohms-law' })} className="shrink-0">
              <Play className="h-4 w-4" /> Start lesson 1
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon="BookOpen" label="Lessons completed" value={`${doneCount}/${ALL_LESSONS.length}`} hint={`${lessonPct}% of library`} />
        <StatCard icon="Trophy" label="Points earned" value={progress.points} hint={`+${POINTS.lesson} per new lesson`} />
        <StatCard icon="Stethoscope" label="Doctor cases solved" value={`${doctorSolved}/${DOCTOR_CASES.length}`} />
        <StatCard icon="Target" label="Achievements" value={`${achievements.length}/${ACHIEVEMENTS.length}`} hint={`${progress.labRuns} lab runs · ${progress.gateRuns} gate runs`} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {/* Continue learning */}
        <Card className="lg:col-span-2 border-primary/25">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Play className="h-4 w-4 text-cyan-accent" /> Continue where you left off
            </CardTitle>
          </CardHeader>
          <CardContent>
            {continueLesson && continueModule ? (
              <button
                className="group flex w-full items-center gap-4 rounded-xl border border-border/60 bg-card p-4 text-left transition-colors hover:border-primary/40"
                onClick={() => go('lesson', { lessonId: continueLesson.id })}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <NovaIcon name={continueModule.icon} className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-muted-foreground">
                    {continueModule.title} · {continueLesson.minutes} min read
                  </div>
                  <div className="truncate font-semibold">{continueLesson.title}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <DifficultyBadge difficulty={continueLesson.difficulty} />
                    {progress.completedLessons[continueLesson.id] && (
                      <Badge variant="outline" className="text-[10px]">
                        Score {progress.completedLessons[continueLesson.id].score}/{progress.completedLessons[continueLesson.id].total}
                      </Badge>
                    )}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </button>
            ) : (
              <p className="text-sm text-muted-foreground">No lesson history yet — pick any module from the Learn library.</p>
            )}

            {/* Recommendation */}
            <div className="mt-4 rounded-xl border border-cyan-accent/25 bg-cyan-accent/5 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-cyan-accent">
                <TrendingUp className="h-4 w-4" /> Recommended next
              </div>
              {recommended && recommendedModule && (
                <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="font-semibold">{recommended.title}</div>
                    <div className="text-xs text-muted-foreground">{recommendedReason}</div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => go('lesson', { lessonId: recommended.id })} className="shrink-0">
                    Open lesson <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>Library progress</span>
                  <span>{doneCount}/{ALL_LESSONS.length}</span>
                </div>
                <Progress value={lessonPct} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick access */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Quick access</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {[
              { icon: 'FlaskConical', label: 'Virtual Lab', view: 'lab' as const, hint: `${progress.labRuns} runs` },
              { icon: 'Sparkles', label: 'NOVA AI', view: 'nova' as const, hint: `${progress.novaQuestions} asked` },
              { icon: 'Stethoscope', label: 'Circuit Doctor', view: 'doctor' as const, hint: `${doctorSolved}/${DOCTOR_CASES.length}` },
              { icon: 'Swords', label: 'Challenges', view: 'challenges' as const, hint: lastChallenge ? `best ${Math.max(...progress.challengeSessions.map((c) => (c.total > 0 ? (c.score / c.total) * 100 : 0))).toFixed(0)}%` : 'start one' },
              { icon: 'Lightbulb', label: 'Innovation', view: 'innovation' as const, hint: `${projectsDone}/3 projects` },
              { icon: 'Activity', label: 'Progress', view: 'progress' as const, hint: 'full report' },
            ].map((q) => (
              <button
                key={q.label}
                onClick={() => go(q.view)}
                className="flex flex-col items-start gap-1.5 rounded-lg border border-border/60 p-3 text-left transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <NovaIcon name={q.icon} className="h-4.5 w-4.5 text-primary" />
                <span className="text-xs font-medium">{q.label}</span>
                <span className="text-[10px] text-muted-foreground">{q.hint}</span>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* Recent results */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-cyan-accent" /> Recent results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentQuizResults.length === 0 && !lastChallenge ? (
              <p className="text-sm text-muted-foreground">
                No quiz or challenge results yet. Finish a lesson quiz or a challenge session and it will appear here.
              </p>
            ) : (
              <div className="space-y-2.5">
                {recentQuizResults.map(({ lesson, record }) => (
                  <div key={lesson!.id} className="flex items-center justify-between gap-2 text-sm">
                    <div className="min-w-0">
                      <div className="truncate font-medium">{lesson!.title}</div>
                      <div className="text-xs text-muted-foreground">Lesson quiz · {timeAgo(record.at)}</div>
                    </div>
                    <Badge variant={record.score === record.total ? 'default' : 'secondary'} className="shrink-0">
                      {record.score}/{record.total}
                    </Badge>
                  </div>
                ))}
                {lastChallenge && (
                  <div className="flex items-center justify-between gap-2 border-t border-border/60 pt-2.5 text-sm">
                    <div className="min-w-0">
                      <div className="truncate font-medium">Challenge session</div>
                      <div className="text-xs text-muted-foreground">
                        {lastChallenge.categoryId === 'mixed' ? 'Mixed' : lastChallenge.categoryId} ·{' '}
                        {lastChallenge.timed ? 'timed' : 'untimed'} · {timeAgo(lastChallenge.at)}
                      </div>
                    </div>
                    <Badge variant={lastChallenge.score === lastChallenge.total ? 'default' : 'secondary'} className="shrink-0">
                      {lastChallenge.score}/{lastChallenge.total}
                    </Badge>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Trophy className="h-4 w-4 text-cyan-accent" /> Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {achievements.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Badges are earned as you learn — your first is one completed lesson away.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {achievements.map((a) => (
                  <Badge key={a.id} variant="outline" className="gap-1.5 border-cyan-accent/40 bg-cyan-accent/10 py-1 text-cyan-accent">
                    <NovaIcon name={a.icon} className="h-3.5 w-3.5" />
                    {a.title}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <History className="h-4 w-4 text-cyan-accent" /> Recent activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {progress.activity.length === 0 ? (
              <p className="text-sm text-muted-foreground">Your activity feed will fill up as you learn and experiment.</p>
            ) : (
              <div className="scrollbar-thin max-h-56 space-y-2 overflow-y-auto pr-1">
                {progress.activity.slice(0, 12).map((ev) => (
                  <div key={ev.id} className="flex items-center gap-2.5 text-sm">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted">
                      <NovaIcon name={ACTIVITY_ICON[ev.kind]} className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate">{ev.label}</div>
                    </div>
                    <span className="shrink-0 text-[10px] text-muted-foreground">{timeAgo(ev.at)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Module progress overview */}
      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Module progress</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map((m) => {
            const done = m.lessons.filter((l) => progress.completedLessons[l.id]).length
            return (
              <button
                key={m.id}
                onClick={() => go('learn', { lessonId: m.lessons[0].id })}
                className="rounded-lg border border-border/60 p-3 text-left transition-colors hover:border-primary/40"
              >
                <div className="flex items-center gap-2">
                  <NovaIcon name={m.icon} className="h-4 w-4 text-primary" />
                  <span className="truncate text-xs font-medium">{m.title}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Progress value={(done / m.lessons.length) * 100} className="h-1.5 flex-1" />
                  <span className="text-[10px] text-muted-foreground">
                    {done}/{m.lessons.length}
                  </span>
                </div>
              </button>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
