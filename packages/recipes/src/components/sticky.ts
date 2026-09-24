import { cx, type ComponentDoc } from "../types";
import { button } from "./button";

export type StickyEdge = "top" | "bottom";

export interface StickyArgs {
  /** HTML that sticks. */
  content?: string;
  edge?: StickyEdge;
  /** Distance from the edge, e.g. under a fixed header. */
  offset?: "none" | "sm" | "md" | "lg";
  /** Shadow and solid background only while stuck (scroll-state query). */
  stuckShadow?: boolean;
}

// Literal class maps: Tailwind only sees classes written out in full.
const offsets: Record<NonNullable<StickyArgs["offset"]>, string> = {
  none: "",
  sm: "ita-sticky-offset-sm",
  md: "ita-sticky-offset-md",
  lg: "ita-sticky-offset-lg",
};

export function sticky(a: StickyArgs = {}): string {
  const { edge = "top", offset = "none", content = `<p class="font-semibold">Elemento fisso</p>` } = a;
  // The shadow styles the child: a scroll-state container cannot style itself.
  const cls = cx("ita-sticky", edge === "bottom" && "ita-sticky-bottom", offsets[offset], a.stuckShadow && "ita-sticky-shadow");
  return `<div class="${cls}">
  <div>${content}</div>
</div>`;
}

const filler = (n: number) =>
  Array.from({ length: n }, (_, i) => `<p class="mb-4">Paragrafo ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`).join("\n    ");
const box = (inner: string) => `<div class="h-80 overflow-y-auto rounded-box border border-base-content/15">\n  ${inner}\n</div>`;

export const doc: ComponentDoc = {
  slug: "sticky",
  name: "Sticky",
  replaces: "<it-sticky>",
  summary:
    "Elementi che restano attaccati al bordo durante lo scorrimento: position: sticky di Tailwind, con ombra solo quando l'elemento è davvero bloccato grazie alle scroll-state container query.",
  classes: ["ita-sticky", "ita-sticky-bottom", "ita-sticky-offset-sm", "ita-sticky-offset-md", "ita-sticky-offset-lg", "ita-sticky-shadow"],
  daisy: [],
  cssOnly:
    "<it-sticky> osserva lo scorrimento in JavaScript per aggiungere la classe is-sticky. Qui lo fa container-type: scroll-state con @container scroll-state(stuck: top) (Chrome 133+): l'ombra compare solo a elemento bloccato. Negli altri browser l'elemento resta sticky, senza ombra. Ricorda che sticky smette di funzionare se un antenato ha overflow: hidden.",
  examples: [
    {
      id: "barra",
      title: "Barra in alto con ombra",
      description: "Scorri il riquadro: la barra si blocca e compare l'ombra.",
      html: box(`<div class="p-4">
    <p class="mb-4">Contenuto sopra la barra.</p>
  </div>
  ${sticky({
    stuckShadow: true,
    content: `<div class="flex items-center justify-between gap-4 border-b border-base-content/15 px-4 py-3"><span class="font-semibold">Riepilogo della domanda</span>${button({ label: "Invia", size: "xs" })}</div>`,
  })}
  <div class="p-4">
    ${filler(8)}
  </div>`),
    },
    {
      id: "barra-azioni",
      title: "Barra delle azioni in basso",
      html: box(`<div class="p-4">
    ${filler(8)}
  </div>
  ${sticky({
    edge: "bottom",
    stuckShadow: true,
    content: `<div class="flex justify-end gap-3 border-t border-base-content/15 px-4 py-3">${button({ label: "Annulla", outline: true, size: "xs" })}${button({ label: "Salva", size: "xs" })}</div>`,
  })}`),
    },
    {
      id: "laterale",
      title: "Colonna laterale",
      html: box(`<div class="grid grid-cols-[10rem_1fr] gap-6 p-4">
    <div class="ita-sticky ita-sticky-offset-md self-start">
      <div class="rounded-box bg-base-200 p-4 text-sm font-semibold">Resto sempre visibile</div>
    </div>
    <div>
    ${filler(10)}
    </div>
  </div>`),
    },
  ],
};
