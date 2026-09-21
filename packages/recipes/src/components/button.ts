import { icon, type IconName } from "../icons";
import { cx, type ComponentDoc } from "../types";

export type ButtonVariant = "primary" | "secondary" | "success" | "danger" | "warning" | "link";
export type ButtonSize = "lg" | "default" | "xs";

export interface ButtonArgs {
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  outline?: boolean;
  block?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: IconName;
  /** Wrap the icon in a white circle (dev-kit "icona cerchiata"). */
  roundedIcon?: boolean;
  /** Render as <a href> instead of <button>. */
  href?: string;
}

// Literal class maps: Tailwind only sees classes written out in full.
const solid: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  success: "btn-success",
  danger: "btn-error",
  warning: "btn-warning",
  link: "btn-link",
};
const outline: Record<ButtonVariant, string> = {
  primary: "btn-outline btn-primary border-2",
  secondary: "btn-outline btn-secondary border-2",
  success: "btn-outline btn-success border-2",
  danger: "btn-outline btn-error border-2",
  warning: "btn-outline btn-warning border-2",
  link: "btn-link",
};
const text: Record<ButtonVariant, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  success: "text-success",
  danger: "text-error",
  warning: "text-warning",
  link: "text-primary",
};
const sizes: Record<ButtonSize, string> = {
  lg: "btn-lg",
  default: "",
  xs: "btn-sm",
};
const iconSizes: Record<ButtonSize, string> = { lg: "size-6", default: "size-6", xs: "size-5" };

/** The class list of a button, so other recipes can put it on a different tag. */
export function buttonClass(a: ButtonArgs = {}): string {
  const { variant = "primary", size = "default" } = a;
  return cx(
    "btn font-semibold",
    a.outline ? outline[variant] : solid[variant],
    sizes[size],
    a.block && "btn-block",
    a.icon && "gap-3",
    a.href && a.disabled && "btn-disabled",
  );
}

export function button(a: ButtonArgs = {}): string {
  const {
    label = "Pulsante",
    variant = "primary",
    size = "default",
    type = "button",
  } = a;
  const cls = buttonClass(a);
  let iconHtml = "";
  if (a.icon) {
    iconHtml = a.roundedIcon
      ? `<span class="grid size-7 place-items-center rounded-full bg-base-100 ${text[variant]}">${icon(a.icon, "size-4")}</span>`
      : icon(a.icon, iconSizes[size]);
  }
  const inner = `${iconHtml}<span>${label}</span>`;
  if (a.href) {
    const dis = a.disabled ? ` tabindex="-1" role="button" aria-disabled="true"` : "";
    return `<a href="${a.href}" class="${cls}"${dis}>${inner}</a>`;
  }
  return `<button type="${type}" class="${cls}"${a.disabled ? " disabled" : ""}>${inner}</button>`;
}

const row = (items: string[]) => `<div class="flex flex-wrap items-center gap-3">\n  ${items.join("\n  ")}\n</div>`;
const stack = (items: string[]) => `<div class="flex flex-col gap-4">\n${items.join("\n")}\n</div>`;
const variants: ButtonVariant[] = ["primary", "secondary", "success", "danger", "warning"];
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

export const doc: ComponentDoc = {
  slug: "button",
  name: "Button",
  replaces: "<it-button>",
  summary:
    "Pulsanti per azioni: una classe daisyUI btn più la variante di colore. Il peso 600 e il gap per le icone arrivano da utility Tailwind.",
  daisy: ["btn", "btn-primary", "btn-outline", "btn-link", "btn-lg", "btn-sm", "btn-block", "badge"],
  examples: [
    {
      id: "varianti-colore",
      title: "Varianti di colore",
      html: stack([
        row(variants.map((v) => button({ label: cap(v), variant: v }))),
        row(variants.map((v) => button({ label: `${cap(v)} outline`, variant: v, outline: true }))),
      ]),
    },
    {
      id: "disabilitato",
      title: "Stato disabilitato",
      html: row([
        ...variants.map((v) => button({ label: cap(v), variant: v, disabled: true })),
        button({ label: "Pulsante link", variant: "link", disabled: true }),
      ]),
    },
    {
      id: "dimensioni",
      title: "Varianti di dimensione",
      html: stack([
        row([
          button({ label: "Primary Large", size: "lg" }),
          button({ label: "Secondary Large", variant: "secondary", size: "lg" }),
        ]),
        row([button({ label: "Primary Default" }), button({ label: "Primary Extra Small", size: "xs" })]),
        button({ label: "Primary Block", block: true }),
        button({ label: "Secondary Block", variant: "secondary", block: true }),
      ]),
    },
    {
      id: "con-icona",
      title: "Con icona",
      html: row([
        button({ label: "Pulsante Large con icona", variant: "success", size: "lg", icon: "it-star-full" }),
        button({ label: "Pulsante con icona", icon: "it-star-full" }),
        button({ label: "Pulsante Extra Small con icona", variant: "danger", size: "xs", icon: "it-star-full" }),
        button({ label: "Pulsante Link Extra Small con icona", variant: "link", size: "xs", icon: "it-star-full" }),
      ]),
    },
    {
      id: "icona-cerchiata",
      title: "Con icona cerchiata",
      html: row([
        button({ label: "Pulsante Large con icona", variant: "success", size: "lg", icon: "it-user", roundedIcon: true }),
        button({ label: "Pulsante con icona", icon: "it-user", roundedIcon: true }),
        button({ label: "Pulsante Extra Small", variant: "danger", size: "xs", icon: "it-user", roundedIcon: true }),
      ]),
    },
    {
      id: "badge",
      title: "Con badge",
      html: `<button type="button" class="btn btn-primary font-semibold gap-2">
  Notifiche <span class="badge badge-sm rounded-sm bg-base-100 text-primary border-0 font-semibold">4</span>
  <span class="sr-only">Messaggi non letti</span>
</button>`,
    },
    {
      id: "sfondo-scuro",
      title: "Sfondo scuro",
      description: "Su una superficie scura si annida un tema scuro: il componente non cambia, cambia data-theme.",
      html: `<div data-theme="italia-dark" class="rounded-box bg-base-100 p-6">
  ${row([
    button({ label: "Primary" }),
    button({ label: "Secondary", variant: "secondary" }),
    button({ label: "Primary outline", outline: true }),
    button({ label: "Link", variant: "link" }),
  ])}
</div>`,
    },
    {
      id: "tipologie",
      title: "Tipologie",
      html: row([
        button({ label: "Button - Primary", type: "button" }),
        button({ label: "Submit - Primary", type: "submit" }),
        button({ label: "Reset - Secondary", type: "reset", variant: "secondary", outline: true }),
        button({ label: "Link come pulsante", href: "#" }),
      ]),
    },
  ],
};
