import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Stethoscope, Lightbulb, CheckCircle2, XCircle, Wrench } from "lucide-react";
import { FAULTS } from "@/lib/data";
import { award, useProgress } from "@/lib/progress";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/doctor")({
  head: () => ({
    meta: [
      { title: "Circuit Doctor — ENTC Nexus" },
      { name: "description", content: "Diagnose simulated electronics faults from meter readings, use hints and learn the repair." },
      { property: "og:title", content: "Circuit Doctor — ENTC Nexus" },
      { property: "og:description", content: "Troubleshooting simulations for ENTC students." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Doctor,
});

function Doctor() {
  const [idx, setIdx] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [hint, setHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const p = useProgress();
  const f = FAULTS[idx]!;
  const solved = pick !== null && f.options[pick]!.correct;

  const choose = (i: number) => {
    if (solved) return;
    setPick(i);
    setAttempts((a) => a + 1);
    if (f.options[i]!.correct) {
      const xp = hint || attempts > 0 ? 15 : 30;
      const fresh = award(`doctor:${f.id}`, `Circuit Doctor: ${f.title}`, xp);
      toast.success(fresh ? `Diagnosis correct! +${xp} XP` : "Diagnosis correct! (already solved)");
    } else toast.error("Wrong diagnosis — read the meter values again.");
  };
  const go = (i: number) => { setIdx(i); setPick(null); setHint(false); setAttempts(0); };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent"><Stethoscope className="h-4 w-4" /> Distinctive feature</div>
      <h1 className="mt-1 text-3xl font-bold">Circuit Doctor</h1>
      <p className="mt-1 text-muted-foreground">Simulated fault cases with sample meter readings. Diagnose first try for 30 XP; using a hint or retrying gives 15 XP.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="flex gap-2 overflow-x-auto lg:flex-col">
          {FAULTS.map((x, i) => (
            <Button key={x.id} variant={i === idx ? "default" : "outline"} className="justify-between" onClick={() => go(i)}>
              <span>Case {i + 1}: {x.title}</span>
              {p.done.includes(`doctor:${x.id}`) && <CheckCircle2 className="text-success" />}
            </Button>
          ))}
        </aside>

        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">Patient: {f.title}</h2>
          <p className="mt-2 text-muted-foreground">{f.symptom}</p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {f.readings.map((r) => (
              <div key={r.label} className="pcb-grid rounded-md border border-border bg-background p-3 font-mono">
                <div className="text-[10px] uppercase text-muted-foreground">{r.label}</div>
                <div className="text-accent">{r.value}</div>
              </div>
            ))}
          </div>

          <h3 className="mt-6 font-semibold">What's your diagnosis?</h3>
          <div className="mt-3 grid gap-2">
            {f.options.map((o, i) => {
              const chosen = pick === i;
              return (
                <div key={o.text}>
                  <Button variant={chosen ? (o.correct ? "default" : "destructive") : "outline"} className="h-auto w-full justify-start whitespace-normal py-2 text-left" onClick={() => choose(i)} disabled={solved && !chosen}>
                    {chosen && (o.correct ? <CheckCircle2 /> : <XCircle />)} {o.text}
                  </Button>
                  {chosen && <p className="mt-1 pl-2 text-sm text-muted-foreground">{o.why}</p>}
                </div>
              );
            })}
          </div>

          {!solved && (
            <Button variant="ghost" className="mt-4" onClick={() => setHint(true)} disabled={hint}><Lightbulb /> {hint ? "Hint shown" : "Show hint (reduces XP)"}</Button>
          )}
          {hint && !solved && <p className="mt-2 rounded-md bg-muted p-3 text-sm">💡 {f.hint}</p>}
          {solved && (
            <div className="mt-5 rounded-md border border-success p-4">
              <p className="flex items-center gap-2 font-semibold text-success"><Wrench className="h-4 w-4" /> Repair</p>
              <p className="mt-1 text-sm">{f.fix}</p>
              {idx < FAULTS.length - 1 && <Button className="mt-3" onClick={() => go(idx + 1)}>Next case →</Button>}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
