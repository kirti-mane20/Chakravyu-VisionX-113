import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useProgress, levelFor, resetProgress } from "@/lib/progress";
import { TOPICS, FAULTS, QUESTIONS } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Progress as Bar } from "@/components/ui/progress";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "My Progress — ENTC Nexus" },
      { name: "description", content: "Track XP, level and completed ENTC activities, saved locally in your browser." },
      { property: "og:title", content: "My Progress — ENTC Nexus" },
      { property: "og:description", content: "XP, levels and completed activities." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const p = useProgress();
  const { level, into } = levelFor(p.xp);
  const count = (pre: string) => p.done.filter((d) => d.startsWith(pre)).length;
  const mods = [
    { name: "Lessons", to: "/learn", n: count("learn:"), total: TOPICS.length },
    { name: "Virtual Lab", to: "/lab", n: count("lab:"), total: 2 },
    { name: "Circuit Doctor", to: "/doctor", n: count("doctor:"), total: FAULTS.length },
    { name: "Challenge Arena", to: "/arena", n: count("arena:"), total: QUESTIONS.length },
  ] as const;

  const reset = () => {
    if (!window.confirm("Reset all XP and progress? This cannot be undone.")) return;
    resetProgress();
    toast.success("Progress reset.");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold">My Progress</h1>
      <p className="mt-1 text-sm text-muted-foreground">Saved in this browser only (localStorage).</p>
      <div className="glow mt-6 rounded-lg border border-primary bg-card p-6">
        <div className="flex items-end justify-between">
          <div><div className="text-sm text-muted-foreground">Level</div><div className="font-display text-5xl font-bold text-copper">{level}</div></div>
          <div className="text-right font-mono"><div className="text-2xl">{p.xp} XP</div><div className="text-xs text-muted-foreground">{100 - into} XP to level {level + 1}</div></div>
        </div>
        <Bar className="mt-4" value={into} />
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {mods.map((m) => (
          <Link key={m.name} to={m.to} className="rounded-lg border border-border bg-card p-5 hover:border-primary">
            <div className="flex justify-between"><span className="font-semibold">{m.name}</span><span className="font-mono text-sm">{m.n}/{m.total}</span></div>
            <Bar className="mt-3" value={(m.n / m.total) * 100} />
          </Link>
        ))}
      </div>
      <h2 className="mt-10 text-xl font-semibold">Recent activity</h2>
      {p.log.length === 0 ? (
        <p className="mt-3 text-muted-foreground">No activity yet. <Link to="/learn" className="text-primary underline">Start your first lesson</Link>.</p>
      ) : (
        <ul className="mt-3 divide-y divide-border rounded-lg border border-border bg-card">
          {p.log.map((l) => (
            <li key={l.id} className="flex justify-between px-4 py-3 text-sm">
              <span>{l.label}</span><span className="font-mono text-accent">+{l.xp} XP</span>
            </li>
          ))}
        </ul>
      )}
      <Button variant="destructive" className="mt-8" onClick={reset} disabled={p.xp === 0}>Reset progress</Button>
    </div>
  );
}
