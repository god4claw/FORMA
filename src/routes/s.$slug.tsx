import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Shell } from "@/components/layout";
import { SpecimenCss } from "@/components/specimen-css";
import { SpecimenLive } from "@/components/specimens/live";
import { useFavorites } from "@/lib/favorites";
import { behaviorOf } from "@/lib/behaviors";
import { CATEGORIES, SPECIMEN_BY_SLUG, neighborsOf, padId, specimenPath } from "@/lib/specimens";
import { absoluteUrl } from "@/lib/site";

export const Route = createFileRoute("/s/$slug")({
  loader: ({ params }) => {
    const specimen = SPECIMEN_BY_SLUG.get(params.slug);
    if (!specimen) throw notFound();
    return specimen;
  },
  head: ({ params }) => {
    const specimen = SPECIMEN_BY_SLUG.get(params.slug);
    if (!specimen) return {};
    const path = specimenPath(specimen);
    const title = `${specimen.name} — ${padId(specimen.id)} · FORMA`;
    const description = `${specimen.nameRu}: ${specimen.note}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: absoluteUrl(path) },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: absoluteUrl(path) }],
    };
  },
  component: SpecimenPage,
  notFoundComponent: SpecimenMissing,
});

function SpecimenMissing() {
  return (
    <Shell>
      <section className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
        <p className="font-mono text-xs tracking-[0.22em] text-muted">404</p>
        <h1 className="mt-3 font-display text-4xl italic">Эталона нет</h1>
        <p className="mt-3 text-sm text-muted">В каталоге нет формы с таким адресом.</p>
        <Link
          to="/"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-fg px-4 text-sm font-medium text-bg"
        >
          <ArrowLeft size={16} />К каталогу
        </Link>
      </section>
    </Shell>
  );
}

function SpecimenPage() {
  const specimen = Route.useLoaderData();
  const canvasRef = useRef<HTMLDivElement>(null);
  const fav = useFavorites((s) => s.ids.includes(specimen.id));
  const toggle = useFavorites((s) => s.toggle);
  const category = CATEGORIES.find((c) => c.slug === specimen.category);
  const { prev, next } = neighborsOf(specimen.id);

  return (
    <Shell>
      <article className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
        <nav
          aria-label="Хлебные крошки"
          className="flex flex-wrap items-center gap-2 font-mono text-xs text-subtle"
        >
          <Link to="/" className="hover:text-fg">
            Каталог
          </Link>
          <span aria-hidden>/</span>
          <Link
            to="/collection/$slug"
            params={{ slug: specimen.category }}
            className="hover:text-fg"
          >
            {category?.label ?? specimen.category}
          </Link>
          <span aria-hidden>/</span>
          <span className="tabular-nums text-muted">{padId(specimen.id)}</span>
        </nav>

        <div
          ref={canvasRef}
          className={`sp-canvas sp-canvas-static mt-6 rounded-xl world-${specimen.world}`}
        >
          <SpecimenLive id={specimen.id} />
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <p className="font-mono text-xs tracking-[0.2em] text-subtle">
              {padId(specimen.id)} · {category?.labelEn}
            </p>
            <h1 className="mt-2 font-display text-[clamp(2.4rem,6vw,4rem)] italic leading-[0.98] tracking-tight">
              {specimen.name}
            </h1>
            <p className="mt-2 text-sm text-muted">{specimen.nameRu}</p>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-fg/90">{specimen.note}</p>

            <ul className="mt-4 flex flex-wrap gap-2">
              {specimen.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-full bg-surface-2 px-2.5 py-1 font-mono text-xs text-muted"
                >
                  {t}
                </li>
              ))}
            </ul>

            <SpecimenCss
              css={specimen.css}
              canvas={canvasRef}
              behavior={behaviorOf(specimen.id)}
            />

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex h-11 items-center gap-2 rounded-lg px-4 text-sm font-medium text-fg shadow-[inset_0_0_0_1px_var(--color-border)]"
                onClick={() => toggle(specimen.id)}
                aria-pressed={fav}
              >
                <Bookmark size={16} fill={fav ? "currentColor" : "none"} />
                {fav ? "В избранном" : "В избранное"}
              </button>
              <Link
                to="/collection/$slug"
                params={{ slug: specimen.category }}
                className="inline-flex h-11 items-center gap-2 rounded-lg px-4 text-sm font-medium text-muted hover:text-fg"
              >
                Вся полка
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <aside className="lg:border-l lg:border-border lg:pl-8">
            <h2 className="font-mono text-xs tracking-[0.2em] text-subtle">ПОЛКА</h2>
            <p className="mt-2 text-sm text-muted">
              {category?.label} — {category?.blurb}
            </p>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-muted">Мир</dt>
                <dd className="font-mono text-xs text-fg">{specimen.world}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-muted">Адрес</dt>
                <dd className="min-w-0 truncate font-mono text-xs text-fg">
                  {specimenPath(specimen)}
                </dd>
              </div>
            </dl>

            <nav aria-label="Соседние эталоны" className="mt-8 grid gap-2">
              {prev ? (
                <Link
                  to="/s/$slug"
                  params={{ slug: prev.slug }}
                  className="group flex items-center gap-3 rounded-lg bg-surface p-3 text-sm shadow-[0_0_0_1px_var(--color-border)] hover:bg-surface-2"
                >
                  <ChevronLeft size={16} className="shrink-0 text-subtle" />
                  <span className="min-w-0">
                    <span className="block truncate text-fg">{prev.name}</span>
                    <span className="block font-mono text-xs text-subtle">{padId(prev.id)}</span>
                  </span>
                </Link>
              ) : null}
              {next ? (
                <Link
                  to="/s/$slug"
                  params={{ slug: next.slug }}
                  className="group flex items-center justify-end gap-3 rounded-lg bg-surface p-3 text-right text-sm shadow-[0_0_0_1px_var(--color-border)] hover:bg-surface-2"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-fg">{next.name}</span>
                    <span className="block font-mono text-xs text-subtle">{padId(next.id)}</span>
                  </span>
                  <ChevronRight size={16} className="shrink-0 text-subtle" />
                </Link>
              ) : null}
            </nav>
          </aside>
        </div>
      </article>
    </Shell>
  );
}
