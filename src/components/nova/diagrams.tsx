'use client'

import * as React from 'react'
import type { DiagramKind } from '@/lib/nova/types'

// Deterministic SVG diagram set for lessons. Theme-aware via CSS classes:
// wires use text-foreground/70, accents use stroke-primary / stroke-cyan-accent.

const wire = 'stroke-foreground/60'
const accent = 'stroke-primary'
const cyan = 'stroke-cyan-accent'
const dim = 'stroke-muted-foreground/50'

function sinePath(x0: number, yMid: number, width: number, amp: number, cycles: number, phaseDeg = 0): string {
  const steps = 120
  const phase = (phaseDeg * Math.PI) / 180
  const pts: string[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const x = x0 + t * width
    const y = yMid - amp * Math.sin(2 * Math.PI * cycles * t + phase)
    pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
  }
  return pts.join(' ')
}

function Battery({ x, y, label = 'V' }: { x: number; y: number; label?: string }) {
  return (
    <g>
      <line x1={x} y1={y - 18} x2={x} y2={y - 4} className={wire} strokeWidth="2.5" />
      <line x1={x - 12} y1={y - 4} x2={x + 12} y2={y - 4} className={accent} strokeWidth="3" />
      <line x1={x - 7} y1={y + 4} x2={x + 7} y2={y + 4} className={accent} strokeWidth="3" />
      <line x1={x} y1={y + 4} x2={x} y2={y + 18} className={wire} strokeWidth="2.5" />
      <text x={x + 18} y={y + 4} fontSize="11" className="fill-cyan-accent">
        {label}
      </text>
    </g>
  )
}

function Resistor({ x, y, label, vertical = false }: { x: number; y: number; label?: string; vertical?: boolean }) {
  const zig = vertical
    ? `M${x},${y - 24} l6,4 -12,6 12,6 -12,6 12,6 -6,4`
    : `M${x - 24},${y} l4,-6 6,12 6,-12 6,12 6,-12 4,6`
  return (
    <g>
      <path d={zig} fill="none" className={wire} strokeWidth="2" />
      {label && (
        <text x={vertical ? x + 14 : x} y={vertical ? y : y - 12} fontSize="11" textAnchor={vertical ? 'start' : 'middle'} className="fill-cyan-accent">
          {label}
        </text>
      )}
    </g>
  )
}

function Led({ x, y, on = true, color = '#ef4444' }: { x: number; y: number; on?: boolean; color?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={8} fill={on ? color : 'none'} fillOpacity={on ? 0.85 : 0} stroke={color} strokeWidth="2" />
      {on && <circle cx={x} cy={y} r={13} fill="none" stroke={color} strokeOpacity="0.35" strokeWidth="1.5" />}
      {on && (
        <>
          <line x1={x + 10} y1={y - 10} x2={x + 16} y2={y - 16} stroke={color} strokeWidth="1.5" />
          <line x1={x + 12} y1={y - 4} x2={x + 19} y2={y - 7} stroke={color} strokeWidth="1.5" />
        </>
      )}
      <text x={x} y={y + 26} fontSize="10" textAnchor="middle" className="fill-muted-foreground">
        LED
      </text>
    </g>
  )
}

// ─── 1. Ohm's law circuit ───────────────────────────────────────────────────

function OhmsLawCircuit() {
  return (
    <svg viewBox="0 0 420 210" className="h-auto w-full" role="img" aria-label="Series circuit with battery and resistor">
      <rect x="70" y="40" width="280" height="130" fill="none" className={wire} strokeWidth="2" rx="4" />
      <Battery x={70} y={95} label="V (source)" />
      <Resistor x={210} y={40} label="R (resistor)" />
      {/* current direction arrows */}
      <path d="M330,95 l0,0" />
      <line x1={210} y1={170} x2={280} y2={170} className={cyan} strokeWidth="2" markerEnd="url(#arrow)" />
      <text x={245} y={188} fontSize="11" textAnchor="middle" className="fill-cyan-accent">
        current I
      </text>
      <line x1={140} y1={170} x2={190} y2={170} className={cyan} strokeWidth="2" />
      <line x1={350} y1={40} x2={350} y2={105} className={cyan} strokeWidth="2" />
      <line x1={350} y1={105} x2={350} y2={170} className={cyan} strokeWidth="2" />
      <text x={335} y={100} fontSize="11" className="fill-cyan-accent">
        I = V / R
      </text>
      <text x={210} y={26} fontSize="11" textAnchor="middle" className="fill-muted-foreground">
        Series loop — same current everywhere
      </text>
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" className="fill-cyan-accent" />
        </marker>
      </defs>
    </svg>
  )
}

