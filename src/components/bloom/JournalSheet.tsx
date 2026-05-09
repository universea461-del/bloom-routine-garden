import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { JournalEntry } from "@/lib/bloom-types";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  entries: JournalEntry[];
}

export function JournalSheet({ open, onOpenChange, entries }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="glass-card w-full sm:max-w-md border-white/60 p-6">
        <SheetHeader className="px-0">
          <SheetTitle className="font-display text-2xl">Your journal 📖</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-3 overflow-y-auto pr-1">
          {entries.length === 0 && (
            <p className="rounded-2xl bg-white/70 p-4 text-sm text-foreground/70">
              No pages yet. Finish a day and tap "Save today" to keep it here.
            </p>
          )}
          {entries.map((e) => (
            <div
              key={e.date}
              className="rounded-2xl bg-white/80 p-4 soft-shadow"
              style={{
                background:
                  "linear-gradient(135deg, rgba(247,184,200,.35), rgba(225,196,245,.35))",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-lg">{e.date}</span>
                <span className="text-2xl">{e.mood}</span>
              </div>
              <p className="mt-2 text-sm text-foreground/80">{e.message}</p>
              <p className="mt-2 text-xs text-foreground/60">
                {e.completed} / {e.total} bloomed
              </p>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
