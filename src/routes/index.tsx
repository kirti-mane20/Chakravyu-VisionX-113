import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, FlaskConical, Stethoscope, Trophy, ArrowRight, AlertTriangle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ENTC Nexus — Smart ENTC Learning & Innovation Platform" },
      { name: "description", content: "Learn ENTC concepts, experiment in a virtual lab, diagnose circuit faults and take challenges — all in your browser." },
      { property: "og:title", content: "ENTC Nexus — Learn It. Build It. Debug It." },
      { property: "og:description", content: "Interactive lessons, virtual circuits and fault-diagnosis simulations for ENTC engineers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const STEPS = [
  { to: "/learn", icon: BookOpen, t: "1. Learn", d: "Bite-sized lessons on Digital, Microcontrollers, IoT, Communication and Signals with knowledge checks." },
  { to: "/lab", icon: FlaskConical, t: "2. Build", d: "Wire a virtual LED circuit. Change voltage and resistance and watch current, brightness — and burnout." },
  { to: "/doctor", icon: Stethoscope, t: "3. Debug", d: "Circuit Doctor: read meter values, diagnose a real-world fault and learn the fix." },
  { to: "/arena", icon: Trophy, t: "4. Master", d: "Timed-free quizzes on digital logic, Boolean algebra and Arduino code." },
] as const;

function Index() {
  return (
    <div className="pcb-grid">
      <section className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">Smart ENTC Learning & Innovation Platform</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
          Learn it. Build it. <span className="text-copper">Debug it.</span> Master it.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          ENTC Nexus turns electronics theory into hands-on practice — virtual circuits, fault diagnosis and challenges, no lab equipment needed.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" className="glow"><Link to="/learn">Start learning <ArrowRight /></Link></Button>
          <Button asChild size="lg" variant="outline"><Link to="/doctor">Try Circuit Doctor</Link></Button>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-16 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <AlertTriangle className="h-6 w-6 text-destructive" />
          <h2 className="mt-3 text-xl font-semibold">The problem</h2>
          <p className="mt-2 text-muted-foreground">ENTC students struggle to connect theory with practice: limited lab access, hard-to-learn troubleshooting, and few interactive resources.</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <Lightbulb className="h-6 w-6 text-primary" />
          <h2 className="mt-3 text-xl font-semibold">Our solution & key benefit</h2>
          <p className="mt-2 text-muted-foreground">One browser-based journey from concept to experiment to diagnosis to assessment — self-paced, free and accessible anywhere, with XP-based progress tracking.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24">
        <h2 className="text-2xl font-bold">The learning journey</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <Link key={s.to} to={s.to} className="group rounded-lg border border-border bg-card p-5 transition hover:border-primary">
              <s.icon className="h-6 w-6 text-accent" />
              <h3 className="mt-3 font-semibold">{s.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm text-primary">Open <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
