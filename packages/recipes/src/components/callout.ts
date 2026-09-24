import { icon, type IconName } from "../icons";
import { cx, type ComponentDoc } from "../types";

export type CalloutVariant = "default" | "primary" | "success" | "warning" | "danger";

export interface CalloutArgs {
  variant?: CalloutVariant;
  title?: string;
  icon?: IconName | false;
  /** HTML body. */
  content?: string;
  /** Left bar only, no box. */
  highlight?: boolean;
  bigText?: boolean;
  headingLevel?: 2 | 3 | 4;
  id?: string;
}

// Literal class maps: Tailwind only sees classes written out in full.
const variants: Record<CalloutVariant, string> = {
  default: "",
  primary: "ita-callout-primary",
  success: "ita-callout-success",
  warning: "ita-callout-warning",
  danger: "ita-callout-danger",
};
const defaults: Record<CalloutVariant, { title: string; icon: IconName }> = {
  default: { title: "Titolo callout", icon: "it-info-circle" },
  primary: { title: "Note a riguardo", icon: "it-info-circle" },
  success: { title: "Titolo di conferma", icon: "it-check-circle" },
  warning: { title: "Titolo di attenzione", icon: "it-warning-circle" },
  danger: { title: "Titolo di allerta", icon: "it-close-circle" },
};

const text1 =
  "Maecenas vulputate ante dictum vestibulum volutpat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean non augue non purus vestibulum varius.";
const text2 =
  "Maecenas at erat id <strong>sem interdum efficitur eu sed nunc.</strong> Mauris sit amet erat eget augue molestie malesuada ut sed ex. In sed dignissim elit. Donec efficitur, sem eget vestibulum auctor, sem erat interdum magna, eu commodo odio mauris semper dolor.";

let counter = 0;

export function callout(a: CalloutArgs = {}): string {
  const variant = a.variant ?? "default";
  const d = defaults[variant];
  const id = a.id ?? `callout-title-${++counter}`;
  const h = `h${a.headingLevel ?? 2}`;
  const cls = cx("ita-callout", variants[variant], a.highlight && "ita-callout-highlight", a.bigText && "ita-callout-big");
  const ic = a.icon === false ? "" : icon(a.icon ?? d.icon, "ita-callout-icon");
  return `<section class="${cls}" aria-labelledby="${id}">
  <div class="ita-callout-header">
    ${ic}
    <${h} id="${id}" class="ita-callout-title">${a.title ?? d.title}</${h}>
  </div>
  <div class="ita-callout-body">${a.content ?? `<p>${variant === "default" ? text1 : text2}</p>`}</div>
</section>`;
}

/** "Approfondimento": folded-corner box with a CSS-only "Leggi tutto" disclosure. */
export function calloutMore(title = "Approfondimento"): string {
  const p =
    "Quisque suscipit interdum augue non volutpat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec ut libero eget nisl dignissim fermentum ut ut nisi. Aliquam erat volutpat.";
  return `<section class="ita-callout-more it-fold-corner" aria-labelledby="callout-more-title">
  <h2 id="callout-more-title" class="ita-callout-title mb-4">${title}</h2>
  <p>${p}</p>
  <p>${p}</p>
  <div class="ita-callout-more-footer">
    <details class="grow">
      <summary class="ita-callout-more-toggle">
        <span data-closed>Leggi tutto</span><span data-open>Chiudi</span>
        <span class="it-plus-minus" aria-hidden="true"></span>
      </summary>
      <p class="mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean non augue non purus vestibulum varius. Maecenas vulputate ante dictum vestibulum volutpat.</p>
    </details>
    <a href="#" class="ita-link inline-flex shrink-0 items-center gap-2">Download ${icon("it-download", "size-6")}</a>
  </div>
</section>`;
}

const colored: CalloutVariant[] = ["primary", "success", "warning", "danger"];

export const doc: ComponentDoc = {
  slug: "callout",
  name: "Callout",
  replaces: "<it-callout>, <it-callout-more>",
  summary:
    "Riquadri di approfondimento con titolo maiuscolo e icona, sui token del tema; la variante «Approfondimento» usa l'angolo piegato it-fold-corner.",
  classes: ["ita-callout", "ita-callout-primary", "ita-callout-success", "ita-callout-warning", "ita-callout-danger", "ita-callout-highlight", "ita-callout-big", "ita-callout-header", "ita-callout-icon", "ita-callout-title", "ita-callout-body", "ita-callout-more", "ita-callout-more-footer", "ita-callout-more-toggle", "ita-link"],
  daisy: ["link"],
  extensions: ["it-fold-corner", "it-plus-minus"],
  cssOnly: "«Leggi tutto» è un <details>: le etichette [data-closed] e [data-open] di ita-callout-more-toggle si scambiano quando si apre.",
  examples: [
    { id: "base", title: "Callout base", html: callout() },
    { id: "big-text", title: "Big text", html: callout({ bigText: true }) },
    { id: "varianti", title: "Varianti di colore", html: colored.map((v) => callout({ variant: v })).join("\n") },
    {
      id: "highlight",
      title: "Highlight",
      html: [callout({ highlight: true }), ...colored.map((v) => callout({ variant: v, highlight: true }))].join("\n"),
    },
    { id: "approfondimento", title: "Approfondimento", html: calloutMore() },
  ],
};
