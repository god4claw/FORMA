import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/layout";
import { SpecimenGrid } from "@/components/specimen-grid";
import { categoryBySlug, padId, specimensInCategory, type CategorySlug } from "@/lib/specimens";
import { absoluteUrl } from "@/lib/site";

export const Route = createFileRoute("/collection/$slug")({
  component: CollectionPage,
  notFoundComponent: CollectionMissing,
  head: ({ params }) => {
    const category = categoryBySlug(params.slug);
    if (!category) return {};
    const path = `/collection/${category.slug}`;
    const title = `${category.label} — ${padId(category.range[0])}–${padId(category.range[1])} · FORMA`;
    const description = `${category.labelEn}: ${category.blurb}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: absoluteUrl(path) },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: absoluteUrl(path) }],
    };
  },
});

function CollectionMissing() {
  return (
    <Shell>
      <section className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-4xl italic">Раздел не найден</h1>
        <p className="mt-3 text-sm text-muted">В каталоге нет такой полки.</p>
        <Link
          to="/"
          className="mt-6 inline-flex h-11 items-center rounded-lg bg-fg px-4 text-sm font-medium text-bg"
        >
          На главную
        </Link>
      </section>
    </Shell>
  );
}

function CollectionPage() {
  const { slug } = Route.useParams();
  const [query, setQuery] = useState("");
  const cat = categoryBySlug(slug);
  if (!cat) throw notFound();
  const items = specimensInCategory(cat.slug as CategorySlug);

  return (
    <Shell>
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
        <p className="font-mono text-xs tracking-[0.22em] text-muted">
          {String(cat.range[0]).padStart(3, "0")}—{String(cat.range[1]).padStart(3, "0")} ·{" "}
          {cat.labelEn}
        </p>
        <h1 className="mt-3 font-display text-[clamp(2.4rem,7vw,4.5rem)] italic leading-[0.95] tracking-tight">
          {cat.label}
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">{cat.blurb}</p>
        <div className="mt-10">
          <SpecimenGrid items={items} query={query} onQuery={setQuery} />
        </div>
      </section>
    </Shell>
  );
}
