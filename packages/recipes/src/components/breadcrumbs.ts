import { icon, type IconName } from "../icons";
import { cx, type ComponentDoc } from "../types";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: IconName;
}

export interface BreadcrumbsArgs {
  items?: BreadcrumbItem[];
  /** "slash" = the .italia "/", "chevron" = daisyUI's arrow (ita-breadcrumbs-chevron). */
  separator?: "slash" | "chevron";
  /** Surface: "base" (default, the page) or "neutral", the dev-kit "dark" variant. */
  surface?: "base" | "neutral";
  /** @deprecated Use `surface: "neutral"`. */
  dark?: boolean;
  label?: string;
}

const defaultItems: BreadcrumbItem[] = [
  { label: "Home", href: "#" },
  { label: "Sezione", href: "#" },
  { label: "Voce corrente" },
];

export function breadcrumbs(a: BreadcrumbsArgs = {}): string {
  const { items = defaultItems, separator = "slash", label = "Percorso di navigazione" } = a;
  const onNeutral = (a.surface ?? (a.dark ? "neutral" : "base")) === "neutral";
  const cls = cx("ita-breadcrumbs", separator === "chevron" && "ita-breadcrumbs-chevron", onNeutral && "ita-breadcrumbs-neutral");
  const li = items
    .map((it, i) => {
      const ic = it.icon ? icon(it.icon, "") : "";
      const last = i === items.length - 1;
      return last || !it.href
        ? `<li><span aria-current="page">${ic}${it.label}</span></li>`
        : `<li><a href="${it.href}">${ic}${it.label}</a></li>`;
    })
    .join("\n    ");
  return `<nav class="${cls}" aria-label="${label}">
  <ol>
    ${li}
  </ol>
</nav>`;
}

const withIcons: BreadcrumbItem[] = [
  { label: "Home", href: "#", icon: "it-link" },
  { label: "Sezione", href: "#", icon: "it-link" },
  { label: "Voce corrente" },
];

export const doc: ComponentDoc = {
  slug: "breadcrumbs",
  name: "Breadcrumbs",
  replaces: "<it-breadcrumbs>",
  summary:
    "Percorso di navigazione: daisyUI breadcrumbs su un elenco ordinato, con il separatore «/» di .italia o la freccia di daisyUI.",
  classes: ["ita-breadcrumbs", "ita-breadcrumbs-chevron", "ita-breadcrumbs-neutral"],
  daisy: ["breadcrumbs"],
  extensions: [],
  examples: [
    { id: "base", title: "Base", html: breadcrumbs() },
    { id: "icona", title: "Con icona", html: breadcrumbs({ items: withIcons }) },
    {
      id: "separatore",
      title: "Separatore personalizzato",
      description: "Con ita-breadcrumbs-chevron resta la freccia di daisyUI.",
      html: breadcrumbs({ separator: "chevron" }),
    },
    {
      id: "sfondo-neutral",
      title: "Su sfondo neutral",
      description: "surface: \"neutral\" è la variante scura di Dev Kit Italia; il colore reale lo decide il tema.",
      html: `<div class="flex flex-col gap-4">\n${breadcrumbs({ surface: "neutral" })}\n${breadcrumbs({ surface: "neutral", separator: "chevron", items: withIcons })}\n</div>`,
    },
  ],
};
