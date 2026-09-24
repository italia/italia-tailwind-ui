import { icon, type IconName } from "../icons";
import { cx, type ComponentDoc } from "../types";
import { dropdownMenu, type DropdownItem } from "./dropdown";

export type ToolbarSize = "lg" | "md" | "sm";

export interface ToolbarItem {
  label?: string;
  icon?: IconName;
  href?: string;
  active?: boolean;
  disabled?: boolean;
  badge?: number;
  /** Plain dot for "something new". */
  alert?: boolean;
  /** What the badge or dot means, for screen readers. */
  badgeLabel?: string;
  /** A vertical rule between groups. */
  divider?: boolean;
  /** Turns the item into a "more" menu with these entries. */
  menu?: DropdownItem[];
}

export interface ToolbarArgs {
  items?: ToolbarItem[];
  size?: ToolbarSize;
  vertical?: boolean;
  label?: string;
}

// bootstrap-italia: large shows 32px icons with labels, medium 24px with
// labels, small 24px icons only. Literal class maps for Tailwind.
const sizes: Record<ToolbarSize, string> = { lg: "ita-toolbar-lg", md: "", sm: "ita-toolbar-sm" };

const defaultItems: ToolbarItem[] = [
  { label: "Condividi", icon: "it-share", href: "#" },
  { label: "Scarica", icon: "it-download", href: "#", active: true },
  { label: "Stampa", icon: "it-print", href: "#" },
  { divider: true },
  { label: "Commenti", icon: "it-comment", href: "#", badge: 4, badgeLabel: "4 nuovi commenti" },
  { label: "Preferiti", icon: "it-star-outline", href: "#", alert: true, badgeLabel: "novità" },
  { label: "Elimina", icon: "it-delete", href: "#", disabled: true },
  {
    label: "Altro",
    icon: "it-more-items",
    menu: [
      { label: "Copia il link", href: "#", icon: "it-copy" },
      { label: "Invia per email", href: "#", icon: "it-mail" },
      { label: "Segnala un problema", href: "#", icon: "it-flag" },
    ],
  },
];

function toolbarItem(it: ToolbarItem, size: ToolbarSize, vertical: boolean): string {
  if (it.divider) return `<li role="separator"></li>`;
  const showLabel = size !== "sm";
  const mark = it.badge
    ? `<span class="indicator-item ita-indicator-count" aria-hidden="true">${it.badge}</span>`
    : it.alert
      ? `<span class="indicator-item ita-indicator-dot" aria-hidden="true"></span>`
      : "";
  const sr = (it.badge || it.alert) && it.badgeLabel ? `<span class="sr-only">, ${it.badgeLabel}</span>` : "";
  const inner = `<span class="indicator">${mark}${icon(it.icon ?? "it-more-items", "")}</span>${
    showLabel ? `<span class="ita-toolbar-label">${it.label ?? ""}</span>` : `<span class="sr-only">${it.label ?? ""}</span>`
  }${sr}`;
  if (it.menu) {
    return `<li><details class="dropdown ${vertical ? "dropdown-right" : "dropdown-end"}">
      <summary class="ita-toolbar-item">${inner}</summary>
      ${dropdownMenu(it.menu, { align: vertical ? "right" : "end" })}
    </details></li>`;
  }
  const attrs = cx(
    it.active && ` aria-current="page"`,
    it.disabled && ` aria-disabled="true" tabindex="-1"`,
    !showLabel && it.label && ` title="${it.label}"`,
  ).replace(/ {2,}/g, " ");
  return `<li><a href="${it.href ?? "#"}" class="ita-toolbar-item"${attrs}>${inner}</a></li>`;
}

export function toolbar(a: ToolbarArgs = {}): string {
  const { items = defaultItems, size = "md", vertical = false, label = "Barra degli strumenti" } = a;
  return `<nav aria-label="${label}" class="${cx("ita-toolbar", sizes[size], vertical && "ita-toolbar-vertical")}">
  <ul>
    ${items.map((it) => toolbarItem(it, size, vertical)).join("\n    ")}
  </ul>
</nav>`;
}

