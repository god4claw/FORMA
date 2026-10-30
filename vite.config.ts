import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

/**
 * FORMA has no database, no accounts and no server state. The only server-side
 * work is rendering route head tags, so the config stays deliberately small.
 *
 * Nitro only joins the build on Vercel (which sets `VERCEL=1`). Everywhere else
 * the build produces the plain TanStack Start output in `dist/`, which is what
 * `npm run preview` and the CI build use.
 */
export default defineConfig(({ command }) => ({
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    tanstackStart(),
    ...(command === "build" && process.env.VERCEL ? [nitro({ preset: "vercel" })] : []),
    viteReact(),
  ],
}));
