import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import confetti from "canvas-confetti";
import { Plus, BookHeart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBloomStore } from "@/hooks/use-bloom-store";
import { SkyScene } from "@/components/bloom/SkyScene";
import { Meadow } from "@/components/bloom/Meadow";
import { CharacterSprite } from "@/components/bloom/CharacterSprite";
import { TaskModal } from "@/components/bloom/TaskModal";
import { AddTaskSheet } from "@/components/bloom/AddTaskSheet";
import { JournalSheet } from "@/components/bloom/JournalSheet";
import { DailySummary } from "@/components/bloom/DailySummary";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bloom Routine — a cozy spring task garden" },
      {
        name: "description",
        content:
          "Turn your daily tasks into cute characters that bloom into a peaceful spring meadow.",
      },
      { property: "og:title", content: "Bloom Routine" },
      { property: "og:description", content: "A calm, animated way to grow your day." },
    ],
  }),
  component: BloomHome,
});

function softConfetti() {
  const colors = ["#f7b8c8", "#e1c4f5", "#fde6a3", "#bce6c9", "#f9c8a4"];
  confetti({
    particleCount: 70,
    spread: 70,
    startVelocity: 28,
    gravity: 0.7,
    scalar: 0.9,
    origin: { y: 0.55 },
    colors,
  });
  setTimeout(
    () =>
      confetti({
        particleCount: 30,
        spread: 120,
        startVelocity: 18,
        scalar: 0.7,
        origin: { y: 0.5 },
        colors,
        shapes: ["circle"],
      }),
    250,
  );
}

function BloomHome() {
  const { state, hydrated, addTask, completeTask, removeTask, saveJournal } = useBloomStore();
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const activeTasks = state.tasks.filter((t) => !t.completedAt);
  const today = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return state.tasks.filter((t) => t.createdAt >= start.getTime());
  }, [state.tasks]);
  const completedToday = today.filter((t) => t.completedAt).length;

  const openTask = state.tasks.find((t) => t.id === openTaskId) ?? null;

  const handleComplete = (id: string) => {
    completeTask(id);
    softConfetti();
    // Close after a short bloom moment
    setTimeout(() => setOpenTaskId(null), 700);
  };

  return (
    <div className="scene-gradient relative min-h-screen w-full overflow-hidden">
      <SkyScene />
      <Meadow blooms={state.blooms} />

      {/* Top bar */}
      <header className="relative z-20 flex items-center justify-between px-6 pt-6">
        <div>
          <h1 className="font-display text-3xl text-shadow-soft sm:text-4xl">
            Bloom Routine
          </h1>
          <p className="text-sm text-foreground/70">
            {hydrated && activeTasks.length === 0
              ? "Your meadow is waiting for a tiny seed 🌱"
              : `${completedToday} bloomed · ${activeTasks.length} resting in the field`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full bg-white/70 backdrop-blur hover:bg-white"
            onClick={() => setJournalOpen(true)}
          >
            <BookHeart className="mr-2 h-4 w-4" /> Journal
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full bg-white/70 backdrop-blur hover:bg-white"
            onClick={() => setSummaryOpen(true)}
          >
            <Sparkles className="mr-2 h-4 w-4" /> Today
          </Button>
        </div>
      </header>

      {/* Scene with characters */}
      <main className="relative z-10 h-[calc(100vh-7rem)] w-full">
        <AnimatePresence>
          {activeTasks.map((t) => (
            <CharacterSprite
              key={t.id}
              task={t}
              onClick={() => setOpenTaskId(t.id)}
            />
          ))}
        </AnimatePresence>

        {hydrated && state.tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pointer-events-none absolute left-1/2 top-1/2 w-[min(420px,86vw)] -translate-x-1/2 -translate-y-1/2 text-center"
          >
            <div className="glass-card rounded-3xl px-6 py-7">
              <div className="text-5xl">🐰🌷🐻</div>
              <h2 className="mt-3 font-display text-2xl">Welcome to your meadow</h2>
              <p className="mt-1 text-sm text-foreground/70">
                Tasks here aren't lists — they're little friends who hop around your
                garden. Plant one and watch your world bloom.
              </p>
            </div>
          </motion.div>
        )}
      </main>

      {/* Floating add button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setAdding(true)}
        className="fixed bottom-6 right-6 z-30 grid h-16 w-16 place-items-center rounded-full text-primary-foreground shadow-xl"
        style={{
          background: "linear-gradient(135deg, oklch(0.78 0.14 350), oklch(0.78 0.13 305))",
          boxShadow: "0 18px 40px -10px oklch(0.5 0.18 350 / 0.55)",
        }}
        aria-label="Plant a task"
      >
        <Plus className="h-7 w-7" strokeWidth={2.5} />
      </motion.button>

      <TaskModal
        task={openTask}
        onClose={() => setOpenTaskId(null)}
        onComplete={handleComplete}
        onRemove={removeTask}
      />
      <AddTaskSheet open={adding} onOpenChange={setAdding} onAdd={addTask} />
      <JournalSheet open={journalOpen} onOpenChange={setJournalOpen} entries={state.journal} />
      <DailySummary
        open={summaryOpen}
        onOpenChange={setSummaryOpen}
        todayTasks={today}
        onSave={saveJournal}
      />
    </div>
  );
}
