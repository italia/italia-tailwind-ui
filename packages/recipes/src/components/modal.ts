import { icon, type IconName } from "../icons";
import { cx, type ComponentDoc } from "../types";
import { button, buttonClass } from "./button";

export type ModalSize = "sm" | "default" | "lg" | "xl";
export type ModalPosition = "center" | "left" | "right";
export type ModalVariant = "default" | "alert" | "popconfirm" | "link-list";
/**
 * How the modal opens, all three without a line of author JavaScript:
 * - "command": <dialog> plus the native command/commandfor invoker attributes.
 *   Real modal semantics — focus trap, inert background, Esc. Needs Chrome 135+,
 *   Safari 26+, Firefox 141+.
 * - "target": the :target pseudo-class. Works everywhere, but writes the hash.
 * - "checkbox": daisyUI's modal-toggle. Works everywhere, leaves the URL alone.
 */
export type ModalTrigger = "command" | "target" | "checkbox";

export interface ModalArgs {
  id?: string;
  title?: string;
  /** Screen-reader-only description of the dialog's purpose. */
  description?: string;
  content?: string;
  triggerLabel?: string;
  size?: ModalSize;
  position?: ModalPosition;
  variant?: ModalVariant;
  /** Body scrolls, header and footer stay put. */
  scrollable?: boolean;
  /** No backdrop dismiss. */
  staticBackdrop?: boolean;
  hideCloseButton?: boolean;
  icon?: IconName;
  iconColor?: "primary" | "warning" | "danger" | "success";
  /** Raw HTML for the footer; defaults to Annulla + Conferma. */
  footer?: string;
  trigger?: ModalTrigger;
  closeLabel?: string;
}

// Literal class maps: Tailwind only sees classes written out in full.
const sizes: Record<ModalSize, string> = {
  sm: "ita-modal-sm",
  default: "",
  lg: "ita-modal-lg",
  xl: "ita-modal-xl",
};
const positions: Record<ModalPosition, string> = {
  center: "",
  left: "modal-start",
  right: "modal-end",
};
const iconColors: Record<NonNullable<ModalArgs["iconColor"]>, string> = {
  primary: "ita-modal-icon-primary",
  warning: "",
  danger: "ita-modal-icon-danger",
  success: "ita-modal-icon-success",
};

let counter = 0;

