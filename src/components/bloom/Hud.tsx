import { motion } from "framer-motion";
import { Flame, Coins, Trophy, Gift, LogOut } from "lucide-react";
import { levelFromXp, MOOD_META, type BloomState, type Mood } from "@/lib/bloom-types";
import { useAuth } from "@/hooks/use-auth";

interface Props {
  state: BloomState;
  todayMood?: Mood;
  onOpenAchievements: () => void;
  onOpenRewards: () => void;
}

export function Hud({ state, todayMood, onOpenAchievements, onOpenRewards }: Props) {
  const lvl = levelFromXp(state.xp);
  const pct = Math.max(4, Math.min(100, (lvl.into / Math.max(1, lvl.span)) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card mt-3 flex flex-wrap items-center gap-3 rounded-full px-4 py-2"
    >
      {/* Level + XP */}
      <div className="flex items-center gap-2">
        <div
          className="grid h-9 w-9 place-items-center rounded-full text-sm font-bold text-white"
          style={{ background: "linear-gradient(135deg, oklch(0.78 0.14 350), oklch(0.78 0.13 305))" }}
        >
          {lvl.level}
        </div>
        <div className="w-24">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-foreground/60">Lv {lvl.level}</div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/70">
            <motion.div
              key={pct}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 18 }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, var(--bloom-pink), var(--bloom-lavender))" }}
            />
          </div>
        </div>
      </div>

      <Divider />

      {/* Streak */}
      <div className="flex items-center gap-1.5 text-sm font-semibold">
        <Flame className="h-4 w-4 text-orange-400" />
        <span>{state.streak}</span>
        <span className="text-[10px] uppercase tracking-widest text-foreground/60">streak</span>
      </div>

      <Divider />

      {/* Coins */}
      <div className="flex items-center gap-1.5 text-sm font-semibold">
        <Coins className="h-4 w-4 text-amber-500" />
        <span>{state.coins}</span>
      </div>

      <Divider />

      {/* Mood */}
      {todayMood && (
        <>
          <div
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs"
            style={{ background: MOOD_META[todayMood].tint }}
          >
            <span className="text-base leading-none">{MOOD_META[todayMood].emoji}</span>
            <span className="font-semibold">{MOOD_META[todayMood].label}</span>
          </div>
          <Divider />
        </>
      )}

      {/* Reward boxes */}
      <button
        onClick={onOpenRewards}
        className="relative grid h-8 w-8 place-items-center rounded-full bg-white/70 transition hover:bg-white"
        aria-label="Reward boxes"
      >
        <Gift className="h-4 w-4 text-pink-500" />
        {state.pendingRewards > 0 && (
          <motion.span
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
            className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-pink-500 text-[10px] font-bold text-white"
          >
            {state.pendingRewards}
          </motion.span>
        )}
      </button>

      {/* Achievements */}
      <button
        onClick={onOpenAchievements}
        className="grid h-8 w-8 place-items-center rounded-full bg-white/70 transition hover:bg-white"
        aria-label="Achievements"
      >
        <Trophy className="h-4 w-4 text-amber-500" />
      </button>
    </motion.div>
  );
}

function Divider() {
  return <span className="hidden h-5 w-px bg-foreground/10 sm:block" />;
}
