import { useMemo } from "react";

interface Props {
  blooms: number;
}

// Procedurally place flowers/grass tufts based on blooms count.
export function Meadow({ blooms }: Props) {
  const flowers = useMemo(() => {
    const seeded = (i: number) => {
      const x = Math.sin(i * 9301 + 49297) * 233280;
      return x - Math.floor(x);
    };
    const count = Math.min(blooms, 80);
    return Array.from({ length: count }, (_, i) => {
      const colors = ["#f7b8c8", "#e1c4f5", "#fde6a3", "#bce6c9", "#f9c8a4"];
      return {
        left: seeded(i + 1) * 96 + 2,
        bottom: 2 + seeded(i + 7) * 22,
        color: colors[i % colors.length],
        size: 12 + seeded(i + 3) * 14,
        delay: seeded(i + 5) * 3,
      };
    });
  }, [blooms]);

  // Grass blades baseline
  const blades = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        left: (i / 40) * 100 + (Math.sin(i) * 1.5),
        h: 18 + (i % 5) * 4,
        delay: (i % 7) * 0.3,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[36%]">
      {/* layered hills */}
      <div className="absolute inset-x-0 bottom-0 h-full"
        style={{
          background:
            "radial-gradient(120% 60% at 50% 100%, oklch(0.78 0.13 145) 0%, oklch(0.86 0.1 145) 60%, transparent 100%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-[60%]"
        style={{
          background:
            "radial-gradient(80% 70% at 30% 100%, oklch(0.72 0.14 150) 0%, transparent 70%), radial-gradient(80% 70% at 80% 100%, oklch(0.74 0.13 140) 0%, transparent 70%)",
          opacity: 0.7,
        }}
      />

      {/* grass blades */}
      {blades.map((b, i) => (
        <div
          key={i}
          className="absolute bottom-0 anim-sway"
          style={{
            left: `${b.left}%`,
            width: 3,
            height: b.h,
            borderRadius: 999,
            background: "linear-gradient(to top, oklch(0.6 0.14 145), oklch(0.8 0.12 140))",
            animationDelay: `${b.delay}s`,
            transformOrigin: "bottom center",
          }}
        />
      ))}

      {/* bloomed flowers */}
      {flowers.map((f, i) => (
        <div
          key={i}
          className="absolute anim-float"
          style={{
            left: `${f.left}%`,
            bottom: `${f.bottom}%`,
            animationDelay: `${f.delay}s`,
          }}
        >
          <div className="relative" style={{ width: f.size, height: f.size }}>
            {[0, 72, 144, 216, 288].map((deg) => (
              <span
                key={deg}
                className="absolute left-1/2 top-1/2 rounded-full"
                style={{
                  width: f.size * 0.55,
                  height: f.size * 0.55,
                  background: f.color,
                  transform: `translate(-50%, -85%) rotate(${deg}deg) translateY(${f.size * 0.32}px)`,
                  boxShadow: "0 2px 6px rgba(0,0,0,.06)",
                }}
              />
            ))}
            <span
              className="absolute left-1/2 top-1/2 h-1/3 w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: "#fff7c4", boxShadow: "0 0 6px rgba(255,210,80,.5)" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
