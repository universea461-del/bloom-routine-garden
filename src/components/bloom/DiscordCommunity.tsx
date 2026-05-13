import { motion } from "framer-motion";
import { ArrowRight, Users, Circle } from "lucide-react";
import { useEffect, useState } from "react";

const DISCORD_INVITE_CODE = "DUAXhuYXy";
const DISCORD_INVITE = `https://discord.gg/${DISCORD_INVITE_CODE}`;

type Stats = { members: number; online: number } | null;

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.317 4.369A19.79 19.79 0 0 0 16.558 3a13.91 13.91 0 0 0-.642 1.32 18.27 18.27 0 0 0-5.832 0A13.4 13.4 0 0 0 9.44 3a19.74 19.74 0 0 0-3.762 1.37C2.005 9.842 1.01 15.18 1.51 20.44a19.93 19.93 0 0 0 6.073 3.07c.49-.668.926-1.378 1.302-2.124-.717-.27-1.404-.6-2.054-.99.172-.126.34-.257.503-.392 3.95 1.825 8.225 1.825 12.13 0 .166.135.334.266.504.392-.652.39-1.34.722-2.057.99.376.747.812 1.456 1.302 2.124a19.85 19.85 0 0 0 6.075-3.07c.586-6.082-1-11.373-4.971-16.07ZM8.677 16.66c-1.183 0-2.157-1.085-2.157-2.42 0-1.336.953-2.422 2.157-2.422 1.205 0 2.179 1.097 2.158 2.422 0 1.335-.962 2.42-2.158 2.42Zm6.646 0c-1.184 0-2.158-1.085-2.158-2.42 0-1.336.953-2.422 2.158-2.422 1.204 0 2.178 1.097 2.157 2.422 0 1.335-.953 2.42-2.157 2.42Z" />
    </svg>
  );
}

export function DiscordCommunity() {
  return (
    <section className="relative w-full px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: "spring", stiffness: 70, damping: 18 }}
        className="relative mx-auto w-full max-w-2xl"
      >
        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute -inset-10 -z-10 rounded-[3rem] opacity-70 blur-3xl"
          style={{
            background:
              "radial-gradient(60% 60% at 30% 30%, oklch(0.82 0.14 285 / 0.55), transparent 70%), radial-gradient(50% 50% at 80% 70%, oklch(0.86 0.1 350 / 0.5), transparent 70%)",
          }}
        />

        {/* Floating particles */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[2rem]">
          {Array.from({ length: 9 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute block h-2 w-2 rounded-full bg-white/70 shadow-[0_0_12px_rgba(255,255,255,0.9)]"
              style={{
                left: `${(i * 11 + 7) % 95}%`,
                top: `${(i * 23 + 12) % 90}%`,
              }}
              animate={{
                y: [0, -14, 0],
                opacity: [0.25, 0.9, 0.25],
              }}
              transition={{
                duration: 4 + (i % 4),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4,
              }}
            />
          ))}
        </div>

        <div className="glass-card relative overflow-hidden rounded-[2rem] px-7 py-10 sm:px-10 sm:py-12">
          {/* Inner gradient wash */}
          <div
            className="pointer-events-none absolute inset-0 opacity-80"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.96 0.04 285 / 0.7), oklch(0.97 0.03 350 / 0.5) 60%, oklch(0.95 0.05 200 / 0.6))",
            }}
          />

          <div className="relative flex flex-col items-center text-center">
            {/* Logo with halo */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative grid h-20 w-20 place-items-center rounded-3xl"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.62 0.18 280), oklch(0.7 0.16 305))",
                boxShadow:
                  "0 20px 50px -15px oklch(0.55 0.22 285 / 0.65), inset 0 1px 0 rgba(255,255,255,0.4)",
              }}
            >
              <span
                className="anim-shimmer absolute -inset-3 -z-10 rounded-[2rem] blur-2xl"
                style={{ background: "oklch(0.7 0.18 285 / 0.65)" }}
              />
              <DiscordIcon className="h-10 w-10 text-white drop-shadow" />
            </motion.div>

            <h2 className="mt-6 font-display text-3xl tracking-tight sm:text-4xl">
              Join our cozy little community.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-foreground/75 sm:text-base">
              Meet creators, builders, and early supporters. Stay close to future
              updates and exclusive launches — softly, and at your own pace.
            </p>

            {/* Glowing button */}
            <motion.a
              href={DISCORD_INVITE}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="group relative mt-8 inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-base font-semibold text-white"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.6 0.2 285), oklch(0.66 0.18 305))",
                boxShadow:
                  "0 18px 45px -12px oklch(0.55 0.22 285 / 0.7), inset 0 1px 0 rgba(255,255,255,0.35)",
              }}
            >
              <span
                className="absolute -inset-1 -z-10 rounded-full opacity-70 blur-xl transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: "oklch(0.7 0.2 285 / 0.7)" }}
              />
              <DiscordIcon className="h-5 w-5" />
              Join Discord
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.a>

            <p className="mt-5 text-xs text-foreground/55">
              A warm space · always welcoming · no pressure
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
