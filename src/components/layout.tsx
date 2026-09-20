import { Link, useRouterState } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { CATEGORIES } from "@/lib/specimens";
import { cn } from "@/lib/cn";

export function Shell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-fg focus:px-3 focus:py-2 focus:text-bg"
      >
        К содержанию
      </a>
      <header className="sticky top-0 z-40 border-b border-border/80 bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="shrink-0 leading-none">
            <span className="font-display text-[28px] tracking-tight text-fg italic">FORMA</span>
          </Link>
          <span className="hidden font-mono text-xs tracking-[0.18em] text-subtle sm:inline">100</span>
          <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Разделы">
            <Link
              to="/"
              className={cn(
                "px-2.5 py-2 text-sm font-medium transition-[color] duration-150",
                pathname === "/" ? "text-fg" : "text-muted hover:text-fg",
              )}
            >
              Каталог
            </Link>
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                to="/collection/$slug"
                params={{ slug: c.slug }}
                className={cn(
                  "px-2.5 py-2 text-sm font-medium transition-[color] duration-150",
                  pathname === `/collection/${c.slug}` ? "text-fg" : "text-muted hover:text-fg",
                )}
              >
                {c.label}
              </Link>
            ))}
            <Link
              to="/studio"
              className={cn(
                "px-2.5 py-2 text-sm font-medium transition-[color] duration-150",
                pathname === "/studio" ? "text-fg" : "text-muted hover:text-fg",
              )}
            >
              Студия
            </Link>
          </nav>
        </div>
        <div className="no-scrollbar flex gap-1 overflow-x-auto px-4 pb-3 md:hidden">
          <Link
            to="/"
            className={cn(
              "shrink-0 rounded-full px-3 py-2 text-sm font-medium",
              pathname === "/" ? "bg-fg text-bg" : "bg-surface text-muted",
            )}
          >
            Все
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to="/collection/$slug"
              params={{ slug: c.slug }}
              className={cn(
                "shrink-0 rounded-full px-3 py-2 text-sm font-medium",
                pathname === `/collection/${c.slug}` ? "bg-fg text-bg" : "bg-surface text-muted",
              )}
            >
              {c.label}
            </Link>
          ))}
          <Link
            to="/studio"
            className={cn(
              "shrink-0 rounded-full px-3 py-2 text-sm font-medium",
              pathname === "/studio" ? "bg-fg text-bg" : "bg-surface text-muted",
            )}
          >
            Студия
          </Link>
        </div>
      </header>
      <main id="content">{children}</main>
      <footer className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>FORMA — полевой каталог интерфейсных форм.</p>
          <p className="font-mono text-xs tracking-widest text-subtle">001—100</p>
        </div>
      </footer>
    </div>
  );
}

export function NotFoundScreen() {
  return (
    <Shell>
      <section className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
        <p className="font-mono text-xs tracking-[0.22em] text-muted">404</p>
        <h1 className="mt-3 font-display text-4xl italic">Страница не найдена</h1>
        <p className="mt-3 text-sm text-muted">В каталоге нет такого адреса.</p>
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
