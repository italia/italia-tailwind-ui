import { icon } from "../icons";
import { cx, type ComponentDoc } from "../types";
import { buttonClass, type ButtonVariant } from "./button";

export type PopoverPlacement = "top" | "bottom" | "left" | "right";

export interface PopoverArgs {
  id?: string;
  title?: string;
  /** HTML body; can hold links and buttons. */
  content?: string;
  placement?: PopoverPlacement;
  triggerLabel?: string;
  triggerVariant?: ButtonVariant;
  /** Close button in the header. */
  closeButton?: boolean;
  /** Custom trigger HTML: a <button> the recipe wires with popovertarget. */
  trigger?: string;
}

// daisyUI's dropdown turns placement classes into position-area values
// when the popover has an anchor. Literal class maps for Tailwind.
const placements: Record<PopoverPlacement, string> = {
  bottom: "dropdown-bottom dropdown-center mt-2",
  top: "dropdown-top dropdown-center mb-2",
  left: "dropdown-left dropdown-center me-2",
  right: "dropdown-right dropdown-center ms-2",
};

let counter = 0;

/**
 * A click popover: the native popover API opens and light-dismisses it (Esc,
 * click outside), CSS anchor positioning places it next to its trigger.
 */
export function popover(a: PopoverArgs = {}): string {
  const {
    title = "Titolo del popover",
    content = "Il contenuto del popover: testo breve, eventualmente con un <a href=\"#\" class=\"link link-primary font-semibold\">link</a>.",
    placement = "bottom",
    triggerLabel = "Apri popover",
  } = a;
  const id = a.id ?? `popover-${++counter}`;
  const anchor = `--${id}`;
  const wire = ` popovertarget="${id}" style="anchor-name:${anchor}"`;
  const trigger = a.trigger
    ? a.trigger.replace(/^<button\b/, `<button${wire}`)
    : `<button type="button" class="${cx(buttonClass({ variant: a.triggerVariant ?? "primary" }), "gap-2")}"${wire}><span>${triggerLabel}</span></button>`;
  const close = a.closeButton
    ? `<button type="button" class="btn btn-ghost btn-xs btn-square -me-1 text-base-content/70" popovertarget="${id}" popovertargetaction="hide" aria-label="Chiudi">${icon("it-close", "size-5")}</button>`
    : "";
  const body = content.trimStart().startsWith("<") ? content : `<p>${content}</p>`;
  return `${trigger}
<div id="${id}" popover role="dialog" class="${cx(
    "dropdown w-72 max-w-[calc(100vw-2rem)] rounded-sm border border-base-content/15 bg-base-100 p-0 text-base-content shadow-[0_8px_24px_rgb(0_0_0/0.15)]",
    placements[placement],
  )}" style="position-anchor:${anchor}" aria-labelledby="${id}-title">
  <div class="flex items-center justify-between gap-2 border-b border-base-content/15 px-4 py-2">
    <p id="${id}-title" class="font-semibold">${title}</p>${close}
  </div>
  <div class="px-4 py-3 text-sm leading-relaxed">${body}</div>
</div>`;
}

const row = (items: string[], cls = "py-24") =>
  `<div class="flex flex-wrap items-center justify-center gap-4 ${cls}">\n${items.join("\n")}\n</div>`;

export const doc: ComponentDoc = {
  slug: "popover",
  name: "Popover",
  replaces: "<it-popover>",
  summary:
    "Un riquadro con titolo e contenuto che si apre al clic accanto al suo pulsante: popover API nativa più l'ancoraggio CSS che daisyUI dropdown già usa.",
  daisy: ["dropdown", "dropdown-top", "dropdown-bottom", "dropdown-left", "dropdown-right", "dropdown-center", "btn"],
  cssOnly:
    "popovertarget apre e chiude, Esc e il clic fuori chiudono (light dismiss), il focus torna al pulsante: nessuno script. Il posizionamento usa anchor-name/position-anchor. I browser senza ancoraggio CSS mostrano il riquadro al centro della finestra. L'apertura al passaggio del mouse (interestfor) è ancora sperimentale e non è inclusa: per un testo breve al passaggio del mouse usa Tooltip.",
  examples: [
    { id: "base", title: "Esempio base", html: row([popover()]) },
    {
      id: "posizione",
      title: "Posizionamento",
      html: row([
        popover({ placement: "top", triggerLabel: "In alto", title: "Popover in alto" }),
        popover({ placement: "bottom", triggerLabel: "In basso", title: "Popover in basso" }),
        popover({ placement: "left", triggerLabel: "A sinistra", title: "Popover a sinistra" }),
        popover({ placement: "right", triggerLabel: "A destra", title: "Popover a destra" }),
      ], "py-40"),
    },
    {
      id: "chiusura",
      title: "Con pulsante di chiusura",
      html: row([
        popover({
          closeButton: true,
          title: "Hai bisogno di aiuto?",
          content: `<p class="mb-2">Chiama il numero verde 800 123 456 dal lunedì al venerdì, 9–17.</p><a href="#" class="link link-primary font-semibold">Scrivi all'assistenza</a>`,
          triggerLabel: "Assistenza",
          triggerVariant: "secondary",
        }),
      ]),
    },
    {
      id: "icona",
      title: "Su un pulsante icona",
      description: "Il popover spiega un campo senza occupare spazio nel modulo.",
      html: row([
        `<span class="font-semibold">Codice IUV</span>`,
        popover({
          title: "Che cos'è il codice IUV",
          content: "L'Identificativo Univoco di Versamento è il codice di 18 cifre stampato sull'avviso di pagamento pagoPA.",
          placement: "right",
          trigger: `<button type="button" class="btn btn-circle btn-ghost btn-sm text-primary" aria-label="Informazioni sul codice IUV">${icon("it-help-circle", "size-6")}</button>`,
        }),
      ], "justify-start py-16"),
    },
  ],
};
