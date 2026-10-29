'use client'

import * as React from 'react'
import { FlaskConical, TriangleAlert, CheckCircle2, XCircle, Info } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useProgress } from '@/lib/nova/store'
import { SimBadge } from './shared'
import { LogicGateSim } from './logic-gates'
import { cn } from '@/lib/utils'

const LED_TYPES = {
  red: { vf: 2.0, color: '#ef4444' },
  green: { vf: 2.1, color: '#22c55e' },
  blue: { vf: 3.0, color: '#3b82f6' },
} as const

type LedType = keyof typeof LED_TYPES

function fmtResistance(r: number): string {
  return r >= 1000 ? `${(r / 1000).toFixed(r % 1000 === 0 ? 0 : 1)} kΩ` : `${r} Ω`
}

// ─── Circuit SVG ────────────────────────────────────────────────────────────

function CircuitSVG({
  voltage,
  resistance,
  switchOn,
  reversed,
  ledType,
  current,
}: {
  voltage: number
  resistance: number
  switchOn: boolean
  reversed: boolean
  ledType: LedType
  current: number
}) {
  const conducting = current > 0
  const brightness = conducting ? Math.min(1, 0.25 + current / 26) : 0
  const led = LED_TYPES[ledType]
  const wireClass = 'stroke-foreground/60'

  return (
    <svg viewBox="0 0 440 250" className="h-auto w-full" role="img" aria-label="Interactive series circuit: battery, resistor, LED and switch">
      {/* loop wires */}
      <path d="M60,70 H210 M290,70 H380 V105 M380,155 V195 H240 M180,195 H60 V155 M60,105 V70" fill="none" className={wireClass} strokeWidth="2.5" strokeLinecap="round" />
      {/* animated current overlay */}
      {conducting && (
        <path
          d="M60,70 H210 M290,70 H380 V105 M380,155 V195 H240 M180,195 H60 V155 M60,105 V70"
          fill="none"
          className="current-flow stroke-cyan-accent"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ animationDirection: reversed ? 'reverse' : 'normal' }}
        />
      )}

      {/* battery (left) */}
      <line x1={60} y1={105} x2={60} y2={117} className={wireClass} strokeWidth="3" />
      <line x1={42} y1={117} x2={78} y2={117} className="stroke-primary" strokeWidth="4" />
      <line x1={50} y1={131} x2={70} y2={131} className="stroke-primary" strokeWidth="4" />
      <line x1={60} y1={131} x2={60} y2={155} className={wireClass} strokeWidth="3" />
      <text x={26} y={110} fontSize="11" className="fill-primary">+</text>
      <text x={26} y={146} fontSize="11" className="fill-muted-foreground">−</text>
      <text x={16} y={128} fontSize="12" className="fill-foreground" fontWeight="600">{voltage} V</text>

      {/* resistor (top) */}
      <path d="M210,70 l5,-9 10,18 10,-18 10,18 10,-18 10,18 5,-9" fill="none" className={wireClass} strokeWidth="2.5" />
      <text x={250} y={46} fontSize="11" textAnchor="middle" className="fill-cyan-accent">{fmtResistance(resistance)}</text>

      {/* LED (right, vertical) */}
      {/* terminals */}
      <line x1={380} y1={105} x2={380} y2={115} className={wireClass} strokeWidth="2.5" />
      <line x1={380} y1={145} x2={380} y2={155} className={wireClass} strokeWidth="2.5" />
      {reversed ? (
        // triangle pointing UP (anode at bottom) = blocked
        <>
          <path d="M380,145 L370,128 L390,128 Z" fill={led.color} fillOpacity={brightness * 0.85} stroke={led.color} strokeWidth="2" />
          <line x1={368} y1={115} x2={392} y2={115} className="stroke-foreground/70" strokeWidth="2.5" />
        </>
      ) : (
        // triangle pointing DOWN (anode at top) = conducting direction
        <>
          <path d="M380,115 L370,132 L390,132 Z" fill={led.color} fillOpacity={brightness * 0.85} stroke={led.color} strokeWidth="2" />
          <line x1={368} y1={145} x2={392} y2={145} className="stroke-foreground/70" strokeWidth="2.5" />
        </>
      )}
      {brightness > 0 && (
        <>
          <circle cx={380} cy={130} r={18} fill="none" stroke={led.color} strokeOpacity={0.4 * brightness} strokeWidth="2" />
          <circle cx={380} cy={130} r={26} fill="none" stroke={led.color} strokeOpacity={0.18 * brightness} strokeWidth="2" />
        </>
      )}
      <text x={404} y={126} fontSize="10" className="fill-muted-foreground">{reversed ? 'reversed' : 'LED'}</text>
      <text x={404} y={140} fontSize="10" className="fill-muted-foreground">Vᶠ≈{led.vf} V</text>

      {/* switch (bottom) */}
      <circle cx={180} cy={195} r={4} className="fill-foreground" />
      <circle cx={240} cy={195} r={4} className="fill-foreground" />
      {switchOn ? (
        <line x1={180} y1={195} x2={240} y2={195} className="stroke-primary" strokeWidth="3" />
      ) : (
        <line x1={180} y1={195} x2={232} y2={172} className="stroke-foreground/70" strokeWidth="3" />
      )}
      <text x={210} y={222} fontSize="11" textAnchor="middle" className={switchOn ? 'fill-primary' : 'fill-muted-foreground'}>
        switch: {switchOn ? 'closed (ON)' : 'open (OFF)'}
      </text>

      {/* current label */}
      {conducting && (
        <>
          <text x={150} y={46} fontSize="12" className="fill-cyan-accent" fontWeight="600">
            I = {current.toFixed(1)} mA
          </text>
          <path d="M96,62 l10,8 -10,8 z" className="fill-cyan-accent" />
        </>
      )}
      {!conducting && (
        <text x={150} y={46} fontSize="12" className="fill-muted-foreground">I = 0 mA</text>
      )}
    </svg>
  )
}

