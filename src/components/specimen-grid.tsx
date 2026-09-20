import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Shuffle } from "lucide-react";
import { searchSpecimens, type Specimen } from "@/lib/specimens";
import { SpecimenFrame } from "@/components/specimen-frame";
import { SpecimenDetail } from "@/components/specimen-detail";

export function SpecimenGrid({
  items,
  query,
  onQuery,
  emptyHint = "Ничего не нашлось.",
  shuffleSignal = 0,
}: {
  items: Specimen[];
  query?: string;
  onQuery?: (q: string) => void;
  emptyHint?: string;
  shuffleSignal?: number;
}) {
  const [openId, setOpenId] = useState<number | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const list = useMemo(
    () => (query !== undefined ? searchSpecimens(query, items) : items),
    [items, query],
  );
  const ids = useMemo(() => list.map((s) => s.id), [list]);

  useEffect(() => {
    if (!shuffleSignal) return;
    if (list.length === 0) return;
    const pick = list[Math.floor(Math.random() * list.length)];
    setOpenId(pick.id);
    // Randomize only when the hero signals — not when the filtered list changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffleSignal]);

  useEffect(() => {
    if (!onQuery) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/") return;
      const t = e.target;
      if (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement) return;
      e.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onQuery]);

  return (
    <div>
      {onQuery ? (
        <div className="mb-6 flex gap-2">
          <div className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-xl bg-surface px-4 shadow-[inset_0_0_0_1px_var(--color-border)]">
            <Search size={18} className="shrink-0 text-subtle" aria-hidden />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Поиск по имени, тегу, номеру"
              aria-label="Поиск по имени, тегу, номеру"
              className="h-full min-w-0 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-subtle"
            />
            <span className="hidden font-mono text-xs tabular-nums text-subtle sm:inline" aria-hidden>
              {String(list.length).padStart(3, "0")}
            </span>
          </div>
          <button
            type="button"
            className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-surface px-3.5 text-sm font-medium text-fg shadow-[inset_0_0_0_1px_var(--color-border)] hover:bg-surface-2"
            onClick={() => {
              if (list.length === 0) return;
              const pick = list[Math.floor(Math.random() * list.length)];
              setOpenId(pick.id);
            }}
            aria-label="Случайный эталон"
          >
            <Shuffle size={16} />
            <span className="hidden sm:inline">Случайный</span>
          </button>
        </div>
      ) : null}

      {list.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted">{emptyHint}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => (
            <SpecimenFrame key={s.id} specimen={s} onOpen={setOpenId} />
          ))}
        </div>
      )}

      <SpecimenDetail id={openId} ids={ids.length ? ids : openId ? [openId] : []} onClose={() => setOpenId(null)} onChange={setOpenId} />
    </div>
  );
}