// ─── 2. Resistor colour code ────────────────────────────────────────────────

function ResistorColor() {
  const bands = [
    { x: 168, c: '#eab308', d: '4' },
    { x: 192, c: '#8b5cf6', d: '7' },
    { x: 216, c: '#ef4444', d: '×100' },
    { x: 248, c: '#d4a24e', d: '±5%' },
  ]
  return (
    <svg viewBox="0 0 420 210" className="h-auto w-full" role="img" aria-label="Resistor colour code example">
      <line x1={20} y1={95} x2={130} y2={95} className={wire} strokeWidth="2.5" />
      <line x1={290} y1={95} x2={400} y2={95} className={wire} strokeWidth="2.5" />
      <path d="M130,95 q20,-26 40,0 q-16,20 0,0 q20,-26 40,0 q-16,20 0,0 q20,-26 40,0 q-16,20 0,0 q20,-26 40,0" fill="none" className={wire} strokeWidth="2" />
      <rect x={132} y={72} width={156} height={46} rx={20} className="fill-card stroke-foreground/50" strokeWidth="1.5" />
      {bands.map((b, i) => (
        <rect key={i} x={b.x} y={72} width={11} height={46} fill={b.c} />
      ))}
      {bands.map((b, i) => (
        <g key={`t${i}`}>
          <line x1={b.x + 5} y1={118} x2={b.x + 5} y2={140} className={dim} strokeWidth="1" />
          <text x={b.x + 5} y={155} fontSize="11" textAnchor="middle" fill={b.c}>
            {b.d}
          </text>
        </g>
      ))}
      <text x={210} y={40} fontSize="12" textAnchor="middle" className="fill-foreground">
        yellow · violet · red · gold
      </text>
      <text x={210} y={190} fontSize="12" textAnchor="middle" className="fill-cyan-accent">
        4, 7, ×100 → 4,700 Ω = 4.7 kΩ ± 5%
      </text>
    </svg>
  )
}

// ─── 3. Logic gates ─────────────────────────────────────────────────────────

function GateAND({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x},${y - 18} h14 a18,18 0 0 1 0,36 h-14 z`}
      fill="none"
      className={accent}
      strokeWidth="2"
    />
  )
}
function GateOR({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x},${y - 18} q14,18 0,36 q26,0 34,-18 q-8,-18 -34,-18 z`}
      fill="none"
      className={accent}
      strokeWidth="2"
    />
  )
}

function LogicGatesDiagram() {
  return (
    <svg viewBox="0 0 420 220" className="h-auto w-full" role="img" aria-label="Symbols of the four basic logic gates">
      {/* AND */}
      <g transform="translate(30,10)">
        <line x1={0} y1={22} x2={18} y2={22} className={wire} strokeWidth="2" />
        <line x1={0} y1={40} x2={18} y2={40} className={wire} strokeWidth="2" />
        <GateAND x={18} y={31} />
        <line x1={50} y1={31} x2={68} y2={31} className={wire} strokeWidth="2" />
        <text x={34} y={72} fontSize="11" textAnchor="middle" className="fill-muted-foreground">AND</text>
        <text x={34} y={86} fontSize="10" textAnchor="middle" className="fill-cyan-accent">A · B</text>
      </g>
      {/* OR */}
      <g transform="translate(140,10)">
        <line x1={0} y1={22} x2={12} y2={22} className={wire} strokeWidth="2" />
        <line x1={0} y1={40} x2={12} y2={40} className={wire} strokeWidth="2" />
        <GateOR x={12} y={31} />
        <line x1={48} y1={31} x2={68} y2={31} className={wire} strokeWidth="2" />
        <text x={30} y={72} fontSize="11" textAnchor="middle" className="fill-muted-foreground">OR</text>
        <text x={30} y={86} fontSize="10" textAnchor="middle" className="fill-cyan-accent">A + B</text>
      </g>
      {/* NOT */}
      <g transform="translate(250,10)">
        <line x1={0} y1={31} x2={14} y2={31} className={wire} strokeWidth="2" />
        <path d={`M14,17 l26,14 -26,14 z`} fill="none" className={accent} strokeWidth="2" />
        <circle cx={43} cy={31} r={3.5} fill="none" className={accent} strokeWidth="2" />
        <line x1={47} y1={31} x2={68} y2={31} className={wire} strokeWidth="2" />
        <text x={34} y={72} fontSize="11" textAnchor="middle" className="fill-muted-foreground">NOT</text>
        <text x={34} y={86} fontSize="10" textAnchor="middle" className="fill-cyan-accent">A′</text>
      </g>
      {/* XOR */}
      <g transform="translate(340,10)">
        <line x1={0} y1={22} x2={10} y2={22} className={wire} strokeWidth="2" />
        <line x1={0} y1={40} x2={10} y2={40} className={wire} strokeWidth="2" />
        <path d={`M6,17 q14,18 0,36`} fill="none" className={accent} strokeWidth="2" />
        <GateOR x={10} y={31} />
        <line x1={46} y1={31} x2={66} y2={31} className={wire} strokeWidth="2" />
        <text x={30} y={72} fontSize="11" textAnchor="middle" className="fill-muted-foreground">XOR</text>
        <text x={30} y={86} fontSize="10" textAnchor="middle" className="fill-cyan-accent">A ⊕ B</text>
      </g>
      {/* mini truth rows */}
      <g transform="translate(60,120)">
        <text x={0} y={0} fontSize="11" className="fill-foreground">A=0,B=0 → AND 0 · OR 0 · XOR 0</text>
        <text x={0} y={20} fontSize="11" className="fill-foreground">A=0,B=1 → AND 0 · OR 1 · XOR 1</text>
        <text x={0} y={40} fontSize="11" className="fill-foreground">A=1,B=0 → AND 0 · OR 1 · XOR 1</text>
        <text x={0} y={60} fontSize="11" className="fill-foreground">A=1,B=1 → AND 1 · OR 1 · XOR 0</text>
        <text x={0} y={84} fontSize="11" className="fill-cyan-accent">Try them live in the Virtual Lab → Logic Gates.</text>
      </g>
    </svg>
  )
}