// ─── Main lab view ──────────────────────────────────────────────────────────

export function LabView() {
  const recordLabRun = useProgress((s) => s.recordLabRun)
  const [voltage, setVoltage] = React.useState(5)
  const [resistance, setResistance] = React.useState(330)
  const [switchOn, setSwitchOn] = React.useState(true)
  const [reversed, setReversed] = React.useState(false)
  const [ledType, setLedType] = React.useState<LedType>('red')
  const [vInput, setVInput] = React.useState('5')
  const [rInput, setRInput] = React.useState('330')

  const vf = LED_TYPES[ledType].vf

  // Validation
  const vNum = Number(vInput)
  const rNum = Number(rInput)
  const vValid = Number.isFinite(vNum) && vNum >= 1 && vNum <= 12
  const rValid = Number.isFinite(rNum) && rNum >= 10 && rNum <= 10000

  const effV = vValid ? vNum : voltage
  const effR = rValid ? rNum : resistance

  // Physics: I = (V − Vf) / R when closed, forward-biased, and V > Vf
  const current = React.useMemo(() => {
    if (!switchOn || reversed || effV <= vf || !vValid || !rValid) return 0
    return ((effV - vf) / effR) * 1000 // mA
  }, [switchOn, reversed, effV, effR, vf, vValid, rValid])

  const status: {
    tone: 'ok' | 'warn' | 'error' | 'info'
    title: string
    detail: string
  } = (() => {
    if (!vValid || !rValid)
      return {
        tone: 'error',
        title: 'Invalid input',
        detail: !vValid ? 'Voltage must be between 1 V and 12 V.' : 'Resistance must be between 10 Ω and 10 kΩ. Adjust the value to continue.',
      }
    if (!switchOn)
      return { tone: 'info', title: 'Circuit is open', detail: 'The switch is OFF, so the loop is broken. No current flows anywhere in a series circuit — close the switch to complete the loop.' }
    if (reversed)
      return { tone: 'error', title: 'LED is reversed', detail: 'An LED is a diode: with the cathode facing the positive side it blocks current completely. Flip its direction to conduct.' }
    if (effV <= vf)
      return { tone: 'info', title: 'Voltage below forward voltage', detail: `A ${ledType} LED needs about ${vf} V to start conducting. At ${effV} V the junction stays blocked and I = 0.` }
    if (current > 30)
      return { tone: 'error', title: 'Overcurrent — LED at risk', detail: `${current.toFixed(1)} mA exceeds the ~30 mA absolute limit of a typical 5 mm indicator LED. It would overheat and fail. Increase the series resistance.` }
    if (current > 20)
      return { tone: 'warn', title: 'Bright and warm', detail: `${current.toFixed(1)} mA is within the maximum rating but near the top of the safe zone (5–20 mA). It will run hot — a larger resistor would extend its life.` }
    if (current < 1)
      return { tone: 'info', title: 'Very dim', detail: `${current.toFixed(2)} mA is barely visible. Most indicator LEDs need at least 1–2 mA to be seen clearly.` }
    return { tone: 'ok', title: 'Circuit conducting normally', detail: `${current.toFixed(1)} mA is a healthy indicator current (5–20 mA). Ohm's law at work: I = (V − Vᶠ) / R.` }
  })()

  const toggleSwitch = (on: boolean) => {
    setSwitchOn(on)
    if (on && vValid && rValid && !reversed && effV > vf) {
      recordLabRun()
      toast.success(`Experiment running — I = ${(((effV - vf) / effR) * 1000).toFixed(1)} mA`)
    }
  }

  const applyPreset = (p: 'healthy' | 'over' | 'reversed' | 'open') => {
    if (p === 'healthy') {
      setVoltage(5); setVInput('5'); setResistance(330); setRInput('330'); setReversed(false); setLedType('red'); setSwitchOn(true)
    } else if (p === 'over') {
      setVoltage(9); setVInput('9'); setResistance(82); setRInput('82'); setReversed(false); setLedType('red'); setSwitchOn(true)
    } else if (p === 'reversed') {
      setVoltage(5); setVInput('5'); setResistance(330); setRInput('330'); setReversed(true); setLedType('red'); setSwitchOn(true)
    } else {
      setSwitchOn(false)
    }
    toast.info('Preset applied — observe the status panel.')
  }

  const power = current > 0 ? (effV * current) / 1000 : 0

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-6 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Virtual Electronics Lab</h1>
          <p className="mt-0.5 max-w-2xl text-sm text-muted-foreground">
            Browser-based circuit experiments with live Ohm&apos;s-law maths. Everything here is a deterministic
            simulation — clearly labelled, never real hardware.
          </p>
        </div>
        <SimBadge label="Simulations only" />
      </div>

      <Tabs defaultValue="circuit" className="mt-5">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="circuit" className="gap-1.5">
            <FlaskConical className="h-4 w-4" /> DC Circuit
          </TabsTrigger>
          <TabsTrigger value="gates">Logic Gates</TabsTrigger>
        </TabsList>

        {/* ── DC circuit ── */}
        <TabsContent value="circuit" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-5">
            <Card className="border-border/60 lg:col-span-3">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold">Series circuit · battery → resistor → LED → switch</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    I = (V − Vᶠ) / R
                  </Badge>
                </div>
                <div className="mt-3 rounded-lg border border-border/50 bg-card p-2">
                  <CircuitSVG
                    voltage={effV}
                    resistance={effR}
                    switchOn={switchOn}
                    reversed={reversed}
                    ledType={ledType}
                    current={current}
                  />
                </div>

                {/* status panel */}
                <div
                  className={cn(
                    'mt-4 flex items-start gap-2.5 rounded-lg border px-3.5 py-3',
                    status.tone === 'ok' && 'border-emerald-500/30 bg-emerald-500/5',
                    status.tone === 'warn' && 'border-amber-500/30 bg-amber-500/5',
                    status.tone === 'error' && 'border-rose-500/30 bg-rose-500/5',
                    status.tone === 'info' && 'border-cyan-accent/30 bg-cyan-accent/5'
                  )}
                  role="status"
                  aria-live="polite"
                >
                  {status.tone === 'ok' && <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-500" />}
                  {status.tone === 'warn' && <TriangleAlert className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-500" />}
                  {status.tone === 'error' && <XCircle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-rose-500" />}
                  {status.tone === 'info' && <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-cyan-accent" />}
                  <div>
                    <div className="text-sm font-semibold">{status.title}</div>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{status.detail}</p>
                  </div>
                </div>

                {/* worked calculation */}
                {current > 0 && (
                  <div className="fade-up mt-3 rounded-lg bg-muted/50 px-3.5 py-3 font-mono text-xs leading-relaxed text-muted-foreground">
                    I = (V − Vᶠ) / R = ({effV} V − {vf} V) / {fmtResistance(effR)} = {((effV - vf) / effR).toFixed(4)} A ≈{' '}
                    <span className="font-semibold text-cyan-accent">{current.toFixed(1)} mA</span>
                    <span className="ml-2">· P = V×I = {power.toFixed(2)} W (whole circuit)</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Controls */}
            <Card className="border-border/60 lg:col-span-2">
              <CardContent className="space-y-5 p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Controls</span>
                  <label className="flex items-center gap-2 text-sm">
                    <Switch checked={switchOn} onCheckedChange={toggleSwitch} aria-label="Circuit switch" />
                    {switchOn ? 'ON' : 'OFF'}
                  </label>
                </div>

                {/* voltage */}
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium">Supply voltage</span>
                    <span className="font-mono text-cyan-accent">{effV} V</span>
                  </div>
                  <Slider
                    value={[effV]}
                    min={1}
                    max={12}
                    step={1}
                    onValueChange={([v]) => {
                      setVoltage(v)
                      setVInput(String(v))
                    }}
                    aria-label="Supply voltage"
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <Input
                      value={vInput}
                      onChange={(e) => setVInput(e.target.value)}
                      className="h-8 w-24 font-mono text-xs"
                      inputMode="decimal"
                      aria-label="Voltage value in volts"
                    />
                    <span className="text-xs text-muted-foreground">V · 1–12</span>
                    {!vValid && <span className="text-xs font-medium text-rose-500">must be 1–12</span>}
                  </div>
                </div>

                {/* resistance */}
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium">Series resistance</span>
                    <span className="font-mono text-cyan-accent">{fmtResistance(effR)}</span>
                  </div>
                  <Slider
                    value={[effR]}
                    min={10}
                    max={10000}
                    step={10}
                    onValueChange={([r]) => {
                      setResistance(r)
                      setRInput(String(r))
                    }}
                    aria-label="Series resistance"
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <Input
                      value={rInput}
                      onChange={(e) => setRInput(e.target.value)}
                      className="h-8 w-24 font-mono text-xs"
                      inputMode="numeric"
                      aria-label="Resistance value in ohms"
                    />
                    <span className="text-xs text-muted-foreground">Ω · 10–10,000</span>
                    {!rValid && <span className="text-xs font-medium text-rose-500">must be 10–10k</span>}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {[100, 330, 1000, 4700, 10000].map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          setResistance(r)
                          setRInput(String(r))
                        }}
                        className="rounded-md border border-border/60 px-2 py-0.5 text-[11px] text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      >
                        {fmtResistance(r)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* LED type + polarity */}
                <div>
                  <div className="mb-2 text-sm font-medium">LED colour (sets Vᶠ)</div>
                  <div className="flex gap-2">
                    {(Object.keys(LED_TYPES) as LedType[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setLedType(t)}
                        className={cn(
                          'flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium capitalize transition-colors',
                          ledType === t ? 'border-primary bg-primary/10 text-foreground' : 'border-border/60 text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: LED_TYPES[t].color }} aria-hidden />
                        {t} · {LED_TYPES[t].vf} V
                      </button>
                    ))}
                  </div>
                </div>
                <label className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2.5 text-sm">
                  <span>
                    LED direction
                    <span className="block text-xs text-muted-foreground">Flip to simulate reversed polarity</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{reversed ? 'reversed' : 'forward'}</span>
                    <Switch checked={reversed} onCheckedChange={setReversed} aria-label="Reverse LED polarity" />
                  </span>
                </label>

                {/* presets */}
                <div>
                  <div className="mb-2 text-sm font-medium">Scenario presets</div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" onClick={() => applyPreset('healthy')}>Healthy circuit</Button>
                    <Button variant="outline" size="sm" onClick={() => applyPreset('over')}>Overcurrent risk</Button>
                    <Button variant="outline" size="sm" onClick={() => applyPreset('reversed')}>Reversed LED</Button>
                    <Button variant="outline" size="sm" onClick={() => applyPreset('open')}>Open switch</Button>
                  </div>
                </div>

                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground">Assumptions:</span> ideal wires (0 Ω), LED modelled as
                  constant Vᶠ drop, resistor tolerance ignored. Real measurements on breadboards will differ — this
                  demonstrates the relationships, not lab-grade accuracy.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Logic gates ── */}
        <TabsContent value="gates" className="mt-4">
          <LogicGateSim />
        </TabsContent>
      </Tabs>
    </div>
  )
}
