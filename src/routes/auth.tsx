import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { SkyScene } from "@/components/bloom/SkyScene";
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
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">
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
