import { cx, type ComponentDoc } from "../types";
import { buttonClass, type ButtonVariant } from "./button";
import { chevron } from "./dropdown";

export interface CollapseArgs {
  label?: string;
  /** HTML shown when open. */
  content?: string;
  open?: boolean;
  /** "button" = a real .italia button; "link" = a text link with a chevron. */
  trigger?: "button" | "link";
  variant?: ButtonVariant;
  outline?: boolean;
  /** Box around the content. */
  bordered?: boolean;
  /** Shared name: opening one closes the others with the same name. */
  name?: string;
}

const lorem =
  "Alcuni contenuti segnaposto per il componente collapse. Il pannello è nascosto di default e compare quando l'utente attiva il pulsante.";

/**
 * A disclosure: <details>/<summary> on daisyUI collapse, so the panel animates
 * open. The summary carries the look of a button or a link.
 */
export function collapse(a: CollapseArgs = {}): string {
  const { label = "Mostra il contenuto", content = lorem, trigger = "button", variant = "primary" } = a;
  const face =
    trigger === "button"
      ? cx(buttonClass({ variant, outline: a.outline }), "gap-2")
      : "inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-2 hover:no-underline";
  const body = content.trimStart().startsWith("<") ? content : `<p>${content}</p>`;
  return `<details class="collapse group w-full overflow-visible rounded-none"${a.name ? ` name="${a.name}"` : ""}${a.open ? " open" : ""}>
  <summary class="collapse-title w-fit min-h-0 rounded-field p-0">
    <span class="${face}"><span>${label}</span>${chevron()}</span>
  </summary>
  <div class="${cx("collapse-content px-0 text-base", a.bordered && "rounded-box border-base-content/20 group-open:mt-3 group-open:border group-open:p-4")}">${body}</div>
</details>`;
}

export const doc: ComponentDoc = {
  slug: "collapse",
  name: "Collapse",
  replaces: "<it-collapse>",
  summary:
    "Un pannello che si apre e si chiude da un pulsante o da un link: <details>/<summary> su daisyUI collapse, con l'animazione di altezza di daisyUI.",
  daisy: ["collapse", "collapse-title", "collapse-content", "btn"],
  cssOnly:
    "Tastiera, stato aperto/chiuso annunciato e ricerca nella pagina (Ctrl+F apre il pannello che contiene il testo) sono di <details>. Il pulsante che comanda un pannello lontano (data-bs-target) non ha un equivalente senza script: il pannello segue sempre il suo <summary>.",
  examples: [
    {
      id: "base",
      title: "Esempio base",
      html: `<div class="flex flex-col gap-6">
${collapse()}
${collapse({ trigger: "link", label: "Leggi i dettagli" })}
</div>`,
    },
    {
      id: "aperto",
      title: "Aperto di default",
      html: collapse({ open: true, label: "Nascondi le istruzioni", outline: true, bordered: true, content: "<p>Compila tutti i campi obbligatori, contrassegnati con l'asterisco, poi premi Invia.</p>" }),
    },
    {
      id: "riquadro",
      title: "Con riquadro",
      html: collapse({ bordered: true, variant: "secondary", label: "Requisiti di accesso" }),
    },
    {
      id: "esclusivi",
      title: "Uno alla volta",
      description: "Con lo stesso name, aprendone uno si chiudono gli altri.",
      html: `<div class="flex flex-col gap-4">
${["Orari", "Contatti", "Come arrivare"].map((l) => collapse({ label: l, name: "sportello", trigger: "link" })).join("\n")}
</div>`,
    },
  ],
};
