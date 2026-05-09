export type CharacterKey = "bunny" | "cat" | "flower" | "bear" | "bird" | "cloud";

export interface CharacterMeta {
  key: CharacterKey;
  emoji: string;
  label: string;
  hint: string;
  tint: string; // css var name
}

export const CHARACTERS: Record<CharacterKey, CharacterMeta> = {
  bunny:  { key: "bunny",  emoji: "🐰", label: "Bunny",  hint: "Quick task",   tint: "var(--bloom-pink)" },
  cat:    { key: "cat",    emoji: "🐱", label: "Cat",    hint: "Medium task",  tint: "var(--bloom-peach)" },
  flower: { key: "flower", emoji: "🌷", label: "Flower", hint: "Daily habit",  tint: "var(--bloom-lavender)" },
  bear:   { key: "bear",   emoji: "🐻", label: "Bear",   hint: "Deep focus",   tint: "var(--bloom-butter)" },
  bird:   { key: "bird",   emoji: "🐦", label: "Bird",   hint: "Social task",  tint: "var(--bloom-mint)" },
  cloud:  { key: "cloud",  emoji: "☁️", label: "Cloud",  hint: "Rest & mind",  tint: "var(--sky-deep)" },
};

export const CHARACTER_LIST = Object.values(CHARACTERS);

export interface Task {
  id: string;
  title: string;
  note?: string;
  character: CharacterKey;
  minutes?: number;
  createdAt: number;
  completedAt?: number;
  // Position in the scene (percent)
  x: number;
  y: number;
}

export interface JournalEntry {
  date: string; // YYYY-MM-DD
  mood: string;
  completed: number;
  total: number;
  message: string;
}

export interface BloomState {
  tasks: Task[];
  journal: JournalEntry[];
  blooms: number; // total lifetime completions = garden growth
}

export const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export function dailyMessage(completed: number, mood: string) {
  if (completed === 0) return `A gentle pause day ${mood} — tomorrow is soft soil.`;
  const phrases = [
    `Today felt like a quiet breeze with ${completed} small bloom${completed === 1 ? "" : "s"} 🌸`,
    `${completed} tiny petal${completed === 1 ? "" : "s"} unfolded today ${mood}`,
    `A warm afternoon, ${completed} thing${completed === 1 ? "" : "s"} done with care 🌼`,
    `Soft progress, ${completed} bloom${completed === 1 ? "" : "s"} added to your meadow ${mood}`,
  ];
  return phrases[completed % phrases.length];
}
