import { icon } from "../icons";
import { cx, type ComponentDoc } from "../types";
import { type DropdownItem } from "./dropdown";

export type FooterPosition = "bottom" | "right";
export type FooterAlign = "left" | "right";

export interface MegamenuArgs {
  label?: string;
  links?: DropdownItem[];
  columns?: 1 | 2 | 3 | 4;
  /** Left-hand block: image plus a line of text about the section. */
  description?: string;
  image?: string;
  imageAlt?: string;
  /** "Esplora la sezione" link above the columns. */
  headerLink?: string;
  /** Raw HTML for the call to action. */
  footer?: string;
  footerPosition?: FooterPosition;
  footerAlign?: FooterAlign;
  active?: boolean;
  disabled?: boolean;
  /** Panel as wide as the viewport container instead of a fixed width. */
  fullWidth?: boolean;
}

// Literal class maps: Tailwind only sees classes written out in full.
const columnCount: Record<1 | 2 | 3 | 4, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};
const footerAlignment: Record<FooterAlign, string> = {
  left: "justify-start",
  right: "justify-end",
};

const arrow = (cls = "size-4 text-primary") => icon("it-arrow-right-triangle", cls);

const defaultLinks: DropdownItem[] = [1, 2, 3, 4, 5, 6].map((n) => ({ label: `Link lista ${n}`, href: "#" }));

/**
 * The panel on its own: the header's nav items drop it straight into their
 * <details>, so the megamenu markup lives in one place.
 */
export function megamenuPanel(a: MegamenuArgs = {}): string {
  const { links = defaultLinks, columns = 2, label = "Megamenu" } = a;
  const hasSide = Boolean(a.description || a.image);
  const footerRight = a.footerPosition === "right";

  const side = hasSide
    ? `<div class="text-base-content">
        ${a.image ? `<div class="mb-4 aspect-[21/9] w-full overflow-hidden rounded-sm bg-base-300"><img src="${a.image}" alt="${a.imageAlt ?? ""}" class="size-full object-cover" loading="lazy"></div>` : `<div class="mb-4 aspect-[21/9] w-full rounded-sm bg-base-300"></div>`}
        <p class="text-sm leading-relaxed">${a.description ?? `Testo utile a fornire una descrizione dei contenuti della sezione <strong>${label}</strong>.`}</p>
      </div>`
    : "";

  const header = a.headerLink
    ? `<div class="mb-3 border-b border-base-content/15 pb-3">
          <a href="#" class="inline-flex items-center gap-2 font-semibold text-primary hover:underline">${arrow()}<span>${a.headerLink}</span></a>
        </div>`
    : "";

  // Inside the nav's daisyUI menu, any <ul> in an <li> picks up the submenu
  // indent and its guide line: ms-0 ps-0 before:hidden take them back off.
  const list = `<ul class="grid w-full list-none gap-1 p-0 ms-0 ps-0 before:hidden ${columnCount[columns]}">
          ${links
            .map(
              (l) =>
                `<li><a href="${l.href ?? "#"}" class="flex items-center gap-2 rounded-sm px-2 py-2 text-sm text-primary hover:bg-primary/10">${arrow()}<span>${l.label ?? ""}</span></a></li>`,
            )
            .join("\n          ")}
        </ul>`;

  const footer = a.footer
    ? `<div class="${cx("flex gap-2 border-base-content/15", footerRight ? "flex-col border-s ps-4" : "mt-4 border-t pt-4", !footerRight && footerAlignment[a.footerAlign ?? "left"])}">${a.footer}</div>`
    : "";

  const main = `<div class="min-w-0">
        ${header}
        ${list}
      </div>`;

  const grid = cx(
    "grid gap-6",
    hasSide && footerRight ? "lg:grid-cols-[1fr_2fr_auto]" : hasSide ? "lg:grid-cols-[1fr_2fr]" : footerRight ? "lg:grid-cols-[1fr_auto]" : "",
  );

  return `<div class="${cx(
    "z-30 rounded-sm bg-base-100 p-6 text-base-content shadow-[0_4px_12px_rgb(0_0_0/0.15)]",
    "lg:absolute lg:start-0 lg:top-full",
    a.fullWidth ? "w-full" : "w-full lg:w-[min(56rem,calc(100vw-2rem))]",
  )}">
      <div class="${grid}">
        ${side}${side ? "\n        " : ""}${main}${footerRight ? `\n        ${footer}` : ""}
      </div>${!footerRight ? footer : ""}
    </div>`;
}

export function megamenu(a: MegamenuArgs = {}): string {
  const { label = "Megamenu" } = a;
  return `<details class="group relative lg:overflow-visible${a.disabled ? " pointer-events-none opacity-50" : ""}">
  <summary class="${cx(
    "rounded-none px-3 py-3 font-semibold",
    a.active && "border-b-4 border-current",
  )}">${label}</summary>
  ${megamenuPanel(a)}
