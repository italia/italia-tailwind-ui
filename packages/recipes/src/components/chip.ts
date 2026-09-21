import { icon, type IconName } from "../icons";
import { cx, type ComponentDoc } from "../types";

export type ChipVariant = "default" | "primary" | "secondary" | "success" | "danger" | "warning";

export interface ChipArgs {
  label?: string;
  variant?: ChipVariant;
  size?: "sm" | "lg";
  href?: string;
  disabled?: boolean;
  /** CSS-only dismiss button (checkbox + has-checked:hidden). */
  dismissable?: boolean;
  dismissLabel?: string;
  icon?: IconName;
  /** Initials shown in a daisyUI placeholder avatar. */
  avatar?: string;
}

const color: Record<ChipVariant, string> = {
  default: "bg-base-200 border-base-content/25 text-base-content/80",
  primary: "badge-outline badge-primary",
  secondary: "badge-outline badge-secondary",
  success: "badge-outline badge-success",
  danger: "badge-outline badge-error",
  warning: "badge-outline badge-warning",
};
const hoverFill: Record<ChipVariant, string> = {
  default: "hover:bg-base-content hover:text-base-100 hover:border-base-content",
  primary: "hover:bg-primary hover:text-primary-content hover:border-primary",
  secondary: "hover:bg-secondary hover:text-secondary-content hover:border-secondary",
  success: "hover:bg-success hover:text-success-content hover:border-success",
  danger: "hover:bg-error hover:text-error-content hover:border-error",
  warning: "hover:bg-warning hover:text-warning-content hover:border-warning",
};
const avatarBg: Record<ChipVariant, string> = {
  default: "bg-neutral text-neutral-content",
  primary: "bg-primary text-primary-content",
  secondary: "bg-secondary text-secondary-content",
  success: "bg-success text-success-content",
  danger: "bg-error text-error-content",
  warning: "bg-warning text-warning-content",
};

/** Focus ring for a label that wraps a visually hidden checkbox. */
export const hiddenCheckboxFocus = "has-focus-visible:ring-2 has-focus-visible:ring-base-content has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-base-100";

export function chip(a: ChipArgs = {}): string {
  const { label = "Etichetta", variant = "default", size = "sm" } = a;
  const lg = size === "lg";
  const cls = cx(
    "badge h-auto gap-2 rounded-selector py-1 font-semibold leading-tight",
    lg ? "min-h-10 px-4 text-lg" : "min-h-8 px-3 text-base",
    a.disabled ? "border-base-300 bg-base-300 text-base-content/60" : color[variant],
    a.href && !a.disabled && cx("underline underline-offset-2", hoverFill[variant]),
    a.dismissable && "has-checked:hidden",
  );
  const parts: string[] = [];
  if (a.icon) parts.push(icon(a.icon, lg ? "size-6" : "size-4"));
  if (a.avatar)
    parts.push(
      `<span class="avatar avatar-placeholder"><span class="${cx(lg ? "size-7 text-sm" : "size-6 text-xs", "grid place-items-center rounded-full leading-none", a.disabled ? "bg-base-content/40 text-base-100" : avatarBg[variant])}">${a.avatar}</span></span>`,
    );
  parts.push(`<span>${label}</span>`);
  if (a.dismissable)
    parts.push(
      `<label class="${cx("-me-1 grid cursor-pointer place-items-center rounded-full", hiddenCheckboxFocus)}"><input type="checkbox" class="sr-only"${a.disabled ? " disabled" : ""}><span class="sr-only">${a.dismissLabel ?? "Elimina etichetta"}</span>${icon("it-close", "size-6")}</label>`,
    );
  const tag = a.href && !a.disabled ? "a" : "span";
  const href = tag === "a" ? ` href="${a.href}"` : "";
  const dis = a.disabled ? ` aria-disabled="true"` : "";
  return `<${tag}${href} class="${cls}"${dis}>${parts.join("")}</${tag}>`;
}

const row = (items: string[]) => `<div class="flex flex-wrap items-center gap-4">\n  ${items.join("\n  ")}\n</div>`;
const variants: ChipVariant[] = ["default", "primary", "secondary", "success", "danger", "warning"];

export const doc: ComponentDoc = {
  slug: "chip",
  name: "Chip",
  replaces: "<it-chip>",
  summary:
    "Etichette a pillola per argomenti e filtri: daisyUI badge ingrandito a 32/40px, con icona, avatar e chiusura opzionali.",
  daisy: ["badge", "badge-outline", "badge-primary", "avatar", "avatar-placeholder"],
  cssOnly: "La chiusura nasconde la chip con un checkbox e has-checked:hidden; senza JavaScript il focus non si sposta.",
  examples: [
    { id: "varianti", title: "Varianti di colore", html: row(variants.map((v) => chip({ variant: v }))) },
    {
      id: "link",
      title: "Variante con link",
      description: "Le chip link si riempiono al passaggio del mouse.",
      html: row(variants.map((v) => chip({ variant: v, href: "#" }))),
    },
    {
      id: "dimensioni",
      title: "Varianti di dimensione",
      html: row([
        chip({ label: "Etichetta sm", variant: "primary", dismissable: true }),
        chip({ label: "Etichetta lg", variant: "primary", size: "lg", dismissable: true }),
      ]),
    },
    {
      id: "chiusura",
      title: "Chip con chiusura",
      html: row(variants.slice(0, 3).map((v) => chip({ variant: v, dismissable: true }))),
    },
    {
      id: "disabilitata",
      title: "Chip disabilitata",
      html: row([chip({ disabled: true }), chip({ disabled: true, dismissable: true, avatar: "MR", label: "Mario Rossi" })]),
    },
    {
      id: "avatar",
      title: "Chip con avatar",
      html: row([
        chip({ label: "Mario Rossi", avatar: "MR", variant: "primary", dismissable: true, dismissLabel: "Rimuovi Mario Rossi" }),
        chip({ label: "Anna Verdi", avatar: "AV", variant: "secondary", size: "lg", dismissable: true, dismissLabel: "Rimuovi Anna Verdi" }),
      ]),
    },
    {
      id: "icona",
      title: "Chip con icona",
      html: row([
        chip({ label: "Download", icon: "it-download", variant: "primary" }),
        chip({ label: "Carica file", icon: "it-upload", variant: "success", size: "lg" }),
        chip({ label: "Preferiti", icon: "it-star-full", variant: "warning", href: "#" }),
      ]),
    },
  ],
};
