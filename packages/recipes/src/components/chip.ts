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

// Literal class maps: Tailwind only sees classes written out in full.
const colors: Record<ChipVariant, string> = {
  default: "",
  primary: "ita-chip-primary",
  secondary: "ita-chip-secondary",
  success: "ita-chip-success",
  danger: "ita-chip-danger",
  warning: "ita-chip-warning",
};

/** Focus ring for a label that wraps a visually hidden checkbox. */
export const hiddenCheckboxFocus = "has-focus-visible:ring-2 has-focus-visible:ring-base-content has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-base-100";

export function chip(a: ChipArgs = {}): string {
  const { label = "Etichetta", variant = "default", size = "sm" } = a;
  const cls = cx("ita-chip", colors[variant], size === "lg" && "ita-chip-lg");
  const parts: string[] = [];
  if (a.icon) parts.push(icon(a.icon, ""));
  if (a.avatar) parts.push(`<span class="ita-chip-avatar">${a.avatar}</span>`);
  parts.push(`<span>${label}</span>`);
  // The close label hides the chip through ita-chip:has(… input:checked).
  if (a.dismissable)
    parts.push(
      `<label class="ita-chip-close"><input type="checkbox" class="sr-only"${a.disabled ? " disabled" : ""}><span class="sr-only">${a.dismissLabel ?? "Elimina etichetta"}</span>${icon("it-close", "")}</label>`,
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
  classes: ["ita-chip", "ita-chip-primary", "ita-chip-secondary", "ita-chip-success", "ita-chip-danger", "ita-chip-warning", "ita-chip-lg", "ita-chip-avatar", "ita-chip-close"],
  daisy: ["badge"],
  cssOnly: "La chiusura nasconde la chip con il checkbox di ita-chip-close (ita-chip:has(… input:checked)); senza JavaScript il focus non si sposta. aria-disabled=\"true\" la rende grigia.",
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
