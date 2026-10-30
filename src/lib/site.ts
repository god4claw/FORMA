/**
 * Site-level constants and absolute-URL helpers.
 *
 * Open Graph images must be absolute, but the repo does not hardcode a domain:
 * set `VITE_SITE_URL` (see `.env.example`) when deploying. Without it, meta
 * tags fall back to root-relative paths — still useful for crawlers that
 * resolve them against the request origin.
 */

const rawSiteUrl = import.meta.env.VITE_SITE_URL;

export const SITE_URL = typeof rawSiteUrl === "string" ? rawSiteUrl.replace(/\/+$/, "") : "";

export const SITE_NAME = "FORMA";

export const SITE_TITLE = "FORMA — сто эталонов формы";

export const SITE_DESCRIPTION =
  "Сто живых эталонов интерфейса: кнопки, боксы, тайтлы, вложения. Каждый нажимается, копируется в CSS и уносится к себе.";

export const OG_IMAGE_PATH = "/og.jpg";

export function absoluteUrl(path: string): string {
  return SITE_URL ? `${SITE_URL}${path}` : path;
}
