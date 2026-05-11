import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated")({
  component: AuthGuard,
});

function AuthGuard() {
  const { session, loading } = useAuth();
  if (loading) {
    return (
      <div className="scene-gradient grid min-h-screen place-items-center">
        <div className="font-display text-xl text-foreground/60">Opening the garden gate…</div>
      </div>
    );
  }
  if (!session) return <Navigate to="/auth" />;
  return <Outlet />;
}
