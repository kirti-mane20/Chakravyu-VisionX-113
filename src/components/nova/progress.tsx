'use client'

import * as React from 'react'
import {
  Trophy, History, BookOpen, FlaskConical, Stethoscope, Swords, Lightbulb, RotateCcw,
  Sparkles, Lock, TrendingUp, Database,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { ALL_LESSONS, findLesson } from '@/lib/nova/content'
import { DOCTOR_CASES } from '@/lib/nova/doctor'
import { CHALLENGE_QUESTIONS } from '@/lib/nova/challenges'
import { useNav } from '@/lib/nova/nav'
import { useProgress, overallLessonPercent, ACHIEVEMENTS } from '@/lib/nova/store'
import { NovaIcon, PageHeader, StatCard } from './shared'
import { cn } from '@/lib/utils'

const KIND_ICON: Record<string, string> = {
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
  return `${Math.floor(hrs / 24)} d ago`
}

export function ProgressView() {
  const go = useNav((s) => s.go)
  const progress = useProgress()

  const doneLessons = Object.keys(progress.completedLessons).length
  const lessonPct = overallLessonPercent(progress)
  const doctorSolved = Object.values(progress.doctorResults).filter((r) => r.solved).length
  const challenges = progress.challengeSessions
  const bestChallenge = challenges.length > 0 ? Math.max(...challenges.map((c) => (c.total > 0 ? (c.score / c.total) * 100 : 0))) : 0
  const projectsDone = Object.values(progress.projectActivities).filter((p) => p.quizDone).length
  const earned = ACHIEVEMENTS.filter((a) => progress.achievements.includes(a.id))

  // Recommendations
  const nextLesson = ALL_LESSONS.find((l) => !progress.completedLessons[l.id])
  const recs: { text: string; cta: string; view: 'lesson' | 'lab' | 'doctor' | 'challenges' | 'innovation' | 'nova'; lessonId?: string }[] = []
  if (doneLessons === 0) recs.push({ text: 'Complete your first lesson to unlock the basics of every other module.', cta: 'Start learning', view: 'lesson', lessonId: 'basics-ohms-law' })
  if (progress.labRuns === 0) recs.push({ text: 'You have not run a lab experiment yet — build the LED circuit and watch Ohm\u2019s law live.', cta: 'Open Virtual Lab', view: 'lab' })
  if (progress.novaQuestions === 0) recs.push({ text: 'Ask NOVA one question about something that confused you today.', cta: 'Meet NOVA', view: 'nova' })
  if (doctorSolved === 0) recs.push({ text: 'Test your troubleshooting instincts on the first Circuit Doctor case.', cta: 'Diagnose a circuit', view: 'doctor' })
  if (challenges.length === 0) recs.push({ text: 'Try a mixed Challenge session to find your strongest and weakest areas.', cta: 'Enter the Arena', view: 'challenges' })
  if (projectsDone === 0) recs.push({ text: 'Apply what you have learned in the Smart Home simulation.', cta: 'Open Innovation Studio', view: 'innovation' })
  if (doneLessons > 0 && doneLessons < ALL_LESSONS.length) {
    const mod = findLesson(nextLesson!.id)
    recs.push({ text: `Your next curriculum lesson is “${mod?.title}”.`, cta: 'Continue curriculum', view: 'lesson', lessonId: nextLesson!.id })
  }

  const isEmpty = doneLessons === 0 && progress.labRuns === 0 && progress.gateRuns === 0 && progress.novaQuestions === 0 && challenges.length === 0 && doctorSolved === 0 && projectsDone === 0

  const handleReset = () => {
    progress.resetProgress()
    toast.success('Progress reset — welcome to a fresh start!')
    go('dashboard')
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-10 pt-6 sm:px-6">
      <PageHeader
        title="Your progress"
        subtitle="Everything is stored locally in your browser (localStorage) — no account needed, and you can wipe it at any time."
        icon="Activity"
        actions={
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-rose-500 hover:bg-rose-500/10 hover:text-rose-500">
                <RotateCcw className="h-4 w-4" /> Reset progress
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset all learning progress?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently clears lesson completions, quiz scores, lab runs, Circuit Doctor results,
                  challenge sessions, project records, points and achievements from this browser. This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep my progress</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset} className="bg-rose-500 text-white hover:bg-rose-600">
                  Yes, reset everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        }
      />

      {/* stats */}
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon="Trophy" label="Total points" value={progress.points} />
        <StatCard icon="BookOpen" label="Lessons completed" value={`${doneLessons}/${ALL_LESSONS.length}`} hint={`${lessonPct}%`} />
        <StatCard icon="Stethoscope" label="Doctor cases solved" value={`${doctorSolved}/${DOCTOR_CASES.length}`} />
        <StatCard icon="Swords" label="Best challenge score" value={challenges.length ? `${Math.round(bestChallenge)}%` : '—'} hint={`${challenges.length} session${challenges.length === 1 ? '' : 's'}`} />
      </div>

      {/* section progress */}
      <Card className="mt-4 border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Learning journey progress</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: BookOpen, label: 'Lessons', done: doneLessons, total: ALL_LESSONS.length },
            { icon: FlaskConical, label: 'Lab experiments', done: Math.min(progress.labRuns, 10), total: 10, note: `${progress.labRuns} runs` },
            { icon: Stethoscope, label: 'Doctor cases', done: doctorSolved, total: DOCTOR_CASES.length },
            { icon: Swords, label: 'Challenge sessions', done: challenges.length, total: 5, note: `${CHALLENGE_QUESTIONS.length} questions available` },
            { icon: Lightbulb, label: 'Innovation projects', done: projectsDone, total: 3 },
            { icon: Sparkles, label: 'NOVA questions asked', done: Math.min(progress.novaQuestions, 10), total: 10, note: `${progress.novaQuestions} total` },
          ].map((row) => (
            <div key={row.label}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 font-medium">
                  <row.icon className="h-4 w-4 text-primary" /> {row.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {Math.min(row.done, row.total)}/{row.total}
                  {row.note ? ` · ${row.note}` : ''}
                </span>
              </div>
              <Progress value={(Math.min(row.done, row.total) / row.total) * 100} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* achievements */}
      <Card className="mt-4 border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="h-4 w-4 text-cyan-accent" /> Achievements ({earned.length}/{ACHIEVEMENTS.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {ACHIEVEMENTS.map((a) => {
            const has = progress.achievements.includes(a.id)
            return (
              <div
                key={a.id}
                className={cn(
                  'flex items-center gap-3 rounded-lg border px-3 py-2.5',
                  has ? 'border-cyan-accent/35 bg-cyan-accent/5' : 'border-border/50 opacity-60'
                )}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                    has ? 'bg-cyan-accent/15 text-cyan-accent' : 'bg-muted text-muted-foreground'
                  )}
                >
                  {has ? <NovaIcon name={a.icon} className="h-4 w-4" /> : <Lock className="h-3.5 w-3.5" />}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{a.title}</div>
                  <div className="truncate text-xs text-muted-foreground">{a.description}</div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {/* activity */}
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <History className="h-4 w-4 text-cyan-accent" /> Full activity feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            {progress.activity.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nothing yet. Lessons, lab runs, doctor cases, challenges and NOVA questions all appear here with timestamps.
              </p>
            ) : (
              <div className="scrollbar-thin max-h-80 space-y-2 overflow-y-auto pr-1">
                {progress.activity.map((ev) => (
                  <div key={ev.id} className="flex items-center gap-2.5 text-sm">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted">
                      <NovaIcon name={KIND_ICON[ev.kind] ?? 'Activity'} className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <span className="flex-1 truncate">{ev.label}</span>
                    <span className="shrink-0 text-[10px] text-muted-foreground">{timeAgo(ev.at)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* recommendations */}
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-cyan-accent" /> What to do next
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEmpty ? (
              <p className="text-sm text-muted-foreground">Start with the first lesson — the recommendations build themselves from your activity.</p>
            ) : (
              <div className="space-y-2.5">
                {recs.slice(0, 5).map((r, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 rounded-lg border border-border/50 px-3 py-2.5">
                    <p className="text-sm text-foreground/85">{r.text}</p>
                    <Button size="sm" variant="outline" className="shrink-0" onClick={() => go(r.view, r.lessonId ? { lessonId: r.lessonId } : undefined)}>
                      {r.cta}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-lg border border-border/60 bg-muted/40 px-3.5 py-3 text-xs leading-relaxed text-muted-foreground">
        <Database className="mt-0.5 h-4 w-4 shrink-0 text-cyan-accent" />
        <p>
          <span className="font-medium text-foreground">Privacy note:</span> ENTC NOVA stores only your learning
          activity (lesson scores, run counts, session results) in your browser&apos;s localStorage. No accounts, no
          server-side profiles, no personal data collected. Resetting from this page clears everything permanently.
        </p>
      </div>
    </div>
  )
}