// ─── 4. Half adder ──────────────────────────────────────────────────────────

function HalfAdder() {
  return (
    <svg viewBox="0 0 420 210" className="h-auto w-full" role="img" aria-label="Half adder built from XOR and AND gates">
      <text x={20} y={80} fontSize="12" className="fill-foreground">A</text>
      <text x={20} y={130} fontSize="12" className="fill-foreground">B</text>
      <line x1={30} y1={76} x2={70} y2={76} className={wire} strokeWidth="2" />
      <line x1={30} y1={76} x2={70} y2={126} className={wire} strokeWidth="2" />
      <line x1={30} y1={126} x2={70} y2={86} className={wire} strokeWidth="2" />
      <line x1={30} y1={126} x2={70} y2={136} className={wire} strokeWidth="2" />
      <circle cx={70} cy={76} r={2.5} className="fill-foreground" />
      <circle cx={70} cy={126} r={2.5} className="fill-foreground" />
      <GateOR x={70} y={81} />
      <path d={`M66,67 q14,18 0,36`} fill="none" className={accent} strokeWidth="2" />
      <GateAND x={70} y={131} />
      <line x1={112} y1={81} x2={150} y2={81} className={wire} strokeWidth="2" />
      <text x={158} y={85} fontSize="12" className="fill-foreground">Sum = A ⊕ B</text>
      <line x1={112} y1={131} x2={150} y2={131} className={wire} strokeWidth="2" />
      <text x={158} y={135} fontSize="12" className="fill-foreground">Carry = A · B</text>
      <text x={20} y={40} fontSize="11" className="fill-muted-foreground">Inputs</text>
      <text x={210} y={190} fontSize="11" className="fill-cyan-accent">1 + 1 = 10₂ → sum 0, carry 1 (two gates doing arithmetic!)</text>
    </svg>
  )
}

// ─── 5. PN junction ─────────────────────────────────────────────────────────

