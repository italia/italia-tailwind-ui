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

const borderTop: Record<CardBorderTop, string> = {
  none: "",
  primary: "border-t-6 border-t-primary",
  secondary: "border-t-6 border-t-secondary",
  success: "border-t-6 border-t-success",
  danger: "border-t-6 border-t-error",
  warning: "border-t-6 border-t-warning",
};
const shadows: Record<CardShadow, string> = {
  none: "shadow-none",
  sm: "shadow-[0_4px_4px_rgb(0_0_0/0.05)]",
  md: "shadow-[0_8px_16px_rgb(0_0_0/0.1)]",
  lg: "shadow-[0_16px_48px_rgb(0_0_0/0.15)]",
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
    "card bg-base-100 text-base-content/85",
    a.border !== false && "card-border border-base-content/20",
    shadows[shadow],
    borderTop[a.borderTop ?? "none"],
    a.inline && "md:card-side",
    a.inline && a.reverse && "md:flex-row-reverse",
  );
  const figure = a.image
    ? `<figure class="bg-base-300 ${a.inline ? "aspect-video md:aspect-auto md:w-1/2 md:shrink-0" : "aspect-video"}"><img src="${a.image}" alt="${a.imageAlt ?? ""}" class="size-full object-cover" loading="lazy"></figure>`
    : "";
  const titleEl = `<${h} class="card-title flex items-start justify-between gap-3 text-2xl font-bold leading-tight">
      <a href="${href}" class="link link-primary underline-offset-2">${title}</a>${a.titleIcon ? `\n      ${icon(a.titleIcon, "size-8 text-secondary")}` : ""}
    </${h}>`;
  const body: string[] = [titleEl];
  if (a.subtitle) body.push(`<p class="text-xl font-semibold leading-tight text-base-content">${a.subtitle}</p>`);
  if (a.signature) body.push(`<address class="font-mono not-italic">${a.signature}</address>`);
  if (text) body.push(`<p class="leading-normal">${text}</p>`);
  const hasFooter = a.category || a.date || a.tags?.length;
  if (hasFooter) {
    const tax = a.tags?.length
      ? `<div class="flex grow flex-wrap gap-2">${a.tags.map((t) => chip({ label: t, href: "#" })).join("")}</div>`
      : `<div class="grow"><a href="#" class="link link-hover text-base font-semibold uppercase text-base-content/70">${a.category}</a></div>`;
    body.push(`<footer class="mt-auto flex flex-wrap items-end justify-end gap-4 pt-4 text-base-content/70">
      ${tax}${a.date ? `\n      <time class="text-sm">${a.date}</time>` : ""}
    </footer>`);
  }
  if (a.actions) body.push(`<div class="card-actions mt-4 border-t border-base-content/20 pt-4" role="group" aria-label="Link correlati:">${a.actions}</div>`);
  return `<article class="${cls}">
  ${figure}
  <div class="card-body gap-2 p-4">
    ${body.join("\n    ")}
  </div>
</article>`;
}

/** Profile card: avatar + name + role, with an optional description list. */
export function profileCard(name = "Nome Personale", role = "Ruolo nell'organizzazione", initials = "NP"): string {
  return `<article class="card card-border border-base-content/20 bg-base-100 shadow-[0_4px_4px_rgb(0_0_0/0.05)]">
  <div class="card-body gap-4 p-4">
    <div class="flex items-center gap-4">
      <div class="avatar avatar-placeholder"><div class="size-20 rounded-full bg-primary text-primary-content text-2xl font-bold">${initials}</div></div>
      <div>
        <h3 class="text-2xl font-bold leading-tight"><a href="#" class="link link-primary underline-offset-2">${name}</a></h3>
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
  return `<article class="card card-border border-base-content/20 bg-base-100 shadow-[0_4px_4px_rgb(0_0_0/0.05)]">
  <div class="card-body items-center gap-4 p-6 text-center lg:p-10">
    ${icon("it-chart-line", "size-16 text-secondary")}
    <h3 class="text-2xl font-bold leading-tight"><a href="#" class="link link-primary underline-offset-2">Titolo del contenuto</a></h3>
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
  daisy: ["card", "card-border", "card-body", "card-title", "card-actions", "md:card-side", "avatar"],
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
          actions: `<a href="#" class="link link-primary inline-flex items-center gap-2 font-semibold">Leggi di più ${icon("it-arrow-right", "size-5")}</a>`,
        }),
      ]),
    },
  ],
};
