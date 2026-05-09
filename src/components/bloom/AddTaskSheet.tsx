import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CHARACTER_LIST, type CharacterKey } from "@/lib/bloom-types";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onAdd: (data: { title: string; note?: string; character: CharacterKey; minutes?: number }) => void;
}

export function AddTaskSheet({ open, onOpenChange, onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [character, setCharacter] = useState<CharacterKey>("bunny");
  const [minutes, setMinutes] = useState<string>("");

  const submit = () => {
    if (!title.trim()) return;
    onAdd({
      title: title.trim(),
      note: note.trim() || undefined,
      character,
      minutes: minutes ? Math.max(1, Math.min(120, Number(minutes))) : undefined,
    });
    setTitle("");
    setNote("");
    setMinutes("");
    setCharacter("bunny");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="glass-card max-h-[92vh] rounded-t-3xl border-white/60 px-6 pb-8 pt-6">
        <SheetHeader className="px-0">
          <SheetTitle className="font-display text-2xl">Plant a new task 🌱</SheetTitle>
        </SheetHeader>

        <div className="mx-auto mt-4 max-w-md space-y-5">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              What blooms today?
            </label>
            <Input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Water the plants"
              className="rounded-2xl bg-white/80 py-6"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Pick a character
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CHARACTER_LIST.map((c) => {
                const active = c.key === character;
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setCharacter(c.key)}
                    className="relative rounded-2xl px-3 py-3 text-center transition-all"
                    style={{
                      background: active ? c.tint : "rgba(255,255,255,0.7)",
                      boxShadow: active
                        ? "0 10px 24px -8px rgba(80,40,90,.25)"
                        : "0 2px 6px rgba(0,0,0,.04)",
                      transform: active ? "translateY(-2px)" : undefined,
                    }}
                  >
                    <div className="text-3xl">{c.emoji}</div>
                    <div className="mt-1 text-xs font-semibold">{c.label}</div>
                    <div className="text-[10px] text-foreground/60">{c.hint}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Timer (min)
              </label>
              <Input
                type="number"
                min={1}
                max={120}
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                placeholder="optional"
                className="rounded-2xl bg-white/80"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              A small note
            </label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="optional whisper to yourself"
              className="rounded-2xl bg-white/80"
              rows={3}
            />
          </div>

          <Button onClick={submit} className="w-full rounded-full py-6 text-base shadow-md">
            Plant it 🌷
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
