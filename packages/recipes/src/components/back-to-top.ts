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
    "ita-back-to-top",
    a.large && "ita-back-to-top-lg",
    a.inverse && "ita-back-to-top-inverse",
    a.shadow && "ita-back-to-top-shadow",
    position === "fixed" && "ita-back-to-top-fixed it-scroll-reveal",
  );
  return `<a href="#top" class="${cls}" aria-label="${label}">${icon("it-arrow-up", "")}</a>`;
}

const row = (items: string[]) => `<div class="flex flex-wrap items-center gap-6">\n  ${items.join("\n  ")}\n</div>`;

export const doc: ComponentDoc = {
  slug: "back-to-top",
  name: "Back to top",
  replaces: "<it-back-to-top>",
  summary:
    "Il pulsante rotondo che riporta in cima alla pagina: un link a #top, fisso in basso a destra, che compare dopo lo scorrimento.",
  classes: ["ita-back-to-top", "ita-back-to-top-lg", "ita-back-to-top-shadow", "ita-back-to-top-fixed"],
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
