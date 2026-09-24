import { cx, type ComponentDoc } from "../types";
import { button } from "./button";
import { card } from "./card";

export type SectionVariant = "default" | "muted" | "primary" | "emphasis";

export interface SectionArgs {
  title?: string;
  /** Short text under the title. */
  lead?: string;
  /** HTML body, inside the content container. */
  content?: string;
  variant?: SectionVariant;
  /** Background image URL; a dark overlay keeps the text readable. */
  image?: string;
  /** More vertical padding. */
  large?: boolean;
  id?: string;
}

// Literal class maps: Tailwind only sees classes written out in full.
const surfaces: Record<SectionVariant, string> = {
  default: "bg-base-100 text-base-content",
  muted: "bg-base-200 text-base-content",
  primary: "bg-primary text-primary-content",
  emphasis: "bg-accent text-accent-content",
};
const leadTone: Record<SectionVariant, string> = {
  default: "text-base-content/80",
  muted: "text-base-content/80",
  primary: "text-primary-content/90",
  emphasis: "text-accent-content/90",
};

let counter = 0;

export function section(a: SectionArgs = {}): string {
  const { title = "Titolo della sezione", variant = "default" } = a;
  const id = a.id ?? `section-${++counter}`;
  const tone = a.image ? "primary" : variant;
  const cls = cx(
    "relative isolate",
    a.large ? "py-16 lg:py-24" : "py-12 lg:py-16",
    a.image ? "bg-cover bg-center text-neutral-content" : surfaces[variant],
  );
  const overlay = a.image ? `\n  <div class="absolute inset-0 -z-10 bg-neutral/70" aria-hidden="true"></div>` : "";
  return `<section id="${id}" aria-labelledby="${id}-title" class="${cls}"${a.image ? ` style="background-image:url('${a.image}')"` : ""}>${overlay}
  <div class="mx-auto max-w-6xl px-4 sm:px-8">
    <h2 id="${id}-title" class="mb-2 text-3xl font-bold sm:text-4xl">${title}</h2>${
      a.lead ? `\n    <p class="${cx("mb-8 max-w-3xl text-lg", a.image ? "text-neutral-content/90" : leadTone[tone])}">${a.lead}</p>` : ""
    }${a.content ? `\n    ${a.content}` : ""}
  </div>
</section>`;
}

const cards = `<div class="grid gap-6 md:grid-cols-3">
      ${[1, 2, 3].map((n) => card({ title: `Servizio ${n}`, text: "Breve descrizione del servizio, di una o due righe.", href: "#" })).join("\n      ")}
    </div>`;

export const doc: ComponentDoc = {
  slug: "section",
  name: "Section",
  replaces: "<it-section>",
  summary:
    "Fasce di pagina a tutta larghezza con titolo, testo introduttivo e un contenitore centrato: sfondo neutro, grigio, primario, enfasi o immagine.",
  daisy: [],
  cssOnly:
    "Solo utility Tailwind sui token del tema: bg-base-200 per «muted», bg-primary, bg-accent per l'enfasi. Le card dentro una fascia colorata restano chiare perché usano bg-base-100.",
  examples: [
    { id: "base", title: "Esempio base", fullBleed: true, html: section({ lead: "Un testo introduttivo che spiega il contenuto della sezione.", content: cards }) },
    { id: "grigia", title: "Sfondo grigio", fullBleed: true, html: section({ variant: "muted", title: "In evidenza", lead: "Le notizie più lette della settimana.", content: cards }) },
    {
      id: "primaria",
      title: "Sfondo primario",
      fullBleed: true,
      html: section({
        variant: "primary",
        title: "Iscriviti alla newsletter",
        lead: "Ricevi ogni mese gli aggiornamenti sui servizi del Comune.",
        content: `<a href="#" class="btn border-0 bg-base-100 font-semibold text-primary hover:bg-base-200">Iscriviti</a>`,
      }),
    },
    {
      id: "enfasi",
      title: "Sfondo di enfasi",
      fullBleed: true,
      html: section({ variant: "emphasis", title: "Numeri utili", lead: "Pronto intervento, uffici e servizi attivi 24 ore su 24.", large: true, content: cards }),
    },
    {
      id: "immagine",
      title: "Con immagine",
      fullBleed: true,
      html: section({
        image: "https://picsum.photos/id/1040/1600/800",
        title: "Scopri il territorio",
        lead: "Itinerari, musei ed eventi in città.",
        large: true,
        content: button({ label: "Esplora", href: "#" }),
      }),
    },
  ],
};
