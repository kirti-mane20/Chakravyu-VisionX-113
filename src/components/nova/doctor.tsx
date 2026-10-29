'use client'

import * as React from 'react'
import {
  ArrowLeft, ArrowRight, CheckCircle2, XCircle, Stethoscope, Eye, Wrench, SearchCheck,
  RotateCcw, Lightbulb,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useNav } from '@/lib/nova/nav'
import { useProgress } from '@/lib/nova/store'
import { DOCTOR_CASES } from '@/lib/nova/doctor'
import { NovaIcon, PageHeader, DifficultyBadge, EmptyState } from './shared'
import { cn } from '@/lib/utils'
import type { DoctorCase, DoctorDiagramKind } from '@/lib/nova/types'

// ─── Case diagrams ──────────────────────────────────────────────────────────

const wire = 'stroke-foreground/60'
const hot = 'stroke-rose-500'

function BaseCircuit({ children, highlight, ledReversed = false }: { children?: React.ReactNode; highlight?: string; ledReversed?: boolean }) {
  return (
    <svg viewBox="0 0 440 240" className="h-auto w-full" role="img" aria-label="Circuit under investigation">
      {/* frame wires with adjustable bottom-right segment */}
      <path d="M60,60 H380 M60,60 V180 M380,60 V105" fill="none" className={wire} strokeWidth="2.5" strokeLinecap="round" />
      {/* battery */}
      <line x1={60} y1={180} x2={60} y2={150} className={wire} strokeWidth="2.5" />
      <line x1={44} y1={150} x2={76} y2={150} className="stroke-primary" strokeWidth="4" />
      <line x1={50} y1={136} x2={70} y2={136} className="stroke-primary" strokeWidth="4" />
      <text x={20} y={148} fontSize="12" className="fill-muted-foreground">5 V</text>
      <path d="M60,136 V110 H60" stroke="none" />
      <line x1={60} y1={110} x2={60} y2={60} className={wire} strokeWidth="2.5" />
      {/* resistor */}
      <path d="M150,60 l6,-9 12,18 12,-18 12,18 12,-18 12,18 6,-9" fill="none" className={wire} strokeWidth="2.5" />
      <text x={186} y={36} fontSize="11" textAnchor="middle" className="fill-muted-foreground">R</text>
      {/* LED */}
      {ledReversed ? (
        <>
          <line x1={368} y1={112} x2={392} y2={112} className="stroke-foreground/70" strokeWidth="2.5" />
          <path d="M380,135 L370,118 L390,118 Z" fill="none" stroke="#ef4444" strokeWidth="2" />
        </>
      ) : (
        <>
          <path d="M380,105 L370,122 L390,122 Z" fill="#ef4444" fillOpacity="0.75" stroke="#ef4444" strokeWidth="2" />
          <line x1={368} y1={135} x2={392} y2={135} className="stroke-foreground/70" strokeWidth="2.5" />
        </>
      )}
      {highlight === 'led' && <rect x={356} y={98} width={48} height={44} rx={6} fill="none" className={hot} strokeWidth="1.5" strokeDasharray="5 3" />}
      {children}
      <text x={220} y={225} fontSize="11" textAnchor="middle" className="fill-muted-foreground">
        Red = zone matching the reported symptom — not necessarily the fault itself
      </text>
    </svg>
  )
}

