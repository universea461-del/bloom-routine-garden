import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Mail, Sparkles, Save, Check, Camera, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useBloomStore } from "@/hooks/use-bloom-store";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CHARACTER_LIST, MOOD_META, levelFromXp, type CharacterKey, type Mood } from "@/lib/bloom-types";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "My Garden Profile — Bloom Routine" },
      { name: "description", content: "Your cozy profile, preferences, and garden stats." },
      { property: "og:title", content: "My Garden Profile" },
      { property: "og:description", content: "A soft little corner just for you." },
    ],
  }),
  component: ProfilePage,
});

interface Preferences {
  dailyGoal: number;
  reminders: boolean;
  favoriteCharacter: CharacterKey;
  favoriteMood: Mood;
}

const DEFAULTS: Preferences = {
  dailyGoal: 3,
  reminders: true,
  favoriteCharacter: "bunny",
  favoriteMood: "calm",
};

interface ProfileRow {
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
  provider: string | null;
  preferences: Partial<Preferences> | null;
}

function ProfilePage() {
  const { user } = useAuth();
  const { state } = useBloomStore();
  const lvl = levelFromXp(state.xp);

  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [prefs, setPrefs] = useState<Preferences>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleAvatarFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !user) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be under 5 MB.");
      return;
    }
    setUploadError(null);
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (upErr) {
      setUploadError(upErr.message);
      setUploading(false);
      return;
    }
    const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = `${pub.publicUrl}?v=${Date.now()}`;
    await supabase.from("profiles").update({ avatar_url: url }).eq("id", user.id);
    setProfile((p) => (p ? { ...p, avatar_url: url } : { display_name: null, email: null, avatar_url: url, provider: null, preferences: null }));
    setUploading(false);
  }

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name, email, avatar_url, provider, preferences")
        .eq("id", user.id)
        .maybeSingle();
      if (cancelled) return;
      const row = (data as ProfileRow | null) ?? null;
      setProfile(row);
      setDisplayName(row?.display_name ?? "");
      setPrefs({ ...DEFAULTS, ...(row?.preferences ?? {}) });
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user]);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    await supabase
      .from("profiles")
      .update({
        display_name: displayName.trim() || null,
        preferences: prefs as never,
      })
      .eq("id", user.id);
    setSaving(false);
    setSavedAt(Date.now());
    setTimeout(() => setSavedAt(null), 1800);
  }

  const initial = (displayName || profile?.email || "B")[0]?.toUpperCase() ?? "B";

  return (
    <div className="scene-gradient min-h-screen pb-20">
      <div className="mx-auto max-w-xl px-5 pt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-sm font-semibold text-foreground/70 shadow-sm transition hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to garden
        </Link>

        {/* Avatar card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card mt-5 rounded-3xl p-6 text-center"
        >
          <div className="relative mx-auto h-24 w-24">
            <motion.div
              animate={{ rotate: [0, 6, -6, 0] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="absolute -inset-2 rounded-full opacity-70 blur-xl"
              style={{ background: "linear-gradient(135deg, var(--bloom-pink), var(--bloom-lavender))" }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="group relative block h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
              aria-label="Change avatar"
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={displayName || "avatar"}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className="grid h-full w-full place-items-center text-3xl font-bold text-white"
                  style={{ background: "linear-gradient(135deg, oklch(0.78 0.14 350), oklch(0.78 0.13 305))" }}
                >
                  {initial}
                </div>
              )}
              <div className="absolute inset-0 grid place-items-center bg-black/40 text-white opacity-0 transition group-hover:opacity-100">
                {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
              </div>
              {uploading && (
                <div className="absolute inset-0 grid place-items-center bg-black/40 text-white">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarFile}
            />
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-foreground/70 transition hover:bg-white disabled:opacity-50"
          >
            <Camera className="h-3.5 w-3.5" />
            {uploading ? "Uploading…" : profile?.avatar_url ? "Change photo" : "Upload photo"}
          </button>
          {uploadError && (
            <div className="mt-2 text-xs text-red-500">{uploadError}</div>
          )}

          <h1 className="font-display mt-4 text-2xl font-bold text-foreground">
            {displayName || "Little Gardener"}
          </h1>
          {profile?.email && (
            <div className="mt-1 inline-flex items-center gap-1.5 text-sm text-foreground/60">
              <Mail className="h-3.5 w-3.5" />
              {profile.email}
            </div>
          )}
          {profile?.provider && (
            <div className="mt-2 inline-block rounded-full bg-white/70 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-foreground/60">
              via {profile.provider}
            </div>
          )}

          {/* Stats */}
          <div className="mt-5 grid grid-cols-3 gap-2">
            <Stat label="Level" value={lvl.level} />
            <Stat label="Streak" value={`${state.streak}🔥`} />
            <Stat label="Blooms" value={state.blooms} />
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="glass-card mt-5 rounded-3xl p-6"
        >
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-pink-500" />
            <h2 className="font-display text-lg font-bold">Your preferences</h2>
          </div>

          {loading ? (
            <div className="py-8 text-center text-sm text-foreground/50">Loading your cozy settings…</div>
          ) : (
            <div className="space-y-5">
              <div>
                <Label htmlFor="name" className="text-xs uppercase tracking-widest text-foreground/60">
                  Display name
                </Label>
                <Input
                  id="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="What should we call you?"
                  className="mt-1.5 rounded-2xl border-white/60 bg-white/70"
                />
              </div>

              <div>
                <Label htmlFor="goal" className="text-xs uppercase tracking-widest text-foreground/60">
                  Daily bloom goal
                </Label>
                <div className="mt-1.5 flex items-center gap-3">
                  <Input
                    id="goal"
                    type="number"
                    min={1}
                    max={20}
                    value={prefs.dailyGoal}
                    onChange={(e) =>
                      setPrefs((p) => ({ ...p, dailyGoal: Math.max(1, Math.min(20, Number(e.target.value) || 1)) }))
                    }
                    className="w-24 rounded-2xl border-white/60 bg-white/70"
                  />
                  <span className="text-sm text-foreground/60">tasks per day</span>
                </div>
              </div>

              <div>
                <Label className="text-xs uppercase tracking-widest text-foreground/60">
                  Favorite companion
                </Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {CHARACTER_LIST.map((c) => {
                    const active = prefs.favoriteCharacter === c.key;
                    return (
                      <button
                        key={c.key}
                        onClick={() => setPrefs((p) => ({ ...p, favoriteCharacter: c.key }))}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition ${
                          active ? "shadow-md ring-2 ring-pink-300" : "bg-white/60 hover:bg-white"
                        }`}
                        style={active ? { background: c.tint } : undefined}
                      >
                        <span className="text-base leading-none">{c.emoji}</span>
                        <span className="font-semibold">{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label className="text-xs uppercase tracking-widest text-foreground/60">
                  Favorite vibe
                </Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(Object.keys(MOOD_META) as Mood[]).map((m) => {
                    const meta = MOOD_META[m];
                    const active = prefs.favoriteMood === m;
                    return (
                      <button
                        key={m}
                        onClick={() => setPrefs((p) => ({ ...p, favoriteMood: m }))}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition ${
                          active ? "shadow-md ring-2 ring-pink-300" : "bg-white/60 hover:bg-white"
                        }`}
                        style={active ? { background: meta.tint } : undefined}
                      >
                        <span className="text-base leading-none">{meta.emoji}</span>
                        <span className="font-semibold">{meta.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-white/60 px-4 py-3">
                <div>
                  <div className="text-sm font-semibold">Gentle reminders</div>
                  <div className="text-xs text-foreground/60">Soft nudges to come tend your garden</div>
                </div>
                <Switch
                  checked={prefs.reminders}
                  onCheckedChange={(v) => setPrefs((p) => ({ ...p, reminders: v }))}
                />
              </div>

              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full rounded-full py-6 text-base font-semibold shadow-lg"
                style={{ background: "linear-gradient(135deg, oklch(0.78 0.14 350), oklch(0.78 0.13 305))" }}
              >
                {savedAt ? (
                  <><Check className="mr-2 h-4 w-4" /> Saved</>
                ) : (
                  <><Save className="mr-2 h-4 w-4" /> {saving ? "Saving…" : "Save preferences"}</>
                )}
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl bg-white/60 px-3 py-2">
      <div className="font-display text-xl font-bold">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-foreground/60">{label}</div>
    </div>
  );
}
