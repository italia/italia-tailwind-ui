import type { ComponentDoc } from "../types";

export interface Skiplink {
  label: string;
  href: string;
}

export interface SkiplinksArgs {
  links?: Skiplink[];
  label?: string;
  /** Always visible, for documenting the look. */
  visible?: boolean;
}

const defaultLinks: Skiplink[] = [
  { label: "Vai al contenuto principale", href: "#main" },
  { label: "Vai alla navigazione", href: "#nav" },
  { label: "Vai al piè di pagina", href: "#footer" },
];

/**
 * Skip links: hidden until one of them gets keyboard focus, then the whole bar
 * appears at the top (focus-within), so every link is visible while tabbing.
 */
export function skiplinks(a: SkiplinksArgs = {}): string {
  const { links = defaultLinks, label = "Scorciatoie di navigazione" } = a;
  const cls = a.visible ? "ita-skiplinks-bar" : "ita-skiplinks";
  return `<nav aria-label="${label}" class="${cls}">
  ${links.map((l) => `<a href="${l.href}">${l.label}</a>`).join("\n  ")}
</nav>`;
}

export const doc: ComponentDoc = {
  slug: "skiplinks",
  name: "Skiplinks",
  replaces: "<it-skiplinks>",
  summary:
    "I collegamenti «Vai al contenuto» per chi naviga da tastiera: nascosti con sr-only, la barra intera compare in cima quando uno di loro riceve il focus.",
  classes: ["ita-skiplinks", "ita-skiplinks-bar"],
  daisy: [],
  cssOnly:
    "ita-skiplinks è sr-only finché un suo link non ha il focus (focus-within) sul <nav>: con il primo Tab compare tutta la barra, non solo il link attivo. Mettilo come primo elemento del <body> e dai un id alle destinazioni (<main id=\"main\">). Per spostare davvero il focus su un elemento non interattivo aggiungi tabindex=\"-1\" alla destinazione.",
  examples: [
    {
      id: "base",
      title: "Esempio base",
      description: "Clicca nel riquadro e premi Tab: la barra compare in cima.",
      html: `<div class="relative rounded-box border border-base-content/15 p-6 pt-16">
  ${skiplinks({ links: [{ label: "Vai al contenuto principale", href: "#skip-main" }, { label: "Vai al piè di pagina", href: "#skip-footer" }] })}
  <p id="skip-main" tabindex="-1" class="mb-2 font-semibold">Contenuto principale</p>
  <p id="skip-footer" tabindex="-1" class="text-base-content/70">Piè di pagina</p>
</div>`,
    },
    { id: "visibili", title: "Aspetto", description: "La barra come appare durante la navigazione da tastiera.", html: skiplinks({ visible: true }) },
  ],
};