function DiodePn() {
  return (
    <svg viewBox="0 0 420 210" className="h-auto w-full" role="img" aria-label="PN junction forward and reverse bias">
      {/* Forward */}
      <text x={105} y={22} fontSize="12" textAnchor="middle" className="fill-foreground">Forward bias → conducts</text>
      <line x1={20} y1={70} x2={45} y2={70} className={wire} strokeWidth="2" />
      <line x1={45} y1={58} x2={45} y2={82} className="stroke-rose-500" strokeWidth="3" />
      <text x={40} y={52} fontSize="10" className="fill-rose-500">+</text>
      <line x1={45} y1={70} x2={110} y2={70} className={wire} strokeWidth="2" />
      <rect x={110} y={52} width={70} height={36} className="fill-primary/20 stroke-foreground/50" strokeWidth="1.5" />
      <rect x={180} y={52} width={70} height={36} className="fill-cyan-accent/20 stroke-foreground/50" strokeWidth="1.5" />
      <text x={145} y={75} fontSize="12" textAnchor="middle" className="fill-primary">P</text>
      <text x={215} y={75} fontSize="12" textAnchor="middle" className="fill-cyan-accent">N</text>
      <rect x={172} y={52} width={16} height={36} className="fill-warning/30" />
      <line x1={250} y1={70} x2={290} y2={70} className={wire} strokeWidth="2" />
      <line x1={290} y1={58} x2={290} y2={82} className="stroke-foreground/60" strokeWidth="3" />
      <text x={294} y={52} fontSize="10" className="fill-muted-foreground">−</text>
      <path d="M78,64 l12,6 -12,6 z" className="fill-cyan-accent" />
      <path d="M262,64 l12,6 -12,6 z" className="fill-cyan-accent" />
      <text x={180} y={108} fontSize="10" textAnchor="middle" className="fill-muted-foreground">thin depletion region — current flows (V &gt; 0.7 V)</text>

      {/* Reverse */}
      <text x={105} y={150} fontSize="12" textAnchor="middle" className="fill-foreground">Reverse bias → blocks</text>
      <line x1={20} y1={185} x2={45} y2={185} className={wire} strokeWidth="2" />
      <line x1={45} y1={173} x2={45} y2={197} className="stroke-foreground/60" strokeWidth="3" />
      <line x1={45} y1={185} x2={110} y2={185} className={wire} strokeWidth="2" />
      <rect x={100} y={167} width={80} height={36} className="fill-primary/20 stroke-foreground/50" strokeWidth="1.5" />
      <rect x={180} y={167} width={80} height={36} className="fill-cyan-accent/20 stroke-foreground/50" strokeWidth="1.5" />
      <text x={130} y={190} fontSize="12" textAnchor="middle" className="fill-primary">P</text>
      <text x={230} y={190} fontSize="12" textAnchor="middle" className="fill-cyan-accent">N</text>
      <rect x={176} y={167} width={28} height={36} className="fill-warning/50" />
      <line x1={260} y1={185} x2={290} y2={185} className={wire} strokeWidth="2" />
      <line x1={290} y1={173} x2={290} y2={197} className="stroke-rose-500" strokeWidth="3" />
      <text x={310} y={150} fontSize="10" className="fill-muted-foreground">wide depletion</text>
      <text x={310} y={162} fontSize="10" className="fill-muted-foreground">region blocks</text>
    </svg>
  )
}

// ─── 6. Transistor switch ───────────────────────────────────────────────────

function TransistorSwitch() {
  return (
    <svg viewBox="0 0 420 210" className="h-auto w-full" role="img" aria-label="NPN transistor low-side switch driving a lamp">
      <text x={95} y={22} fontSize="11" className="fill-cyan-accent">MCU pin (5 V, ~20 mA)</text>
      <line x1={90} y1={30} x2={90} y2={70} className={wire} strokeWidth="2" />
      <Resistor x={90} y={70} label="R_B 1 kΩ" />
      <line x1={90} y1={94} x2={90} y2={120} className={wire} strokeWidth="2" />
      <line x1={90} y1={120} x2={150} y2={120} className={wire} strokeWidth="2" />
      {/* NPN symbol */}
      <circle cx={170} cy={120} r={26} fill="none" className={wire} strokeWidth="2" />
      <line x1={150} y1={120} x2={166} y2={112} className={wire} strokeWidth="2" />
      <line x1={150} y1={120} x2={166} y2={128} className={wire} strokeWidth="2" />
      <line x1={166} y1={112} x2={166} y2={92} className={wire} strokeWidth="2" />
      <line x1={166} y1={92} x2={166} y2={70} className={wire} strokeWidth="2" />
      <line x1={166} y1={128} x2={166} y2={148} className={wire} strokeWidth="2" />
      <line x1={166} y1={148} x2={166} y2={170} className={wire} strokeWidth="2" />
      <path d="M162,124 l6,-8 3,9 z" className="fill-cyan-accent" />
      <text x={196} y={114} fontSize="11" className="fill-foreground">C</text>
      <text x={196} y={138} fontSize="11" className="fill-foreground">E</text>
      <text x={130} y={136} fontSize="11" className="fill-foreground">B</text>
      <text x={200} y={98} fontSize="10" className="fill-muted-foreground">NPN</text>
      {/* GND */}
      <line x1={166} y1={170} x2={166} y2={182} className={wire} strokeWidth="2" />
      <line x1={152} y1={182} x2={180} y2={182} className={wire} strokeWidth="2.5" />
      <line x1={158} y1={188} x2={174} y2={188} className={wire} strokeWidth="2" />
      <line x1={163} y1={194} x2={169} y2={194} className={wire} strokeWidth="2" />
      {/* Load path */}
      <line x1={166} y1={70} x2={280} y2={70} className={wire} strokeWidth="2" />
      <text x={288} y={62} fontSize="11" className="fill-cyan-accent">+12 V</text>
      <line x1={280} y1={70} x2={280} y2={95} className={wire} strokeWidth="2" />
      <circle cx={280} cy={112} r={15} fill="#eab308" fillOpacity="0.85" stroke="#eab308" strokeWidth="2" />
      <text x={280} y={116} fontSize="9" textAnchor="middle" className="fill-foreground">LAMP</text>
      <line x1={280} y1={127} x2={280} y2={148} className={wire} strokeWidth="2" />
      <text x={296} y={142} fontSize="11" className="fill-muted-foreground">load: 12 V @ 200 mA</text>
      <line x1={280} y1={148} x2={280} y2={170} className={wire} strokeWidth="2" />
      <line x1={280} y1={170} x2={166} y2={170} className={wire} strokeWidth="2" />
      <text x={30} y={200} fontSize="11" className="fill-cyan-accent">Small base current → large collector current (gain β). Pin stays safe at 5 V.</text>
    </svg>
  )
}

