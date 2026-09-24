import { icon, type IconName } from "../icons";
import { cx, type ComponentDoc } from "../types";

export interface TabItem {
  label: string;
  /** HTML of the panel. */
  content?: string;
  icon?: IconName;
  /** Icon only; the label stays as the accessible name. */
  iconOnly?: boolean;
  active?: boolean;
  disabled?: boolean;
  /** Link tabs: the page this tab navigates to. */
  href?: string;
}

export interface TabsArgs {
  items?: TabItem[];
  /** "underline" = .italia nav-tabs, "card" = daisyUI tabs-lift. */
  variant?: "underline" | "card";
  /** Tabs share the row equally. */
  fullWidth?: boolean;
  /** Icon above the label instead of before it. */
  iconAbove?: boolean;
  name?: string;
  /** Accessible name of the tab list. */
  label?: string;
}

const lorem = (n: number) =>
  `<p>Contenuto della scheda ${n}. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`;

const defaultItems: TabItem[] = [
  { label: "Scheda 1", content: lorem(1), active: true },
  { label: "Scheda 2", content: lorem(2) },
  { label: "Scheda 3", content: lorem(3) },
];

// daisyUI greys inactive tabs to 50% base-content (under 4.5:1); .italia
// keeps every tab primary and marks the active one with weight and the bar.
const italiaTab = "[&>.tab]:h-auto [&>.tab]:min-h-12 [&>.tab]:gap-2 [&>.tab]:font-semibold [&>.tab]:text-primary [&>.tab:hover]:underline [&>.tab-disabled]:text-base-content/40";

let counter = 0;

/**
 * Radio tabs: each tab is a <label> around a radio, followed by its panel.
 * Checking a radio shows the panel after it (daisyUI tab-content).
 */
export function tabs(a: TabsArgs = {}): string {
  const { items = defaultItems, variant = "underline", label = "Schede" } = a;
  const name = a.name ?? `tabs-${++counter}`;
  const list = cx(
    "tabs",
    variant === "card" ? "tabs-lift" : "tabs-border",
    italiaTab,
    a.fullWidth && "[&>.tab]:flex-1",
    a.iconAbove && "[&>.tab]:flex-col [&>.tab]:py-2",
  );
  const panel = cx(
    "tab-content py-6",
    variant === "card" ? "border-base-300 bg-base-100 px-6" : "rounded-none border-0 border-t border-base-content/15 px-1",
  );
  const body = items
    .map((it) => {
      const glyph = it.icon ? icon(it.icon, "size-6 shrink-0") : "";
      const text = it.iconOnly ? `<span class="sr-only">${it.label}</span>` : `<span>${it.label}</span>`;
      const radio = `<input type="radio" name="${name}"${it.active ? " checked" : ""}${it.disabled ? " disabled" : ""}>`;
      return `  <label class="${cx("tab", it.disabled && "tab-disabled")}">${radio}${glyph}${text}</label>
  <div class="${panel}">${it.content ?? ""}</div>`;
    })
    .join("\n");
  return `<div role="group" class="${list}" aria-label="${label}">\n${body}\n</div>`;
}

/** Tabs that are links to other pages: a nav, the current page marked with aria-current. */
export function tabsNav(a: TabsArgs = {}): string {
  const { items = defaultItems, label = "Sezioni" } = a;
  const list = cx("tabs tabs-border border-b border-base-content/15", italiaTab, a.fullWidth && "[&>.tab]:flex-1");
  const links = items.map(
    (it) =>
      `<a href="${it.href ?? "#"}" class="${cx("tab", it.disabled && "tab-disabled")}"${it.active ? ` aria-current="page"` : ""}${
        it.disabled ? ` aria-disabled="true" tabindex="-1"` : ""
      }>${it.icon ? icon(it.icon, "size-6 shrink-0") : ""}<span>${it.label}</span></a>`,
  );
  return `<nav class="${list}" aria-label="${label}">\n  ${links.join("\n  ")}\n</nav>`;
}

const withIcons: TabItem[] = [
  { label: "Documenti", icon: "it-files", content: lorem(1), active: true },
  { label: "Messaggi", icon: "it-mail", content: lorem(2) },
  { label: "Pagamenti", icon: "it-card", content: lorem(3) },
  { label: "Archivio", icon: "it-folder", content: lorem(4), disabled: true },
];

