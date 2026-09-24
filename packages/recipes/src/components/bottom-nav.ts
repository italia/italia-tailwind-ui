import { icon, type IconName } from "../icons";
import { cx, type ComponentDoc } from "../types";

export interface BottomNavItem {
  label: string;
  href?: string;
  icon: IconName;
  active?: boolean;
  disabled?: boolean;
  /** Counter badge on the icon. */
  badge?: number;
  /** Plain dot on the icon, for "something new". */
  alert?: boolean;
  /** What the badge or dot means, for screen readers. */
  badgeLabel?: string;
}

export interface BottomNavArgs {
  items?: BottomNavItem[];
  label?: string;
  /** "fixed" pins it to the bottom of the viewport; "static" shows it in place, for docs. */
  position?: "fixed" | "static";
}

const defaultItems: BottomNavItem[] = [
  { label: "Home", href: "#", icon: "it-pa", active: true },
  { label: "Messaggi", href: "#", icon: "it-mail", badge: 3, badgeLabel: "3 messaggi non letti" },
  { label: "Pagamenti", href: "#", icon: "it-card", alert: true, badgeLabel: "avviso in scadenza" },
  { label: "Profilo", href: "#", icon: "it-user" },
];

const item = (it: BottomNavItem) => {
  const mark = it.badge
    ? `<span class="indicator-item ita-indicator-count" aria-hidden="true">${it.badge}</span>`
    : it.alert
      ? `<span class="indicator-item ita-indicator-dot" aria-hidden="true"></span>`
      : "";
  const sr = (it.badge || it.alert) && it.badgeLabel ? `<span class="sr-only">, ${it.badgeLabel}</span>` : "";
  const attrs = cx(it.active && ` aria-current="page"`, it.disabled && ` aria-disabled="true" tabindex="-1"`).replace(/ {2,}/g, " ");
  return `<a href="${it.href ?? "#"}"${it.active ? ' class="dock-active"' : ""}${attrs}>
    <span class="indicator">${mark}${icon(it.icon, "")}</span>
    <span class="dock-label">${it.label}</span>${sr}
  </a>`;
};

export function bottomNav(a: BottomNavArgs = {}): string {
  const { items = defaultItems, label = "Navigazione principale", position = "fixed" } = a;
  const cls = cx("dock dock-md ita-bottom-nav", position === "static" && "ita-bottom-nav-static");
  return `<nav class="${cls}" aria-label="${label}">
  ${items.map(item).join("\n  ")}
</nav>`;
}

export const doc: ComponentDoc = {
  slug: "bottom-nav",
  name: "Bottom navigation",
  replaces: "<it-bottom-nav>",
  summary:
    "La barra di navigazione in fondo allo schermo delle app mobili: daisyUI dock con icona, etichetta, contatori e la voce corrente in colore primario.",
  classes: ["ita-bottom-nav", "ita-bottom-nav-static", "ita-indicator-count", "ita-indicator-dot"],
  daisy: ["dock", "dock-md", "dock-active", "dock-label", "indicator", "indicator-item", "badge", "status"],
  cssOnly:
    "dock è fisso in fondo alla pagina e tiene conto della safe area di iOS (aggiungi viewport-fit=cover al meta viewport). La voce corrente usa sia dock-active sia aria-current=\"page\". I contatori sono nascosti ai lettori di schermo e ripetuti come testo.",
  examples: [
    {
      id: "base",
      title: "Esempio base",
      description: "Mostrata sul posto; nella pagina reale è fissa in fondo.",
      html: `<div class="mx-auto max-w-sm overflow-hidden rounded-box border border-base-content/15">
  <div class="h-40 bg-base-200"></div>
  ${bottomNav({ position: "static" })}
</div>`,
    },
    {
      id: "cinque-voci",
      title: "Cinque voci e voce disabilitata",
      html: `<div class="mx-auto max-w-md overflow-hidden rounded-box border border-base-content/15">
  ${bottomNav({
    position: "static",
    items: [
      { label: "Home", icon: "it-pa" },
      { label: "Cerca", icon: "it-search", active: true },
      { label: "Servizi", icon: "it-list" },
      { label: "Documenti", icon: "it-files", disabled: true },
      { label: "Impostazioni", icon: "it-settings", badge: 1, badgeLabel: "1 aggiornamento" },
    ],
  })}
</div>`,
    },
    {
      id: "sfondo-primario",
      title: "Su sfondo primario",
      description: "Il contenitore ha la classe it-surface-primary: i token si scambiano (base diventa primary, primary diventa primary-content) e il componente si adatta senza opzioni.",
      html: `<div class="it-surface-primary mx-auto max-w-sm overflow-hidden rounded-box">
  <div class="h-24 bg-base-200"></div>
  ${bottomNav({ position: "static" })}
</div>`,
    },
  ],
};
