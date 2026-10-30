import { Link } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { CATEGORIES, padId, type Specimen } from "@/lib/specimens";
import { useFavorites } from "@/lib/favorites";
import { cn } from "@/lib/cn";
import { SpecimenLive } from "@/components/specimens/live";

/**
 * A card in the grid. Clicking the canvas opens the quick view; the title is a
 * real link to the specimen's page, so the same thing is reachable with a
 * keyboard and crawlable by search engines.
 */
export function SpecimenFrame({
  specimen,
  onOpen,
}: {
  specimen: Specimen;
  onOpen: (id: number) => void;
}) {
  const fav = useFavorites((s) => s.ids.includes(specimen.id));
  const toggle = useFavorites((s) => s.toggle);
  const cat = CATEGORIES.find((c) => c.slug === specimen.category);

  return (
    <article className="flex flex-col overflow-hidden rounded-xl bg-surface shadow-[0_0_0_1px_var(--color-border)]">
      <div
        className={cn("sp-canvas w-full rounded-none", `world-${specimen.world}`)}
        onClick={(e) => {
          const el = e.target as HTMLElement;
          if (el.closest("button, input, textarea, a, label")) return;
          onOpen(specimen.id);
        }}
      >
        <SpecimenLive id={specimen.id} />
      </div>
      <div className="flex items-start gap-3 px-3.5 py-3">
        <h3 className="min-w-0 flex-1 text-left">
          <Link to="/s/$slug" params={{ slug: specimen.slug }} className="group block">
            <span className="flex items-baseline gap-2">
              <span className="font-mono text-[11px] tabular-nums tracking-wider text-subtle">
                {padId(specimen.id)}
              </span>
              <span className="truncate text-sm font-medium leading-tight text-fg group-hover:underline group-hover:decoration-border group-hover:underline-offset-4">
                {specimen.name}
              </span>
            </span>
            <span className="mt-0.5 block truncate text-xs font-normal text-muted">
              {specimen.nameRu}
              <span className="text-subtle"> · {cat?.label}</span>
            </span>
          </Link>
        </h3>
        <button
          type="button"
          onClick={() => toggle(specimen.id)}
          className={cn(
            "grid size-11 shrink-0 place-items-center -mr-2 -mt-1 text-subtle",
            fav && "text-fg",
          )}
          aria-pressed={fav}
          aria-label={fav ? "Убрать из избранного" : "В избранное"}
        >
          <Bookmark size={16} fill={fav ? "currentColor" : "none"} />
        </button>
      </div>
    </article>
  );
}
