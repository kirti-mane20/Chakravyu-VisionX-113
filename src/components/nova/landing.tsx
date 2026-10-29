'use client'

import * as React from 'react'
import {
  ArrowRight, CircuitBoard, FlaskConical, Sparkles, Stethoscope, Swords, Lightbulb,
  Sun, Moon, RotateCcw, ChevronRight, Zap,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { MODULES, LESSONS_TOTAL } from '@/lib/nova/content'
import { useNav } from '@/lib/nova/nav'
import { useProgress, overallLessonPercent } from '@/lib/nova/store'
import { NovaIcon } from './shared'

const FEATURES = [
  {
    icon: 'BookOpen',
    title: 'Interactive Lessons',
    description: 'Seven ENTC modules from Ohm\u2019s law to IoT, each with diagrams, key terms and instant knowledge checks.',
    view: 'learn' as const,
  },
  {
    icon: 'FlaskConical',
    title: 'Virtual Electronics Lab',
    description: 'Build a live LED circuit with real Ohm\u2019s-law maths, and toggle logic gates against their truth tables.',
    view: 'lab' as const,
  },
  {
    icon: 'Sparkles',
    title: 'NOVA AI Assistant',
    description: 'Ask ENTC questions in plain English and get step-by-step explanations, hints and worked examples.',
    view: 'nova' as const,
  },
  {
    icon: 'Stethoscope',
    title: 'Circuit Doctor',
    description: 'Diagnose five progressively harder circuit faults using clues \u2014 think like a real technician.',
    view: 'doctor' as const,
  },
  {
    icon: 'Swords',
    title: 'Challenge Arena',
    description: 'Digital logic, electronics MCQs, component ID, Arduino code and circuit puzzles across three difficulty levels.',
    view: 'challenges' as const,
  },
  {
    icon: 'Lightbulb',
    title: 'Innovation Studio',
    description: 'Simulate smart home automation, IoT safety monitoring and a communication network you can tune.',
    view: 'innovation' as const,
  },
]

const JOURNEY = [
  { step: 'Explore', text: 'Pick a concept from the searchable library' },
  { step: 'Understand', text: 'Read the explanation, terms and diagram' },
  { step: 'Experiment', text: 'Rebuild it live in the Virtual Lab' },
  { step: 'Ask NOVA', text: 'Get unstuck with the AI assistant' },
  { step: 'Challenge', text: 'Prove it in the Challenge Arena' },
  { step: 'Apply', text: 'Use it in an Innovation project' },
]

export function Landing() {
  const go = useNav((s) => s.go)
  const { theme, setTheme } = useTheme()
  const progress = useProgress()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  const hasProgress = mounted && Object.keys(progress.completedLessons).length > 0
  const lessonPct = mounted ? overallLessonPercent(progress) : 0

  return (
    <div className="relative min-h-svh overflow-x-hidden">
      {/* subtle grid + glow backdrop */}
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />

      {/* Top bar */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Zap className="h-5 w-5" aria-hidden />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold tracking-tight">ENTC NOVA</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Learn · Simulate · Innovate</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-4.5 w-4.5 dark:hidden" />
            <Moon className="hidden h-4.5 w-4.5 dark:block" />
          </Button>
          <Button onClick={() => go('dashboard')} className="rounded-full">
            Open app <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* Hero */}
        <section className="flex flex-col items-center pb-14 pt-14 text-center sm:pt-20">
          <Badge variant="outline" className="mb-5 gap-1.5 rounded-full border-cyan-accent/40 bg-cyan-accent/10 px-3 py-1 text-cyan-accent">
            <Sparkles className="h-3 w-3" aria-hidden />
            HAKRAVYUH — AI Vibe Coding Challenge
          </Badge>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Understand Electronics.{' '}
            <span className="bg-gradient-to-r from-primary to-cyan-accent bg-clip-text text-transparent">
              Experiment Freely.
            </span>{' '}
            Innovate Intelligently.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            ENTC NOVA is a smart learning and innovation platform for Electronics &amp; Telecommunication
            Engineering — interactive lessons, a live circuit lab, an AI assistant, circuit debugging
            and real-world simulations, all in one place.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Button size="lg" className="h-12 rounded-full px-7 text-base" onClick={() => go(hasProgress ? 'dashboard' : 'learn')}>
              Start Learning <ArrowRight className="h-4.5 w-4.5" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 rounded-full px-7 text-base" onClick={() => go('lab')}>
              <FlaskConical className="h-4.5 w-4.5" /> Try the Virtual Lab
            </Button>
          </div>

          {hasProgress && (
            <Card className="fade-up mt-8 w-full max-w-md border-primary/30 bg-primary/5">
              <CardContent className="flex items-center justify-between gap-3 p-4">
                <div className="text-left">
                  <div className="text-sm font-semibold">Welcome back</div>
                  <div className="text-xs text-muted-foreground">
                    {lessonPct}% of the lesson library complete · {progress.points} points
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => go('dashboard')}>
                  Continue <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* stats strip */}
          <div className="mt-12 grid w-full max-w-2xl grid-cols-3 gap-3">
            {[
              { value: String(LESSONS_TOTAL), label: 'Interactive lessons' },
              { value: '5', label: 'Simulation engines' },
              { value: '20+', label: 'Challenge questions' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border/60 bg-card/60 px-3 py-4 backdrop-blur">
                <div className="text-2xl font-bold text-primary">{s.value}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="pb-16">
          <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            One platform, the full ENTC journey
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">
            Every module is interactive and connected to your progress — nothing is a static mockup.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <Card
                key={f.title}
                className="group cursor-pointer border-border/60 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                onClick={() => go(f.view)}
              >
                <CardContent className="p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <NovaIcon name={f.icon} className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3.5 font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-cyan-accent">
                    Open module <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Learning journey */}
        <section className="pb-16">
          <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            A complete learning loop
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {JOURNEY.map((j, i) => (
              <div key={j.step} className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/50 p-4">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-accent/15 text-xs font-bold text-cyan-accent">
                  {i + 1}
                </div>
                <div>
                  <div className="text-sm font-semibold">{j.step}</div>
                  <div className="text-xs text-muted-foreground">{j.text}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Modules preview */}
        <section className="pb-20">
          <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            Seven modules, beginner to IoT
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {MODULES.map((m) => (
              <button
                key={m.id}
                onClick={() => go('learn', { lessonId: m.lessons[0].id })}
                className="rounded-xl border border-border/60 bg-card/50 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40"
              >
                <NovaIcon name={m.icon} className="h-5 w-5 text-primary" />
                <div className="mt-2.5 text-sm font-semibold leading-snug">{m.title}</div>
                <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">{m.tagline}</div>
              </button>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border/60 bg-card/40">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <CircuitBoard className="h-4 w-4 text-primary" aria-hidden />
            <span>ENTC NOVA — Smart ENTC Learning &amp; Innovation Platform</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="inline-flex items-center gap-1 hover:text-foreground"
              onClick={() => {
                if (confirm('Reset all learning progress? This cannot be undone.')) {
                  progress.resetProgress()
                }
              }}
            >
              <RotateCcw className="h-3 w-3" /> Reset progress
            </button>
            <span>Simulations are educational models, not physical hardware.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
