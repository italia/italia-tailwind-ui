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
  `<a href="${l.href ?? "#"}">${l.label}${l.note ? `<span class="sr-only"> ${l.note}</span>` : ""}</a>`;

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

  const cols = columns.length
    ? `
      <section class="footer ita-footer-columns">
        ${columns
          .map(
            (c) => `<nav>
          <${sub} class="footer-title">${c.href ? `<a href="${c.href}">${c.title}</a>` : c.title}</${sub}>
          <ul class="ita-footer-list">
            ${c.links.map((l) => `<li>${link(l)}</li>`).join("\n            ")}
          </ul>
        </nav>`,
          )
          .join("\n        ")}
      </section>`
    : "";

  const contactsBlock = `
      <section class="footer ita-footer-contacts">
        <div>
          <${sub} class="footer-title">${contacts.title ?? "Contatti"}</${sub}>
          <p><strong>${contacts.name ?? ""}</strong><br>${contacts.address ?? ""}</p>
          <ul class="ita-footer-list">
            ${(contacts.links ?? []).map((l) => `<li>${link(l)}</li>`).join("\n            ")}
          </ul>
        </div>
        <div>
          <${sub} class="footer-title">Seguici su</${sub}>
          <ul class="ita-footer-socials">
            ${socials
              .map(
                (s) =>
                  `<li><a href="${s.href ?? "#"}">${icon(s.name, "")}<span class="sr-only">${s.label}</span></a></li>`,
              )
              .join("\n            ")}
          </ul>
        </div>
      </section>`;

  return `<footer class="${cx("ita-footer", surface === "base" && "ita-footer-base")}">
  <div class="ita-footer-main">
    <div class="ita-footer-container">
      <section class="ita-footer-brand">
        <a href="#">
          ${icon(brandIcon, "")}
          <span>
            <${h} class="ita-footer-name">${brand}</${h}>
            <span class="ita-footer-tagline">${tagline}</span>
          </span>
        </a>
      </section>${cols}${contactsBlock}
    </div>
  </div>
  <div class="ita-footer-legal">
    <ul class="ita-footer-container">
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
  classes: ["ita-footer", "ita-footer-base", "ita-footer-main", "ita-footer-container", "ita-footer-brand", "ita-footer-name", "ita-footer-tagline", "ita-footer-columns", "ita-footer-contacts", "ita-footer-list", "ita-footer-socials", "ita-footer-legal"],
  daisy: ["footer", "footer-title"],
  cssOnly:
    "Nessun comportamento da replicare: è markup statico. Le due fasce usano bg-primary e bg-accent invece dei token primary-muted e primary-deep di bootstrap-italia, così restano leggibili in tutti i temi.",
  examples: [
    { id: "completo", fullBleed: true, title: "Footer completo", html: footer() },
    { id: "contatti", fullBleed: true, title: "Footer solo contatti", html: footerCompact() },
    { id: "completo-base", fullBleed: true, title: "Footer completo - sfondo base", html: footer({ surface: "base" }) },
  ],
};
