import { useCallback, useEffect, useState } from "react";
import type { BloomState, JournalEntry, Task } from "@/lib/bloom-types";

const KEY = "bloom-routine-v1";

const initial: BloomState = { tasks: [], journal: [], blooms: 0 };

function load(): BloomState {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    return { ...initial, ...JSON.parse(raw) };
  } catch {
    return initial;
  }
}

function save(s: BloomState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function useBloomStore() {
  const [state, setState] = useState<BloomState>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) save(state);
  }, [state, hydrated]);

  const addTask = useCallback((t: Omit<Task, "id" | "createdAt" | "x" | "y">) => {
    const task: Task = {
      ...t,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      x: 10 + Math.random() * 75,
      y: 30 + Math.random() * 45,
    };
    setState((s) => ({ ...s, tasks: [task, ...s.tasks] }));
  }, []);

  const completeTask = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      blooms: s.blooms + 1,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, completedAt: Date.now() } : t)),
    }));
  }, []);

  const removeTask = useCallback((id: string) => {
    setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));
  }, []);

  const saveJournal = useCallback((entry: JournalEntry) => {
    setState((s) => ({
      ...s,
      journal: [entry, ...s.journal.filter((j) => j.date !== entry.date)],
    }));
  }, []);

  return { state, hydrated, addTask, completeTask, removeTask, saveJournal };
}
