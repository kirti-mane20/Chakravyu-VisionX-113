import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";
import { award } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/lab")({
  head: () => ({
    meta: [
      { title: "Virtual Electronics Lab — ENTC Nexus" },
      { name: "description", content: "Simulate an LED circuit: adjust supply voltage, resistor and switch to see Ohm's law in action." },
      { property: "og:title", content: "Virtual Electronics Lab — ENTC Nexus" },
      { property: "og:description", content: "A browser-based LED circuit simulation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Lab,
});

const VF = 2.0; // red LED forward voltage
const IMAX = 30; // mA — burn threshold in this simulation

function simulate(v: number, r: number, power: boolean, sw: boolean) {
  const closed = power && sw;
  const i = closed && v > VF ? ((v - VF) / r) * 1000 : 0; // mA
  return { closed, i, burnt: i > IMAX, brightness: Math.min(i / 20, 1) };
}

function Lab() {
  const [power, setPower] = useState(false);
  const [sw, setSw] = useState(false);
  const [v, setV] = useState(5);
  const [r, setR] = useState(330);
  const [burnt, setBurnt] = useState(false);
  const sim = simulate(v, r, power, sw);

  useEffect(() => {
    if (burnt) return;
    if (sim.burnt) {
      setBurnt(true);
      toast.error(`LED burnt out! ${sim.i.toFixed(1)} mA exceeds the ${IMAX} mA rating.`);
      award("lab:burn", "Lab: Discovered LED burnout", 10);
    } else if (sim.i >= 5) {
      if (award("lab:lit", "Lab: Lit the LED safely", 20)) toast.success("LED lit safely! +20 XP");
    }
  }, [sim.i, sim.burnt, burnt]);

  const reset = () => { setBurnt(false); setPower(false); setSw(false); setV(5); setR(330); toast("New LED installed. Circuit reset."); };
  const lit = !burnt && sim.i > 0;
  const current = burnt ? 0 : sim.i;
  const wire = sim.closed && !burnt ? "var(--primary)" : "var(--muted-foreground)";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Virtual Electronics Lab</h1>
      <p className="mt-1 text-muted-foreground">Simulated series LED circuit (red LED, Vf = 2 V, max {IMAX} mA). Values follow Ohm's law: I = (V − Vf) / R.</p>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="pcb-grid rounded-lg border border-border bg-card p-4">
          <svg viewBox="0 0 400 260" className="w-full" role="img" aria-label="LED circuit diagram">
            <path d="M60 60 H340 V200 H60 Z" fill="none" stroke={wire} strokeWidth="4" strokeDasharray={sim.closed && !burnt ? "8 6" : "0"}>
              {sim.closed && !burnt && <animate attributeName="stroke-dashoffset" from="28" to="0" dur="0.6s" repeatCount="indefinite" />}
            </path>
            {/* battery */}
            <rect x="35" y="105" width="50" height="50" rx="6" fill="var(--secondary)" stroke={wire} strokeWidth="3" />
            <text x="60" y="135" textAnchor="middle" fontSize="13" fill="var(--foreground)" fontFamily="monospace">{v}V</text>
            {/* switch */}
            <circle cx="160" cy="60" r="5" fill="var(--foreground)" />
            <circle cx="210" cy="60" r="5" fill="var(--foreground)" />
            <rect x="150" y="45" width="70" height="30" fill="var(--card)" />
            <circle cx="160" cy="60" r="5" fill="var(--foreground)" />
            <circle cx="210" cy="60" r="5" fill="var(--foreground)" />
            <line x1="160" y1="60" x2={sw ? 210 : 200} y2={sw ? 60 : 32} stroke="var(--foreground)" strokeWidth="4" />
            <text x="185" y="95" textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">SW {sw ? "ON" : "OFF"}</text>
            {/* resistor */}
            <rect x="315" y="95" width="50" height="70" fill="var(--card)" />
            <path d="M340 95 l12 6 -24 12 24 12 -24 12 24 12 -24 12 12 4" fill="none" stroke="var(--primary)" strokeWidth="3" />
            <text x="305" y="135" textAnchor="end" fontSize="11" fill="var(--foreground)" fontFamily="monospace">{r}Ω</text>
            {/* LED */}
            <rect x="170" y="180" width="60" height="40" fill="var(--card)" />
            <polygon points="180,185 180,215 210,200" fill={burnt ? "var(--muted)" : lit ? "var(--led-on)" : "var(--secondary)"}
              stroke="var(--foreground)" strokeWidth="2" style={{ opacity: lit ? 0.4 + sim.brightness * 0.6 : 1 }} className={lit ? "led-glow" : ""} />
            <line x1="212" y1="185" x2="212" y2="215" stroke="var(--foreground)" strokeWidth="3" />
            <text x="200" y="245" textAnchor="middle" fontSize="11" fill={burnt ? "var(--destructive)" : "var(--muted-foreground)"}>{burnt ? "LED BURNT ✕" : "LED"}</text>
          </svg>
          <div className="mt-2 grid grid-cols-3 gap-2 font-mono text-sm">
            <Meter label="Current" value={`${current.toFixed(1)} mA`} warn={sim.i > IMAX} />
            <Meter label="V(resistor)" value={`${lit ? (v - VF).toFixed(1) : "0.0"} V`} />
            <Meter label="Power(R)" value={`${lit ? (((v - VF) * current) ).toFixed(0) : 0} mW`} />
          </div>
        </div>

        <div className="space-y-6 rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between"><Label htmlFor="pw">Power supply</Label><Switch id="pw" checked={power} onCheckedChange={setPower} /></div>
          <div className="flex items-center justify-between"><Label htmlFor="sw">Circuit switch</Label><Switch id="sw" checked={sw} onCheckedChange={setSw} /></div>
          <div>
            <Label>Supply voltage: <span className="font-mono text-primary">{v} V</span></Label>
            <Slider className="mt-3" min={3} max={12} step={1} value={[v]} onValueChange={([x]) => setV(x ?? 5)} />
          </div>
          <div>
            <Label>Resistor: <span className="font-mono text-primary">{r} Ω</span></Label>
            <Slider className="mt-3" min={47} max={1000} step={1} value={[r]} onValueChange={([x]) => setR(x ?? 330)} />
            <div className="mt-2 flex flex-wrap gap-2">
              {[100, 220, 330, 470, 1000].map((x) => <Button key={x} size="sm" variant="outline" onClick={() => setR(x)}>{x}Ω</Button>)}
            </div>
          </div>
          <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
            {!power ? "Turn on the power supply to begin." : !sw ? "Close the switch to complete the circuit." : burnt ? "Too much current destroyed the LED. Increase resistance, then replace the LED." : sim.i < 5 ? "LED is very dim — try a smaller resistor." : "Circuit working. Try lowering R to see what happens…"}
          </div>
          <Button variant="secondary" className="w-full" onClick={reset}><RotateCcw /> Replace LED & reset</Button>
        </div>
      </div>
    </div>
  );
}

function Meter({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className={`rounded-md border p-2 text-center ${warn ? "border-destructive text-destructive" : "border-border"}`}>
      <div className="text-[10px] uppercase text-muted-foreground">{label}</div>{value}
    </div>
  );
}