export const doc: ComponentDoc = {
  slug: "toolbar",
  name: "Toolbar",
  replaces: "<it-toolbar>",
  summary:
    "Barra di azioni con icone ed etichette, divisori, contatori e un menu «Altro»: una lista di link con utility Tailwind, daisyUI indicator per i badge e Dropdown per il menu.",
  classes: ["ita-toolbar", "ita-toolbar-lg", "ita-toolbar-sm", "ita-toolbar-vertical", "ita-toolbar-item", "ita-toolbar-label", "ita-indicator-count", "ita-indicator-dot"],
  daisy: ["indicator", "indicator-item", "badge", "status", "dropdown", "menu"],
  cssOnly:
    "Il menu «Altro» è lo stesso Dropdown su <details>. Nella misura piccola le etichette restano per i lettori di schermo e in title. Le frecce fra le voci (roving tabindex di role=toolbar) richiedono JavaScript: qui si naviga con Tab, per questo è un <nav> di link e non role=toolbar.",
  examples: [
    { id: "base", title: "Esempio base", html: `<div class="h-56">${toolbar()}</div>` },
    {
      id: "dimensioni",
      title: "Dimensioni",
      html: `<div class="flex flex-col items-start gap-6">
${toolbar({ size: "lg", items: defaultItems.slice(0, 5) })}
${toolbar({ size: "md", items: defaultItems.slice(0, 5) })}
${toolbar({ size: "sm", items: defaultItems.slice(0, 5) })}
</div>`,
    },
    {
      id: "verticale",
      title: "Verticale",
      html: `<div class="h-96">${toolbar({ vertical: true, items: defaultItems.filter((i) => !i.disabled) })}</div>`,
    },
    {
      id: "sfondo-primario",
      title: "Su sfondo primario",
      description: "Il contenitore ha la classe it-surface-primary: i token si scambiano (base diventa primary, primary diventa primary-content) e il componente si adatta senza opzioni.",
      html: `<div class="it-surface-primary h-56 rounded-box p-6">${toolbar()}</div>`,
    },
  ],
  snippets: [
    { title: "Frecce fra le voci (role=toolbar)", lang: "js", description: "Roving tabindex: un solo Tab per entrare, poi frecce, Home e Fine. Aggiungi role=toolbar e aria-label alla lista.", code: `document.querySelectorAll("[role=toolbar]").forEach((bar) => {
  const items = [...bar.querySelectorAll("a, button, summary")].filter((el) => !el.matches("[aria-disabled=true]"));
  items.forEach((el, i) => (el.tabIndex = i === 0 ? 0 : -1));
  bar.addEventListener("keydown", (e) => {
    const i = items.indexOf(document.activeElement);
    if (i < 0) return;
    const vertical = bar.getAttribute("aria-orientation") === "vertical";
    const keys = vertical ? { ArrowDown: 1, ArrowUp: -1 } : { ArrowRight: 1, ArrowLeft: -1 };
    let n = e.key === "Home" ? 0 : e.key === "End" ? items.length - 1 : keys[e.key] !== undefined ? i + keys[e.key] : null;
    if (n === null) return;
    e.preventDefault();
    n = (n + items.length) % items.length;
    items[i].tabIndex = -1;
    items[n].tabIndex = 0;
    items[n].focus();
  });
});` },
    { title: "Hook React", lang: "tsx", code: `import { useRef, type KeyboardEvent } from "react";

/** Roving tabindex for a horizontal toolbar: spread the result on the container. */
export function useRovingToolbar() {
  const ref = useRef<HTMLDivElement>(null);
  const onKeyDown = (e: KeyboardEvent) => {
    const items = [...(ref.current?.querySelectorAll<HTMLElement>("a, button") ?? [])];
    const i = items.indexOf(document.activeElement as HTMLElement);
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key as "ArrowRight" | "ArrowLeft"];
    if (i < 0 || step === undefined) return;
    e.preventDefault();
    const n = (i + step + items.length) % items.length;
    items.forEach((el, k) => (el.tabIndex = k === n ? 0 : -1));
    items[n].focus();
  };
  return { ref, role: "toolbar", onKeyDown };
}
// <div {...useRovingToolbar()} aria-label="Barra degli strumenti">…</div>` },
  ],
};
