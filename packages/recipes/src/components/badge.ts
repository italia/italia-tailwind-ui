import { cx, type ComponentDoc } from "../types";

export type BadgeVariant = "primary" | "secondary" | "success" | "danger" | "warning" | "inverse";

export interface BadgeArgs {
  label?: string;
  variant?: BadgeVariant;
  pill?: boolean;
  href?: string;
}

// Literal class maps: Tailwind only sees classes written out in full.
const color: Record<BadgeVariant, string> = {
  primary: "ita-badge-primary",
  secondary: "ita-badge-secondary",
  success: "ita-badge-success",
  danger: "ita-badge-danger",
  warning: "ita-badge-warning",
  inverse: "ita-badge-inverse",
};

export function badge(a: BadgeArgs = {}): string {
  const { label = "New", variant = "secondary" } = a;
  const cls = cx("ita-badge", color[variant], a.pill && "ita-badge-pill");
  return a.href ? `<a href="${a.href}" class="${cls}">${label}</a>` : `<span class="${cls}">${label}</span>`;
}

const variants: BadgeVariant[] = ["primary", "secondary", "success", "danger", "warning"];
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

export const doc: ComponentDoc = {
  slug: "badge",
  name: "Badge",
  replaces: ".badge (bootstrap-italia)",
  summary:
    "Piccole etichette di conteggio o stato. Il testo è 0.75em, quindi il badge scala con il testo che lo contiene.",
  classes: ["ita-badge", "ita-badge-primary", "ita-badge-secondary", "ita-badge-success", "ita-badge-danger", "ita-badge-warning", "ita-badge-inverse", "ita-badge-pill"],
  daisy: ["badge", "badge-primary", "badge-secondary"],
  examples: [
    {
      id: "dimensione",
      title: "Dimensione",
      html: ["text-5xl", "text-4xl", "text-3xl", "text-2xl", "text-xl", "text-base"]
        .map((t, i) => `<p class="${t} font-bold">Titolo di esempio h${i + 1} ${badge()}</p>`)
        .join("\n"),
    },
    {
      id: "colori",
      title: "Variazioni di colore",
      html: `<div class="flex flex-wrap gap-3">\n  ${variants.map((v) => badge({ label: cap(v), variant: v })).join("\n  ")}\n</div>`,
    },
    {
      id: "arrotondati",
      title: "Badge arrotondati",
      html: `<div class="flex flex-wrap gap-3">\n  ${variants.map((v) => badge({ label: cap(v), variant: v, pill: true })).join("\n  ")}\n</div>`,
    },
    {
      id: "link",
      title: "Link",
      html: `<div class="flex flex-wrap gap-3">\n  ${variants.map((v) => badge({ label: cap(v), variant: v, href: "#" })).join("\n  ")}\n</div>`,
    },
  ],
};
