import { icon, type IconName } from "../icons";
import type { ComponentDoc } from "../types";

export type AlertVariant = "primary" | "secondary" | "success" | "warning" | "danger";

export interface AlertArgs {
  variant?: AlertVariant;
  /** HTML content of the alert. */
  content?: string;
  icon?: IconName | false;
  /** CSS-only close: a checkbox inside a label hides the alert via :has(:checked). */
  dismissible?: boolean;
}

// Literal class maps: Tailwind only sees classes written out in full.
const variants: Record<AlertVariant, string> = {
  primary: "ita-alert-primary",
  secondary: "ita-alert-secondary",
  success: "ita-alert-success",
  warning: "ita-alert-warning",
  danger: "ita-alert-danger",
};
const defaultIcon: Record<AlertVariant, IconName> = {
  primary: "it-info-circle",
  secondary: "it-info-circle",
  success: "it-check-circle",
  warning: "it-warning-circle",
  danger: "it-close-circle",
};

export function alert(a: AlertArgs = {}): string {
  const variant = a.variant ?? "primary";
  const ic = a.icon === false ? "" : icon(a.icon ?? defaultIcon[variant], "ita-alert-icon");
  // The close label hides the alert through ita-alert:has(… input:checked).
  const close = a.dismissible
    ? `\n  <label class="ita-alert-close">
    <input type="checkbox" class="sr-only"><span class="sr-only">Chiudi avviso</span>${icon("it-close", "")}
  </label>`
    : "";
  return `<div role="alert" class="ita-alert ${variants[variant]}">
  ${ic}
  <div>${a.content ?? `Questo è un alert di tipo "<strong>${variant}</strong>".`}</div>${close}
</div>`;
}

const allVariants: AlertVariant[] = ["primary", "secondary", "success", "warning", "danger"];

export const doc: ComponentDoc = {
  slug: "alert",
  name: "Alert",
  replaces: "<it-alert>",
  summary:
    "Messaggi di stato con la barra sinistra .italia: daisyUI alert, con bordo sinistro da 8px nel colore della variante e icona colorata.",
  classes: ["ita-alert", "ita-alert-primary", "ita-alert-secondary", "ita-alert-success", "ita-alert-warning", "ita-alert-danger", "ita-alert-icon", "ita-alert-close"],
  daisy: ["alert", "btn-ghost", "btn-square"],
  cssOnly:
    "La chiusura usa un checkbox dentro la label ita-alert-close: quando è selezionato, ita-alert:has(… input:checked) nasconde l'alert. Niente JavaScript.",
  examples: [
    {
      id: "esempi",
      title: "Esempi",
      html: `<div class="flex flex-col gap-4">\n${allVariants.map((v) => alert({ variant: v })).join("\n")}\n</div>`,
    },
    {
      id: "link-evidenziato",
      title: "Link evidenziato",
      html: alert({
        variant: "danger",
        content: `Questo è un alert con un esempio di <a href="#" class="link font-semibold">link evidenziato</a>.`,
      }),
    },
    {
      id: "contenuto-aggiuntivo",
      title: "Contenuto aggiuntivo",
      html: alert({
        variant: "success",
        content: `<h4 class="mb-2 text-2xl font-bold">Avviso di successo!</h4>
    <p>Stai leggendo questo importante messaggio di avviso di successo. Questo testo di esempio sarà più lungo in modo da poter vedere come funzioni la spaziatura all'interno di un avviso con questo tipo di contenuto.</p>
    <hr class="my-4 border-base-content/20">
    <p>Quando necessario, assicurati di inserire le utilità di margine per mantenere gli spazi equilibrati.</p>`,
      }),
    },
    {
      id: "chiusura",
      title: "Chiusura",
      description: "Premi la X (o Spazio sul pulsante a fuoco): l'alert si nasconde solo con CSS.",
      html: alert({
        variant: "warning",
        dismissible: true,
        content: "<strong>Attenzione</strong> Alcuni campi inseriti sono da controllare.",
      }),
    },
  ],
};