function DoctorDiagram({ kind }: { kind: DoctorDiagramKind }) {
  switch (kind) {
    case 'led-broken-wire':
      return (
        <BaseCircuit highlight={undefined}>
          {/* broken return wire: gap after LED */}
          <path d="M380,135 V180 H330" fill="none" className={wire} strokeWidth="2.5" />
          <path d="M285,180 H240 M240,180 H60" fill="none" className={wire} strokeWidth="2.5" />
          <circle cx={330} cy={180} r={3} className="fill-foreground" />
          <circle cx={285} cy={180} r={3} className="fill-foreground" />
          <line x1={285} y1={180} x2={330} y2={180} className={hot} strokeWidth="2" strokeDasharray="6 5" />
          <rect x={278} y={168} width={60} height={24} rx={4} fill="none" className={hot} strokeWidth="1.5" strokeDasharray="5 3" />
          <text x={308} y={160} fontSize="10" textAnchor="middle" className="fill-rose-500">lifted wire?</text>
        </BaseCircuit>
      )
    case 'led-open-switch':
      return (
        <BaseCircuit>
          <path d="M380,135 V180 H265" fill="none" className={wire} strokeWidth="2.5" />
          <path d="M180,180 H60" fill="none" className={wire} strokeWidth="2.5" />
          <circle cx={265} cy={180} r={4} className="fill-foreground" />
          <circle cx={205} cy={180} r={4} className="fill-foreground" />
          {/* lever drawn open while label says ON */}
          <line x1={205} y1={180} x2={258} y2={158} className="stroke-foreground/80" strokeWidth="3" />
          <rect x={198} y={148} width={74} height={44} rx={4} fill="none" className={hot} strokeWidth="1.5" strokeDasharray="5 3" />
          <text x={235} y={212} fontSize="10" textAnchor="middle" className="fill-foreground">switch label: ON</text>
        </BaseCircuit>
      )
    case 'led-wrong-resistor':
      return (
        <BaseCircuit highlight="led">
          <path d="M380,135 V180 H60" fill="none" className={wire} strokeWidth="2.5" />
          <circle cx={186} cy={60} r={0} />
          <text x={186} y={22} fontSize="11" textAnchor="middle" className="fill-rose-500">measured: 30 mA</text>
          <rect x={140} y={40} width={92} height={38} rx={6} fill="none" className={hot} strokeWidth="1.5" strokeDasharray="5 3" />
          <text x={400} y={92} fontSize="9" className="fill-rose-500">hot!</text>
        </BaseCircuit>
      )
    case 'led-reversed':
      return (
        <BaseCircuit highlight="led" ledReversed>
          {/* reversed LED: cathode bar towards the resistor (top), triangle pointing up */}
          <path d="M380,135 V180 H60" fill="none" className={wire} strokeWidth="2.5" />
          <text x={414} y={116} fontSize="9" className="fill-muted-foreground">flat rim ↑</text>
        </BaseCircuit>
      )
    case 'gate-wrong-input':
      return (
        <svg viewBox="0 0 440 240" className="h-auto w-full" role="img" aria-label="Gate circuit under investigation">
          {/* switches */}
          <text x={20} y={80} fontSize="12" className="fill-foreground">A: ON</text>
          <line x1={70} y1={76} x2={160} y2={76} className="stroke-cyan-accent" strokeWidth="2.5" />
          <text x={20} y={130} fontSize="12" className="fill-foreground">B: ON</text>
          <line x1={70} y1={126} x2={110} y2={126} className="stroke-cyan-accent" strokeWidth="2.5" />
          {/* B wire bends to wrong pin */}
          <path d="M110,126 L130,126 L130,160 L160,160" fill="none" className={hot} strokeWidth="2.5" />
          <rect x={122} y={118} width={70} height={50} rx={6} fill="none" className={hot} strokeWidth="1.5" strokeDasharray="5 3" />
          {/* IC */}
          <rect x={160} y={50} width={90} height={130} rx={8} className="fill-card stroke-foreground/50" strokeWidth="1.5" />
          <text x={205} y={44} fontSize="11" textAnchor="middle" className="fill-foreground">74HC08 (quad AND)</text>
          <circle cx={172} cy={62} r={3} className="fill-foreground" />
          <text x={140} y={80} fontSize="9" textAnchor="end" className="fill-muted-foreground">pin1 A</text>
          <text x={140} y={164} fontSize="9" textAnchor="end" className="fill-muted-foreground">pin6 out2!</text>
          <text x={258} y={80} fontSize="9" className="fill-muted-foreground">pin2 B ← should be here</text>
          <text x={258} y={164} fontSize="9" className="fill-muted-foreground">pin6 = 2nd gate output</text>
          {/* output */}
          <line x1={250} y1={90} x2={330} y2={90} className="stroke-cyan-accent" strokeWidth="2.5" />
          <circle cx={348} cy={90} r={14} className="fill-amber-400/80 stroke-amber-500" strokeWidth="2" />
          <text x={348} y={120} fontSize="10" textAnchor="middle" className="fill-muted-foreground">LED: ON</text>
          <text x={220} y={222} fontSize="11" textAnchor="middle" className="fill-muted-foreground">
            Output follows A regardless of B — investigate inputs at the IC pins
          </text>
        </svg>
      )
    default:
      return <BaseCircuit />
    }
}

