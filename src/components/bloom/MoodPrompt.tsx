import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MOOD_META, type Mood } from "@/lib/bloom-types";
import { motion } from "framer-motion";

interface Props {
  open: boolean;
  onPick: (m: Mood) => void;
}

const ORDER: Mood[] = ["calm", "energetic", "tired", "sad"];

export function MoodPrompt({ open, onPick }: Props) {
  return (
    <Dialog open={open}>
      <DialogContent
        className="glass-card max-w-md rounded-3xl border-white/60 [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-center font-display text-2xl">
            How does today feel? 🌷
          </DialogTitle>
        </DialogHeader>
        <p className="text-center text-sm text-foreground/70">
          Your meadow listens — pick a mood and we'll match the day's pace.
        </p>

        <div className="mt-3 grid grid-cols-2 gap-3">
          {ORDER.map((m, i) => {
            const meta = MOOD_META[m];
            return (
              <motion.button
                key={m}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPick(m)}
                className="rounded-3xl p-5 text-left soft-shadow"
                style={{ background: meta.tint }}
              >
                <div className="text-4xl">{meta.emoji}</div>
                <div className="mt-2 font-display text-lg">{meta.label}</div>
              </motion.button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
