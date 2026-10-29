import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { TOPICS, type Topic } from "@/lib/data";
import { award, useProgress } from "@/lib/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learn ENTC Topics — ENTC Nexus" },
      { name: "description", content: "Simplified lessons on digital electronics, microcontrollers, IoT, communication and signals." },
      { property: "og:title", content: "Learn ENTC Topics — ENTC Nexus" },
      { property: "og:description", content: "Interactive lessons with knowledge checks." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Learn,
});

const CATS = ["All", "Digital", "Microcontrollers", "IoT", "Communication", "Signals"] as const;

function Learn() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [open, setOpen] = useState<Topic | null>(null);
  const p = useProgress();

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return TOPICS.filter((t) => (cat === "All" || t.category === cat) &&
      (!s || (t.title + t.summary + t.points.join(" ")).toLowerCase().includes(s)));
  }, [q, cat]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Learn</h1>
      <p className="mt-1 text-muted-foreground">Pick a topic, read the key ideas, pass the knowledge check for +15 XP.</p>
      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <div className="relative md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search topics, e.g. PWM, Nyquist…" className="pl-9" aria-label="Search topics" />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATS.map((c) => (
            <Button key={c} size="sm" variant={cat === c ? "default" : "outline"} onClick={() => setCat(c)}>{c}</Button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
          No topics match “{q}”. <button className="text-primary underline" onClick={() => { setQ(""); setCat("All"); }}>Clear filters</button>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t) => {
            const done = p.done.includes(`learn:${t.id}`);
            return (
              <button key={t.id} onClick={() => setOpen(t)} className="rounded-lg border border-border bg-card p-5 text-left transition hover:border-primary">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{t.category}</Badge>
                  {done && <CheckCircle2 className="h-5 w-5 text-success" aria-label="Completed" />}
                </div>
                <h3 className="mt-3 font-semibold">{t.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.summary}</p>
                <p className="mt-3 font-mono text-xs text-accent">{t.level}</p>
              </button>
            );
          })}
        </div>
      )}
      <TopicDialog topic={open} onClose={() => setOpen(null)} />
    </div>
  );
}

function TopicDialog({ topic, onClose }: { topic: Topic | null; onClose: () => void }) {
  const [pick, setPick] = useState<number | null>(null);
  const [result, setResult] = useState<null | boolean>(null);
  const close = () => { setPick(null); setResult(null); onClose(); };
  if (!topic) return null;
  const submit = () => {
    if (pick === null) { toast.error("Select an answer first."); return; }
    const ok = pick === topic.check.answer;
    setResult(ok);
    if (ok) {
      const fresh = award(`learn:${topic.id}`, `Lesson: ${topic.title}`, 15);
      toast.success(fresh ? "Correct! +15 XP" : "Correct! (already completed)");
    } else toast.error("Not quite — re-read the key points and try again.");
  };
  return (
    <Dialog open onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{topic.title}</DialogTitle>
          <DialogDescription>{topic.summary}</DialogDescription>
        </DialogHeader>
        <ul className="list-disc space-y-1 pl-5 text-sm">{topic.points.map((x) => <li key={x}>{x}</li>)}</ul>
        <div className="mt-2 rounded-md border border-border bg-muted p-4">
          <p className="text-sm font-semibold">Knowledge check: {topic.check.q}</p>
          <div className="mt-3 grid gap-2">
            {topic.check.options.map((o, i) => (
              <Button key={o} variant={pick === i ? "default" : "outline"} className="justify-start" onClick={() => { setPick(i); setResult(null); }}>{o}</Button>
            ))}
          </div>
          {result !== null && (
            <p className={`mt-3 text-sm ${result ? "text-success" : "text-destructive"}`}>
              {result ? "✔ Correct!" : "✘ Incorrect, try again."}
            </p>
          )}
          <Button className="mt-3 w-full" onClick={submit}>Check answer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
