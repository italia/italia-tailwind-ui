/**
 * The full-page layout examples. Each one is a page in src/pages/layout/<slug>.astro
 * built on LayoutDemo.astro; add an entry here to list it in /layout/.
 */
export interface LayoutExample {
  slug: string;
  title: string;
  description: string;
  /** What the few lines of JavaScript in the page do, if it has any. */
  script?: string;
}

export const layouts: LayoutExample[] = [
  {
    slug: "dashboard",
    title: "Dashboard",
    description:
      "Area riservata con menu laterale riducibile (drawer su mobile), intestazione fissa con percorso di navigazione, griglia di card e piè di pagina.",
    script: "Apre e riduce il menu laterale, chiude i menu a tendina con Esc o cliccando fuori, cambia tema.",
  },
];
