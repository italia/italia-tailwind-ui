import { icon, type IconName } from "../icons";
import { cx, type ComponentDoc } from "../types";
import { chip } from "./chip";
import { button } from "./button";

export type CardBorderTop = "none" | "primary" | "secondary" | "success" | "danger" | "warning";
export type CardShadow = "none" | "sm" | "md" | "lg";

export interface CardArgs {
  title?: string;
  href?: string;
  text?: string;
  subtitle?: string;
  signature?: string;
  category?: string;
  date?: string;
  tags?: string[];
  image?: string;
  imageAlt?: string;
  /** Icon next to the title (featured cards). */
  titleIcon?: IconName;
  borderTop?: CardBorderTop;
  shadow?: CardShadow;
  border?: boolean;
  /** Image beside text from md up (daisyUI card-side). */
  inline?: boolean;
  reverse?: boolean;
  headingLevel?: 2 | 3 | 4;
  actions?: string;
}

// Literal class maps: Tailwind only sees classes written out in full.
const borderTop: Record<CardBorderTop, string> = {
  none: "",
  primary: "ita-card-primary",
  secondary: "ita-card-secondary",
  success: "ita-card-success",
  danger: "ita-card-danger",
  warning: "ita-card-warning",
};
const shadows: Record<CardShadow, string> = {
  none: "ita-card-shadow-none",
  sm: "",
  md: "ita-card-shadow-md",
  lg: "ita-card-shadow-lg",
};

export function card(a: CardArgs = {}): string {
  const {
    title = "Titolo del contenuto",
    href = "#",
    text = "Questo è un testo breve che riassume il contenuto della pagina di destinazione in massimo tre o quattro righe, senza troncamento.",
    shadow = "sm",
    headingLevel = 3,
  } = a;
  const h = `h${headingLevel}`;
  const cls = cx(
    "card ita-card",
    a.border === false && "ita-card-borderless",
    shadows[shadow],
    borderTop[a.borderTop ?? "none"],
    a.inline && "ita-card-inline",
    a.inline && a.reverse && "ita-card-reverse",
  );
  const figure = a.image ? `<figure><img src="${a.image}" alt="${a.imageAlt ?? ""}" loading="lazy"></figure>` : "";
  const titleEl = `<${h} class="card-title">
      <a href="${href}">${title}</a>${a.titleIcon ? `\n      ${icon(a.titleIcon, "")}` : ""}
    </${h}>`;
  const body: string[] = [titleEl];
  if (a.subtitle) body.push(`<p class="ita-card-subtitle">${a.subtitle}</p>`);
  if (a.signature) body.push(`<address>${a.signature}</address>`);
  if (text) body.push(`<p class="ita-card-text">${text}</p>`);
  const hasFooter = a.category || a.date || a.tags?.length;
  if (hasFooter) {
    const tax = a.tags?.length
      ? `<div class="ita-card-tags">${a.tags.map((t) => chip({ label: t, href: "#" })).join("")}</div>`
      : `<div><a href="#" class="ita-card-category">${a.category}</a></div>`;
    body.push(`<footer class="ita-card-footer">
      ${tax}${a.date ? `\n      <time>${a.date}</time>` : ""}
    </footer>`);
  }
  if (a.actions) body.push(`<div class="card-actions" role="group" aria-label="Link correlati:">${a.actions}</div>`);
  return `<article class="${cls}">
  ${figure}
  <div class="card-body">
    ${body.join("\n    ")}
  </div>
</article>`;
}

/** Profile card: avatar + name + role, with an optional description list. */
export function profileCard(name = "Nome Personale", role = "Ruolo nell'organizzazione", initials = "NP"): string {
  return `<article class="card ita-card ita-card-profile">
  <div class="card-body">
    <div class="flex items-center gap-4">
      <div class="avatar avatar-placeholder"><div class="size-20 rounded-full bg-primary text-primary-content text-2xl font-bold">${initials}</div></div>
      <div>
        <h3 class="card-title"><a href="#">${name}</a></h3>
        <p class="text-base-content/70">${role}</p>
      </div>
    </div>
    <dl class="border-y border-base-content/20 py-3">
      <dt class="font-bold">Area:</dt>
      <dd>Nome dell'area di appartenenza</dd>
    </dl>
  </div>
</article>`;
}