// ─── 7. Sensor block chain ──────────────────────────────────────────────────

function BlockChain({ blocks }: { blocks: { label: string; sub?: string }[] }) {
  const w = 74
  const gap = (420 - blocks.length * w) / (blocks.length + 1)
  return (
    <svg viewBox="0 0 420 210" className="h-auto w-full" role="img" aria-label="Block diagram">
      {blocks.map((b, i) => {
        const x = gap + i * (w + gap)
        const y = 78
        return (
          <g key={i}>
            <rect x={x} y={y} width={w} height={54} rx={8} className="fill-card stroke-primary/60" strokeWidth="1.5" />
            <text x={x + w / 2} y={y + 24} fontSize="11" textAnchor="middle" className="fill-foreground">
              {b.label}
            </text>
            {b.sub && (
              <text x={x + w / 2} y={y + 40} fontSize="9" textAnchor="middle" className="fill-muted-foreground">
                {b.sub}
              </text>
            )}
            {i < blocks.length - 1 && (
              <line x1={x + w + 4} y1={y + 27} x2={x + w + gap - 8} y2={y + 27} className={cyan} strokeWidth="2" markerEnd="url(#arrowD)" />
            )}
          </g>
        )
      })}
      <defs>
        <marker id="arrowD" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" className="fill-cyan-accent" />
        </marker>
      </defs>
    </svg>
  )
}

function SensorBlock() {
  return (
    <div>
      <BlockChain
        blocks={[
          { label: 'Sensor', sub: 'physical → electrical' },
          { label: 'Conditioning', sub: 'divider / filter' },
          { label: 'ADC', sub: '10-bit counts' },
          { label: 'MCU', sub: 'decide' },
          { label: 'Actuator', sub: 'relay / motor' },
        ]}
      />
      <p className="px-2 pb-1 text-center text-xs text-muted-foreground">
        The universal sensing chain — every smart device follows this pattern.
      </p>
    </div>
  )
}

// ─── 8. Arduino LED wiring ──────────────────────────────────────────────────

function ArduinoLed() {
  return (
    <svg viewBox="0 0 420 210" className="h-auto w-full" role="img" aria-label="Arduino blink wiring">
      <rect x={40} y={50} width={140} height={120} rx={10} className="fill-card stroke-primary/70" strokeWidth="2" />
      <text x={110} y={78} fontSize="13" textAnchor="middle" className="fill-foreground">Arduino UNO</text>
      <rect x={58} y={92} width={104} height={30} rx={4} className="fill-muted stroke-foreground/30" />
      <text x={110} y={111} fontSize="9" textAnchor="middle" className="fill-muted-foreground">ATmega328P</text>
      <circle cx={158} cy={132} r={5} className="fill-cyan-accent" />
      <text x={150} y={156} fontSize="9" className="fill-muted-foreground">pin 13</text>
      <line x1={158} y1={132} x2={240} y2={132} className={wire} strokeWidth="2" />
      <Resistor x={262} y={132} label="220 Ω" />
      <line x1={286} y1={132} x2={320} y2={132} className={wire} strokeWidth="2" />
      <g transform="translate(330,118)">
        <circle cx={0} cy={14} r={10} fill="#22c55e" fillOpacity="0.85" stroke="#22c55e" strokeWidth="2" />
        <line x1={0} y1={4} x2={0} y2={-10} className={wire} strokeWidth="2" />
        <line x1={0} y1={24} x2={0} y2={38} className={wire} strokeWidth="2" />
        <text x={16} y={8} fontSize="9" className="fill-muted-foreground">anode (+)</text>
        <text x={16} y={34} fontSize="9" className="fill-muted-foreground">cathode (−)</text>
      </g>
      <line x1={330} y1={156} x2={330} y2={170} className={wire} strokeWidth="2" />
      <line x1={330} y1={170} x2={110} y2={170} className={wire} strokeWidth="2" />
      <line x1={110} y1={170} x2={110} y2={140} className={wire} strokeWidth="2" />
      <text x={200} y={40} fontSize="11" textAnchor="middle" className="fill-muted-foreground">
        Blink wiring: pin 13 → resistor → LED → GND (loop!)
      </text>
      <text x={210} y={198} fontSize="11" textAnchor="middle" className="fill-cyan-accent">
        digitalWrite(13, HIGH) → 5 V → ~13 mA through the LED
      </text>
    </svg>
  )
}

