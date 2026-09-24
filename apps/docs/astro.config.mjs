import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Deploy target, from the environment (see README "Build and deploy"):
  // DOCS_SITE = the origin, e.g. https://italia.github.io
  // DOCS_BASE = the path the site lives under, e.g. /italia-daisy/ (default /)
  site: process.env.DOCS_SITE || undefined,
  base: process.env.DOCS_BASE || "/",
  vite: { plugins: [tailwindcss()] },
});
