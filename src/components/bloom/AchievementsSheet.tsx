import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ACHIEVEMENTS } from "@/lib/bloom-types";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  unlocked: string[];
}

export function AchievementsSheet({ open, onOpenChange, unlocked }: Props) {
  const set = new Set(unlocked);
  const got = ACHIEVEMENTS.filter((a) => set.has(a.id)).length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="glass-card w-full border-white/60 p-6 sm:max-w-md">
        <SheetHeader className="px-0">
          <SheetTitle className="font-display text-2xl">Achievements 🏆</SheetTitle>
        </SheetHeader>
        <p className="mt-1 text-sm text-foreground/70">
          {got} of {ACHIEVEMENTS.length} unlocked · +5 coins each
        </p>

        <div className="mt-4 grid grid-cols-1 gap-2.5 overflow-y-auto pr-1 sm:grid-cols-2">
          {ACHIEVEMENTS.map((a, i) => {
            const isUnlocked = set.has(a.id);
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl p-4 soft-shadow"
                style={{
                  background: isUnlocked
                    ? "linear-gradient(135deg, rgba(247,184,200,.55), rgba(225,196,245,.55))"
                    : "rgba(255,255,255,.55)",
                  filter: isUnlocked ? undefined : "grayscale(0.6)",
                  opacity: isUnlocked ? 1 : 0.7,
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{isUnlocked ? a.emoji : "🔒"}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 font-display text-base">
                      {a.title}
                      {!isUnlocked && <Lock className="h-3 w-3 text-foreground/40" />}
                    </div>
                    <p className="text-xs text-foreground/70">{a.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
