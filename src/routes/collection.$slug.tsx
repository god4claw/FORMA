import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/layout";
import { SpecimenGrid } from "@/components/specimen-grid";
import { categoryBySlug, specimensInCategory, type CategorySlug } from "@/lib/specimens";

export const Route = createFileRoute("/collection/$slug")({
  component: CollectionPage,
  notFoundComponent: CollectionMissing,
});

function CollectionMissing() {
  return (
    <Shell>
      <section className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-4xl italic">Раздел не найден</h1>
        <p className="mt-3 text-sm text-muted">В каталоге нет такой полки.</p>
        <Link to="/" className="mt-6 inline-flex h-11 items-center rounded-lg bg-fg px-4 text-sm font-medium text-bg">
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
          {String(cat.range[0]).padStart(3, "0")}—{String(cat.range[1]).padStart(3, "0")} · {cat.labelEn}
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
