import { icon, type IconName } from "../icons";
import { cx, type ComponentDoc } from "../types";
import { button, type ButtonVariant } from "./button";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";
export type TooltipColor = "neutral" | "primary" | "secondary" | "success" | "warning" | "danger" | "info";

export interface TooltipArgs {
  text?: string;
  placement?: TooltipPlacement;
  color?: TooltipColor;
  /** Pinned open, for documenting the look. */
  open?: boolean;
  /** The element the tooltip describes; defaults to a primary button. */
  trigger?: string;
}

// Literal class maps: Tailwind only sees classes written out in full.
const placements: Record<TooltipPlacement, string> = {
  top: "tooltip-top",
  bottom: "tooltip-bottom",
  left: "tooltip-left",
  right: "tooltip-right",
};
const colors: Record<TooltipColor, string> = {
  neutral: "",
  primary: "tooltip-primary",
  secondary: "tooltip-secondary",
  success: "tooltip-success",
  warning: "tooltip-warning",
  danger: "tooltip-error",
  info: "tooltip-info",
};
// The described variant paints the bubble itself, so it needs the token pair.
const bubble: Record<TooltipColor, string> = {
  neutral: "bg-neutral text-neutral-content",
  primary: "bg-primary text-primary-content",
  secondary: "bg-secondary text-secondary-content",
  success: "bg-success text-success-content",
  warning: "bg-warning text-warning-content",
  danger: "bg-error text-error-content",
  info: "bg-info text-info-content",
};
const arrowColor: Record<TooltipColor, string> = {
  neutral: "bg-neutral",
  primary: "bg-primary",
  secondary: "bg-secondary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-error",
  info: "bg-info",
};

/**
 * daisyUI's tooltip: the bubble is a ::before on the wrapper, fed by data-tip.
 * Quick to write, but a pseudo-element is not in the accessibility tree — for
 * text a screen reader must announce, use tooltipDescribed().
 */
export function tooltip(a: TooltipArgs = {}): string {
  const { text = "Testo del tooltip", placement = "top", color = "neutral" } = a;
  const cls = cx("tooltip max-w-[32em]", placements[placement], colors[color], a.open && "tooltip-open");
  return `<span class="${cls}" data-tip="${text}">${a.trigger ?? button({ label: "Mostra tooltip" })}</span>`;
}

let counter = 0;

const arrowPosition: Record<TooltipPlacement, string> = {
  top: "-bottom-1 left-1/2 -translate-x-1/2",
  bottom: "-top-1 left-1/2 -translate-x-1/2",
  left: "-right-1 top-1/2 -translate-y-1/2",
  right: "-left-1 top-1/2 -translate-y-1/2",
};
const panelPosition: Record<TooltipPlacement, string> = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
  left: "right-full top-1/2 me-2 -translate-y-1/2",
  right: "left-full top-1/2 ms-2 -translate-y-1/2",
};

/**
 * The accessible variant: a real element with role="tooltip", tied to the
 * trigger with aria-describedby, shown on hover and on keyboard focus.
 */
export function tooltipDescribed(a: TooltipArgs = {}): string {
  const { text = "Testo del tooltip", placement = "top", color = "neutral" } = a;
  const id = `tooltip-${++counter}`;
  const trigger = (a.trigger ?? button({ label: "Mostra tooltip" })).replace(
    /^<(button|a)\s/,
    `<$1 aria-describedby="${id}" `,
  );
  return `<span class="group relative inline-block">
  ${trigger}
  <span role="tooltip" id="${id}" class="${cx(
    "pointer-events-none absolute z-20 w-max max-w-[32em] rounded-sm px-2 py-1 text-sm opacity-0 transition-opacity",
    "group-hover:opacity-100 group-focus-within:opacity-100",
    bubble[color],
    panelPosition[placement],
  )}">${text}<span class="${cx("absolute size-2 rotate-45", arrowColor[color], arrowPosition[placement])}" aria-hidden="true"></span></span>
</span>`;
}

const row = (items: string[], pad = "py-10") =>
  `<div class="flex flex-wrap items-center justify-center gap-6 ${pad}">\n  ${items.join("\n  ")}\n</div>`;

export const doc: ComponentDoc = {
  slug: "tooltip",
  name: "Tooltip",
  replaces: "<it-tooltip>",
  summary:
    "Suggerimenti al passaggio del mouse e al focus da tastiera. daisyUI tooltip per il caso rapido, oppure un elemento reale con role=tooltip e aria-describedby quando il testo deve essere annunciato.",
  daisy: ["tooltip", "tooltip-top", "tooltip-bottom", "tooltip-left", "tooltip-right", "tooltip-open", "tooltip-primary"],
  cssOnly:
    "Niente Floating UI: le quattro posizioni sono quelle di daisyUI, senza flip automatico vicino ai bordi. Il tooltip di daisyUI è uno pseudo-elemento e non entra nell'albero di accessibilità: per un testo che deve essere letto usa la variante con aria-describedby, che compare anche con :focus-visible.",
  examples: [
    {
      id: "base",
      title: "Esempio base",
      html: row([tooltip(), tooltip({ trigger: `<button type="button" class="btn btn-outline btn-primary border-2 font-semibold">Su un pulsante outline</button>` })]),
    },
    {
      id: "posizione",
      title: "Posizionamento",
      html: row([
        tooltip({ placement: "top", text: "Tooltip in alto", trigger: button({ label: "Top" }) }),
        tooltip({ placement: "bottom", text: "Tooltip in basso", trigger: button({ label: "Bottom" }) }),
        tooltip({ placement: "left", text: "Tooltip a sinistra", trigger: button({ label: "Left" }) }),
        tooltip({ placement: "right", text: "Tooltip a destra", trigger: button({ label: "Right" }) }),
      ]),
    },
    {
      id: "aperto",
      title: "Sempre visibile",
      description: "tooltip-open lo tiene aperto, utile per documentare l'aspetto.",
      html: row([
        tooltip({ open: true, text: "Tooltip sempre visibile" }),
        tooltip({ open: true, color: "primary", text: "Colore primario", trigger: button({ label: "Primary" }) }),
        tooltip({ open: true, color: "danger", text: "Colore danger", trigger: button({ label: "Danger", variant: "danger" as ButtonVariant }) }),
      ], "py-16"),
    },
    {
      id: "accessibile",
      title: "Variante accessibile",
      description: "role=tooltip più aria-describedby: il testo è nell'albero di accessibilità e compare anche col focus da tastiera (prova con Tab).",
      html: row([
        tooltipDescribed({ text: "Testo del tooltip annunciato dallo screen reader" }),
        tooltipDescribed({
          placement: "bottom",
          color: "primary",
          text: "Anche in basso",
          trigger: `<button type="button" class="btn btn-circle btn-outline btn-primary border-2" aria-label="Informazioni">${icon("it-info-circle", "size-5")}</button>`,
        }),
      ], "py-16"),
    },
    {
      id: "su-link",
      title: "Su link e testo",
      html: row([
        tooltip({
          text: "Testo del tooltip",
          trigger: `<a href="#" class="link link-primary font-semibold">Un link con tooltip</a>`,
        }),
        tooltipDescribed({
          text: "Spiegazione dell'acronimo",
          trigger: `<button type="button" class="link link-primary font-semibold">Acronimo</button>`,
        }),
      ]),
    },
  ],
};