// ─── 9. AM modulation ───────────────────────────────────────────────────────

function AmModulation() {
  return (
    <svg viewBox="0 0 420 210" className="h-auto w-full" role="img" aria-label="AM modulation waveforms">
      <text x={8} y={26} fontSize="10" className="fill-muted-foreground">Message (slow)</text>
      <path d={sinePath(8, 48, 250, 16, 1.5)} fill="none" className="fill-none stroke-emerald-500" strokeWidth="2" />
      <text x={8} y={92} fontSize="10" className="fill-muted-foreground">Carrier (fast)</text>
      <path d={sinePath(8, 112, 250, 14, 9)} fill="none" className={cyan} strokeWidth="1.5" />
      <text x={8} y={156} fontSize="10" className="fill-muted-foreground">AM result</text>
      <path d={sinePath(8, 186, 250, 14, 18)} fill="none" className="fill-none stroke-primary" strokeWidth="1.2" strokeOpacity="0.8" />
      {/* envelope */}
      <path d={`M8,${186 - 14} q42,-20 83,-4 q42,16 84,-12 q42,-24 83,6`} fill="none" className="stroke-rose-400" strokeWidth="1.5" strokeDasharray="4 3" />
      <path d={`M8,${186 + 14} q42,20 83,4 q42,-16 84,12 q42,24 83,-6`} fill="none" className="stroke-rose-400" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x={278} y={40} fontSize="10" className="fill-foreground">The carrier rides</text>
      <text x={278} y={54} fontSize="10" className="fill-foreground">inside the message</text>
      <text x={278} y={68} fontSize="10" className="fill-foreground">envelope (red).</text>
      <text x={278} y={92} fontSize="10" className="fill-muted-foreground">The receiver just</text>
      <text x={278} y={106} fontSize="10" className="fill-muted-foreground">traces the envelope</text>
      <text x={278} y={120} fontSize="10" className="fill-muted-foreground">to recover the audio.</text>
      <text x={278} y={150} fontSize="10" className="fill-cyan-accent">Same idea, digital:</text>
      <text x={278} y={164} fontSize="10" className="fill-cyan-accent">jump between states</text>
      <text x={278} y={178} fontSize="10" className="fill-cyan-accent">(FSK/PSK/QAM).</text>
    </svg>
  )
}

// ─── 10. Digital link ───────────────────────────────────────────────────────

function DigitalLink() {
  const bits = ['1', '0', '1', '1', '0']
  return (
    <svg viewBox="0 0 420 210" className="h-auto w-full" role="img" aria-label="Digital communication link with noise">
      <rect x={20} y={80} width={70} height={50} rx={8} className="fill-card stroke-primary/60" strokeWidth="1.5" />
      <text x={55} y={102} fontSize="11" textAnchor="middle" className="fill-foreground">TX</text>
      <text x={55} y={117} fontSize="8.5" textAnchor="middle" className="fill-muted-foreground">modulator</text>
      <rect x={330} y={80} width={70} height={50} rx={8} className="fill-card stroke-primary/60" strokeWidth="1.5" />
      <text x={365} y={102} fontSize="11" textAnchor="middle" className="fill-foreground">RX</text>
      <text x={365} y={117} fontSize="8.5" textAnchor="middle" className="fill-muted-foreground">demodulator</text>
      <line x1={90} y1={105} x2={330} y2={105} className={wire} strokeWidth="2" strokeDasharray="6 4" />
      <text x={210} y={72} fontSize="10" textAnchor="middle" className="fill-muted-foreground">noisy channel (attenuation + interference)</text>
      {/* noise */}
      <path d="M110,105 l8,-7 6,14 7,-12 6,10 8,-6 7,8 9,-9 6,12 8,-8 7,5 8,-6 7,9 8,-10 6,8 8,-4 7,6 8,-7 6,10 8,-6" fill="none" className="stroke-rose-400/70" strokeWidth="1.2" />
      {/* bits */}
      {bits.map((b, i) => {
        const x = 120 + i * 36
        const isErr = i === 2
        return (
          <g key={i}>
            <rect x={x} y={24} width={26} height={20} rx={4} className={isErr ? 'fill-rose-500/20 stroke-rose-500/60' : 'fill-primary/10 stroke-primary/40'} strokeWidth="1" />
            <text x={x + 13} y={38} fontSize="10" textAnchor="middle" className={isErr ? 'fill-rose-500' : 'fill-foreground'}>
              {b}
            </text>
            {isErr && <text x={x + 13} y={18} fontSize="9" textAnchor="middle" className="fill-rose-500">error ✕</text>}
          </g>
        )
      })}
      <text x={210} y={160} fontSize="10" textAnchor="middle" className="fill-muted-foreground">CRC detects the flipped bit → retransmit (or FEC repairs it)</text>
      <text x={210} y={182} fontSize="10" textAnchor="middle" className="fill-cyan-accent">Higher SNR → fewer errors → faster modulation possible</text>
      {/* rx bits */}
      {['1', '0', '?', '1', '0'].map((b, i) => (
        <text key={`r${i}`} x={138 + i * 36} y={142} fontSize="10" textAnchor="middle" className="fill-foreground/80">
          {b}
        </text>
      ))}
    </svg>
  )
}

