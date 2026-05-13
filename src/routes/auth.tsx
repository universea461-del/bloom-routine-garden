import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { SkyScene } from "@/components/bloom/SkyScene";
import { DiscordCommunity } from "@/components/bloom/DiscordCommunity";
import { toast } from "sonner";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Welcome to your garden — Bloom Routine" },
      { name: "description", content: "Sign in to grow your cozy task garden." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { session, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  if (!loading && session) return <Navigate to="/" />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } =
      mode === "login"
        ? await signIn(email, password)
        : await signUp(email, password, name);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (mode === "signup") {
      toast.success("Your garden is ready 🌸");
    } else {
      toast.success("Welcome back 🌿");
    }
    navigate({ to: "/" });
  };

  const onGoogle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error(result.error.message);
      return;
    }
    if (result.redirected) return;
    toast.success("Welcome 🌿");
    navigate({ to: "/" });
  };

  return (
    <div className="scene-gradient relative min-h-screen w-full overflow-hidden">
      <SkyScene />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
          className="glass-card w-full max-w-md rounded-3xl px-7 py-8"
        >
          <div className="text-center">
            <div className="text-4xl">🌸</div>
            <h1 className="mt-2 font-display text-2xl">
              {mode === "login" ? "Welcome back to your garden" : "Plant your garden"}
            </h1>
            <p className="mt-1 text-sm text-foreground/70">
              {mode === "login"
                ? "A cozy meadow is waiting for you."
                : "A few soft details and your seeds are ready."}
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Display name</Label>
                <Input
                  id="name"
                  placeholder="Petal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-2xl bg-white/80"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="you@bloom.garden"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-2xl bg-white/80"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-2xl bg-white/80"
              />
            </div>

            <Button
              type="submit"
              disabled={busy}
              className="w-full rounded-full py-6 text-base font-semibold text-white shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.78 0.14 350), oklch(0.78 0.13 305))",
              }}
            >
              {busy ? "Blooming…" : mode === "login" ? "Enter the garden" : "Plant my garden"}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-foreground/50">
            <div className="h-px flex-1 bg-foreground/10" />
            <span>or</span>
            <div className="h-px flex-1 bg-foreground/10" />
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={onGoogle}
            className="w-full gap-3 rounded-full bg-white/90 py-6 text-base font-medium hover:bg-white"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.2c-2 1.5-4.6 2.4-7.3 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.6 39.6 16.2 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.2 5.2C41.1 35.5 44 30.2 44 24c0-1.3-.1-2.4-.4-3.5z"/>
            </svg>
            Continue with Google
          </Button>

          <div className="mt-5 text-center text-sm text-foreground/70">
            {mode === "login" ? "New here?" : "Already have a garden?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="font-semibold text-pink-500 hover:underline"
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
