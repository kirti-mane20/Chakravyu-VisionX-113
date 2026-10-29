'use client'

import * as React from 'react'
import {
  Menu, Search, Sun, Moon, Zap, PanelLeftClose, PanelLeft, ChevronRight, BookOpen, Gauge,
  FlaskConical, Sparkles, Stethoscope, Swords, Lightbulb, Activity, CircleHelp, X,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Separator } from '@/components/ui/separator'
import { Toaster } from '@/components/ui/sonner'
import { ALL_LESSONS, findModuleOf } from '@/lib/nova/content'
import { useNav } from '@/lib/nova/nav'
import { useProgress } from '@/lib/nova/store'
import type { ViewId } from '@/lib/nova/types'
import { Landing } from './landing'
import { Dashboard } from './dashboard'
import { LearnView, LessonView } from './learn'
import { LabView } from './lab'
import { NovaChatView } from './nova-chat'
import { DoctorView } from './doctor'
import { ChallengesView } from './challenges'
import { InnovationView } from './innovation'
import { ProgressView } from './progress'
import { cn } from '@/lib/utils'

const NAV_ITEMS: { view: ViewId; label: string; icon: React.ElementType; hint: string }[] = [
  { view: 'dashboard', label: 'Dashboard', icon: Gauge, hint: 'overview & continue learning' },
  { view: 'learn', label: 'Learn', icon: BookOpen, hint: 'lesson library' },
  { view: 'lab', label: 'Virtual Lab', icon: FlaskConical, hint: 'circuit & gate simulators' },
  { view: 'nova', label: 'NOVA AI', icon: Sparkles, hint: 'learning assistant' },
  { view: 'doctor', label: 'Circuit Doctor', icon: Stethoscope, hint: 'troubleshooting cases' },
  { view: 'challenges', label: 'Challenges', icon: Swords, hint: 'quizzes & puzzles' },
  { view: 'innovation', label: 'Innovation Studio', icon: Lightbulb, hint: 'real-world simulations' },
  { view: 'progress', label: 'Progress', icon: Activity, hint: 'stats & achievements' },
]

const VIEW_TITLES: Record<ViewId, string> = {
  landing: 'Welcome',
  dashboard: 'Dashboard',
  learn: 'Learn',
  lesson: 'Lesson',
  lab: 'Virtual Lab',
  nova: 'NOVA AI',
  doctor: 'Circuit Doctor',
  challenges: 'Challenge Arena',
  innovation: 'Innovation Studio',
  progress: 'Progress',
}

const HELP: Partial<Record<ViewId, { q: string; a: string }[]>> = {
  dashboard: [
    { q: 'How does progress tracking work?', a: 'Everything is saved in your browser\u2019s localStorage — lessons, scores, lab runs, achievements. No account is needed, and you can reset it anytime from the Progress page.' },
    { q: 'What should I do first?', a: 'Open the recommended lesson, complete its knowledge check, then rebuild the circuit in the Virtual Lab. The dashboard recommendation updates as you go.' },
  ],
  learn: [
    { q: 'Are the lessons beginner-friendly?', a: 'Yes — every lesson uses simple English, worked numeric examples and diagrams. Difficulty labels help you pick a starting point.' },
    { q: 'How do I complete a lesson?', a: 'Read the sections and finish the knowledge check at the bottom. Your best score is stored automatically.' },
  ],
  lab: [
    { q: 'Is this real hardware?', a: 'No — both simulators are deterministic software models. The circuit uses Ohm\u2019s law with an ideal LED model; real measurements will differ slightly.' },
    { q: 'Why does the LED stay dark?', a: 'Check the status panel: the switch may be open, the voltage may be below the LED\u2019s forward voltage, or the LED may be reversed.' },
  ],
  nova: [
    { q: 'Is NOVA a real AI?', a: 'NOVA tries a real AI model first. If none is configured, it answers from a built-in educational knowledge base and clearly labels responses — no fake claims.' },
    { q: 'What can I ask?', a: 'Concept explanations, worked examples, step-by-step hints, Arduino code help, and practice questions. Set a topic context for more focused answers.' },
  ],
  doctor: [
    { q: 'How is the case scored?', a: 'You earn 20 points per solved case. Wrong submissions are counted but never penalised — reasoning through mistakes is the point.' },
    { q: 'Can I retry a case?', a: 'Yes — every case can be retried as often as you like.' },
  ],
  challenges: [
    { q: 'How does scoring work?', a: '4 points per correct answer, +15 bonus for a perfect session. Results include explanations and lesson links for everything you missed.' },
    { q: 'Is my code executed in Arduino questions?', a: 'No — Arduino questions use a deterministic, rule-based checker (predict-the-output / pick-the-fix). Nothing you type is executed anywhere.' },
  ],
  innovation: [
    { q: 'Are the sensors real?', a: 'No — all readings are simulated. The projects demonstrate the control logic and decision patterns of real systems without claiming live data.' },
  ],
  progress: [
    { q: 'Where is my data stored?', a: 'Only in this browser\u2019s localStorage. Resetting from this page clears everything permanently.' },
  ],
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const view = useNav((s) => s.view)
  const go = useNav((s) => s.go)
  const points = useProgress((s) => s.points)

  return (
    <div className="flex h-full flex-col">
      <button
        className="flex items-center gap-2.5 px-4 py-4 text-left"
        onClick={() => {
          go('landing')
          onNavigate?.()
        }}
        aria-label="Back to landing page"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Zap className="h-4.5 w-4.5" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-bold tracking-tight">ENTC NOVA</div>
          <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Learn · Simulate · Innovate</div>
        </div>
      </button>
      <Separator />
      <nav className="scrollbar-thin flex-1 space-y-1 overflow-y-auto p-3" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
          const active = view === item.view || (view === 'lesson' && item.view === 'learn')
          return (
            <button
              key={item.view}
              onClick={() => {
                go(item.view)
                onNavigate?.()
              }}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                active ? 'bg-primary/12 font-medium text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" aria-hidden />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight className="h-3.5 w-3.5" aria-hidden />}
            </button>
          )
        })}
      </nav>
      <Separator />
      <div className="p-3">
        <div className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2.5">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Zap className="h-3.5 w-3.5 text-cyan-accent" /> Points
          </span>
          <span className="font-mono text-sm font-semibold text-cyan-accent">{points}</span>
        </div>
      </div>
    </div>
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle light/dark theme"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {mounted && theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
    </Button>
  )
}