// ─── 11. Sampling ───────────────────────────────────────────────────────────

function SineSampling() {
  const samples = Array.from({ length: 9 }, (_, i) => i)
  return (
    <svg viewBox="0 0 420 210" className="h-auto w-full" role="img" aria-label="Sampling a sine wave">
      <line x1={20} y1={100} x2={400} y2={100} className={dim} strokeWidth="1" />
      <path d={sinePath(20, 100, 380, 55, 2)} fill="none" className={cyan} strokeWidth="2" />
      {/* well-sampled dots */}
      {samples.map((i) => {
        const t = i / 8
        const x = 20 + t * 380
        const y = 100 - 55 * Math.sin(2 * Math.PI * 2 * t)
        return <circle key={i} cx={x} cy={y} r={3.5} className="fill-primary" />
      })}
      <text x={30} y={30} fontSize="10" className="fill-foreground">● well sampled (f_s &gt; 2 f_max) — the wave is recoverable</text>
      {/* undersampled staircase */}
      <g transform="translate(0,0)">
        <path
          d="M20,190 L70,190 L70,152 L120,152 L120,190 L170,190 L170,152 L220,152 L220,190 L270,190 L270,152 L320,152 L320,190 L370,190"
          fill="none"
          className="stroke-rose-400"
          strokeWidth="2"
        />
        <text x={30} y={145} fontSize="10" className="fill-rose-400">
          undersampled → aliases into a slower false wave ✕
        </text>
      </g>
    </svg>
  )
}

// ─── 12. Filter response ────────────────────────────────────────────────────

function FilterResponse() {
  // flat then roll-off curve
  const path = `M30,60 L190,60 Q240,60 270,100 Q300,140 380,158`
  return (
    <svg viewBox="0 0 420 210" className="h-auto w-full" role="img" aria-label="Low pass filter frequency response">
      <line x1={30} y1={170} x2={400} y2={170} className={dim} strokeWidth="1.5" />
      <line x1={30} y1={170} x2={30} y2={30} className={dim} strokeWidth="1.5" />
      <text x={220} y={196} fontSize="10" textAnchor="middle" className="fill-muted-foreground">frequency →</text>
      <text x={16} y={100} fontSize="10" className="fill-muted-foreground" transform="rotate(-90 16 100)">
        gain
      </text>
      <path d={path} fill="none" className={accent} strokeWidth="2.5" />
      {/* cutoff */}
      <line x1={230} y1={60} x2={230} y2={170} className="stroke-rose-400" strokeWidth="1.5" strokeDasharray="5 4" />
      <text x={230} y={50} fontSize="10" textAnchor="middle" className="fill-rose-400">cutoff f_c</text>
      <text x={100} y={48} fontSize="10" className="fill-foreground">passband (kept)</text>
      <text x={300} y={140} fontSize="10" className="fill-foreground">stopband (attenuated)</text>
      <text x={210} y={188} fontSize="0" className="fill-muted-foreground"> </text>
      <text x={130} y={120} fontSize="10" className="fill-cyan-accent">RC low-pass: f_c = 1/(2πRC)</text>
    </svg>
  )
}

// ─── 13. Embedded stack ─────────────────────────────────────────────────────