export function modal(a: ModalArgs = {}): string {
  const {
    title = "Titolo modale",
    content = "Testo che descrive lo scopo della modale e quali sono le azioni richieste all'utente.",
    triggerLabel = "Lancia la demo della modale",
    size = "default",
    position = "center",
    variant = "default",
    trigger = "command",
    closeLabel = "Chiudi finestra modale",
  } = a;
  const id = a.id ?? `modal-${++counter}`;
  const titleId = `${id}-title`;
  const descId = `${id}-desc`;
  const popconfirm = variant === "popconfirm";

  const x = icon("it-close-big", "");
  const closeButton =
    a.hideCloseButton || popconfirm
      ? ""
      : trigger === "command"
        ? `<button type="button" command="close" commandfor="${id}" class="ita-modal-close" aria-label="${closeLabel}">${x}</button>`
        : trigger === "target"
          ? `<a href="#" class="ita-modal-close" aria-label="${closeLabel}">${x}</a>`
          : `<label for="${id}" class="ita-modal-close" aria-label="${closeLabel}">${x}</label>`;

  const closeAttrs =
    trigger === "command"
      ? ` command="close" commandfor="${id}"`
      : trigger === "target"
        ? ""
        : "";
  const closeTag = (label: string, primary: boolean) => {
    const cls = buttonClass({ variant: "primary", outline: !primary });
    if (trigger === "command") return `<button type="button" class="${cls}"${closeAttrs}><span>${label}</span></button>`;
    if (trigger === "target") return `<a href="#" class="${cls}"><span>${label}</span></a>`;
    return `<label for="${id}" class="${cls}"><span>${label}</span></label>`;
  };

  const head =
    variant === "alert"
      ? `${a.icon ? `<div class="${cx("ita-modal-icon", iconColors[a.iconColor ?? "warning"])}">${icon(a.icon, "")}</div>` : ""}
      <h2 id="${titleId}" class="ita-modal-title">${title}</h2>`
      : popconfirm && !a.title
        ? ""
        : `<h2 id="${titleId}" class="ita-modal-title">${title}</h2>`;

  const body = `<div class="ita-modal-body">${content}</div>`;
  const footer = a.footer ?? `${closeTag("Annulla", false)}${closeTag("Conferma", true)}`;

  const inner = `<div class="modal-box">
      ${closeButton}
      ${head}
      ${body}
      <div class="modal-action">${footer}</div>
    </div>`;

  const labelled = head ? ` aria-labelledby="${titleId}"` : ` aria-label="${title}"`;
  const described = a.description ? ` aria-describedby="${descId}"` : "";
  const srDescription = a.description ? `\n    <p id="${descId}" class="sr-only">${a.description}</p>` : "";
  const modalCls = cx(
    "modal ita-modal",
    positions[position],
    sizes[size],
    variant === "alert" && "ita-modal-alert",
    popconfirm && "ita-modal-popconfirm",
    a.scrollable && "ita-modal-scroll",
  );

  if (trigger === "command") {
    const backdrop = a.staticBackdrop
      ? ""
      : `\n    <form method="dialog" class="modal-backdrop"><button>${closeLabel}</button></form>`;
    return `<button type="button" class="${buttonClass()}" command="show-modal" commandfor="${id}"><span>${triggerLabel}</span></button>
<dialog id="${id}" class="${modalCls}"${labelled}${described}>${srDescription}
    ${inner}${backdrop}
</dialog>`;
  }

  if (trigger === "target") {
    const backdrop = a.staticBackdrop ? "" : `\n    <a href="#" class="modal-backdrop" aria-label="${closeLabel}"></a>`;
    return `<a href="#${id}" class="${buttonClass()}"><span>${triggerLabel}</span></a>
<div id="${id}" class="${modalCls}" role="dialog"${labelled}${described}>${srDescription}
    ${inner}${backdrop}
</div>`;
  }

  const backdrop = a.staticBackdrop ? "" : `\n    <label for="${id}" class="modal-backdrop" aria-label="${closeLabel}"></label>`;
  return `<label for="${id}" class="${buttonClass()}"><span>${triggerLabel}</span></label>
<input type="checkbox" id="${id}" class="modal-toggle" aria-label="${triggerLabel}">
<div class="${modalCls}" role="dialog"${labelled}${described}>${srDescription}
    ${inner}${backdrop}
</div>`;
}

