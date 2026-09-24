import { icon } from "../icons";
import { cx, type ComponentDoc } from "../types";

export interface BackToTopArgs {
  label?: string;
  /** 56px instead of 40px. */
  large?: boolean;
  /** @deprecated Put the button inside an it-surface-primary container instead. */
  inverse?: boolean;
  /** Shadow under the button. */
  shadow?: boolean;
  /**
   * "fixed" pins it to the bottom-right of the viewport and reveals it once
   * the page has scrolled; "static" shows it in place, for docs.
   */
  position?: "fixed" | "static";
}

export function backToTop(a: BackToTopArgs = {}): string {
  const { label = "Torna su", position = "fixed" } = a;
  const cls = cx(
    "btn btn-circle border-0",
    a.large ? "size-14" : "size-10",
    a.inverse ? "bg-base-100 text-primary hover:bg-base-200" : "btn-primary",
    a.shadow && "shadow-lg",
    position === "fixed" && (a.large ? "fixed end-8 bottom-8 z-40 it-scroll-reveal" : "fixed end-4 bottom-4 z-40 it-scroll-reveal"),
  );
  return `<a href="#top" class="${cls}" aria-label="${label}">${icon("it-arrow-up", a.large ? "size-7" : "size-5")}</a>`;
}

const row = (items: string[]) => `<div class="flex flex-wrap items-center gap-6">\n  ${items.join("\n  ")}\n</div>`;

export const doc: ComponentDoc = {
  slug: "back-to-top",
  name: "Back to top",
  replaces: "<it-back-to-top>",
  summary:
    "Il pulsante rotondo che riporta in cima alla pagina: un link a #top, fisso in basso a destra, che compare dopo lo scorrimento.",
  daisy: ["btn", "btn-circle", "btn-primary"],
  extensions: ["it-scroll-reveal"],
  cssOnly:
    "href=\"#top\" porta in cima al documento anche senza un elemento con quell'id. La comparsa è una scroll-driven animation (it-scroll-reveal) legata allo scorrimento della pagina. I browser che non supportano animation-timeline mostrano il pulsante sempre. Aggiungi scroll-smooth su <html> per lo scorrimento fluido.",
  examples: [
    {
      id: "varianti",
      title: "Varianti",
      description: "Mostrati sul posto; nella pagina reale sono fissi in basso a destra. La seconda riga è su sfondo primario (it-surface-primary).",
      html: `${row([
        backToTop({ position: "static" }),
        backToTop({ position: "static", large: true }),
        backToTop({ position: "static", shadow: true }),
      ])}
<div class="it-surface-primary mt-6 rounded-box p-6">${row([backToTop({ position: "static" }), backToTop({ position: "static", large: true })])}</div>`,
    },
    {
      id: "fisso",
      title: "Fisso nella pagina",
      description: "Questo pulsante è davvero fisso: scorri la pagina e comparirà in basso a destra.",
      html: `<p class="text-base-content/75">Scorri la pagina verso il basso.</p>\n${backToTop({ shadow: true })}`,
    },
  ],
};
