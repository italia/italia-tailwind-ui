import { icon, type IconName } from "../icons";
import { cx, type ComponentDoc } from "../types";
import { buttonClass, type ButtonSize, type ButtonVariant } from "./button";

export type DropdownSurface = "base" | "accent";
export type DropdownAlign = "start" | "end" | "top" | "top-end" | "left" | "right";

export interface DropdownItem {
  label?: string;
  href?: string;
  active?: boolean;
  disabled?: boolean;
  /** Taller row with a larger label. */
  large?: boolean;
  /** A rule between groups of items. */
  separator?: boolean;
  /** Plain text instead of a link (dropdown-item-text). */
  text?: boolean;
  icon?: IconName;
  iconPosition?: "left" | "right";
}

export interface DropdownArgs {
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  outline?: boolean;
  disabled?: boolean;
  items?: DropdownItem[];
  /** Small heading above the items. */
  header?: string;
  align?: DropdownAlign;
  /** Menu surface: "base" (default) or "accent", the deep blue of the slim header. */
  surface?: DropdownSurface;
  /** @deprecated Use `surface: "accent"`. */
  dark?: boolean;
  /** Menu as wide as its container. */
  fullWidth?: boolean;
  /** The .italia notch pointing at the toggle. */
  notch?: boolean;
  /** Accessible name when the toggle has no visible label. */
  ariaLabel?: string;
  /** role="menu" for an action menu rather than a link list. */
  role?: "menu";
}

/** The toggle chevron, flipped when its <details> opens (ita-chevron). */
export const chevron = (cls = "") =>
  `<svg class="${cx("ita-chevron", cls)}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 15.5 5.5 9 7 7.5l5 5 5-5L18.5 9z"/></svg>`;

// Literal class maps: Tailwind only sees classes written out in full.
const alignment: Record<DropdownAlign, string> = {
  start: "",
  end: "dropdown-end",
  top: "dropdown-top",
  "top-end": "dropdown-top dropdown-end",
  left: "dropdown-left",
  right: "dropdown-right",
};
const menuAlign: Record<DropdownAlign, string> = {
  start: "",
  end: "ita-menu-end",
  top: "ita-menu-top",
  "top-end": "ita-menu-top-end",
  left: "ita-menu-left",
  right: "ita-menu-right",
};

const dropdownItem = (it: DropdownItem) => {
  if (it.separator) return `<li role="separator"></li>`;
  const glyph = it.icon ? icon(it.icon, "") : "";
  const inner = cx(
    it.iconPosition === "right" ? "" : glyph,
    `<span>${it.label ?? ""}${it.active ? '<span class="sr-only"> attivo</span>' : ""}</span>`,
    it.iconPosition === "right" ? glyph : "",
  );
  if (it.text) return `<li><span>${it.label ?? ""}</span></li>`;
  const attrs = cx(
    it.large ? 'class="ita-menu-item-lg"' : "",
    it.active ? 'aria-current="true"' : "",
    it.disabled ? 'aria-disabled="true" tabindex="-1"' : "",
  );
  return `<li${it.disabled ? ' class="menu-disabled"' : ""}><a href="${it.href ?? "#"}"${attrs ? ` ${attrs}` : ""}>${inner}</a></li>`;
};

/** The menu panel on its own, so the header and the megamenu can reuse it. */
export function dropdownMenu(
  items: DropdownItem[],
  o: { header?: string; align?: DropdownAlign; surface?: DropdownSurface; dark?: boolean; fullWidth?: boolean; notch?: boolean; role?: "menu" } = {},
): string {
  const align = o.align ?? "start";
  const tone: DropdownSurface = o.surface ?? (o.dark ? "accent" : "base");
  const cls = cx(
    "dropdown-content menu ita-menu",
    menuAlign[align],
    tone === "accent" && "ita-menu-accent",
    o.fullWidth && "ita-menu-full",
    o.notch === false && "ita-menu-no-notch",
  );
  const head = o.header ? `<li class="menu-title">${o.header}</li>` : "";
  return `<ul class="${cls}"${o.role ? ` role="${o.role}"` : ""}>
    ${head}${head ? "\n    " : ""}${items.map(dropdownItem).join("\n    ")}
  </ul>`;
}

const defaultItems: DropdownItem[] = [
  { label: "Azione 1", href: "#" },
  { label: "Azione 2", href: "#" },
  { label: "Azione 3", href: "#" },
];

export function dropdown(a: DropdownArgs = {}): string {
  const { label = "Apri dropdown", variant = "primary", size = "default", items = defaultItems, align = "start" } = a;
  const toggle = `<summary class="${buttonClass({ variant, size, outline: a.outline })} gap-2"${
    a.ariaLabel ? ` aria-label="${a.ariaLabel}"` : ""
  }><span>${label}</span>${chevron()}</summary>`;
  const cls = cx("dropdown ita-dropdown", alignment[align], a.fullWidth && "w-full");
  return `<details class="${cls}"${a.disabled ? " aria-disabled=\"true\"" : ""}>
  ${toggle}
  ${dropdownMenu(items, { header: a.header, align, surface: a.surface, dark: a.dark, fullWidth: a.fullWidth, notch: a.notch, role: a.role })}
</details>`;
}

