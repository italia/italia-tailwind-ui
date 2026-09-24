import { cx, type ComponentDoc } from "../types";

export interface AccordionItem {
  title: string;
  content: string;
  open?: boolean;
}

export interface AccordionArgs {
  items?: AccordionItem[];
  /** Exclusive mode: items share a name, so opening one closes the others. */
  single?: boolean;
  name?: string;
  /** Primary fill on the open item's header. */
  backgroundActive?: boolean;
  /** Primary fill on hover. */
  backgroundHover?: boolean;
  /** "+ / –" glyph on the left instead of the chevron. */
  leftIcon?: boolean;
  headingLevel?: 2 | 3 | 4;
}

const lorem =
  "Vestibulum hendrerit ultrices nibh, sed pharetra lacus ultrices eget. Morbi et ipsum et sapien dapibus facilisis. Integer eget semper nibh. Proin enim nulla, egestas ac rutrum eget, ullamcorper nec turpis.";

const defaultItems: AccordionItem[] = [
  { title: "Elemento richiudibile #1", content: lorem, open: true },
  { title: "Elemento richiudibile #2", content: lorem },
  { title: "Elemento richiudibile #3", content: lorem },
];

let counter = 0;

export function accordion(a: AccordionArgs = {}): string {
  const { items = defaultItems, headingLevel = 2 } = a;
  const name = a.single ? (a.name ?? `accordion-${++counter}`) : undefined;
  const h = `h${headingLevel}`;
  // daisyUI's collapse classes stay; ita-accordion on the wrapper adds the .italia look.
  const details = cx("collapse", !a.leftIcon && "collapse-arrow");
  const root = cx("ita-accordion", a.backgroundActive && "ita-accordion-active", a.backgroundHover && "ita-accordion-hover");
  const body = items
    .map(
      (it) => `  <details class="${details}"${name ? ` name="${name}"` : ""}${it.open ? " open" : ""}>
    <summary class="collapse-title">${a.leftIcon ? `<span class="it-plus-minus" aria-hidden="true"></span>` : ""}<${h}>${it.title}</${h}></summary>
    <div class="collapse-content">${it.content.trimStart().startsWith("<") ? it.content : `<p>${it.content}</p>`}</div>
  </details>`,
    )
    .join("\n");
  return `<div class="${root}">\n${body}\n</div>`;
}

export const doc: ComponentDoc = {
  slug: "accordion",
  name: "Accordion",
  replaces: "<it-accordion>, <it-accordion-item>",
  summary:
    "Elementi richiudibili su <details>/<summary> nativi con daisyUI collapse: apertura, chiusura e tastiera funzionano senza JavaScript.",
  classes: ["ita-accordion", "ita-accordion-active", "ita-accordion-hover"],
  daisy: ["collapse", "collapse-arrow", "collapse-title", "collapse-content"],
  extensions: ["it-plus-minus"],
  cssOnly:
    "La modalità esclusiva usa l'attributo name condiviso di <details>; aperto di default = attributo open. Le frecce su/giù fra intestazioni del web component non sono replicate (Tab funziona).",
  examples: [
    { id: "base", title: "Esempio base", html: accordion() },
    { id: "esclusiva", title: "Modalità esclusiva", description: "Aprendo un elemento si chiudono gli altri.", html: accordion({ single: true, name: "esclusivo" }) },
    {
      id: "annidati",
      title: "Accordion annidati",
      html: accordion({
        items: [
          {
            title: "Elemento richiudibile #1",
            open: true,
            content: accordion({
              headingLevel: 3,
              items: [1, 2, 3].map((n) => ({ title: `Elemento richiudibile annidato #${n}`, content: lorem })),
            }),
          },
          { title: "Elemento richiudibile #2", content: lorem },
        ],
      }),
    },
    { id: "sfondo-attivo", title: "Sfondo degli elementi attivi", html: accordion({ backgroundActive: true }) },
    { id: "hover", title: "Hover degli header", html: accordion({ backgroundHover: true }) },
    { id: "icona-sinistra", title: "Icona a sinistra", html: accordion({ leftIcon: true }) },
  ],
};
