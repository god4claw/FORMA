import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Shuffle } from "lucide-react";
import { Shell } from "@/components/layout";
import { SpecimenGrid } from "@/components/specimen-grid";
import { CATEGORIES, SPECIMENS } from "@/lib/specimens";
import { useFavorites } from "@/lib/favorites";
import { cn } from "@/lib/cn";

type Filter = "all" | "fav" | (typeof CATEGORIES)[number]["slug"];

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [shuffleSignal, setShuffleSignal] = useState(0);
  const favIds = useFavorites((s) => s.ids);

  const items = useMemo(() => {
    if (filter === "fav") return SPECIMENS.filter((s) => favIds.includes(s.id));
    if (filter === "all") return SPECIMENS;
    return SPECIMENS.filter((s) => s.category === filter);
  }, [filter, favIds]);

  return (
    <Shell>
      <section className="mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 sm:pt-16">
        <p className="font-mono text-xs tracking-[0.22em] text-muted">INDEX · 001—100</p>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h1 className="max-w-xl font-display text-[clamp(2.75rem,8vw,5.5rem)] italic leading-[0.95] tracking-tight text-fg">
            Сто эталонов формы
          </h1>
          <p className="max-w-sm text-sm leading-relaxed text-muted lg:pb-2">
            Живой каталог кнопок, боксов, тайтлов и вложений. Откройте карточку, скопируйте CSS,
            соберите настроение в студии.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            to="/studio"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-fg px-4 text-sm font-medium text-bg active:scale-[0.96]"
          >
            Студия
            <ArrowRight size={16} />
          </Link>
          <button
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded-lg px-4 text-sm font-medium text-fg shadow-[inset_0_0_0_1px_var(--color-border)]"
            onClick={() => {
              setFilter("all");
              setQuery("");
              setShuffleSignal((n) => n + 1);
            }}
          >
            <Shuffle size={16} />
            Случайный
          </button>
          <a
            href="#catalog"
            className="inline-flex h-11 items-center rounded-lg px-4 text-sm font-medium text-muted hover:text-fg"
          >
            К каталогу
          </a>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to="/collection/$slug"
              params={{ slug: c.slug }}
              className="rounded-xl bg-surface p-4 shadow-[0_0_0_1px_var(--color-border)] transition-[background-color] duration-150 hover:bg-surface-2"
            >
              <div className="font-mono text-xs tabular-nums text-subtle">
                {String(c.range[0]).padStart(3, "0")}–{String(c.range[1]).padStart(3, "0")}
              </div>
              <div className="mt-2 text-sm font-medium">{c.label}</div>
              <div className="text-xs text-muted">{c.labelEn}</div>
            </Link>
          ))}
        </div>
      </section>

      <section id="catalog" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mb-6 flex flex-wrap gap-2">
          {(
            [
              ["all", "Все"],
              ["fav", "Избранное"],
              ...CATEGORIES.map((c) => [c.slug, c.label] as const),
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key as Filter)}
              className={cn(
                "h-10 rounded-full px-3.5 text-sm font-medium",
                filter === key ? "bg-fg text-bg" : "bg-surface text-muted hover:text-fg",
              )}
            >
              {label}
              {key === "fav" && favIds.length > 0 ? (
                <span className="ml-1.5 font-mono text-xs tabular-nums opacity-70">{favIds.length}</span>
              ) : null}
            </button>
          ))}
        </div>
        <SpecimenGrid
          items={items}
          query={query}
          onQuery={setQuery}
          shuffleSignal={shuffleSignal}
          emptyHint={filter === "fav" ? "Пока пусто — отметьте эталоны закладкой." : "Ничего не нашлось."}
        />
      </section>
    </Shell>
  );
}
