import * as Dialog from "@radix-ui/react-dialog";
import { Bookmark, Check, ChevronLeft, ChevronRight, Copy, X } from "lucide-react";
import { useEffect, useState } from "react";
import { CATEGORIES, padId, SPECIMEN_BY_ID } from "@/lib/specimens";
import { useFavorites } from "@/lib/favorites";
import { cn } from "@/lib/cn";
import { SpecimenLive } from "@/components/specimens/live";

export function SpecimenDetail({
  id,
  ids = [],
  onClose,
  onChange,
}: {
  id: number | null;
  ids?: number[];
  onClose: () => void;
  onChange: (id: number) => void;
}) {
  const specimen = id ? SPECIMEN_BY_ID.get(id) : undefined;
  const fav = useFavorites((s) => (id ? s.ids.includes(id) : false));
  const toggle = useFavorites((s) => s.toggle);
  const [copied, setCopied] = useState(false);
  const index = specimen ? ids.indexOf(specimen.id) : -1;
  const total = ids.length;
  const canNav = total > 1 && index >= 0;

  useEffect(() => {
    setCopied(false);
  }, [id]);

  useEffect(() => {
    if (!specimen || !canNav) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target;
      if (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onChange(ids[(index - 1 + total) % total]);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        onChange(ids[(index + 1) % total]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [specimen, canNav, ids, index, total, onChange]);

  return (
    <Dialog.Root open={Boolean(specimen)} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-scrim" />
        <Dialog.Content
          className="fixed inset-x-0 bottom-0 z-[51] max-h-[92dvh] overflow-y-auto rounded-t-xl bg-surface shadow-[0_0_0_1px_var(--color-border)] outline-none sm:inset-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[min(560px,calc(100vw-32px))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl"
          aria-describedby={undefined}
        >
          {specimen ? (
            <>
              <div className="flex items-center gap-2 px-4 py-3">
                <Dialog.Title className="min-w-0 flex-1 font-mono text-xs tracking-[0.18em] text-muted">
                  {padId(specimen.id)} · {CATEGORIES.find((c) => c.slug === specimen.category)?.label}
                </Dialog.Title>
                {canNav ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="grid size-11 place-items-center text-muted hover:text-fg"
                      aria-label="Предыдущий эталон"
                      onClick={() => onChange(ids[(index - 1 + total) % total])}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span className="min-w-12 text-center font-mono text-xs tabular-nums text-subtle">
                      {index + 1}/{total}
                    </span>
                    <button
                      type="button"
                      className="grid size-11 place-items-center text-muted hover:text-fg"
                      aria-label="Следующий эталон"
                      onClick={() => onChange(ids[(index + 1) % total])}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                ) : null}
                <Dialog.Close className="grid size-11 place-items-center text-muted hover:text-fg" aria-label="Закрыть">
                  <X size={18} />
                </Dialog.Close>
              </div>
              <div className={cn("sp-canvas min-h-[220px]", `world-${specimen.world}`)}>
                <SpecimenLive id={specimen.id} />
              </div>
              <div className="px-5 py-5">
                <h2 className="font-display text-3xl italic leading-tight tracking-tight">{specimen.name}</h2>
                <p className="mt-1 text-sm text-muted">{specimen.nameRu}</p>
                <p className="mt-4 text-sm leading-relaxed text-fg/90">{specimen.note}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {specimen.tags.map((t) => (
                    <span key={t} className="rounded-full bg-surface-2 px-2.5 py-1 font-mono text-xs text-muted">
                      {t}
                    </span>
                  ))}
                </div>
                <pre className="mt-5 overflow-x-auto rounded-lg bg-bg p-4 font-mono text-xs leading-relaxed text-accent shadow-[inset_0_0_0_1px_var(--color-border)]">
                  {specimen.css}
                </pre>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="inline-flex h-11 items-center gap-2 rounded-lg bg-fg px-4 text-sm font-medium text-bg active:scale-[0.96]"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(specimen.css);
                        setCopied(true);
                      } catch {
                        setCopied(false);
                      }
                    }}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? "Скопировано" : "Копировать CSS"}
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-11 items-center gap-2 rounded-lg px-4 text-sm font-medium text-fg shadow-[inset_0_0_0_1px_var(--color-border)]"
                    onClick={() => toggle(specimen.id)}
                  >
                    <Bookmark size={16} fill={fav ? "currentColor" : "none"} />
                    {fav ? "В избранном" : "В избранное"}
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
