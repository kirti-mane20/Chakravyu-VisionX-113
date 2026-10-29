import { useEffect, useState, useCallback } from "react";

export type Progress = { xp: number; done: string[]; log: { id: string; label: string; xp: number; at: string }[] };
const KEY = "entc-nexus-progress";
const EMPTY: Progress = { xp: 0, done: [], log: [] };

export function readProgress(): Progress {
  if (typeof window === "undefined") return EMPTY;
  try {
    const p = JSON.parse(localStorage.getItem(KEY) || "null");
    return p && Array.isArray(p.done) ? p : EMPTY;
  } catch {
    return EMPTY;
  }
}

/** Awards XP once per activity id. Returns true if newly awarded. */
export function award(id: string, label: string, xp: number): boolean {
  const p = readProgress();
  if (p.done.includes(id)) return false;
  const next: Progress = {
    xp: p.xp + xp,
    done: [...p.done, id],
    log: [{ id, label, xp, at: new Date().toISOString() }, ...p.log].slice(0, 50),
  };
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("entc-progress"));
  return true;
}

export function resetProgress() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("entc-progress"));
}

export function levelFor(xp: number) {
  const level = Math.floor(xp / 100) + 1;
  return { level, into: xp % 100 };
}

export function useProgress() {
  const [p, setP] = useState<Progress>(EMPTY);
  const refresh = useCallback(() => setP(readProgress()), []);
  useEffect(() => {
    refresh();
    window.addEventListener("entc-progress", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("entc-progress", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);
  return p;
}