const stage = (html: string, h = "h-64") => `<div class="${h} [&_details]:align-top">${html}</div>`;
const row = (items: string[], h = "h-64") =>
  `<div class="${h} flex flex-wrap items-start gap-3">\n  ${items.join("\n  ")}\n</div>`;

export const doc: ComponentDoc = {
  slug: "dropdown",
  name: "Dropdown",
  replaces: "<it-dropdown>, <it-dropdown-item>",
  summary:
    "Menu a tendina su <details>/<summary> nativi con daisyUI dropdown e menu: apertura, chiusura con Esc e tastiera senza JavaScript. La tacca .italia è una pseudo-classe before che eredita lo sfondo del menu.",
  classes: ["ita-dropdown", "ita-menu", "ita-menu-end", "ita-menu-top", "ita-menu-top-end", "ita-menu-left", "ita-menu-right", "ita-menu-accent", "ita-menu-full", "ita-menu-no-notch", "ita-menu-item-lg", "ita-chevron"],
  daisy: ["dropdown", "dropdown-content", "dropdown-end", "dropdown-top", "dropdown-left", "dropdown-right", "menu", "menu-title", "menu-disabled"],
  cssOnly:
    "Niente Floating UI: il posizionamento è quello di daisyUI (dropdown-end, dropdown-top, dropdown-left, dropdown-right), quindi non c'è flip automatico. La tacca usa before:bg-inherit, così segue da sola il menu chiaro o scuro.",
  examples: [
    {
      id: "varianti",
      title: "Varianti",
      html: row([
        dropdown({ variant: "primary" }),
        dropdown({ variant: "secondary" }),
        dropdown({ variant: "success" }),
        dropdown({ variant: "danger" }),
      ]),
    },
    {
      id: "posizionamento",
      title: "Posizionamento",
      description: "daisyUI posiziona il menu; la tacca segue l'allineamento.",
      html: `<div class="flex flex-col items-start gap-4 pb-56 sm:grid sm:h-80 sm:grid-cols-3 sm:place-items-center sm:gap-2 sm:pb-0">
  <div class="sm:col-start-2">${dropdown({ label: "Apri dropdown", align: "start" })}</div>
  <div class="sm:col-start-1 sm:row-start-2">${dropdown({ label: "Apri dropend", align: "right" })}</div>
  <div class="sm:col-start-3 sm:row-start-2">${dropdown({ label: "Apri dropstart", align: "left" })}</div>
  <div class="sm:col-start-2 sm:row-start-3">${dropdown({ label: "Apri dropup", align: "top" })}</div>
</div>`,
    },
    {
      id: "voci-attive",
      title: "Menu con voci attive",
      html: stage(
        dropdown({
          items: [
            { label: "Attivo", href: "#", active: true },
            { label: "Non attivo", href: "#" },
            { label: "Non attivo", href: "#" },
          ],
        }),
      ),
    },
    {
      id: "voci-disabilitate",
      title: "Menu con voci disabilitate",
      html: row([
        dropdown({
          items: [
            { label: "Azione 1", href: "#" },
            { label: "Azione 2", href: "#", disabled: true },
            { label: "Azione 3", href: "#" },
          ],
        }),
        dropdown({ label: "Dropdown disabilitato", disabled: true }),
      ]),
    },
    {
      id: "intestazioni",
      title: "Menu con intestazioni e separatori",
      html: stage(
        dropdown({
          header: "Intestazione",
          items: [{ label: "Azione 1", href: "#" }, { separator: true }, { label: "Azione 2", href: "#" }],
        }),
      ),
    },
    {
      id: "voci-grandi",
      title: "Menu con voci grandi",
      html: stage(dropdown({ items: defaultItems.map((i) => ({ ...i, large: true })) })),
    },
    {
      id: "icone",
      title: "Menu con icone",
      html: row([
        dropdown({
          label: "Icona a sinistra",
          items: defaultItems.map((i) => ({ ...i, icon: "it-star-outline" as IconName })),
        }),
        dropdown({
          label: "Icona a destra",
          items: defaultItems.map((i) => ({ ...i, icon: "it-star-outline" as IconName, iconPosition: "right" as const })),
        }),
      ]),
    },
    {
      id: "tutta-larghezza",
      title: "Menu a tutta larghezza",
      html: `<div class="h-64 w-full max-w-md">${dropdown({ fullWidth: true })}</div>`,
    },
    {
      id: "sfondo-accent",
      title: "Menu su sfondo accent",
      description: "surface: \"accent\", il blu profondo dello slim header: la variante scura di Dev Kit Italia, con il colore deciso dal tema.",
      html: stage(dropdown({ surface: "accent", header: "Intestazione" })),
    },
    {
      id: "azioni",
      title: "Menu di azioni",
      description: 'role="menu" per un menu di comandi invece di una lista di link.',
      html: stage(
        dropdown({
          label: "Modifica",
          role: "menu",
          items: [
            { label: "Copia", href: "#" },
            { label: "Taglia", href: "#" },
            { label: "Incolla", href: "#" },
            { separator: true },
            { label: "Elimina", href: "#" },
          ],
        }),
      ),
    },
  ],
};
