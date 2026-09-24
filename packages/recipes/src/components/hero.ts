import { cx, type ComponentDoc } from "../types";

/** Overlay on the image. "dark" is the deprecated name of "neutral". */
export type HeroOverlay = "none" | "neutral" | "primary" | "filter" | "dark";
type Overlay = Exclude<HeroOverlay, "dark">;

export interface HeroArgs {
  /** Occhiello: the small uppercase label above the title. */
  category?: string;
  title?: string;
  text?: string;
  image?: string;
  imageAlt?: string;
  /** Centre the text block. */
  center?: boolean;
  /** Overlay on top of the background image. Defaults to "neutral" when there are both an image and text. */
  overlay?: HeroOverlay;
  /** Negative bottom margin, so the block after the hero overlaps it. */
  overlap?: boolean;
  /** 300px from lg up instead of 400px. */
  small?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
  headingLevel?: 1 | 2 | 3;
  /** Accessible name for a hero with no heading (image only). */
  ariaLabel?: string;
}

// Literal class maps: Tailwind only sees classes written out in full.
const overlayClass: Record<Overlay, string> = {
  none: "",
  neutral: "ita-hero-neutral",
  primary: "ita-hero-primary",
  filter: "ita-hero-filter",
};

let counter = 0;

export function hero(a: HeroArgs = {}): string {
  const {
    title = "Titolo della sezione",
    headingLevel = 2,
    overlay: requested = a.image && (a.title !== "" || a.text) ? "neutral" : "none",
  } = a;
  const overlay: Overlay = requested === "dark" ? "neutral" : requested;
  const h = `h${headingLevel}`;
  const id = `hero-${++counter}-title`;
  const hasText = Boolean(a.category || title || a.text || a.ctaLabel);

  const section = cx("hero ita-hero", overlayClass[overlay], a.small && "ita-hero-sm", a.center && "ita-hero-center", a.overlap && "ita-hero-overlap");
  const img = a.image ? `\n  <img src="${a.image}" alt="${a.imageAlt ?? ""}">` : "";
  const veil = overlay === "neutral" || overlay === "primary" ? `\n  <div class="hero-overlay"></div>` : "";
  if (!hasText) {
    return `<section class="${section}" aria-label="${a.ariaLabel ?? "In evidenza"}">${img}${veil}\n</section>`;
  }

  const parts: string[] = [];
  if (a.category)
    parts.push(`<span class="ita-hero-kicker">${a.category}</span>`);
  if (title) parts.push(`<${h} id="${id}" class="ita-hero-title">${title}</${h}>`);
  if (a.text) parts.push(`<p class="ita-hero-text">${a.text}</p>`);
  if (a.ctaLabel)
    parts.push(`<div><a href="${a.ctaHref ?? "#"}" class="ita-btn ita-btn-xs ita-hero-cta">${a.ctaLabel}</a></div>`);

  const label = title ? ` aria-labelledby="${id}"` : ` aria-label="${a.ariaLabel ?? "In evidenza"}"`;
  return `<section class="${section}"${label}>${img}${veil}
  <div class="hero-content">
    <div>
      ${parts.join("\n      ")}
    </div>
  </div>
</section>`;
}

const lead =
  "Platea dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim cras. Dictum sit amet justo donec enim diam vulputate ut.";
const photo = "https://picsum.photos/seed/hero-italia/1600/700";
const base: HeroArgs = {
  category: "Titolo occhiello",
  title: "Titolo della sezione",
  text: lead,
  ctaLabel: "Azione primaria",
};

export const doc: ComponentDoc = {
  slug: "hero",
  name: "Hero",
  replaces: "<it-hero>",
  summary:
    "Blocco di apertura con immagine di sfondo, occhiello, titolo e azione. daisyUI hero e hero-overlay, con i colori presi dai token del tema.",
  classes: ["ita-hero", "ita-hero-neutral", "ita-hero-primary", "ita-hero-filter", "ita-hero-center", "ita-hero-sm", "ita-hero-overlap", "ita-hero-kicker", "ita-hero-title", "ita-hero-text", "ita-hero-cta"],
  daisy: ["hero", "hero-content", "hero-overlay", "btn"],
  cssOnly:
    "Nessuno script: lo slot background è un <img> nella stessa cella di griglia di .hero, l'overlay è un div hero-overlay colorato da ita-hero-neutral/-primary e il filtro (ita-hero-filter) è mix-blend-screen. Il nome accessibile arriva da aria-labelledby sul titolo (aria-label quando l'hero è solo immagine), non da ariaLabelledByElements.",
  examples: [
    {
      id: "immagine",
      fullBleed: true,
      title: "Con immagine",
      description: "Solo immagine: la sezione prende il nome accessibile da aria-label.",
      html: hero({ title: "", image: photo, imageAlt: "Veduta di montagna", ariaLabel: "In evidenza" }),
    },
    { id: "testuale", fullBleed: true, title: "Con contenuti testuali", html: hero(base) },
    { id: "centrato", fullBleed: true, title: "Con contenuti testuali centrati", html: hero({ ...base, center: true }) },
    {
      id: "testo-immagine",
      fullBleed: true,
      title: "Con testi ed immagine di sfondo",
      html: hero({ ...base, image: photo, imageAlt: "Veduta di montagna" }),
    },
    {
      id: "overlay-primario",
      fullBleed: true,
      title: "Con overlay di colore primario",
      html: hero({ ...base, image: photo, imageAlt: "Veduta di montagna", overlay: "primary" }),
    },
    {
      id: "overlay-filtro",
      fullBleed: true,
      title: "Con overlay e filtro di colore primario",
      description: "mix-blend-screen sull'immagine, sopra lo sfondo primary della sezione.",
      html: hero({ title: "", image: photo, imageAlt: "Veduta di montagna", overlay: "filter", ariaLabel: "In evidenza" }),
    },
    { id: "piccolo", fullBleed: true, title: "Dimensione ridotta", html: hero({ ...base, small: true, image: photo, imageAlt: "Veduta di montagna" }) },
    {
      id: "sovrapposto",
      fullBleed: true,
      title: "Con contenuti sovrapposti",
      description: "overlap aggiunge il margine negativo: il blocco successivo sale sopra l'hero.",
      html: `${hero({ ...base, image: photo, imageAlt: "Veduta di montagna", overlap: true })}
<div class="mx-auto max-w-[1320px] px-4 sm:px-6">
  <article class="card card-border border-base-content/20 bg-base-100 shadow-[0_8px_16px_rgb(0_0_0/0.1)]">
    <div class="card-body">
      <h3 class="card-title text-2xl font-bold">Titolo del contenuto</h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    </div>
  </article>
</div>`,
    },
  ],
};