// ─── Case runner ────────────────────────────────────────────────────────────

type Stage = 'investigate' | 'fault' | 'fix' | 'done'

function CaseRunner({ caseData, onBack }: { caseData: DoctorCase; onBack: () => void }) {
  const recordDoctor = useProgress((s) => s.recordDoctor)
  const solvedRecord = useProgress((s) => s.doctorResults[caseData.id])

  const [stage, setStage] = React.useState<Stage>('investigate')
  const [revealedClues, setRevealedClues] = React.useState<number>(0)
  const [faultPick, setFaultPick] = React.useState<string | null>(null)
  const [fixPick, setFixPick] = React.useState<string | null>(null)
  const [faultFeedback, setFaultFeedback] = React.useState<'correct' | 'wrong' | null>(null)
  const [fixFeedback, setFixFeedback] = React.useState<'correct' | 'wrong' | null>(null)
  const [wrongSubmissions, setWrongSubmissions] = React.useState(0)

  const submitFault = () => {
    if (faultPick === null) return
    if (faultPick === caseData.correctFaultId) {
      setFaultFeedback('correct')
      toast.success('Fault identified correctly!')
      setTimeout(() => setStage('fix'), 650)
    } else {
      setFaultFeedback('wrong')
      setWrongSubmissions((w) => w + 1)
    }
  }

  const submitFix = () => {
    if (fixPick === null) return
    if (fixPick === caseData.correctFixId) {
      setFixFeedback('correct')
      const attempts = wrongSubmissions + 1
      recordDoctor(caseData.id, true, attempts)
      toast.success(`Case solved in ${attempts} submission${attempts === 1 ? '' : 's'}!`)
      setTimeout(() => setStage('done'), 650)
    } else {
      setFixFeedback('wrong')
      setWrongSubmissions((w) => w + 1)
    }
  }

  return (
    <div className="fade-up mx-auto w-full max-w-4xl px-4 pb-12 pt-6 sm:px-6">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft className="h-4 w-4" /> All cases
      </Button>

      <div className="mt-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-primary/40 text-primary">Case {caseData.order}</Badge>
          <DifficultyBadge difficulty={caseData.difficulty} />
          {solvedRecord?.solved && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/12 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3 w-3" /> previously solved
            </span>
          )}
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">{caseData.title}</h1>
      </div>

      {/* Scenario */}
      <Card className="mt-4 border-border/60">
        <CardContent className="p-4 sm:p-5">
          <p className="text-sm leading-relaxed">{caseData.scenario}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">Expected behaviour</div>
              <p className="mt-1 text-sm text-muted-foreground">{caseData.expectedBehavior}</p>
            </div>
            <div className="rounded-lg border border-rose-500/25 bg-rose-500/5 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-rose-500">Observed behaviour</div>
              <p className="mt-1 text-sm text-muted-foreground">{caseData.observedBehavior}</p>
            </div>
          </div>
          <div className="mt-3 rounded-lg border border-border/50 bg-card p-3">
            <DoctorDiagram kind={caseData.diagram} />
          </div>
        </CardContent>
      </Card>

      {/* Step 1 — clues */}
      <Card className="mt-4 border-border/60">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Eye className="h-4 w-4 text-cyan-accent" /> Step 1 — Inspect the clues
            </h2>
            <span className="text-xs text-muted-foreground">
              {revealedClues}/{caseData.clues.length} revealed
            </span>
          </div>
          <div className="mt-3 space-y-2">
            {caseData.clues.map((clue, i) => (
              <div key={i}>
                {i < revealedClues ? (
                  <div className="fade-up rounded-lg border border-border/50 bg-muted/40 px-3.5 py-2.5">
                    <div className="text-sm font-medium">{clue.label}</div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{clue.detail}</p>
                  </div>
                ) : i === revealedClues ? (
                  <button
                    onClick={() => setRevealedClues((c) => c + 1)}
                    className="flex w-full items-center gap-2 rounded-lg border border-dashed border-cyan-accent/50 px-3.5 py-2.5 text-sm text-cyan-accent transition-colors hover:bg-cyan-accent/5"
                  >
                    <SearchCheck className="h-4 w-4" /> Reveal clue {i + 1} of {caseData.clues.length}
                  </button>
                ) : null}
              </div>
            ))}
          </div>
          {revealedClues < caseData.clues.length && (
            <p className="mt-2 text-xs text-muted-foreground">
              Reveal clues one at a time and reason before choosing — good technicians minimise guesswork.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Step 2 — identify fault */}
      <Card className="mt-4 border-border/60">
        <CardContent className="p-4 sm:p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Stethoscope className="h-4 w-4 text-cyan-accent" /> Step 2 — Identify the fault
          </h2>
          <div className="mt-3 grid gap-2">
            {caseData.faultOptions.map((opt) => {
              const revealed = faultPick !== null
              const isCorrect = opt.id === caseData.correctFaultId
              const isPicked = opt.id === faultPick
              return (
                <button
                  key={opt.id}
                  disabled={stage !== 'investigate' && stage !== 'fault'}
                  onClick={() => {
                    setFaultPick(opt.id)
                    setFaultFeedback(null)
                  }}
                  className={cn(
                    'rounded-lg border px-3.5 py-2.5 text-left text-sm transition-colors',
                    faultPick === null && 'border-border/60 hover:border-primary/50 hover:bg-primary/5',
                    faultPick !== null && isCorrect && 'border-emerald-500/50 bg-emerald-500/10',
                    faultPick !== null && isPicked && !isCorrect && 'border-rose-500/50 bg-rose-500/10',
                    faultPick !== null && !isCorrect && !isPicked && 'border-border/50 opacity-60'
                  )}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>

          {faultFeedback === 'wrong' && (
            <div className="fade-up mt-3 flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/5 px-3.5 py-2.5 text-sm">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
              <div>
                Not this one. Re-read the clues — especially the measurements — and compare with what each option claims. You can try again.
              </div>
            </div>
          )}
          {faultFeedback === 'correct' && (
            <div className="fade-up mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3.5 py-2.5 text-sm">
              <div className="flex items-center gap-2 font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> Correct diagnosis
              </div>
              <p className="mt-1 text-muted-foreground">{caseData.faultExplanation}</p>
            </div>
          )}

          {(stage === 'investigate' || stage === 'fault') && (
            <div className="mt-3 flex justify-end">
              <Button size="sm" onClick={submitFault} disabled={faultPick === null}>
                Submit diagnosis <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step 3 — choose fix */}
      {(stage === 'fix' || stage === 'done') && (
        <Card className="fade-up mt-4 border-border/60">
          <CardContent className="p-4 sm:p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Wrench className="h-4 w-4 text-cyan-accent" /> Step 3 — Choose the correction
            </h2>
            <div className="mt-3 grid gap-2">
              {caseData.fixOptions.map((opt) => {
                const revealed = fixPick !== null
                const isCorrect = opt.id === caseData.correctFixId
                const isPicked = opt.id === fixPick
                return (
                  <button
                    key={opt.id}
                    disabled={stage === 'done'}
                    onClick={() => {
                      setFixPick(opt.id)
                      setFixFeedback(null)
                    }}
                    className={cn(
                      'rounded-lg border px-3.5 py-2.5 text-left text-sm transition-colors',
                      fixPick === null && 'border-border/60 hover:border-primary/50 hover:bg-primary/5',
                      revealed && isCorrect && 'border-emerald-500/50 bg-emerald-500/10',
                      revealed && isPicked && !isCorrect && 'border-rose-500/50 bg-rose-500/10',
                      revealed && !isCorrect && !isPicked && 'border-border/50 opacity-60'
                    )}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>

            {fixFeedback === 'wrong' && (
              <div className="fade-up mt-3 flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/5 px-3.5 py-2.5 text-sm">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                <div>That fix does not address the confirmed fault. Think about what the diagnosis implies physically.</div>
              </div>
            )}
            {fixFeedback === 'correct' && (
              <div className="fade-up mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3.5 py-2.5 text-sm">
                <div className="flex items-center gap-2 font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" /> Fix applied — circuit repaired
                </div>
                <p className="mt-1 text-muted-foreground">{caseData.fixExplanation}</p>
              </div>
            )}

            {stage === 'fix' && (
              <div className="mt-3 flex justify-end">
                <Button size="sm" onClick={submitFix} disabled={fixPick === null}>
                  Apply fix <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Completion */}
      {stage === 'done' && (
        <Card className="fade-up mt-4 border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="p-5">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
                <Lightbulb className="h-6 w-6" />
              </div>
              <div>
                <div className="text-lg font-semibold">Case closed</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {wrongSubmissions === 0
                    ? 'Flawless diagnosis — you identified and fixed the fault on the first submission. +20 points.'
                    : `Solved after ${wrongSubmissions} wrong submission${wrongSubmissions === 1 ? '' : 's'} — each mistake narrowed the search. +20 points.`}
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 pt-1">
                {caseData.concepts.map((c) => (
                  <Badge key={c} variant="outline" className="text-cyan-accent border-cyan-accent/40">
                    {c}
                  </Badge>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <Button variant="outline" size="sm" onClick={onBack}>
                  Next case
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setStage('investigate')
                    setRevealedClues(0)
                    setFaultPick(null)
                    setFixPick(null)
                    setFaultFeedback(null)
                    setFixFeedback(null)
                    setWrongSubmissions(0)
                  }}
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Retry this case
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ─── Case list ──────────────────────────────────────────────────────────────

export function DoctorView() {
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const progress = useProgress()

  const selected = DOCTOR_CASES.find((c) => c.id === selectedId)
  if (selected) return <CaseRunner caseData={selected} onBack={() => setSelectedId(null)} />

  const solvedCount = Object.values(progress.doctorResults).filter((r) => r.solved).length

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-10 pt-6 sm:px-6">
      <PageHeader
        title="Circuit Doctor"
        subtitle="Five progressively harder circuit faults. Inspect clues, diagnose the fault, then choose the right fix — learn to reason like a technician."
        icon="Stethoscope"
        actions={
          <Badge variant="outline" className="border-cyan-accent/40 text-cyan-accent">
            {solvedCount}/{DOCTOR_CASES.length} solved
          </Badge>
        }
      />

      <div className="mt-5 grid gap-3">
        {DOCTOR_CASES.map((c) => {
          const rec = progress.doctorResults[c.id]
          return (
            <Card
              key={c.id}
              className={cn(
                'cursor-pointer border-border/60 transition-all hover:border-primary/40',
                rec?.solved && 'border-emerald-500/25'
              )}
              onClick={() => setSelectedId(c.id)}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div
                  className={cn(
                    'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold',
                    rec?.solved ? 'bg-emerald-500/15 text-emerald-500' : 'bg-primary/10 text-primary'
                  )}
                >
                  {rec?.solved ? <CheckCircle2 className="h-5 w-5" /> : c.order}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{c.title}</span>
                    <DifficultyBadge difficulty={c.difficulty} />
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{c.scenario}</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {c.concepts.slice(0, 3).map((concept) => (
                      <span key={concept} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
                {rec && (
                  <div className="shrink-0 text-right text-xs text-muted-foreground">
                    {rec.solved ? (
                      <span className="text-emerald-500">solved</span>
                    ) : (
                      <span>attempted</span>
                    )}
                    <div>{rec.attempts} submission{rec.attempts === 1 ? '' : 's'}</div>
                  </div>
                )}
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </CardContent>
            </Card>
          )
        })}
      </div>

      {solvedCount === DOCTOR_CASES.length && (
        <Card className="mt-4 border-cyan-accent/30 bg-cyan-accent/5">
          <CardContent className="flex items-center gap-3 p-4">
            <NovaIcon name="Award" className="h-5 w-5 text-cyan-accent" />
            <p className="text-sm">
              All cases solved — you have the full diagnostic routine down. Keep the habit: <strong>measure, don&apos;t guess</strong>.
            </p>
          </CardContent>
        </Card>
      )}

      {solvedCount === 0 && (
        <div className="mt-5">
          <EmptyState
            icon="Stethoscope"
            title="No cases diagnosed yet"
            description="Start with Case 1 — a dark LED circuit. You will get three clues and instant feedback on every submission."
          />
        </div>
      )}
    </div>
  )
}
