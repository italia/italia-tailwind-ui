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
  1: "ita-megamenu-cols-1",
  2: "",
  3: "ita-megamenu-cols-3",
  4: "ita-megamenu-cols-4",
};

const arrow = () => icon("it-arrow-right-triangle", "");

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
    ? `<div class="ita-megamenu-side">
        <div>${a.image ? `<img src="${a.image}" alt="${a.imageAlt ?? ""}" loading="lazy">` : ""}</div>
        <p>${a.description ?? `Testo utile a fornire una descrizione dei contenuti della sezione <strong>${label}</strong>.`}</p>
      </div>`
    : "";

  const header = a.headerLink
    ? `<div class="ita-megamenu-header">
          <a href="#">${arrow()}<span>${a.headerLink}</span></a>
        </div>`
    : "";

  const list = `<ul class="${cx("ita-megamenu-list", columnCount[columns])}">
          ${links
            .map(
              (l) =>
                `<li><a href="${l.href ?? "#"}">${arrow()}<span>${l.label ?? ""}</span></a></li>`,
            )
            .join("\n          ")}
        </ul>`;

  const footer = a.footer
    ? `<div class="${cx("ita-megamenu-footer", footerRight ? "ita-megamenu-footer-side" : a.footerAlign === "right" && "ita-megamenu-footer-end")}">${a.footer}</div>`
    : "";

  const main = `<div class="ita-megamenu-main">
        ${header}
        ${list}
      </div>`;

  return `<div class="${cx("ita-megamenu", a.fullWidth && "ita-megamenu-full")}">
      <div class="ita-megamenu-grid">
        ${side}${side ? "\n        " : ""}${main}${footerRight ? `\n        ${footer}` : ""}
      </div>${!footerRight ? footer : ""}
    </div>`;
}

export function megamenu(a: MegamenuArgs = {}): string {
  const { label = "Megamenu" } = a;
  return `<details class="${cx("ita-megamenu-item", a.active && "ita-megamenu-active", a.disabled && "ita-megamenu-disabled")}">
  <summary>${label}</summary>
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

const cta = `<a href="#" class="ita-btn ita-btn-primary ita-btn-xs">Call to action</a>`;

export const doc: ComponentDoc = {
  slug: "megamenu",
  name: "Megamenu",
  replaces: "<it-megamenu>",
  summary:
    "Il pannello largo della navigazione principale: colonne di link, blocco descrittivo, link di sezione e call to action. Un <details> dentro daisyUI dropdown, quindi funziona con la tastiera e senza JavaScript.",
  classes: ["ita-megamenu", "ita-megamenu-full", "ita-megamenu-grid", "ita-megamenu-side", "ita-megamenu-main", "ita-megamenu-header", "ita-megamenu-list", "ita-megamenu-cols-1", "ita-megamenu-cols-3", "ita-megamenu-cols-4", "ita-megamenu-footer", "ita-megamenu-footer-end", "ita-megamenu-footer-side", "ita-megamenu-item", "ita-megamenu-active", "ita-megamenu-disabled"],
  daisy: ["menu", "menu-horizontal"],
  cssOnly:
    "daisyUI ha una classe megamenu basata su popover e anchor positioning: qui non è usata perché l'anchor positioning non è ancora supportato fuori da Chromium. Il pannello è largo min(56rem, 100vw - 2rem) invece di essere ancorato dinamicamente.",
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
