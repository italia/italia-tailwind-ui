import { cx, type ComponentDoc } from "../types";

export type RatingSize = "sm" | "md" | "lg";

export interface RatingArgs {
  name?: string;
  /** Legend of the group (interactive) or prefix of the label (read-only). */
  legend?: string;
  legendHidden?: boolean;
  /** Current value; 0 = none. Halves allowed with `half`. */
  value?: number;
  max?: number;
  size?: RatingSize;
  /** Shows the value without inputs. */
  readonly?: boolean;
  /** Half-star steps. */
  half?: boolean;
  disabled?: boolean;
}

// Literal class maps: Tailwind only sees classes written out in full.
const sizes: Record<RatingSize, string> = { sm: "rating-sm", md: "rating-md", lg: "rating-lg" };

const stars = (n: number) => (n === 1 ? "1 stella" : `${String(n).replace(".", ",")} stelle`);
let counter = 0;

export function rating(a: RatingArgs = {}): string {
  const { legend = "Valuta il servizio", value = 0, max = 5, size = "md" } = a;
  const step = a.half ? 0.5 : 1;
  const steps = Array.from({ length: max / step }, (_, i) => (i + 1) * step);
  const star = (v: number) =>
    cx("mask", a.half ? (v % 1 ? "mask-star-2 mask-half-1" : "mask-star-2 mask-half-2") : "mask-star-2");
  const cls = cx("rating ita-rating", sizes[size], a.half && "rating-half");

  if (a.readonly) {
    // role="img" + a label: the stars are one picture of the value.
    const items = steps.map((v) => `<span class="${star(v)}"${v === value ? ` aria-current="true"` : ""}></span>`).join("");
    return `<div class="${cls}" role="img" aria-label="${legend}: ${stars(value)} su ${max}">${items}</div>`;
  }

  const name = a.name ?? `rating-${++counter}`;
  const inputs = steps
    .map(
      (v) =>
        `<input type="radio" name="${name}" value="${v}" class="${star(v)}" aria-label="${stars(v)} su ${max}"${v === value ? " checked" : ""}${a.disabled ? " disabled" : ""}>`,
    )
    .join("\n    ");
  return `<fieldset class="ita-rating-group"${a.disabled ? " disabled" : ""}>
  <legend${a.legendHidden ? ` class="sr-only"` : ""}>${legend}</legend>
  <div class="${cls}">
    <input type="radio" name="${name}" value="0" class="rating-hidden" aria-label="Nessuna valutazione"${value ? "" : " checked"}${a.disabled ? " disabled" : ""}>
    ${inputs}
  </div>
</fieldset>`;
}

const row = (items: string[]) => `<div class="flex flex-wrap items-end gap-10">\n${items.join("\n")}\n</div>`;

export const doc: ComponentDoc = {
  slug: "rating",
  name: "Rating",
  replaces: "<it-rating>",
  summary:
    "Valutazione a stelle nel colore primario: un gruppo di radio daisyUI rating per votare, o una sola immagine etichettata per mostrare un voto.",
  classes: ["ita-rating", "ita-rating-group"],
  daisy: ["rating", "rating-half", "rating-hidden", "rating-sm", "rating-lg", "mask", "mask-star-2", "mask-half-1", "mask-half-2", "fieldset"],
  cssOnly:
    "Sono radio button: frecce per cambiare voto, valore inviato col form. Il primo radio nascosto (rating-hidden) vale zero e permette di non votare. In sola lettura le stelle sono un'unica immagine con role=img e un'etichetta che dice il voto.",
  examples: [
    { id: "base", title: "Esempio base", html: rating({ value: 3 }) },
    { id: "sola-lettura", title: "Sola lettura", html: row([rating({ readonly: true, value: 4, legend: "Valutazione media" }), rating({ readonly: true, value: 2, legend: "Valutazione", size: "sm" })]) },
    { id: "mezze-stelle", title: "Mezze stelle", html: row([rating({ half: true, value: 3.5, legend: "Valuta con mezze stelle" }), rating({ half: true, readonly: true, value: 4.5, legend: "Media", size: "lg" })]) },
    {
      id: "dimensioni",
      title: "Dimensioni",
      html: row([rating({ size: "sm", value: 2, legend: "Piccolo" }), rating({ value: 3, legend: "Medio" }), rating({ size: "lg", value: 4, legend: "Grande" })]),
    },
    { id: "disabilitato", title: "Disabilitato", html: rating({ value: 3, disabled: true, legend: "Valutazione chiusa" }) },
  ],
};
