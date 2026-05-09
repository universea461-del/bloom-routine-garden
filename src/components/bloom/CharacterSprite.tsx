import { motion } from "framer-motion";
import { CHARACTERS, type Task } from "@/lib/bloom-types";

interface Props {
  task: Task;
  onClick: () => void;
}

export function CharacterSprite({ task, onClick }: Props) {
  const meta = CHARACTERS[task.character];
  const done = !!task.completedAt;

  return (
    <motion.button
      onClick={onClick}
      className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
      style={{ left: `${task.x}%`, top: `${task.y}%` }}
      initial={{ opacity: 0, y: 20, scale: 0.6 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.4, y: -30 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 220, damping: 16 }}
    >
      {/* halo */}
      <div
        className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl transition-opacity"
        style={{
          background: meta.tint,
          opacity: done ? 0.65 : 0.35,
        }}
      />
      <motion.div
        animate={done ? { y: [0, -10, 0], rotate: [0, -8, 8, 0] } : { y: [0, -4, 0] }}
        transition={
          done
            ? { duration: 1.2, repeat: Infinity, repeatDelay: 1 }
            : { duration: 3 + (task.id.charCodeAt(0) % 3), repeat: Infinity, ease: "easeInOut" }
        }
        className="relative grid place-items-center text-5xl drop-shadow-[0_6px_8px_rgba(80,40,90,0.18)]"
        style={{ filter: done ? "saturate(1.2)" : undefined }}
      >
        <span aria-hidden>{meta.emoji}</span>
        {done && (
          <span className="absolute -right-2 -top-2 text-xl anim-shimmer" aria-hidden>✨</span>
        )}
      </motion.div>
      {/* name tag */}
      <div className="mt-1 flex justify-center">
        <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-[11px] font-semibold text-foreground/80 shadow-sm backdrop-blur whitespace-nowrap max-w-[140px] truncate">
          {task.title}
        </span>
      </div>
    </motion.button>
  );
}
