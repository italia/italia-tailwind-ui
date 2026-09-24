import { icon } from "../icons";
import { cx, type ComponentDoc } from "../types";

export interface NavscrollLink {
  label: string;
  /** Target id, with the leading #. */
  href: string;
  /** Server-rendered current section (fallback for browsers without :target-current). */
  active?: boolean;
  children?: NavscrollLink[];
}

export interface NavscrollArgs {
  title?: string;
  links?: NavscrollLink[];
  /** Reading progress bar under the title. */
  progress?: boolean;
}

const defaultLinks: NavscrollLink[] = [
  { label: "Descrizione", href: "#ns-descrizione" },
  { label: "A chi è rivolto", href: "#ns-destinatari" },
  {
    label: "Come fare",
    href: "#ns-come-fare",
    children: [
      { label: "Online", href: "#ns-online" },
      { label: "Allo sportello", href: "#ns-sportello" },
    ],
  },
  { label: "Costi", href: "#ns-costi" },
  { label: "Contatti", href: "#ns-contatti" },
];

const link = (l: NavscrollLink): string => {
  const kids = l.children?.length ? `\n      <ul>\n        ${l.children.map(link).join("\n        ")}\n      </ul>\n    ` : "";
  return `<li><a href="${l.href}"${l.active ? ` aria-current="true"` : ""}>${l.label}</a>${kids}</li>`;
};

/**
 * A page index: anchor links with the current section highlighted while
 * scrolling. On small screens it folds into a <details>; from lg up it is
 * always open.
 */
export function navscroll(a: NavscrollArgs = {}): string {
  const { title = "Indice della pagina", links = defaultLinks, progress = true } = a;
  return `<nav aria-label="${title}" class="ita-navscroll">
  <details>
    <summary>
      <span>${title}</span>${icon("it-expand", "")}
    </summary>
    <div>
      <p class="ita-navscroll-title" aria-hidden="true">${title}</p>${
        progress ? `\n      <div class="ita-navscroll-progress" aria-hidden="true"><div class="it-scroll-progress"></div></div>` : ""
      }
      <ul>
    ${links.map(link).join("\n    ")}
      </ul>
    </div>
  </details>
</nav>`;
}

const section = (id: string, title: string, level: 2 | 3 = 2) =>
  `<section id="${id}" class="scroll-mt-4 pb-10">
      <h${level} class="${level === 2 ? "mb-3 text-2xl" : "mb-2 text-xl"} font-bold">${title}</h${level}>
      <p class="mb-3">Testo di esempio per la sezione «${title}». Scorri il riquadro: l'indice evidenzia la sezione visibile e la barra mostra quanto hai letto.</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
    </section>`;

export const doc: ComponentDoc = {
  slug: "navscroll",
  name: "Navscroll",
  replaces: "<it-navscroll>",
  summary:
    "L'indice di pagina di bootstrap-italia: link ad ancora con la sezione corrente evidenziata durante lo scorrimento e una barra di avanzamento della lettura.",
  classes: ["ita-navscroll", "ita-navscroll-title", "ita-navscroll-progress"],
  daisy: [],
  extensions: ["it-scroll-progress"],
  cssOnly:
    "La sezione corrente usa scroll-target-group e :target-current (Chrome 140+); negli altri browser resta il link segnato con aria-current dal server. La barra è una scroll-driven animation (it-scroll-progress) sul contenitore di scorrimento più vicino, cioè la pagina in un layout reale. Sotto lg l'indice si chiude in un <details>; da lg in su ::details-content è sempre visibile.",
  examples: [
    {
      id: "base",
      title: "Esempio base",
      description: "Scorri il riquadro di destra.",
      html: `<div class="grid h-[28rem] grid-cols-1 gap-8 overflow-y-auto scroll-smooth rounded-box border border-base-content/15 p-6 lg:grid-cols-[16rem_1fr]">
  <aside class="lg:sticky lg:top-0 lg:self-start">
    ${navscroll()}
  </aside>
  <div>
    ${section("ns-descrizione", "Descrizione")}
    ${section("ns-destinatari", "A chi è rivolto")}
    ${section("ns-come-fare", "Come fare")}
    ${section("ns-online", "Online", 3)}
    ${section("ns-sportello", "Allo sportello", 3)}
    ${section("ns-costi", "Costi")}
    ${section("ns-contatti", "Contatti")}
  </div>
</div>`,
    },
    {
      id: "statico",
      title: "Senza barra, voce corrente dal server",
      html: `<div class="max-w-xs">${navscroll({
        progress: false,
        links: [
          { label: "Panoramica", href: "#panoramica" },
          { label: "Documenti richiesti", href: "#documenti", active: true },
          { label: "Tempi e scadenze", href: "#tempi" },
        ],
      })}</div>`,
    },
  ],
};