</details>`;
}

const bar = (inner: string) =>
  `<div class="bg-primary text-primary-content">
  <nav aria-label="Navigazione principale" class="mx-auto w-full max-w-[1320px] px-4">
    <ul class="menu menu-horizontal w-full gap-0 p-0">
      ${inner}
    </ul>
  </nav>
</div>
<div class="h-96"></div>`;

const cta = `<a href="#" class="btn btn-sm btn-primary font-semibold">Call to action</a>`;

export const doc: ComponentDoc = {
  slug: "megamenu",
  name: "Megamenu",
  replaces: "<it-megamenu>",
  summary:
    "Il pannello largo della navigazione principale: colonne di link, blocco descrittivo, link di sezione e call to action. Un <details> dentro daisyUI dropdown, quindi funziona con la tastiera e senza JavaScript.",
  daisy: ["menu", "menu-horizontal", "btn"],
  cssOnly:
    "daisyUI ha una classe megamenu basata su popover e anchor positioning: qui non è usata perché l'anchor positioning non è ancora supportato fuori da Chromium. Il pannello è largo w-[min(56rem,100vw-2rem)] invece di essere ancorato dinamicamente.",
  examples: [
    { id: "base", title: "Megamenu base", html: bar(`<li>${megamenu()}</li>`) },
    {
      id: "completo",
      title: "Megamenu completo",
      description: "Descrizione a sinistra e link di sezione sopra le colonne.",
      html: bar(
        `<li>${megamenu({
          image: "https://picsum.photos/seed/megamenu/560/240",
          imageAlt: "Segnaposto",
          headerLink: "Esplora la sezione Megamenu",
        })}</li>`,
      ),
    },
    {
      id: "colonne",
      title: "Numero di colonne",
      html: bar(
        `<li>${megamenu({ label: "Due colonne", columns: 2, links: defaultLinks })}</li>
      <li>${megamenu({ label: "Tre colonne", columns: 3, links: [...defaultLinks, { label: "Link lista 7", href: "#" }, { label: "Link lista 8", href: "#" }, { label: "Link lista 9", href: "#" }] })}</li>`,
      ),
    },
    {
      id: "esplora",
      title: 'Con link "Esplora la sezione"',
      html: bar(`<li>${megamenu({ headerLink: "Esplora la sezione Megamenu" })}</li>`),
    },
    {
      id: "cta-basso",
      title: "Con call to action in basso",
      html: bar(`<li>${megamenu({ footer: cta, footerAlign: "right" })}</li>`),
    },
    {
      id: "cta-destra",
      title: "Con call to action a destra",
      html: bar(`<li>${megamenu({ footer: cta, footerPosition: "right" })}</li>`),
    },
    {
      id: "attivo",
      title: "Stato attivo e disabilitato",
      html: bar(`<li>${megamenu({ label: "Attivo", active: true })}</li>
      <li>${megamenu({ label: "Disabilitato", disabled: true })}</li>`),
    },
  ],
};
