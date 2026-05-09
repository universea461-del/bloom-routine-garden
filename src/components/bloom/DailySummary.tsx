import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toPng } from "html-to-image";
import { dailyMessage, todayKey, type JournalEntry, type Task } from "@/lib/bloom-types";
import { Download, Heart } from "lucide-react";

const MOODS = ["🌸", "🌿", "☁️", "🌞", "🌙", "🍃"];

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  todayTasks: Task[];
  onSave: (entry: JournalEntry) => void;
}

export function DailySummary({ open, onOpenChange, todayTasks, onSave }: Props) {
  const [mood, setMood] = useState("🌸");
  const cardRef = useRef<HTMLDivElement>(null);
  const completed = todayTasks.filter((t) => t.completedAt).length;
  const total = todayTasks.length;
  const message = dailyMessage(completed, mood);

  const share = async () => {
    if (!cardRef.current) return;
    const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
    const link = document.createElement("a");
    link.download = `bloom-${todayKey()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const save = () => {
    onSave({ date: todayKey(), mood, completed, total, message });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card max-w-md rounded-3xl border-white/60">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">A soft recap 🍃</DialogTitle>
        </DialogHeader>

        <div className="mt-2">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            How did today feel?
          </p>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <button
                key={m}
                onClick={() => setMood(m)}
                className="grid h-11 w-11 place-items-center rounded-full bg-white/80 text-2xl transition-all"
                style={{
                  outline: m === mood ? "3px solid var(--color-primary)" : "none",
                  transform: m === mood ? "scale(1.08)" : undefined,
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={cardRef}
          className="mt-4 overflow-hidden rounded-3xl p-6 text-center"
          style={{
            background:
              "linear-gradient(160deg, oklch(0.94 0.07 350) 0%, oklch(0.92 0.08 200) 60%, oklch(0.9 0.1 145) 100%)",
          }}
        >
          <div className="text-5xl">{mood}</div>
          <div className="mt-2 text-xs uppercase tracking-[0.25em] text-foreground/60">
            Bloom Routine · {todayKey()}
          </div>
          <p className="mt-3 font-display text-xl leading-snug text-foreground">
            {message}
          </p>
          <div className="mt-4 flex justify-center gap-1 text-2xl">
            {Array.from({ length: Math.max(completed, 1) }).slice(0, 8).map((_, i) => (
              <span key={i} className="anim-float" style={{ animationDelay: `${i * 0.2}s` }}>
                {completed === 0 ? "🌱" : "🌸"}
              </span>
            ))}
          </div>
          <div className="mt-3 text-xs text-foreground/60">
            {completed} of {total} bloomed today
          </div>
        </div>

        <div className="mt-2 flex gap-2">
          <Button variant="secondary" className="flex-1 rounded-full" onClick={share}>
            <Download className="mr-2 h-4 w-4" /> Share image
          </Button>
          <Button className="flex-1 rounded-full" onClick={save}>
            <Heart className="mr-2 h-4 w-4" /> Save day
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
