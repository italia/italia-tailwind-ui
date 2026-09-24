import { icon, type IconName } from "../icons";
import { cx, type ComponentDoc } from "../types";

export interface FooterLink {
  label: string;
  href?: string;
  /** Appended as a screen-reader-only note, e.g. "(link esterno)". */
  note?: string;
}

export interface FooterColumn {
  title: string;
  href?: string;
  links: FooterLink[];
}

/** Which surface the bands sit on: "primary" (default) or "base", the page background with primary text. */
export type FooterSurface = "primary" | "base";
/** @deprecated Use FooterSurface: "default" is "primary", "light" is "base". */
export type FooterTheme = "default" | "light";

export interface FooterArgs {
  brand?: string;
  tagline?: string;
  brandIcon?: IconName;
  columns?: FooterColumn[];
  contacts?: {
    title?: string;
    name?: string;
    address?: string;
    links?: FooterLink[];
  };
  socials?: Array<{ name: IconName; label: string; href?: string }>;
  smallPrints?: FooterLink[];
  headingLevel?: 2 | 3;
  /** "base": the bands on the page background with primary text, like the header's base surface. */
  surface?: FooterSurface;
  /** @deprecated Use `surface`: `theme: "light"` is `surface: "base"`. */
  theme?: FooterTheme;
}

const band = "mx-auto w-full max-w-[1320px] px-4";

// Literal class maps: Tailwind only sees classes written out in full.
const mainBand: Record<FooterSurface, string> = {
  primary: "bg-primary text-primary-content",
  base: "border-t border-primary/20 bg-base-100 text-primary",
};
const smallPrintsBand: Record<FooterSurface, string> = {
  primary: "bg-accent text-accent-content",
  base: "border-t border-primary/20 bg-base-200 text-primary",
};
const listLink =
  "text-sm underline decoration-current/50 decoration-1 underline-offset-[3px] hover:decoration-current";

const defaultColumns: FooterColumn[] = [
  {
    title: "Amministrazione",
    links: [
      { label: "Giunta e consiglio" },
      { label: "Aree di competenza" },
      { label: "Dipendenti" },
      { label: "Luoghi" },
      { label: "Associazioni e società partecipate" },
    ],
  },
  {
    title: "Servizi",
    links: [
      { label: "Pagamenti" },
      { label: "Sostegno" },
      { label: "Domande e iscrizioni" },
      { label: "Segnalazioni" },
      { label: "Autorizzazioni e concessioni" },
    ],
  },
  {
    title: "Novità",
    links: [{ label: "Notizie" }, { label: "Eventi" }, { label: "Comunicati stampa" }],
  },
  {
    title: "Documenti",
    links: [
      { label: "Progetti e attività" },
      { label: "Delibere, determine e ordinanze" },
      { label: "Bandi" },
      { label: "Concorsi" },
    ],
  },
];

const defaultSmallPrints: FooterLink[] = [
  { label: "Media policy" },
  { label: "Note legali" },
  { label: "Privacy policy" },
  { label: "Mappa del sito" },
  { label: "Dichiarazione di accessibilità", note: "(link esterno su sito AgID)" },
];

const link = (l: FooterLink) =>
  `<a href="${l.href ?? "#"}" class="${listLink}">${l.label}${l.note ? `<span class="sr-only"> ${l.note}</span>` : ""}</a>`;

