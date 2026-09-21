import { icon, type IconName } from "../icons";
import { cx, type ComponentDoc } from "../types";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: IconName;
}

export interface BreadcrumbsArgs {
  items?: BreadcrumbItem[];
  /** "slash" = .italia "/" (it-slash extension), "chevron" = daisyUI default. */
  separator?: "slash" | "chevron";
  /** Inverted surface (bg-neutral), the dev-kit "dark" variant. */
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
  const cls = cx(
    "breadcrumbs text-base",
    separator === "slash" && "it-slash",
    a.dark ? "rounded-box bg-neutral px-4 text-neutral-content" : "",
  );
  const link = a.dark ? "font-semibold underline underline-offset-2" : "font-semibold text-base-content/80 underline underline-offset-2 hover:text-base-content";
  const li = items
    .map((it, i) => {
      const ic = it.icon ? icon(it.icon, "size-5 opacity-80") : "";
      const last = i === items.length - 1;
      return last || !it.href
        ? `<li><span aria-current="page" class="${cx("inline-flex items-center gap-1", !a.dark && "text-base-content")}">${ic}${it.label}</span></li>`
        : `<li><a href="${it.href}" class="${link}">${ic}${it.label}</a></li>`;
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
  daisy: ["breadcrumbs"],
  extensions: ["it-slash"],
  examples: [
    { id: "base", title: "Base", html: breadcrumbs() },
    { id: "icona", title: "Con icona", html: breadcrumbs({ items: withIcons }) },
    {
      id: "separatore",
      title: "Separatore personalizzato",
      description: "Senza it-slash resta la freccia di daisyUI.",
      html: breadcrumbs({ separator: "chevron" }),
    },
    {
      id: "scuro",
      title: "Sfondo scuro",
      html: `<div class="flex flex-col gap-4">\n${breadcrumbs({ dark: true })}\n${breadcrumbs({ dark: true, separator: "chevron", items: withIcons })}\n</div>`,
    },
  ],
};
