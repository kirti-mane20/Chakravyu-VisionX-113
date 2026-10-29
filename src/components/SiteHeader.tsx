import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Cpu, Menu, X, Zap } from "lucide-react";
import { useProgress, levelFor } from "@/lib/progress";

const NAV = [
  { to: "/learn", label: "Learn" },
  { to: "/lab", label: "Virtual Lab" },
  { to: "/doctor", label: "Circuit Doctor" },
  { to: "/arena", label: "Challenge Arena" },
  { to: "/progress", label: "Progress" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const p = useProgress();
  const { level } = levelFor(p.xp);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <Cpu className="h-5 w-5 text-primary" /> ENTC <span className="text-copper">Nexus</span>
        </Link>
        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
              activeProps={{ className: "rounded-md px-3 py-1.5 text-sm bg-secondary text-foreground" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <Link to="/progress" className="ml-auto flex items-center gap-1 rounded-full border border-border px-3 py-1 font-mono text-xs md:ml-2">
          <Zap className="h-3.5 w-3.5 text-primary" /> {p.xp} XP · L{level}
        </Link>
        <button aria-label="Toggle menu" className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col border-t border-border px-4 py-2 md:hidden">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-2 text-sm">{n.label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}
