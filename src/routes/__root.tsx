import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { OG_IMAGE_PATH, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";
import appCss from "../styles.css?url";

/**
 * Site-wide defaults. Page-specific tags (title, description, canonical, og:url)
 * live in each route's `head` so nothing is emitted twice.
 */
export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0c0c0b" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: absoluteUrl(OG_IMAGE_PATH) },
      { property: "og:image:alt", content: "FORMA — сто эталонов формы" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: absoluteUrl(OG_IMAGE_PATH) },
      ...(SITE_URL ? [{ property: "og:locale", content: "ru_RU" }] : []),
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&family=Outfit:wght@400;500;600&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  component: () => (
    <html lang="ru" suppressHydrationWarning className="antialiased">
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  ),
});