const row = (items: string[]) => `<div class="flex flex-wrap items-center gap-3">\n  ${items.join("\n  ")}\n</div>`;
const lorem =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export const doc: ComponentDoc = {
  slug: "modal",
  name: "Modal",
  replaces: "<it-modal>",
  summary:
    "Finestre modali su daisyUI modal. Tre aperture senza JavaScript d'autore: <dialog> con command/commandfor, :target e la checkbox modal-toggle.",
  classes: ["ita-modal", "ita-modal-sm", "ita-modal-lg", "ita-modal-xl", "ita-modal-alert", "ita-modal-popconfirm", "ita-modal-scroll", "ita-modal-title", "ita-modal-body", "ita-modal-icon", "ita-modal-icon-primary", "ita-modal-icon-danger", "ita-modal-icon-success", "ita-modal-close"],
  daisy: ["modal", "modal-box", "modal-action", "modal-backdrop", "modal-toggle", "modal-start", "modal-end", "btn"],
  cssOnly:
    "command/commandfor è HTML nativo (Chrome 135+, Safari 26+, Firefox 141+) e dà le vere semantiche di dialogo: focus trap, sfondo inerte, Esc. Dove serve più compatibilità, :target e modal-toggle funzionano ovunque ma non spostano il focus né rendono inerte la pagina: aggiungi tu il focus iniziale se ti serve.",
  examples: [
    {
      id: "apertura",
      title: "Tre modi di aprirla",
      description: "Stesso markup del corpo, tre inneschi diversi.",
      html: row([
        modal({ triggerLabel: "Con &lt;dialog&gt; e command", title: "Aperta con command" }),
        modal({ triggerLabel: "Con :target", title: "Aperta con :target", trigger: "target" }),
        modal({ triggerLabel: "Con checkbox", title: "Aperta con checkbox", trigger: "checkbox" }),
      ]),
    },
    {
      id: "chiusura",
      title: "Con e senza pulsante di chiusura",
      html: row([
        modal({ triggerLabel: "Lancia la demo della modale" }),
        modal({ triggerLabel: "Senza close button", hideCloseButton: true }),
      ]),
    },
    {
      id: "icona",
      title: "Con icona",
      html: modal({
        variant: "alert",
        icon: "it-warning-circle",
        iconColor: "warning",
        title: "Questo è un messaggio di notifica",
        content: lorem,
        footer: button({ label: "Conferma" }),
      }),
    },
    {
      id: "footer",
      title: "Con footer personalizzato",
      html: modal({
        title: "Con footer personalizzato",
        content: lorem,
        footer: `<div class="flex w-full items-center justify-between gap-2">
        <a href="#" class="ita-link">Link di supporto</a>
        <div class="flex gap-2">${button({ label: "Annulla", outline: true })}${button({ label: "Conferma" })}</div>
      </div>`,
      }),
    },
    {
      id: "link-list",
      title: "Con link list",
      html: modal({
        variant: "link-list",
        title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        content: `<ul class="menu w-full gap-0 p-0">
        <li><a href="#" class="rounded-sm px-4 py-3 text-primary">Link lista 1</a></li>
        <li><a href="#" class="rounded-sm px-4 py-3 text-primary">Link lista 2</a></li>
        <li><a href="#" class="rounded-sm px-4 py-3 text-primary">Link lista 3</a></li>
      </ul>`,
        footer: button({ label: "Conferma" }),
      }),
    },
    {
      id: "popconfirm",
      title: "Popconfirm",
      html: row([
        modal({
          variant: "popconfirm",
          triggerLabel: "Popconfirm basico",
          content: "Breve messaggio di conferma inserito nella modale.",
          footer: `${button({ label: "Azione 1", outline: true, size: "xs" })}${button({ label: "Azione 2", size: "xs" })}`,
        }),
        modal({
          variant: "popconfirm",
          triggerLabel: "Popconfirm con header",
          title: "Titolo modale",
          content: "Breve messaggio di conferma inserito nella modale.",
          footer: `${button({ label: "Azione 1", outline: true, size: "xs" })}${button({ label: "Azione 2", size: "xs" })}`,
        }),
      ]),
    },
    {
      id: "scroll",
      title: "Scroll interno alla modale",
      html: modal({
        title: "Scroll interno",
        scrollable: true,
        content: Array.from({ length: 8 }, () => `<p class="mb-3">${lorem}</p>`).join("\n        "),
      }),
    },
    {
      id: "dimensioni",
      title: "Dimensioni opzionali",
      html: row([
        modal({ triggerLabel: "Small", size: "sm", title: "Modale small", content: lorem }),
        modal({ triggerLabel: "Default", title: "Modale default", content: lorem }),
        modal({ triggerLabel: "Large", size: "lg", title: "Modale large", content: lorem }),
        modal({ triggerLabel: "Extra large", size: "xl", title: "Modale extra large", content: lorem }),
      ]),
    },
    {
      id: "posizione",
      title: "Allineamento",
      html: row([
        modal({ triggerLabel: "A sinistra", position: "left", title: "Allineata a sinistra", content: lorem }),
        modal({ triggerLabel: "Centrata", title: "Centrata", content: lorem }),
        modal({ triggerLabel: "A destra", position: "right", title: "Allineata a destra", content: lorem }),
      ]),
    },
    {
      id: "backdrop-statico",
      title: "Backdrop statico",
      description: "Senza il form di backdrop il click fuori non chiude: resta il pulsante di chiusura.",
      html: modal({ triggerLabel: "Backdrop statico", title: "Backdrop statico", staticBackdrop: true, content: lorem }),
    },
  ],
};