function EmbeddedStack() {
  return (
    <svg viewBox="0 0 420 210" className="h-auto w-full" role="img" aria-label="Embedded system block anatomy">
      {/* center */}
      <rect x={160} y={70} width={100} height={70} rx={10} className="fill-card stroke-primary" strokeWidth="2" />
      <text x={210} y={98} fontSize="12" textAnchor="middle" className="fill-foreground">MCU</text>
      <text x={210} y={114} fontSize="9" textAnchor="middle" className="fill-muted-foreground">CPU · RAM · Flash</text>
      {/* satellites */}
      {[
        { x: 30, y: 30, label: 'Power', sub: '3.3/5 V reg' },
        { x: 300, y: 30, label: 'Clock', sub: 'crystal' },
        { x: 30, y: 150, label: 'Sensors', sub: 'ADC / I2C' },
        { x: 300, y: 150, label: 'Drivers', sub: 'motors, LEDs' },
        { x: 160, y: 8, label: 'Reset', sub: '' },
        { x: 160, y: 158, label: 'Watchdog', sub: 'auto-restart' },
      ].map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={b.y} width={90} height={36} rx={8} className="fill-card stroke-foreground/40" strokeWidth="1.5" />
          <text x={b.x + 45} y={b.y + (b.sub ? 16 : 22)} fontSize="10.5" textAnchor="middle" className="fill-foreground">
            {b.label}
          </text>
          {b.sub && (
            <text x={b.x + 45} y={b.y + 29} fontSize="8.5" textAnchor="middle" className="fill-muted-foreground">
              {b.sub}
            </text>
          )}
          <line
            x1={b.x + 45 + (b.x < 160 ? 45 : -45)}
            y1={b.y + 18}
            x2={b.x < 160 ? 160 : 260}
            y2={b.y < 70 ? (b.y + 36 < 70 ? 70 : 95) : b.y > 140 ? 140 : 105}
            className={dim}
            strokeWidth="1.2"
          />
        </g>
      ))}
    </svg>
  )
}

// ─── 14. IoT architecture ───────────────────────────────────────────────────

function IotArchitecture() {
  return (
    <svg viewBox="0 0 420 210" className="h-auto w-full" role="img" aria-label="IoT architecture layers">
      {[
        { x: 12, label: 'Things', sub: 'sensors + actuators', icon: '◦◦◦' },
        { x: 116, label: 'Gateway', sub: 'Wi-Fi / LoRa / BLE', icon: '((·))' },
        { x: 220, label: 'Cloud', sub: 'storage · rules · MQTT', icon: '☁' },
        { x: 324, label: 'App', sub: 'dashboard · alerts', icon: '[]' },
      ].map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={78} width={84} height={54} rx={10} className="fill-card stroke-primary/60" strokeWidth="1.5" />
          <text x={b.x + 42} y={100} fontSize="12" textAnchor="middle" className="fill-foreground">
            {b.label}
          </text>
          <text x={b.x + 42} y={116} fontSize="8.5" textAnchor="middle" className="fill-muted-foreground">
            {b.sub}
          </text>
          {i < 3 && <line x1={b.x + 86} y1={105} x2={b.x + 100} y2={105} className={cyan} strokeWidth="2" markerEnd="url(#arrowI)" />}
        </g>
      ))}
      <defs>
        <marker id="arrowI" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" className="fill-cyan-accent" />
        </marker>
      </defs>
      <text x={210} y={50} fontSize="11" textAnchor="middle" className="fill-muted-foreground">
        Data flows up · commands flow down
      </text>
      <text x={54} y={160} fontSize="10" textAnchor="middle" className="fill-cyan-accent">battery budget</text>
      <text x={262} y={160} fontSize="10" textAnchor="middle" className="fill-cyan-accent">TLS · signed OTA</text>
      <text x={210} y={192} fontSize="10" textAnchor="middle" className="fill-muted-foreground">
        Range, power, data rate — pick two
      </text>
    </svg>
  )
}

// ─── Dispatcher ─────────────────────────────────────────────────────────────

export function LessonDiagram({ kind }: { kind: DiagramKind }) {
  switch (kind) {
    case 'ohms-law-circuit':
      return <OhmsLawCircuit />
    case 'resistor-color':
      return <ResistorColor />
    case 'logic-gates':
      return <LogicGatesDiagram />
    case 'half-adder':
      return <HalfAdder />
    case 'diode-pn':
      return <DiodePn />
    case 'transistor-switch':
      return <TransistorSwitch />
    case 'sensor-block':
      return <SensorBlock />
    case 'arduino-led':
      return <ArduinoLed />
    case 'am-modulation':
      return <AmModulation />
    case 'digital-link':
      return <DigitalLink />
    case 'sine-sampling':
      return <SineSampling />
    case 'filter-response':
      return <FilterResponse />
    case 'embedded-stack':
      return <EmbeddedStack />
    case 'iot-architecture':
      return <IotArchitecture />
    default:
      return null
  }
}
