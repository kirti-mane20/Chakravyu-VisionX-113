'use client'

import * as React from 'react'
import { ToggleLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { useProgress } from '@/lib/nova/store'
import { SimBadge } from './shared'
import { cn } from '@/lib/utils'

type GateId = 'AND' | 'OR' | 'NOT' | 'XOR'

const GATES: Record<GateId, { inputs: 1 | 2; fn: (a: boolean, b?: boolean) => boolean; rule: string; blurb: string }> = {
  AND: {
    inputs: 2,
    fn: (a, b) => a && !!b,
    rule: 'Output 1 only when ALL inputs are 1',
    blurb: 'The AND gate is strict: every input must be HIGH. A single 0 pulls the output to 0.',
  },
  OR: {
    inputs: 2,
    fn: (a, b) => a || !!b,
    rule: 'Output 1 when AT LEAST ONE input is 1',
    blurb: 'The OR gate is generous: one HIGH input is enough. Only all-zeros gives a 0 output.',
  },
  NOT: {
    inputs: 1,
    fn: (a) => !a,
    rule: 'Output is the opposite of the input',
    blurb: 'The NOT gate (inverter) flips its single input: 0 becomes 1, 1 becomes 0.',
  },
  XOR: {
    inputs: 2,
    fn: (a, b) => a !== !!b,
    rule: 'Output 1 when inputs are DIFFERENT',
    blurb: 'The XOR gate is the difference detector: equal inputs give 0, different inputs give 1. It is the sum bit of binary addition.',
  },
}

function GateSymbol({ gate, a, b }: { gate: GateId; a: boolean; b: boolean }) {
  const inColor = 'stroke-foreground/60'
  const hi = 'stroke-cyan-accent'
  return (
    <svg viewBox="0 0 420 170" className="h-auto w-full" role="img" aria-label={`${gate} gate diagram`}>
      {/* input wires */}
      <line x1={20} y1={55} x2={130} y2={55} className={a ? hi : inColor} strokeWidth="2.5" />
      {gate !== 'NOT' && <line x1={20} y1={115} x2={130} y2={115} className={b ? hi : inColor} strokeWidth="2.5" />}
      <text x={12} y={45} fontSize="13" className="fill-foreground">A</text>
      {gate !== 'NOT' && <text x={12} y={105} fontSize="13" className="fill-foreground">B</text>}
      <circle cx={20} cy={55} r={4} className={a ? 'fill-cyan-accent' : 'fill-foreground/40'} />
      {gate !== 'NOT' && <circle cx={20} cy={115} r={4} className={b ? 'fill-cyan-accent' : 'fill-foreground/40'} />}

      {/* gate body */}
      {gate === 'AND' && <path d="M130,55 h22 a30,30 0 0 1 0,60 h-22 z" fill="none" className="stroke-primary" strokeWidth="2.5" />}
      {(gate === 'OR' || gate === 'XOR') && (
        <>
          {gate === 'XOR' && <path d="M122,53 q14,32 0,64" fill="none" className="stroke-primary" strokeWidth="2.5" />}
          <path d="M130,53 q14,32 0,64 q36,0 46,-32 q-10,-32 -46,-32 z" fill="none" className="stroke-primary" strokeWidth="2.5" />
        </>
      )}
      {gate === 'NOT' && <path d="M130,40 l50,45 -50,45 z" fill="none" className="stroke-primary" strokeWidth="2.5" />}
      {gate === 'NOT' && <circle cx={186} cy={85} r={6} fill="none" className="stroke-primary" strokeWidth="2.5" />}

      {/* output wire + lamp */}
      {gate === 'NOT' ? (
        <line x1={192} y1={85} x2={320} y2={85} className="stroke-foreground/60" strokeWidth="2.5" />
      ) : (
        <line x1={gate === 'AND' ? 182 : 208} y1={85} x2={320} y2={85} className="stroke-foreground/60" strokeWidth="2.5" />
      )}
      <circle cx={340} cy={85} r={16} fill="none" className="stroke-foreground/50" strokeWidth="2" />
      <circle cx={340} cy={85} r={10} className={GATES[gate].fn(a, b) ? 'fill-amber-400' : 'fill-transparent'} />
      {GATES[gate].fn(a, b) && <circle cx={340} cy={85} r={21} fill="none" className="stroke-amber-400/50" strokeWidth="2" />}
      <text x={340} y={122} fontSize="11" textAnchor="middle" className="fill-muted-foreground">
        OUT = {GATES[gate].fn(a, b) ? 1 : 0}
      </text>
      <text x={160} y={150} fontSize="11" className="fill-cyan-accent">{GATES[gate].rule}</text>
    </svg>
  )
}

export function LogicGateSim() {
  const recordGateRun = useProgress((s) => s.recordGateRun)
  const [gate, setGate] = React.useState<GateId>('AND')
  const [a, setA] = React.useState(false)
  const [b, setB] = React.useState(false)

  const def = GATES[gate]
  const out = def.fn(a, b)
  const rows = def.inputs === 2
    ? [
        { a: false, b: false },
        { a: false, b: true },
        { a: true, b: false },
        { a: true, b: true },
      ]
    : [{ a: false }, { a: true }]

  const toggleA = (v: boolean) => {
    setA(v)
    recordGateRun()
  }
  const toggleB = (v: boolean) => {
    setB(v)
    recordGateRun()
  }
  const changeGate = (g: GateId) => {
    setGate(g)
    recordGateRun()
  }

  const explanation = (() => {
    const A = a ? 1 : 0
    const B = b ? 1 : 0
    const O = out ? 1 : 0
    if (gate === 'AND') return `A = ${A}, B = ${B}. AND needs all inputs = 1, so the output is ${O}. ${A && B ? 'Both inputs are 1 → output 1.' : 'At least one input is 0 → output 0.'}`
    if (gate === 'OR') return `A = ${A}, B = ${B}. OR needs at least one input = 1, so the output is ${O}. ${A || B ? 'A HIGH input exists → output 1.' : 'Both inputs are 0 → output 0.'}`
    if (gate === 'NOT') return `A = ${A}. NOT flips its input, so the output is ${O}.`
    return `A = ${A}, B = ${B}. XOR outputs 1 when inputs differ. ${a !== b ? `The inputs are different → output ${O}.` : `The inputs are equal → output ${O}.`}`
  })()

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {/* Simulator */}
      <Card className="border-border/60 lg:col-span-3">
        <CardContent className="p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ToggleLeft className="h-4 w-4 text-primary" aria-hidden />
              <span className="text-sm font-semibold">Gate workbench</span>
            </div>
            <SimBadge />
          </div>

          {/* gate selector */}
          <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Logic gate selector">
            {(Object.keys(GATES) as GateId[]).map((g) => (
              <button
                key={g}
                role="tab"
                aria-selected={gate === g}
                onClick={() => changeGate(g)}
                className={cn(
                  'rounded-lg border px-3.5 py-1.5 text-sm font-semibold transition-colors',
                  gate === g ? 'border-primary bg-primary text-primary-foreground' : 'border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground'
                )}
              >
                {g}
              </button>
            ))}
          </div>

          <GateSymbol gate={gate} a={a} b={b} />

          {/* input switches */}
          <div className="mt-4 flex flex-wrap items-center gap-6 rounded-lg border border-border/60 bg-muted/30 p-4">
            <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium">
              <Switch checked={a} onCheckedChange={toggleA} aria-label={`Input A`} />
              Input A = <span className="font-mono text-cyan-accent">{a ? 1 : 0}</span>
            </label>
            {def.inputs === 2 && (
              <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium">
                <Switch checked={b} onCheckedChange={toggleB} aria-label={`Input B`} />
                Input B = <span className="font-mono text-cyan-accent">{b ? 1 : 0}</span>
              </label>
            )}
            <div className="ml-auto">
              <Badge variant="outline" className="font-mono text-sm">
                {gate}( {a ? 1 : 0}
                {def.inputs === 2 ? `, ${b ? 1 : 0}` : ''} ) = {out ? 1 : 0}
              </Badge>
            </div>
          </div>

          <p className="mt-3 rounded-lg border-l-2 border-cyan-accent/60 bg-cyan-accent/5 px-3.5 py-2.5 text-sm leading-relaxed">
            {explanation} {def.blurb}
          </p>
        </CardContent>
      </Card>

      {/* Truth table */}
      <Card className="border-border/60 lg:col-span-2">
        <CardContent className="p-4 sm:p-5">
          <div className="mb-3 text-sm font-semibold">{gate} — truth table</div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-2">A</th>
                {def.inputs === 2 && <th className="py-2 pr-2">B</th>}
                <th className="py-2 text-right">{gate} out</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const active = r.a === a && (def.inputs === 1 || r.b === b)
                const result = def.fn(r.a, r.b)
                return (
                  <tr
                    key={i}
                    className={cn(
                      'border-b border-border/40 transition-colors',
                      active ? 'bg-primary/10 font-semibold' : 'text-muted-foreground'
                    )}
                  >
                    <td className="py-2.5 pr-2 font-mono">{r.a ? 1 : 0}</td>
                    {def.inputs === 2 && <td className="py-2.5 pr-2 font-mono">{r.b ? 1 : 0}</td>}
                    <td className="py-2.5 text-right">
                      <span className={cn('inline-flex h-6 w-6 items-center justify-center rounded-md font-mono text-xs', result ? 'bg-cyan-accent/20 text-cyan-accent' : 'bg-muted text-muted-foreground')}>
                        {result ? 1 : 0}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            The highlighted row is your current input combination. A gate&apos;s truth table is its complete contract —
            every possible behaviour is listed. Try each gate with all four combinations and watch the outputs match.
          </p>
          <div className="mt-4 rounded-lg bg-muted/50 p-3 text-xs leading-relaxed">
            <div className="font-medium text-foreground">Remember:</div>
            <div className="mt-1 text-muted-foreground">
              AND = both keys · OR = either key · NOT = the opposite · XOR = inputs differ (sum bit of 1+1=10₂ is XOR!).
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
