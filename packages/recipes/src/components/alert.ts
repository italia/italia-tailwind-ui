import { icon, type IconName } from "../icons";
import { cx, type ComponentDoc } from "../types";

export type AlertVariant = "primary" | "secondary" | "success" | "warning" | "danger";

export interface AlertArgs {
  variant?: AlertVariant;
  /** HTML content of the alert. */
  content?: string;
  icon?: IconName | false;
  /** CSS-only close: a checkbox inside a label hides the alert via :has(:checked). */
  dismissible?: boolean;
}

const bar: Record<AlertVariant, string> = {
  primary: "border-l-primary",
  secondary: "border-l-secondary",
  success: "border-l-success",
  warning: "border-l-warning",
  danger: "border-l-error",
};
const tint: Record<AlertVariant, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-error",
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
  const ic = a.icon === false ? "" : icon(a.icon ?? defaultIcon[variant], cx("size-8", tint[variant]));
  const cls = cx(
    "alert items-center rounded-none border-base-content/40 border-l-8 bg-base-100 p-4 text-base-content shadow-none",
    bar[variant],
    a.dismissible && "has-checked:hidden",
  );
  const close = a.dismissible
    ? `\n  <label class="btn btn-ghost btn-sm btn-square text-base-content/70 hover:text-base-content has-focus-visible:ring-2 has-focus-visible:ring-base-content has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-base-100">
    <input type="checkbox" class="sr-only"><span class="sr-only">Chiudi avviso</span>${icon("it-close", "size-6")}
  </label>`
    : "";
  return `<div role="alert" class="${cls}">
  ${ic}
  <div class="text-base">${a.content ?? `Questo è un alert di tipo "<strong>${variant}</strong>".`}</div>${close}
</div>`;
}

const variants: AlertVariant[] = ["primary", "secondary", "success", "warning", "danger"];

export const doc: ComponentDoc = {
  slug: "alert",
  name: "Alert",
  replaces: "<it-alert>",
  summary:
    "Messaggi di stato con la barra sinistra .italia: daisyUI alert, con bordo sinistro da 8px nel colore della variante e icona colorata.",
  daisy: ["alert", "btn-ghost", "btn-square"],
  cssOnly:
    "La chiusura usa un checkbox dentro una label e la variante Tailwind has-checked:hidden sull'alert: niente JavaScript.",
  examples: [
    {
      id: "esempi",
      title: "Esempi",
      html: `<div class="flex flex-col gap-4">\n${variants.map((v) => alert({ variant: v })).join("\n")}\n</div>`,
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
