export type CharacterKey = "bunny" | "cat" | "flower" | "bear" | "bird" | "cloud" | "tree" | "goldenTree";

export interface CharacterMeta {
  key: CharacterKey;
  emoji: string;
  label: string;
  hint: string;
  tint: string;
  xp: number;
  coins: number;
}

export const CHARACTERS: Record<CharacterKey, CharacterMeta> = {
  bunny:      { key: "bunny",      emoji: "🐰", label: "Bunny",  hint: "Quick task",   tint: "var(--bloom-pink)",     xp: 10, coins: 2 },
  flower:     { key: "flower",     emoji: "🌸", label: "Flower", hint: "Light task",   tint: "var(--bloom-lavender)", xp: 8,  coins: 2 },
  cat:        { key: "cat",        emoji: "🐱", label: "Cat",    hint: "Medium task",  tint: "var(--bloom-peach)",    xp: 18, coins: 4 },
  bird:       { key: "bird",       emoji: "🐦", label: "Bird",   hint: "Social task",  tint: "var(--bloom-mint)",     xp: 15, coins: 3 },
  bear:       { key: "bear",       emoji: "🐻", label: "Bear",   hint: "Deep focus",   tint: "var(--bloom-butter)",   xp: 22, coins: 5 },
  cloud:      { key: "cloud",      emoji: "☁️", label: "Cloud",  hint: "Rest & mind",  tint: "var(--sky-deep)",       xp: 12, coins: 3 },
  tree:       { key: "tree",       emoji: "🌳", label: "Tree",   hint: "Big task",     tint: "var(--meadow-deep)",    xp: 35, coins: 8 },
  goldenTree: { key: "goldenTree", emoji: "🌟", label: "Boss",   hint: "Boss task",    tint: "var(--bloom-butter)",   xp: 70, coins: 20 },
};

export const CHARACTER_LIST = Object.values(CHARACTERS);

export type Mood = "calm" | "energetic" | "tired" | "sad";

export const MOOD_META: Record<Mood, { emoji: string; label: string; tint: string }> = {
  calm:      { emoji: "🌿", label: "Calm",      tint: "var(--bloom-mint)" },
  energetic: { emoji: "🌞", label: "Energetic", tint: "var(--bloom-butter)" },
  tired:     { emoji: "☁️", label: "Tired",     tint: "var(--sky-deep)" },
  sad:       { emoji: "🌧️", label: "Sad",      tint: "var(--bloom-lavender)" },
};

export interface Task {
  id: string;
  title: string;
  note?: string;
  character: CharacterKey;
  minutes?: number;
  createdAt: number;
  completedAt?: number;
  x: number;
  y: number;
}

export interface JournalEntry {
  date: string;
  mood: string;
  completed: number;
  total: number;
  message: string;
}

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  emoji: string;
  check: (s: BloomState) => boolean;
}

export interface BloomState {
  tasks: Task[];
  journal: JournalEntry[];
  blooms: number;
  xp: number;
  coins: number;
  streak: number;
  lastCompletedDate?: string; // YYYY-MM-DD of last completion
  moodByDate: Record<string, Mood>;
  achievements: string[]; // unlocked IDs
  rewardProgress: number; // tasks completed since last reward box
  pendingRewards: number; // unopened reward boxes
}

export const REWARD_THRESHOLD = 3; // tasks per mystery box

export const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const yesterdayKey = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// Level grows on a soft curve: level n requires n*100 cumulative XP-ish
export function levelFromXp(xp: number) {
  const level = Math.floor((-1 + Math.sqrt(1 + xp / 25)) / 2) + 1;
  const prev = 25 * level * (level - 1) * 2;
  const next = 25 * level * (level + 1) * 2;
  return { level, prev, next, into: xp - prev, span: next - prev };
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: "first-bloom",   title: "First Bloom",      description: "Complete your very first task", emoji: "🌱", check: (s) => s.blooms >= 1 },
  { id: "five-blooms",   title: "Little Garden",    description: "Complete 5 tasks",              emoji: "🌷", check: (s) => s.blooms >= 5 },
  { id: "twenty-blooms", title: "Wild Meadow",      description: "Complete 20 tasks",             emoji: "🌼", check: (s) => s.blooms >= 20 },
  { id: "streak-3",      title: "Soft Rhythm",      description: "3 day streak",                  emoji: "🍃", check: (s) => s.streak >= 3 },
  { id: "streak-7",      title: "7 Day Garden",     description: "7 day streak",                  emoji: "🌸", check: (s) => s.streak >= 7 },
  { id: "tree-guardian", title: "Tree Guardian",    description: "Plant & complete a Tree task",  emoji: "🌳", check: (s) => s.tasks.some((t) => t.character === "tree" && !!t.completedAt) },
  { id: "boss-slayer",   title: "Golden Hour",      description: "Complete a Boss task",          emoji: "👑", check: (s) => s.tasks.some((t) => t.character === "goldenTree" && !!t.completedAt) },
  { id: "calm-master",   title: "Calm Master",      description: "Pick the Calm mood 3 days",     emoji: "🌿", check: (s) => Object.values(s.moodByDate).filter((m) => m === "calm").length >= 3 },
  { id: "rich-soil",     title: "Rich Soil",        description: "Earn 100 coins",                emoji: "💰", check: (s) => s.coins >= 100 },
];

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

export const REWARD_POOL = [
  { kind: "coins",  emoji: "💰", title: "Pouch of coins",   description: "+15 coins for the garden shop", value: 15 },
  { kind: "coins",  emoji: "💎", title: "Crystal shard",    description: "+30 coins, sparkly!",            value: 30 },
  { kind: "flower", emoji: "🌺", title: "Rare hibiscus",    description: "Added to your meadow",           value: 1 },
  { kind: "flower", emoji: "🌻", title: "Sunflower seed",   description: "A bright bloom appears",         value: 1 },
  { kind: "flower", emoji: "🪻", title: "Dreamy iris",      description: "A rare violet petal",            value: 1 },
  { kind: "aura",   emoji: "✨", title: "Glowing aura",     description: "Your garden shimmers softly",    value: 0 },
] as const;

export type Reward = typeof REWARD_POOL[number];
