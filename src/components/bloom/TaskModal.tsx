import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CHARACTERS, type Task } from "@/lib/bloom-types";
import { useEffect, useRef, useState } from "react";
import { Clock, Trash2, Sparkles } from "lucide-react";

interface Props {
  task: Task | null;
  onClose: () => void;
  onComplete: (id: string) => void;
  onRemove: (id: string) => void;
}

export function TaskModal({ task, onClose, onComplete, onRemove }: Props) {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (!task) {
      setSeconds(0);
      setRunning(false);
    } else {
      setSeconds((task.minutes ?? 0) * 60);
    }
  }, [task]);

  useEffect(() => {
    if (running) {
      ref.current = window.setInterval(() => {
        setSeconds((s) => Math.max(0, s - 1));
      }, 1000);
    }
    return () => {
      if (ref.current) window.clearInterval(ref.current);
    };
  }, [running]);

  if (!task) return null;
  const meta = CHARACTERS[task.character];
  const done = !!task.completedAt;
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <Dialog open={!!task} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="glass-card max-w-md rounded-3xl border-white/60 p-0 overflow-hidden">
        <div
          className="relative px-7 pt-8 pb-4 text-center"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${meta.tint}, transparent 70%)`,
          }}
        >
          <div className="text-7xl">{meta.emoji}</div>
          <DialogHeader className="mt-3">
            <DialogTitle className="font-display text-2xl">
              {task.title}
            </DialogTitle>
          </DialogHeader>
          <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
            {meta.label} · {meta.hint}
          </p>
        </div>

        <div className="space-y-5 p-6">
          {task.note && (
            <p className="rounded-2xl bg-white/70 p-3 text-sm text-foreground/80">
              {task.note}
            </p>
          )}

          {task.minutes ? (
            <div className="flex items-center justify-between rounded-2xl bg-white/70 p-4">
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <Clock className="h-4 w-4" />
                Soft timer
              </div>
              <div className="font-display text-3xl tabular-nums">
                {mm}:{ss}
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full"
                onClick={() => setRunning((r) => !r)}
              >
                {running ? "Pause" : "Start"}
              </Button>
            </div>
          ) : null}

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-muted-foreground hover:text-destructive"
              onClick={() => {
                onRemove(task.id);
                onClose();
              }}
              aria-label="Remove"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              disabled={done}
              onClick={() => onComplete(task.id)}
              className="ml-auto rounded-full px-6 shadow-md"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {done ? "Bloomed" : "Complete"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