/** Banner card: centred icon, title, subtitle and an optional action. */
export function bannerCard(action = false): string {
  return `<article class="card ita-card ita-card-banner">
  <div class="card-body">
    ${icon("it-chart-line", "size-16 text-secondary")}
    <h3 class="card-title"><a href="#">Titolo del contenuto</a></h3>
    <p class="font-semibold">Scopri maggiori informazioni</p>${action ? `\n    <div class="card-actions">${button({ label: "Apri il form di iscrizione", outline: true })}</div>` : ""}
  </div>
</article>`;
}

const grid = (items: string[]) =>
  `<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">\n${items.join("\n")}\n</div>`;

export const doc: ComponentDoc = {
  slug: "card",
  name: "Card",
  replaces: "<it-card>",
  summary:
    "Card editoriali, inline, profilo e banner. daisyUI card con bordo sottile, ombre di design-tokens-italia e titolo come link.",
  classes: ["ita-card", "ita-card-primary", "ita-card-secondary", "ita-card-success", "ita-card-danger", "ita-card-warning", "ita-card-shadow-none", "ita-card-shadow-md", "ita-card-shadow-lg", "ita-card-borderless", "ita-card-inline", "ita-card-reverse", "ita-card-profile", "ita-card-banner", "ita-card-subtitle", "ita-card-text", "ita-card-footer", "ita-card-tags", "ita-card-category"],
  daisy: ["card", "card-body", "card-title", "card-actions", "card-side", "avatar"],
  examples: [
    {
      id: "editoriali",
      title: "Card editoriali standard",
      html: grid([
        card({ category: "Categoria", date: "22 aprile 2026" }),
        card({ image: "https://picsum.photos/seed/city/800/600", imageAlt: "Città", category: "Categoria", date: "22 aprile 2026" }),
        card({ image: "https://picsum.photos/seed/nature/800/600", imageAlt: "Natura", tags: ["Argomento 1", "Argomento 2"] }),
      ]),
    },
    {
      id: "featured",
      title: "Card editoriali featured",
      html: grid([
        card({ title: "Titolo del contenuto featured", titleIcon: "it-file", subtitle: "Sottotitolo del contenuto", signature: "di Maria Verde" }),
        card({ title: "Titolo del contenuto featured", titleIcon: "it-designers-italia", category: "Categoria", date: "22 aprile 2026" }),
        card({ title: "Titolo del contenuto featured", titleIcon: "it-external-link", subtitle: "Sottotitolo del contenuto" }),
      ]),
    },
    {
      id: "inline",
      title: "Card inline",
      html: `<div class="flex flex-col gap-6">
${card({ inline: true, image: "https://picsum.photos/seed/city/800/600", imageAlt: "Città", category: "Categoria", date: "22 aprile 2026" })}
${card({ inline: true, reverse: true, image: "https://picsum.photos/seed/nature/800/600", imageAlt: "Natura", category: "Categoria", date: "22 aprile 2026" })}
</div>`,
    },
    {
      id: "bordi-ombre",
      title: "Bordi e ombre",
      html: grid([
        card({ title: "Titolo h3", borderTop: "primary", date: "12 ottobre, 2026", category: "Categoria" }),
        card({ title: "Titolo h3", borderTop: "success", shadow: "md", date: "12 ottobre, 2026", category: "Categoria" }),
        card({ title: "Titolo h3", borderTop: "danger", shadow: "lg", border: false, date: "12 ottobre, 2026", category: "Categoria" }),
      ]),
    },
    {
      id: "profili",
      title: "Card per profili personali",
      html: grid([profileCard(), profileCard("Maria Verde", "Responsabile comunicazione", "MV")]),
    },
    {
      id: "banner",
      title: "Card banner",
      html: grid([bannerCard(), bannerCard(true)]),
    },
    {
      id: "azioni",
      title: "Card con azioni",
      html: grid([
        card({
          subtitle: "Sottotitolo del contenuto",
          actions: `<a href="#" class="ita-link inline-flex items-center gap-2 font-semibold">Leggi di più ${icon("it-arrow-right", "size-5")}</a>`,
        }),
      ]),
    },
  ],
};
