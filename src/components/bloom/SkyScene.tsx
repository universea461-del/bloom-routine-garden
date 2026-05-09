import { motion } from "framer-motion";

function Cloud({ top, delay, scale = 1, duration = 60 }: { top: string; delay: number; scale?: number; duration?: number }) {
  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{ top, left: "-15vw" }}
      initial={{ x: 0 }}
      animate={{ x: "125vw" }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
    >
      <div
        className="rounded-full bg-white/85 blur-[1px]"
        style={{
          width: 180 * scale,
          height: 60 * scale,
          boxShadow: `40px 10px 0 -8px rgba(255,255,255,.85), -30px 6px 0 -4px rgba(255,255,255,.85), 0 18px 40px -10px oklch(0.6 0.06 240 / .25)`,
        }}
      />
    </motion.div>
  );
}

function Sun() {
  return (
    <motion.div
      className="pointer-events-none absolute right-[8%] top-[6%]"
      animate={{ scale: [1, 1.04, 1] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="relative h-28 w-28 rounded-full"
        style={{
          background: "radial-gradient(circle, oklch(0.95 0.12 90) 0%, oklch(0.9 0.13 75) 60%, transparent 75%)",
          filter: "blur(0.5px)",
        }}
      />
    </motion.div>
  );
}

export function SkyScene() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <Sun />
      <Cloud top="8%" delay={0} duration={70} scale={1} />
      <Cloud top="18%" delay={-25} duration={90} scale={0.7} />
      <Cloud top="28%" delay={-50} duration={110} scale={1.2} />
      <Cloud top="14%" delay={-80} duration={100} scale={0.9} />
    </div>
  );
}
