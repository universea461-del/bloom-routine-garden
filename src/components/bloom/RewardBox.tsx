import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { REWARD_POOL, type Reward } from "@/lib/bloom-types";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  pending: number;
  onClaim: (r: Reward) => void;
}

export function RewardBox({ open, onOpenChange, pending, onClaim }: Props) {
  const [opened, setOpened] = useState<Reward | null>(null);

  const openBox = () => {
    const r = REWARD_POOL[Math.floor(Math.random() * REWARD_POOL.length)];
    setOpened(r);
    onClaim(r);
    confetti({
      particleCount: 60,
      spread: 80,
      scalar: 0.9,
      origin: { y: 0.5 },
      colors: ["#f7b8c8", "#e1c4f5", "#fde6a3", "#bce6c9"],
    });
  };

  const close = () => {
    setOpened(null);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) setOpened(null);
        onOpenChange(o);
      }}
    >
      <DialogContent className="glass-card max-w-sm rounded-3xl border-white/60">
        <DialogHeader>
          <DialogTitle className="text-center font-display text-2xl">
            Mystery box 🎁
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.div
              key="closed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="py-4 text-center"
            >
              <motion.div
                animate={{ y: [0, -6, 0], rotate: [-3, 3, -3] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="text-7xl"
              >
                🎁
              </motion.div>
              <p className="mt-3 text-sm text-foreground/70">
                {pending > 0
                  ? `You have ${pending} unopened ${pending === 1 ? "box" : "boxes"}. Open one?`
                  : "No boxes yet. Complete a few tasks to earn one 🌸"}
              </p>
              <Button
                disabled={pending <= 0}
                onClick={openBox}
                className="mt-4 rounded-full px-6"
              >
                Open box
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 12 }}
              className="py-4 text-center"
            >
              <div className="text-7xl">{opened.emoji}</div>
              <div className="mt-3 font-display text-xl">{opened.title}</div>
              <p className="text-sm text-foreground/70">{opened.description}</p>
              <div className="mt-4 flex justify-center gap-2">
                {pending > 0 && (
                  <Button variant="secondary" className="rounded-full" onClick={() => setOpened(null)}>
                    Open another
                  </Button>
                )}
                <Button className="rounded-full" onClick={close}>
                  Lovely 💗
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