export function footer(a: FooterArgs = {}): string {
  const {
    brand = "Lorem Ipsum",
    tagline = "Inserire qui la tag line",
    brandIcon = "it-code-circle",
    columns = defaultColumns,
    smallPrints = defaultSmallPrints,
    headingLevel = 2,
    socials = [
      { name: "it-designers-italia", label: "Designers Italia (link esterno)" },
      { name: "it-twitter", label: "X (link esterno)" },
      { name: "it-medium", label: "Medium (link esterno)" },
      { name: "it-behance", label: "Behance (link esterno)" },
    ],
    contacts = {
      title: "Contatti",
      name: "Comune di Lorem Ipsum",
      address: "Via Roma 0 - 00000 Lorem Ipsum Codice fiscale / P. IVA: 000000000",
      links: [{ label: "Posta Elettronica Certificata" }, { label: "URP - Ufficio Relazioni con il Pubblico" }],
    },
  } = a;
  const surface: FooterSurface = a.surface ?? (a.theme === "light" ? "base" : "primary");
  const h = `h${headingLevel}`;
  const sub = `h${headingLevel + 1}`;
  const title = "footer-title mb-3 text-sm font-semibold uppercase opacity-100";

  const cols = columns.length
    ? `
      <section class="footer grid gap-10 border-t border-current/40 py-8 sm:grid-cols-2 lg:grid-cols-4">
        ${columns
          .map(
            (c) => `<nav class="gap-0">
          <${sub} class="${title}">${c.href ? `<a href="${c.href}" class="${listLink}">${c.title}</a>` : c.title}</${sub}>
          <ul class="flex flex-col gap-3">
            ${c.links.map((l) => `<li>${link(l)}</li>`).join("\n            ")}
          </ul>
        </nav>`,
          )
          .join("\n        ")}
      </section>`
    : "";

  const contactsBlock = `
      <section class="footer grid gap-10 border-t border-current/40 py-8 md:grid-cols-3">
        <div class="gap-0">
          <${sub} class="${title}">${contacts.title ?? "Contatti"}</${sub}>
          <p class="mb-3 text-sm leading-relaxed"><strong>${contacts.name ?? ""}</strong><br>${contacts.address ?? ""}</p>
          <ul class="flex flex-col gap-3">
            ${(contacts.links ?? []).map((l) => `<li>${link(l)}</li>`).join("\n            ")}
          </ul>
        </div>
        <div class="gap-0 md:col-start-3">
          <${sub} class="${title}">Seguici su</${sub}>
          <ul class="flex flex-wrap items-center gap-1">
            ${socials
              .map(
                (s) =>
                  `<li><a href="${s.href ?? "#"}" class="grid size-9 place-items-center rounded-full hover:bg-current/15">${icon(s.name, "size-5")}<span class="sr-only">${s.label}</span></a></li>`,
              )
              .join("\n            ")}
          </ul>
        </div>
      </section>`;

  return `<footer>
  <div class="${mainBand[surface]}">
    <div class="${band} py-8">
      <section class="pb-8">
        <a href="#" class="flex items-center gap-4 no-underline hover:no-underline">
          ${icon(brandIcon, "size-12 shrink-0 lg:size-14")}
          <span>
            <${h} class="text-xl font-normal leading-tight lg:text-2xl">${brand}</${h}>
            <span class="hidden text-base md:block">${tagline}</span>
          </span>
        </a>
      </section>${cols}${contactsBlock}
    </div>
  </div>
  <div class="${smallPrintsBand[surface]}">
    <ul class="${cx(band, "flex flex-col gap-3 py-4 text-xs md:flex-row md:flex-wrap md:gap-6")}">
      ${smallPrints.map((l) => `<li>${link(l)}</li>`).join("\n      ")}
    </ul>
  </div>
</footer>`;
}

/** The "solo contatti" variant: brand, contacts and small prints, without the link columns. */
export function footerCompact(): string {
  return footer({ columns: [] });
}

export const doc: ComponentDoc = {
  slug: "footer",
  name: "Footer",
  replaces: ".it-footer (bootstrap-italia)",
  summary:
    "Piè di pagina istituzionale a due fasce: colonne di link e contatti su primary, note legali su accent, oppure sulla superficie base (lo sfondo della pagina) con testo primary. daisyUI footer e footer-title, colori dai token del tema.",
  daisy: ["footer", "footer-title"],
  cssOnly:
    "Nessun comportamento da replicare: è markup statico. Le due fasce usano bg-primary e bg-accent invece dei token primary-muted e primary-deep di bootstrap-italia, così restano leggibili in tutti i temi.",
  examples: [
    { id: "completo", fullBleed: true, title: "Footer completo", html: footer() },
    { id: "contatti", fullBleed: true, title: "Footer solo contatti", html: footerCompact() },
    { id: "completo-base", fullBleed: true, title: "Footer completo - sfondo base", html: footer({ surface: "base" }) },
  ],
};
