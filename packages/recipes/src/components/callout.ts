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

const border: Record<CalloutVariant, string> = {
  default: "border-base-content/60",
  primary: "border-primary",
  success: "border-success",
  warning: "border-warning",
  danger: "border-error",
};
const tint: Record<CalloutVariant, string> = {
  default: "text-base-content/70",
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-error",
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
  const cls = cx(
    "my-8 text-base-content/85",
    border[variant],
    a.highlight ? "border-l-2 px-6" : "border-2 bg-base-100 p-6",
    a.bigText ? "text-xl" : "text-base",
  );
  const ic = a.icon === false ? "" : icon(a.icon ?? d.icon, cx("size-8", tint[variant]));
  return `<section class="${cls}" aria-labelledby="${id}">
  <div class="mb-4 flex items-center gap-2">
    ${ic}
    <${h} id="${id}" class="text-base font-semibold uppercase text-base-content sm:text-lg">${a.title ?? d.title}</${h}>
  </div>
  <div class="[&>p:last-child]:mb-0 [&>p]:mb-4">${a.content ?? `<p>${variant === "default" ? text1 : text2}</p>`}</div>
</section>`;
}

/** "Approfondimento": folded-corner box with a CSS-only "Leggi tutto" disclosure. */
export function calloutMore(title = "Approfondimento"): string {
  const p =
    "Quisque suscipit interdum augue non volutpat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec ut libero eget nisl dignissim fermentum ut ut nisi. Aliquam erat volutpat.";
  return `<section class="it-fold-corner my-8 bg-base-200 p-8 text-base-content/85" aria-labelledby="callout-more-title">
  <h2 id="callout-more-title" class="mb-4 text-base font-semibold uppercase text-base-content sm:text-lg">${title}</h2>
  <p class="mb-4">${p}</p>
  <p class="mb-4">${p}</p>
  <div class="flex items-start gap-4 border-t border-base-content/20 pt-6">
    <details class="group grow">
      <summary class="inline-flex cursor-pointer list-none items-center gap-2 text-primary hover:underline [&::-webkit-details-marker]:hidden">
        <span class="group-open:hidden">Leggi tutto</span><span class="hidden group-open:inline">Chiudi</span>
        <span class="it-plus-minus" aria-hidden="true"></span>
      </summary>
      <p class="mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean non augue non purus vestibulum varius. Maecenas vulputate ante dictum vestibulum volutpat.</p>
    </details>
    <a href="#" class="link link-primary inline-flex shrink-0 items-center gap-2">Download ${icon("it-download", "size-6")}</a>
  </div>
</section>`;
}

const variants: CalloutVariant[] = ["primary", "success", "warning", "danger"];

export const doc: ComponentDoc = {
  slug: "callout",
  name: "Callout",
  replaces: "<it-callout>, <it-callout-more>",
  summary:
    "Riquadri di approfondimento con titolo maiuscolo e icona. Solo utility Tailwind sui token del tema; la variante «Approfondimento» usa l'angolo piegato it-fold-corner.",
  daisy: [],
  extensions: ["it-fold-corner", "it-plus-minus"],
  cssOnly: "«Leggi tutto» è un <details>; l'etichetta cambia con group-open.",
  examples: [
    { id: "base", title: "Callout base", html: callout() },
    { id: "big-text", title: "Big text", html: callout({ bigText: true }) },
    { id: "varianti", title: "Varianti di colore", html: variants.map((v) => callout({ variant: v })).join("\n") },
    {
      id: "highlight",
      title: "Highlight",
      html: [callout({ highlight: true }), ...variants.map((v) => callout({ variant: v, highlight: true }))].join("\n"),
    },
    { id: "approfondimento", title: "Approfondimento", html: calloutMore() },
  ],
};
