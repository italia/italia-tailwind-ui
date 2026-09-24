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
  default: "",
  muted: "ita-section-muted",
  primary: "ita-section-primary",
  emphasis: "ita-section-emphasis",
};

let counter = 0;

export function section(a: SectionArgs = {}): string {
  const { title = "Titolo della sezione", variant = "default" } = a;
  const id = a.id ?? `section-${++counter}`;
  const cls = cx("ita-section", a.image ? "ita-section-image" : surfaces[variant], a.large && "ita-section-lg");
  return `<section id="${id}" aria-labelledby="${id}-title" class="${cls}"${a.image ? ` style="background-image:url('${a.image}')"` : ""}>
  <div class="ita-section-container">
    <h2 id="${id}-title" class="ita-section-title">${title}</h2>${a.lead ? `\n    <p class="ita-section-lead">${a.lead}</p>` : ""}${
      a.content ? `\n    ${a.content}` : ""
    }
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
  classes: ["ita-section", "ita-section-muted", "ita-section-primary", "ita-section-emphasis", "ita-section-image", "ita-section-lg", "ita-section-container", "ita-section-title", "ita-section-lead"],
  daisy: [],
  cssOnly:
    "Sui token del tema: base-200 per «muted», primary, accent per l'enfasi; il velo sull'immagine è un ::before. Le card dentro una fascia colorata restano chiare perché usano bg-base-100.",
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
        content: `<a href="#" class="ita-btn ita-btn-inverse">Iscriviti</a>`,
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