export const doc: ComponentDoc = {
  slug: "tabs",
  name: "Tabs",
  replaces: "<it-tabs>, <it-tab-item>, <it-tab-panel>",
  summary:
    "Schede su radio button nativi con daisyUI tabs: il pannello visibile segue il radio selezionato. Stile .italia sottolineato o a schede, anche con icone. Per le sezioni su pagine diverse ci sono le schede come link.",
  daisy: ["tabs", "tab", "tab-content", "tabs-border", "tabs-lift", "tab-disabled"],
  cssOnly:
    "Le schede sono un gruppo di radio: Tab entra nel gruppo, le frecce cambiano scheda e il pannello segue, senza JavaScript. I lettori di schermo le annunciano come «pulsante di opzione» e non come tablist, perché role=tab e aria-controls richiedono uno script che aggiorni aria-selected. Se la scheda porta a un'altra pagina usa tabsNav con aria-current=\"page\".",
  examples: [
    { id: "base", title: "Esempio base", html: tabs() },
    { id: "icone", title: "Con icone", html: tabs({ items: withIcons }) },
    { id: "icona-sopra", title: "Icona sopra l'etichetta", html: tabs({ items: withIcons, iconAbove: true, fullWidth: true }) },
    {
      id: "solo-icone",
      title: "Solo icone",
      html: tabs({ items: withIcons.map((i) => ({ ...i, iconOnly: true })) }),
    },
    { id: "schede", title: "A schede (card)", html: tabs({ variant: "card" }) },
    { id: "tutta-larghezza", title: "A tutta larghezza", html: tabs({ fullWidth: true }) },
    {
      id: "link",
      title: "Schede come link",
      description: "Navigazione fra pagine: un <nav> di link, la pagina corrente con aria-current.",
      html: tabsNav({
        items: [
          { label: "Panoramica", href: "#", active: true },
          { label: "Documenti", href: "#" },
          { label: "Storico", href: "#" },
          { label: "Non disponibile", href: "#", disabled: true },
        ],
      }),
    },
    { id: "scuro", title: "Tema scuro", html: `<div data-theme="italia-dark" class="rounded-box bg-base-100 p-6">${tabs({ items: withIcons })}</div>` },
  ],
  snippets: [
    { title: "Schede ARIA vere (tablist)", lang: "js", description: "Se ti serve la semantica tablist: pulsanti role=tab, frecce sinistra/destra, Home/Fine e aria-selected aggiornato. Markup: div role=tablist con button role=tab aria-controls, seguiti dai pannelli role=tabpanel.", code: `document.querySelectorAll("[role=tablist]").forEach((list) => {
  const tabs = [...list.querySelectorAll("[role=tab]")];
  const select = (tab) => {
    for (const t of tabs) {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      t.classList.toggle("tab-active", on);
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    }
    tab.focus();
  };
  list.addEventListener("click", (e) => { const t = e.target.closest("[role=tab]"); if (t) select(t); });
  list.addEventListener("keydown", (e) => {
    const i = tabs.indexOf(document.activeElement);
    const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select(tabs[(next + tabs.length) % tabs.length]);
  });
});` },
    { title: "Componente React", lang: "tsx", code: `import { useId, useRef, useState, type ReactNode } from "react";

export function Tabs({ items }: { items: { label: string; content: ReactNode }[] }) {
  const [current, setCurrent] = useState(0);
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const go = (i: number) => { const n = (i + items.length) % items.length; setCurrent(n); refs.current[n]?.focus(); };
  return (
    <div>
      <div role="tablist" className="tabs tabs-border [&>.tab]:font-semibold [&>.tab]:text-primary"
           onKeyDown={(e) => ({ ArrowRight: () => go(current + 1), ArrowLeft: () => go(current - 1) } as Record<string, () => void>)[e.key]?.()}>
        {items.map((it, i) => (
          <button key={i} ref={(el) => { refs.current[i] = el; }} role="tab" type="button" id={base + "-t" + i}
                  aria-selected={i === current} aria-controls={base + "-p" + i} tabIndex={i === current ? 0 : -1}
                  className={"tab" + (i === current ? " tab-active" : "")} onClick={() => setCurrent(i)}>
            {it.label}
          </button>
        ))}
      </div>
      {items.map((it, i) => (
        <div key={i} role="tabpanel" id={base + "-p" + i} aria-labelledby={base + "-t" + i} hidden={i !== current} className="border-t border-base-content/15 py-6">
          {it.content}
        </div>
      ))}
    </div>
  );
}` },
  ],
};
