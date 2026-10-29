'use client'

import * as React from 'react'
import {
  ArrowLeft, ArrowRight, Home, ShieldAlert, Radio, Fan, Lightbulb, Thermometer, Wind,
  Eye, Gauge, Signal, Send, CircleCheck, TriangleAlert, OctagonX, RadioTower,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { useNav } from '@/lib/nova/nav'
import { useProgress } from '@/lib/nova/store'
import { PROJECTS } from '@/lib/nova/projects'
import { NovaIcon, PageHeader, QuizCard, SimBadge, StatCard } from './shared'
import { cn } from '@/lib/utils'
import type { ProjectMeta } from '@/lib/nova/types'

// ═══ Project A: Smart Home Automation ═══════════════════════════════════════

function SmartHomeSim() {
  const [lux, setLux] = React.useState(600) // ambient light 0–1000 lx
  const [temp, setTemp] = React.useState(24) // room temperature 16–38 °C
  const [presence, setPresence] = React.useState(true)
  const [autoLight, setAutoLight] = React.useState(true)
  const [autoFan, setAutoFan] = React.useState(true)
  const [manualLight, setManualLight] = React.useState(false)
  const [manualFanSpeed, setManualFanSpeed] = React.useState(0)

  // Control logic (the "firmware")
  const isDark = lux < 200
  const lightOn = autoLight ? isDark && presence : manualLight
  const lightBrightness = lightOn ? Math.round(Math.max(30, 100 - lux / 10)) : 0
  const autoFanSpeed = presence ? (temp >= 30 ? 3 : temp >= 26 ? 2 : temp >= 23 ? 1 : 0) : 0
  const fanSpeed = autoFan ? autoFanSpeed : manualFanSpeed

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <Card className="border-border/60 lg:col-span-3">
        <CardContent className="p-4 sm:p-5">
          {/* room visual */}
          <div className="relative flex h-56 flex-col items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-muted/30">
            <div
              className="absolute inset-0 transition-colors duration-500"
              style={{
                background: `linear-gradient(to bottom, rgba(0,0,0,${Math.max(0, 0.75 - lux / 400)}), rgba(0,0,0,${Math.max(0, 0.45 - lux / 500)}))`,
              }}
              aria-hidden
            />
            {lightOn && (
              <div
                className="pulse-soft absolute top-6 h-24 w-48 rounded-full blur-2xl"
                style={{ background: 'radial-gradient(ellipse, rgba(250, 204, 21, 0.55), transparent 70%)' }}
                aria-hidden
              />
            )}
            <Lightbulb
              className={cn('relative z-10 h-10 w-10 transition-colors', lightOn ? 'text-amber-300' : 'text-muted-foreground/40')}
              style={lightOn ? { filter: `drop-shadow(0 0 ${lightBrightness / 5}px rgba(250,204,21,0.9))` } : undefined}
            />
            <div className="relative z-10 mt-3 flex items-center gap-4 rounded-full border border-border/60 bg-card/80 px-5 py-2.5 backdrop-blur">
              <Fan className={cn('h-5 w-5 text-primary', fanSpeed > 0 && (fanSpeed >= 3 ? 'animate-spin' : fanSpeed >= 2 ? 'animate-[spin_1.5s_linear_infinite]' : 'animate-[spin_3s_linear_infinite]'))} />
              <span className="text-sm font-medium">Fan: {['off', 'low', 'medium', 'high'][fanSpeed]}</span>
              <span className="text-border">|</span>
              <span className="text-sm font-medium">Light: {lightOn ? `${lightBrightness}%` : 'off'}</span>
            </div>
            <div className="absolute bottom-3 left-3 z-10 flex gap-2">
              <Badge variant="outline" className="gap-1 bg-card/80 backdrop-blur">
                <Thermometer className="h-3 w-3" /> {temp} °C
              </Badge>
              <Badge variant="outline" className="gap-1 bg-card/80 backdrop-blur">
                <Eye className="h-3 w-3" /> {lux} lx
              </Badge>
            </div>
          </div>

          {/* rule readout */}
          <div className="mt-4 space-y-1.5 rounded-lg bg-muted/50 p-3.5 font-mono text-xs leading-relaxed text-muted-foreground">
            <div>
              isDark = {String(isDark)} (lux {lux} {isDark ? '<' : '≥'} 200)
            </div>
            <div>
              light = auto ? (isDark AND presence) : manual → <span className="font-semibold text-cyan-accent">{String(lightOn)}</span>
            </div>
            <div>
              fanSpeed = presence ? (temp≥30?3 : temp≥26?2 : temp≥23?1 : 0) : 0 → <span className="font-semibold text-cyan-accent">{fanSpeed}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 lg:col-span-2">
        <CardContent className="space-y-5 p-4 sm:p-5">
          <div className="text-sm font-semibold">Sensors (simulated)</div>
          <div>
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="flex items-center gap-1.5"><Sun2 /> Ambient light</span>
              <span className="font-mono text-cyan-accent">{lux} lx</span>
            </div>
            <Slider value={[lux]} min={0} max={1000} step={10} onValueChange={([v]) => setLux(v)} aria-label="Ambient light level" />
          </div>
          <div>
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="flex items-center gap-1.5"><Thermometer className="h-4 w-4 text-primary" /> Room temperature</span>
              <span className="font-mono text-cyan-accent">{temp} °C</span>
            </div>
            <Slider value={[temp]} min={16} max={38} step={1} onValueChange={([v]) => setTemp(v)} aria-label="Room temperature" />
          </div>
          <label className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5"><Eye className="h-4 w-4 text-primary" /> Occupancy</span>
            <Switch checked={presence} onCheckedChange={setPresence} aria-label="Occupancy" />
          </label>

          <div className="border-t border-border/60 pt-4">
            <div className="mb-2 text-sm font-semibold">Device overrides</div>
            <label className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2.5 text-sm">
              <span>
                Light control
                <span className="block text-xs text-muted-foreground">{autoLight ? 'AUTO rule: dark + occupied' : `MANUAL: ${manualLight ? 'on' : 'off'}`}</span>
              </span>
              <span className="flex items-center gap-2">
                <Badge variant={autoLight ? 'default' : 'secondary'} className="text-[10px]">{autoLight ? 'auto' : 'manual'}</Badge>
                <Switch checked={autoLight ? lightOn : manualLight} onCheckedChange={(v) => { setAutoLight(false); setManualLight(v) }} aria-label="Light on/off" />
              </span>
            </label>
            {!autoLight && (
              <button className="mt-1.5 text-xs text-cyan-accent hover:underline" onClick={() => { setAutoLight(true) }}>
                Return light to auto control
              </button>
            )}
            <label className="mt-2 flex items-center justify-between rounded-lg border border-border/60 px-3 py-2.5 text-sm">
              <span>
                Fan control
                <span className="block text-xs text-muted-foreground">{autoFan ? `AUTO rule → speed ${autoFanSpeed}` : 'MANUAL slider'}</span>
              </span>
              <Badge variant={autoFan ? 'default' : 'secondary'} className="text-[10px]">{autoFan ? 'auto' : 'manual'}</Badge>
            </label>
            {!autoFan && (
              <div className="mt-1.5">
                <Slider value={[manualFanSpeed]} min={0} max={3} step={1} onValueChange={([v]) => setManualFanSpeed(v)} aria-label="Manual fan speed" />
              </div>
            )}
            {autoFan && (
              <button className="mt-1.5 text-xs text-cyan-accent hover:underline" onClick={() => { setAutoFan(false); setManualFanSpeed(autoFanSpeed) }}>
                Take fan to manual control
              </button>
            )}
          </div>

          <p className="text-[11px] leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">How it works:</span> sensor values feed simple control rules —
            exactly how real home-automation firmware decides. PWM-like speed/brightness levels stand in for real
            actuator drives. No physical devices are connected; this is a control-logic simulation.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function Sun2() {
  // small sun icon inline
  return (
    <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}

// ═══ Project B: IoT Safety Monitoring ═══════════════════════════════════════

type Severity = 'normal' | 'warning' | 'danger'

const SEV_STYLE: Record<Severity, { cls: string; icon: React.ReactNode; label: string }> = {
  normal: { cls: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400', icon: <CircleCheck className="h-5 w-5" />, label: 'NORMAL' },
  warning: { cls: 'border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400', icon: <TriangleAlert className="h-5 w-5" />, label: 'WARNING' },
  danger: { cls: 'border-rose-500/40 bg-rose-500/5 text-rose-500', icon: <OctagonX className="h-5 w-5" />, label: 'DANGER' },
}

function SensorRow({
  label, value, unit, state, threshold,
}: { label: string; value: number; unit: string; state: Severity; threshold: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/60 px-3.5 py-3">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{threshold}</div>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-lg font-semibold">{value}<span className="ml-0.5 text-xs text-muted-foreground">{unit}</span></span>
        <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase', SEV_STYLE[state].cls)}>{state}</span>
      </div>
    </div>
  )
}

function IotSafetySim() {
  const [temperature, setTemperature] = React.useState(28)
  const [gasPpm, setGasPpm] = React.useState(120)
  const [motion, setMotion] = React.useState(false)
  const [tempWarn, setTempWarn] = React.useState(45)
  const [gasWarn, setGasWarn] = React.useState(300)
  const [log, setLog] = React.useState<{ at: number; severity: Severity; message: string }[]>([])

  const tempState: Severity = temperature >= tempWarn + 15 ? 'danger' : temperature >= tempWarn ? 'warning' : 'normal'
  const gasState: Severity = gasPpm >= gasWarn * 2 ? 'danger' : gasPpm >= gasWarn ? 'warning' : 'normal'
  const overall: Severity = tempState === 'danger' || gasState === 'danger' ? 'danger' : tempState === 'warning' || gasState === 'warning' ? 'warning' : 'normal'

  // Log threshold crossings
  const pushLog = React.useCallback((severity: Severity, message: string) => {
    setLog((l) => [{ at: Date.now(), severity, message }, ...l].slice(0, 8))
  }, [])

  const lastTempKey = React.useRef('')
  const lastGasKey = React.useRef('')
  React.useEffect(() => {
    const key = tempState
    if (lastTempKey.current !== key) {
      if (key === 'warning') pushLog('warning', `Temperature ${temperature} °C crossed warning threshold (${tempWarn} °C)`)
      if (key === 'danger') pushLog('danger', `Temperature ${temperature} °C is in DANGER zone — immediate action required`)
      if (key === 'normal' && lastTempKey.current !== '') pushLog('normal', `Temperature back to normal (${temperature} °C)`)
      lastTempKey.current = key
    }
     
  }, [tempState, temperature])

  React.useEffect(() => {
    const key = gasState
    if (lastGasKey.current !== key) {
      if (key === 'warning') pushLog('warning', `Gas level ${gasPpm} ppm crossed warning threshold (${gasWarn} ppm)`)
      if (key === 'danger') pushLog('danger', `Gas level ${gasPpm} ppm is in DANGER zone — ventilate and evacuate`)
      if (key === 'normal' && lastGasKey.current !== '') pushLog('normal', `Gas level back to normal (${gasPpm} ppm)`)
      lastGasKey.current = key
    }
     
  }, [gasState, gasPpm])

  const actions: Record<Severity, string> = {
    normal: 'All sensors within safe limits. System continues periodic monitoring (every 30 s in a real deployment).',
    warning: 'Investigate the sensor in warning: increase sampling rate, notify the operator, prepare ventilation. No evacuation yet.',
    danger: 'Trigger alarm and evacuation, shut down equipment in the zone, notify emergency contacts automatically. In a real deployment this also switches the node to max-priority transmissions.',
  }

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="space-y-4 lg:col-span-3">
        {/* overall status */}
        <Card className={cn('border', SEV_STYLE[overall].cls)}>
          <CardContent className="flex items-center gap-3 p-4">
            {SEV_STYLE[overall].icon}
            <div>
              <div className="text-sm font-bold tracking-wide">SYSTEM STATUS: {SEV_STYLE[overall].label}</div>
              <p className="text-xs text-muted-foreground">{actions[overall]}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="space-y-3 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Live sensor board</span>
              <SimBadge label="Simulated readings" />
            </div>
            <SensorRow label="Temperature sensor (DHT22-class)" value={temperature} unit="°C" state={tempState} threshold={`warning ≥ ${tempWarn} °C · danger ≥ ${tempWarn + 15} °C`} />
            <SensorRow label="Gas sensor (MQ-2 class)" value={gasPpm} unit="ppm" state={gasState} threshold={`warning ≥ ${gasWarn} ppm · danger ≥ ${gasWarn * 2} ppm`} />
            <div className="flex items-center justify-between rounded-lg border border-border/60 px-3.5 py-3">
              <div>
                <div className="text-sm font-medium">PIR motion detector</div>
                <div className="text-xs text-muted-foreground">presence logging, informational only</div>
              </div>
              <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase', motion ? SEV_STYLE.normal.cls : SEV_STYLE.normal.cls)}>
                {motion ? 'motion' : 'clear'}
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              The alert logic is a threshold state machine — the same pattern real monitoring nodes use. Danger beats
              warning; the worst sensor decides the system state. All values are simulated: no physical sensor is attached.
            </p>
          </CardContent>
        </Card>

        {/* alert log */}
        <Card className="border-border/60">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Alert log</span>
              {log.length > 0 && (
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setLog([])}>
                  Clear
                </Button>
              )}
            </div>
            {log.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">No threshold events yet — move the sliders past the warning thresholds.</p>
            ) : (
              <div className="scrollbar-thin mt-2 max-h-44 space-y-1.5 overflow-y-auto pr-1">
                {log.map((e, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-md bg-muted/50 px-2.5 py-1.5 text-xs">
                    <span className={cn('mt-0.5 h-2 w-2 shrink-0 rounded-full', e.severity === 'danger' ? 'bg-rose-500' : e.severity === 'warning' ? 'bg-amber-500' : 'bg-emerald-500')} />
                    <span className="flex-1">{e.message}</span>
                    <span className="shrink-0 text-muted-foreground">{new Date(e.at).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* controls */}
      <Card className="border-border/60 lg:col-span-2">
        <CardContent className="space-y-5 p-4 sm:p-5">
          <div className="text-sm font-semibold">Sensor inputs</div>
          <div>
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="flex items-center gap-1.5"><Thermometer className="h-4 w-4 text-primary" /> Temperature</span>
              <span className="font-mono text-cyan-accent">{temperature} °C</span>
            </div>
            <Slider value={[temperature]} min={0} max={80} step={1} onValueChange={([v]) => setTemperature(v)} aria-label="Temperature" />
          </div>
          <div>
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="flex items-center gap-1.5"><Wind className="h-4 w-4 text-primary" /> Gas concentration</span>
              <span className="font-mono text-cyan-accent">{gasPpm} ppm</span>
            </div>
            <Slider value={[gasPpm]} min={0} max={1000} step={10} onValueChange={([v]) => setGasPpm(v)} aria-label="Gas level" />
          </div>
          <label className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5"><Eye className="h-4 w-4 text-primary" /> Motion detected</span>
            <Switch checked={motion} onCheckedChange={setMotion} aria-label="Motion" />
          </label>

          <div className="border-t border-border/60 pt-4">
            <div className="mb-2 text-sm font-semibold">Configurable thresholds</div>
            <div>
              <div className="mb-1.5 flex justify-between text-sm">
                <span>Temp warning at</span>
                <span className="font-mono text-cyan-accent">{tempWarn} °C</span>
              </div>
              <Slider value={[tempWarn]} min={30} max={60} step={1} onValueChange={([v]) => setTempWarn(v)} aria-label="Temperature warning threshold" />
            </div>
            <div className="mt-3">
              <div className="mb-1.5 flex justify-between text-sm">
                <span>Gas warning at</span>
                <span className="font-mono text-cyan-accent">{gasWarn} ppm</span>
              </div>
              <Slider value={[gasWarn]} min={100} max={500} step={10} onValueChange={([v]) => setGasWarn(v)} aria-label="Gas warning threshold" />
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
              Thresholds are engineering decisions: too low and the system cries wolf; too high and danger arrives
              unannounced. Danger zones are always warning + margin.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ═══ Project C: Smart Communication Network ═════════════════════════════════

const MESSAGE_BITS = '10110010' // 8-bit toy message

function CommNetworkSim() {
  const [signal, setSignal] = React.useState(-55) // dBm
  const [noise, setNoise] = React.useState(-85) // dBm
  const [txResult, setTxResult] = React.useState<{ sent: string; received: string; errors: number; snr: number } | null>(null)
  const [txCount, setTxCount] = React.useState(0)

  const snr = signal - noise // dB (illustrative simplification)
  const qualityPct = Math.round(Math.max(0, Math.min(100, ((snr - 2) / 26) * 100)))
  // Illustrative bit-error probability: high at low SNR, ~0 at high SNR
  const ber = Math.max(0.0005, Math.min(0.35, 0.35 / (1 + Math.pow(2, (snr - 8) / 2.2))))

  const qualityLabel = snr >= 22 ? 'Excellent' : snr >= 14 ? 'Good' : snr >= 7 ? 'Fair — errors likely' : 'Poor — link unreliable'

  const transmit = () => {
    let received = ''
    let errors = 0
    for (const ch of MESSAGE_BITS) {
      if (Math.random() < ber) {
        received += ch === '0' ? '1' : '0'
        errors++
      } else {
        received += ch
      }
    }
    setTxResult({ sent: MESSAGE_BITS, received, errors, snr })
    setTxCount((c) => c + 1)
    if (errors === 0) toast.success('Transmission received without errors')
    else toast.warning(`Transmission arrived with ${errors} flipped bit${errors === 1 ? '' : 's'} — CRC would catch this`)
  }

  const qualityColor = snr >= 22 ? 'bg-emerald-500' : snr >= 14 ? 'bg-cyan-accent' : snr >= 7 ? 'bg-amber-500' : 'bg-rose-500'

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <Card className="border-border/60 lg:col-span-3">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Radio link · TX → RX</span>
            <SimBadge label="Illustrative model" />
          </div>

          {/* link visual */}
          <svg viewBox="0 0 420 150" className="mt-3 h-auto w-full" role="img" aria-label="Transmitter and receiver link">
            <g transform="translate(40,30)">
              <rect x={0} y={30} width={54} height={44} rx={8} className="fill-card stroke-primary/60" strokeWidth="1.5" />
              <text x={27} y={56} fontSize="11" textAnchor="middle" className="fill-foreground">TX</text>
              <RadioTower className="h-0 w-0" />
              <line x1={27} y1={30} x2={27} y2={8} className="stroke-primary" strokeWidth="2" />
              <path d="M20,10 a10,10 0 0 1 14,0" fill="none" className="stroke-primary" strokeWidth="1.5" />
              <path d="M16,5 a15,15 0 0 1 22,0" fill="none" className="stroke-primary" strokeWidth="1.5" opacity="0.6" />
            </g>
            <g transform="translate(326,30)">
              <rect x={0} y={30} width={54} height={44} rx={8} className="fill-card stroke-cyan-accent/60" strokeWidth="1.5" />
              <text x={27} y={56} fontSize="11" textAnchor="middle" className="fill-foreground">RX</text>
              <line x1={27} y1={30} x2={27} y2={8} className="stroke-cyan-accent" strokeWidth="2" />
              <path d="M20,10 a10,10 0 0 1 14,0" fill="none" className="stroke-cyan-accent" strokeWidth="1.5" />
              <path d="M16,5 a15,15 0 0 1 22,0" fill="none" className="stroke-cyan-accent" strokeWidth="1.5" opacity="0.6" />
            </g>
            {/* wave with noise */}
            <path
              d={(() => {
                const pts: string[] = []
                const amp = Math.max(2, 16 * (qualityPct / 100) + 3)
                for (let i = 0; i <= 60; i++) {
                  const t = i / 60
                  const x = 110 + t * 200
                  const jitter = (Math.sin(i * 7.3) + Math.sin(i * 3.1)) * (1 - qualityPct / 100) * 6
                  const y = 75 - amp * Math.sin(2 * Math.PI * 3 * t) + jitter * 0.5
                  pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
                }
                return pts.join(' ')
              })()}
              fill="none"
              className="stroke-cyan-accent"
              strokeWidth="2"
            />
            <text x={210} y={112} fontSize="10" textAnchor="middle" className="fill-muted-foreground">
              SNR = {snr} dB — {qualityLabel}
            </text>
          </svg>

          {/* quality meter */}
          <div className="mt-2">
            <div className="mb-1 flex justify-between text-xs text-muted-foreground">
              <span>Link quality (illustrative)</span>
              <span>{qualityPct}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-muted">
              <div className={cn('h-full rounded-full transition-all duration-300', qualityColor)} style={{ width: `${qualityPct}%` }} />
            </div>
          </div>

          {/* transmission tester */}
          <div className="mt-4 rounded-lg border border-border/60 p-3.5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Transmission test — 8-bit message {MESSAGE_BITS}</div>
              <Button size="sm" onClick={transmit}>
                <Send className="h-3.5 w-3.5" /> Transmit
              </Button>
            </div>
            {txResult ? (
              <div className="fade-up mt-3 space-y-2">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-sm">
                  <span>
                    sent: <span className="text-muted-foreground">{txResult.sent}</span>
                  </span>
                  <span>
                    received:{' '}
                    {txResult.received.split('').map((b, i) => (
                      <span key={i} className={b !== txResult.sent[i] ? 'font-bold text-rose-500' : 'text-emerald-500'}>
                        {b}
                      </span>
                    ))}
                  </span>
                </div>
                <div
                  className={cn(
                    'rounded-md border px-3 py-2 text-xs',
                    txResult.errors === 0 ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-amber-500/30 bg-amber-500/5'
                  )}
                >
                  {txResult.errors === 0
                    ? 'Clean reception — all 8 bits intact. At this SNR the receiver reliably distinguishes the symbol states.'
                    : `${txResult.errors} bit${txResult.errors === 1 ? '' : 's'} flipped by noise. A CRC check would detect the corruption and request retransmission — exactly why digital links add error-detection overhead.`}
                </div>
              </div>
            ) : (
              <p className="mt-2 text-xs text-muted-foreground">Press Transmit to send the message and see how noise treats it.</p>
            )}
            {txCount > 0 && (
              <p className="mt-2 text-[11px] text-muted-foreground">
                Bit-error probability at this SNR ≈ {(ber * 100).toFixed(1)}% per bit (illustrative curve — real BER follows
                the modulation and coding scheme).
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 lg:col-span-2">
        <CardContent className="space-y-5 p-4 sm:p-5">
          <div className="text-sm font-semibold">Link controls</div>
          <div>
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="flex items-center gap-1.5"><Signal className="h-4 w-4 text-primary" /> Signal strength</span>
              <span className="font-mono text-cyan-accent">{signal} dBm</span>
            </div>
            <Slider value={[signal]} min={-100} max={-30} step={1} onValueChange={([v]) => setSignal(v)} aria-label="Signal strength" />
            <p className="mt-1 text-[11px] text-muted-foreground">Stronger signal (closer to −30) = transmit power, antenna gain or short distance.</p>
          </div>
          <div>
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="flex items-center gap-1.5"><Radio className="h-4 w-4 text-primary" /> Noise floor</span>
              <span className="font-mono text-cyan-accent">{noise} dBm</span>
            </div>
            <Slider value={[noise]} min={-110} max={-60} step={1} onValueChange={([v]) => setNoise(v)} aria-label="Noise floor" />
            <p className="mt-1 text-[11px] text-muted-foreground">Interference and thermal noise. Closer to the signal = noisier channel.</p>
          </div>

          <div className="rounded-lg bg-muted/50 p-3.5 font-mono text-xs leading-relaxed">
            <div>SNR = signal − noise</div>
            <div>
              = {signal} − ({noise}) = <span className="font-semibold text-cyan-accent">{snr} dB</span>
            </div>
            <div className="mt-1.5 font-sans text-muted-foreground">
              Every 6 dB ≈ 2× power ratio. Higher SNR lets the receiver separate the symbol states cleanly — that is what
              quality and speed are made of.
            </div>
          </div>

          <p className="text-[11px] leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">Simplified model:</span> this demo uses a straight dB difference
            and an illustrative error curve — real radios compute BER from modulation, coding and fading. The
            relationships it demonstrates are genuine: more noise or weaker signal → lower SNR → more bit errors.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// ═══ Project wrapper + hub ══════════════════════════════════════════════════

function ProjectDetail({ meta, onBack }: { meta: ProjectMeta; onBack: () => void }) {
  const recordProject = useProgress((s) => s.recordProject)

  const handleQuizFinish = (score: number, total: number) => {
    recordProject(meta.id, score, total)
    if (score === total) toast.success(`Project complete — perfect ${score}/${total}!`)
    else toast.success(`Project knowledge check done — ${score}/${total}`)
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-6 sm:px-6">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft className="h-4 w-4" /> All projects
      </Button>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <NovaIcon name={meta.icon} className="h-5 w-5" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{meta.title}</h1>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{meta.tagline}</p>

      <div className="mt-5">
        {meta.id === 'smart-home' && <SmartHomeSim />}
        {meta.id === 'iot-safety' && <IotSafetySim />}
        {meta.id === 'comm-network' && <CommNetworkSim />}
      </div>

      {/* concepts + use case */}
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardContent className="p-4 sm:p-5">
            <h2 className="text-sm font-semibold">The ENTC concepts inside</h2>
            <ul className="mt-2.5 space-y-2">
              {meta.concepts.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-accent" aria-hidden />
                  <span className="leading-relaxed text-foreground/85">{c}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="border-cyan-accent/25 bg-cyan-accent/5">
          <CardContent className="p-4 sm:p-5">
            <h2 className="text-sm font-semibold">Real-world use case</h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground/85">{meta.useCase}</p>
          </CardContent>
        </Card>
      </div>

      {/* knowledge check */}
      <div className="mt-6">
        <h2 className="mb-3 text-lg font-semibold tracking-tight">Project knowledge check</h2>
        <QuizCard questions={meta.knowledgeCheck} onFinish={handleQuizFinish} />
      </div>
    </div>
  )
}

export function InnovationView() {
  const [selected, setSelected] = React.useState<string | null>(null)
  const progress = useProgress()

  const meta = PROJECTS.find((p) => p.id === selected)
  if (meta) return <ProjectDetail meta={meta} onBack={() => setSelected(null)} />

  const doneCount = Object.values(progress.projectActivities).filter((p) => p.quizDone).length

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-10 pt-6 sm:px-6">
      <PageHeader
        title="Innovation Studio"
        subtitle="Three interactive simulations connecting ENTC theory to products you can touch. Adjust the inputs, watch the logic respond, then pass the knowledge check."
        icon="Lightbulb"
        actions={
          <Badge variant="outline" className="border-cyan-accent/40 text-cyan-accent">
            {doneCount}/3 completed
          </Badge>
        }
      />

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {PROJECTS.map((p) => {
          const rec = progress.projectActivities[p.id]
          return (
            <Card
              key={p.id}
              className={cn(
                'group cursor-pointer border-border/60 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md',
                rec?.quizDone && 'border-emerald-500/25'
              )}
              onClick={() => setSelected(p.id)}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <NovaIcon name={p.icon} className="h-5.5 w-5.5" />
                  </div>
                  {rec?.quizDone && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/12 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      done · {rec.bestScore}/{rec.total}
                    </span>
                  )}
                </div>
                <h3 className="mt-3.5 font-semibold">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.tagline}</p>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-cyan-accent">
                  Open simulation <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon="Home" label="Control logic you can change" value="Smart Home" />
        <StatCard icon="ShieldAlert" label="Threshold state machine" value="IoT Safety" />
        <StatCard icon="Radio" label="SNR & bit-error demo" value="Comm Network" />
        <StatCard icon="Gauge" label="Physical devices" value="0 — all simulated" />
      </div>
    </div>
  )
}
