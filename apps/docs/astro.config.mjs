import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Set `site`/`base` when deploying, e.g. to GitHub Pages.
  vite: { plugins: [tailwindcss()] },
});