function GlobalSearch({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const go = useNav((s) => s.go)
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search lessons, modules and actions…" />
      <CommandList className="scrollbar-thin">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          {NAV_ITEMS.map((item) => (
            <CommandItem
              key={item.view}
              value={`${item.label} ${item.hint}`}
              onSelect={() => {
                go(item.view)
                setOpen(false)
              }}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
              <span className="ml-2 text-xs text-muted-foreground">{item.hint}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Lessons">
          {ALL_LESSONS.map((l) => {
            const mod = findModuleOf(l.id)!
            return (
              <CommandItem
                key={l.id}
                value={`${l.title} ${mod.title} ${l.summary} ${l.terms.map((t) => t.term).join(' ')}`}
                onSelect={() => {
                  go('lesson', { lessonId: l.id })
                  setOpen(false)
                }}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                {l.title}
                <span className="ml-2 text-xs text-muted-foreground">{mod.title}</span>
              </CommandItem>
            )
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

function HelpPanel({ view, open, setOpen }: { view: ViewId; open: boolean; setOpen: (v: boolean) => void }) {
  const entries = HELP[view] ?? [
    { q: 'About ENTC NOVA', a: 'A smart learning & innovation platform for Electronics & Telecommunication Engineering. Tagline: Understand Electronics. Experiment Freely. Innovate Intelligently.' },
  ]
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-[320px] overflow-y-auto sm:w-[380px]">
        <SheetHeader className="pb-2">
          <SheetTitle className="flex items-center gap-2 text-base">
            <CircleHelp className="h-4 w-4 text-cyan-accent" /> Contextual help
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-4 px-4 pb-6">
          {entries.map((e, i) => (
            <div key={i} className="rounded-lg border border-border/60 bg-card p-3.5">
              <div className="text-sm font-semibold">{e.q}</div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{e.a}</p>
            </div>
          ))}
          <Separator />
          <div className="rounded-lg bg-muted/50 p-3.5 text-xs leading-relaxed text-muted-foreground">
            <div className="font-medium text-foreground">Honesty note</div>
            <p className="mt-1">
              All labs, readings and networks in ENTC NOVA are software simulations for learning — clearly labelled, never
              claiming to be physical hardware. NOVA identifies when it is running on its built-in knowledge base.
            </p>
          </div>
          <p className="text-center text-[10px] text-muted-foreground">Press Esc or click outside to close</p>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function Splash() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background">
      <div className="flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-primary text-primary-foreground">
        <Zap className="h-7 w-7" />
      </div>
      <div className="text-sm font-semibold tracking-tight">ENTC NOVA</div>
      <div className="text-xs text-muted-foreground">Loading your learning platform…</div>
    </div>
  )
}

export function NovaApp() {
  const view = useNav((s) => s.view)
  const go = useNav((s) => s.go)
  const lessonId = useNav((s) => s.lessonId)
  const setLastView = useProgress((s) => s.setLastView)
  const [ready, setReady] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [helpOpen, setHelpOpen] = React.useState(false)
  const [collapsed, setCollapsed] = React.useState(false)
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false)

  // Hydrate persisted progress once on mount, then decide the start view.
  React.useEffect(() => {
    try {
      useProgress.persist.rehydrate()
    } catch {
      // storage unavailable — continue with defaults
    }
    const state = useProgress.getState()
    const hasProgress =
      Object.keys(state.completedLessons).length > 0 ||
      state.labRuns > 0 ||
      state.gateRuns > 0 ||
      state.challengeSessions.length > 0 ||
      state.novaQuestions > 0 ||
      Object.keys(state.doctorResults).length > 0 ||
      Object.keys(state.projectActivities).length > 0
    if (hasProgress && state.lastView && state.lastView !== 'landing') {
      go(state.lastView)
    }
    setReady(true)
     
  }, [])

  // Track "continue where you left off"
  React.useEffect(() => {
    if (ready && view !== 'landing') setLastView(view)
     
  }, [view, ready])

  // Scroll to top when switching views
  React.useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [view, lessonId])

  if (!ready) return <Splash />

  if (view === 'landing') {
    return (
      <>
        <Landing />
        <GlobalSearch open={searchOpen} setOpen={setSearchOpen} />
      </>
    )
  }

  const isChat = view === 'nova'

  return (
    <div className="min-h-svh">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 hidden border-r border-border/60 bg-sidebar transition-all duration-200 lg:block',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        {collapsed ? (
          <div className="flex h-full flex-col items-center py-4">
            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"
              onClick={() => go('landing')}
              aria-label="Back to landing"
            >
              <Zap className="h-4.5 w-4.5" />
            </button>
            <nav className="mt-4 flex flex-1 flex-col items-center gap-1.5" aria-label="Main navigation (compact)">
              {NAV_ITEMS.map((item) => {
                const active = view === item.view || (view === 'lesson' && item.view === 'learn')
                return (
                  <button
                    key={item.view}
                    onClick={() => go(item.view)}
                    title={item.label}
                    aria-label={item.label}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                      active ? 'bg-primary/12 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <item.icon className="h-4.5 w-4.5" />
                  </button>
                )
              })}
            </nav>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setCollapsed(false)}
              aria-label="Expand sidebar"
            >
              <PanelLeft className="h-4.5 w-4.5" />
            </button>
          </div>
        ) : (
          <div className="relative h-full">
            <SidebarContent />
            <button
              className="absolute -right-3 top-4 flex h-6 w-6 items-center justify-center rounded-full border border-border/60 bg-card text-muted-foreground shadow-sm hover:text-foreground"
              onClick={() => setCollapsed(true)}
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </aside>

      {/* Main column */}
      <div className={cn('flex min-h-svh flex-col transition-all duration-200', collapsed ? 'lg:pl-16' : 'lg:pl-60')}>
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-border/60 bg-background/85 px-4 backdrop-blur sm:px-6">
          {/* Mobile nav */}
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <SidebarContent onNavigate={() => setMobileNavOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold tracking-tight">{VIEW_TITLES[view]}</div>
            <div className="hidden text-[11px] text-muted-foreground sm:block">
              Understand Electronics · Experiment Freely · Innovate Intelligently
            </div>
          </div>

          <button
            onClick={() => setSearchOpen(true)}
            className="flex h-9 items-center gap-2 rounded-lg border border-border/60 bg-card px-3 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            aria-label="Open global search"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Search everything</span>
            <kbd className="hidden rounded border border-border/60 bg-muted px-1.5 py-0.5 font-mono text-[10px] sm:inline">⌘K</kbd>
          </button>

          <Badge variant="outline" className="hidden gap-1 border-cyan-accent/40 text-cyan-accent md:inline-flex">
            <Zap className="h-3 w-3" />
            <PointsBadge />
          </Badge>

          <ThemeToggle />

          <Button variant="ghost" size="icon" onClick={() => setHelpOpen(true)} aria-label="Open help panel">
            <CircleHelp className="h-4.5 w-4.5" />
          </Button>
        </header>

        {/* View content */}
        <main className="flex-1">
          {view === 'dashboard' && <Dashboard />}
          {view === 'learn' && <LearnView />}
          {view === 'lesson' && <LessonView lessonId={lessonId ?? 'basics-ohms-law'} />}
          {view === 'lab' && <LabView />}
          {view === 'nova' && <NovaChatView />}
          {view === 'doctor' && <DoctorView />}
          {view === 'challenges' && <ChallengesView />}
          {view === 'innovation' && <InnovationView />}
          {view === 'progress' && <ProgressView />}
        </main>

        {/* Sticky footer (pushed naturally on long pages) */}
        {!isChat && (
          <footer className="mt-auto border-t border-border/60 bg-card/40">
            <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-[11px] text-muted-foreground sm:flex-row sm:px-6">
              <span>ENTC NOVA — Smart ENTC Learning &amp; Innovation Platform · HAKRAVYUH prototype</span>
              <span className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> All simulations are educational models, not physical hardware
                </span>
              </span>
            </div>
          </footer>
        )}
      </div>

      <GlobalSearch open={searchOpen} setOpen={setSearchOpen} />
      <HelpPanel view={view} open={helpOpen} setOpen={setHelpOpen} />
      <Toaster position="bottom-right" richColors closeButton />
    </div>
  )
}

function PointsBadge() {
  const points = useProgress((s) => s.points)
  return <span className="font-mono">{points}</span>
}
