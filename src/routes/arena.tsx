import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Trophy } from "lucide-react";
import { QUESTIONS } from "@/lib/data";
import { award } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/arena")({
  head: () => ({
    meta: [
      { title: "Challenge Arena — ENTC Nexus" },
      { name: "description", content: "Quizzes on digital electronics, Boolean logic and Arduino programming." },
      { property: "og:title", content: "Challenge Arena — ENTC Nexus" },
      { property: "og:description", content: "Test your ENTC knowledge and earn XP." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Arena,
});

const CATS = ["All", "Digital", "Boolean", "Arduino"] as const;
type Cat = (typeof CATS)[number];

function Arena() {
  const [cat, setCat] = useState<Cat | null>(null);
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const qs = cat ? QUESTIONS.filter((q) => cat === "All" || q.cat === cat) : [];
  const q = qs[i]!;
  const finished = cat && i >= qs.length;

  const start = (c: Cat) => { setCat(c); setI(0); setPick(null); setScore(0); };
  const answer = (k: number) => {
    if (pick !== null) return;
    setPick(k);
    if (k === q.answer) {
      setScore((s) => s + 1);
      award(`arena:${q.id}`, `Arena: ${q.cat} question`, 10);
    }
  };
  const next = () => {
    if (pick === null) { toast.error("Choose an answer first."); return; }
    setPick(null);
    setI(i + 1);
  };

  if (!cat) return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Challenge Arena</h1>
      <p className="mt-1 text-muted-foreground">Choose a track. Each first-time correct answer earns +10 XP.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {CATS.map((c) => (
          <button key={c} onClick={() => start(c)} className="rounded-lg border border-border bg-card p-5 text-left hover:border-primary">
            <h3 className="font-semibold">{c === "All" ? "Mixed challenge" : c === "Boolean" ? "Boolean logic" : c === "Arduino" ? "Arduino code" : "Digital electronics"}</h3>
            <p className="text-sm text-muted-foreground">{QUESTIONS.filter((q) => c === "All" || q.cat === c).length} questions</p>
          </button>
        ))}
      </div>
    </div>
  );

  if (finished) {
    const pct = Math.round((score / qs.length) * 100);
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <Trophy className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl font-bold">{score} / {qs.length}</h1>
        <p className="mt-2 text-muted-foreground">{pct >= 80 ? "Excellent — you've mastered this track!" : pct >= 50 ? "Good work. Review the explanations and retry." : "Keep practising — revisit the Learn section."}</p>
        <div className="mt-6 flex justify-center gap-2">
          <Button onClick={() => start(cat)}>Retry</Button>
          <Button variant="outline" onClick={() => setCat(null)}>Other tracks</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <button className="underline" onClick={() => setCat(null)}>← Tracks</button>
        <span className="font-mono">Q{i + 1}/{qs.length} · Score {score}</span>
      </div>
      <Progress className="mt-3" value={(i / qs.length) * 100} />
      <div className="mt-6 rounded-lg border border-border bg-card p-6">
        <p className="font-mono text-xs text-accent">{q.cat}</p>
        <h2 className="mt-1 text-xl font-semibold">{q.q}</h2>
        {q.code && <pre className="mt-3 overflow-x-auto rounded-md bg-background p-3 font-mono text-sm text-accent">{q.code}</pre>}
        <div className="mt-4 grid gap-2">
          {q.options.map((o, k) => {
            const v = pick === null ? "outline" : k === q.answer ? "default" : k === pick ? "destructive" : "outline";
            return <Button key={o} variant={v} className="justify-start font-mono" onClick={() => answer(k)}>{o}</Button>;
          })}
        </div>
        {pick !== null && (
          <p className={`mt-4 text-sm ${pick === q.answer ? "text-success" : "text-destructive"}`}>
            {pick === q.answer ? "✔ Correct. " : "✘ Incorrect. "}<span className="text-muted-foreground">{q.explain}</span>
          </p>
        )}
        <Button className="mt-4 w-full" onClick={next}>{i === qs.length - 1 ? "See results" : "Next question"}</Button>
      </div>
    </div>
  );
}
