import { useCallback, useEffect, useRef, useState } from "react";
import {
  ACHIEVEMENTS,
  CHARACTERS,
  REWARD_THRESHOLD,
  todayKey,
  yesterdayKey,
  type BloomState,
  type JournalEntry,
  type Mood,
  type Task,
} from "@/lib/bloom-types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

const initial: BloomState = {
  tasks: [],
  journal: [],
  blooms: 0,
  xp: 0,
  coins: 0,
  streak: 0,
  moodByDate: {},
  achievements: [],
  rewardProgress: 0,
  pendingRewards: 0,
};

function checkAchievements(s: BloomState): { state: BloomState; newly: string[] } {
  const newly: string[] = [];
  const unlocked = new Set(s.achievements);
  for (const a of ACHIEVEMENTS) {
    if (!unlocked.has(a.id) && a.check(s)) {
      unlocked.add(a.id);
      newly.push(a.id);
    }
  }
  if (newly.length === 0) return { state: s, newly };
  return {
    state: { ...s, achievements: Array.from(unlocked), coins: s.coins + newly.length * 5 },
    newly,
  };
}

export function useBloomStore() {
  const { user } = useAuth();
  const [state, setState] = useState<BloomState>(initial);
  const [hydrated, setHydrated] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load from Supabase when user changes
  useEffect(() => {
    if (!user) {
      setHydrated(false);
      setState(initial);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("garden_states")
        .select("state")
        .eq("user_id", user.id)
        .maybeSingle();
      if (cancelled) return;
      const loaded = (data?.state as Partial<BloomState> | null) ?? null;
      setState(loaded && Object.keys(loaded).length ? { ...initial, ...loaded } : initial);
      setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Debounced persist to Supabase
  useEffect(() => {
    if (!user || !hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      supabase
        .from("garden_states")
        .upsert({ user_id: user.id, state: state as unknown as Record<string, unknown> })
        .then(() => {});
    }, 400);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state, hydrated, user]);

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
    setState((s) => {
      const task = s.tasks.find((t) => t.id === id);
      if (!task || task.completedAt) return s;
      const meta = CHARACTERS[task.character];
      const today = todayKey();
      const yest = yesterdayKey();
      const sameDay = s.lastCompletedDate === today;
      const continuing = s.lastCompletedDate === yest;
      const streak = sameDay ? s.streak : continuing ? s.streak + 1 : 1;

      const progress = s.rewardProgress + 1;
      const earnedBox = progress >= REWARD_THRESHOLD;

      const next: BloomState = {
        ...s,
        blooms: s.blooms + 1,
        xp: s.xp + meta.xp,
        coins: s.coins + meta.coins,
        streak,
        lastCompletedDate: today,
        rewardProgress: earnedBox ? 0 : progress,
        pendingRewards: earnedBox ? s.pendingRewards + 1 : s.pendingRewards,
        tasks: s.tasks.map((t) => (t.id === id ? { ...t, completedAt: Date.now() } : t)),
      };
      return checkAchievements(next).state;
    });
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

  const setMood = useCallback((mood: Mood) => {
    setState((s) => {
      const next = { ...s, moodByDate: { ...s.moodByDate, [todayKey()]: mood } };
      return checkAchievements(next).state;
    });
  }, []);

  const claimReward = useCallback((reward: { kind: string; value: number }) => {
    setState((s) => {
      if (s.pendingRewards <= 0) return s;
      let next: BloomState = { ...s, pendingRewards: s.pendingRewards - 1 };
      if (reward.kind === "coins") next = { ...next, coins: next.coins + reward.value };
      if (reward.kind === "flower") next = { ...next, blooms: next.blooms + reward.value };
      return checkAchievements(next).state;
    });
  }, []);

  const todayMood = state.moodByDate[todayKey()];

  return {
    state,
    hydrated,
    todayMood,
    addTask,
    completeTask,
    removeTask,
    saveJournal,
    setMood,
    claimReward,
  };
}
