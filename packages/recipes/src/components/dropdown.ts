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

/** The toggle chevron, flipped by `details[open]` through the `group` class. */
export const chevron = (cls = "size-4") =>
  `<svg class="${cls} shrink-0 fill-current transition-transform group-open:-scale-y-100" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 15.5 5.5 9 7 7.5l5 5 5-5L18.5 9z"/></svg>`;

// Literal class maps: Tailwind only sees classes written out in full.
const alignment: Record<DropdownAlign, string> = {
  start: "",
  end: "dropdown-end",
  top: "dropdown-top",
  "top-end": "dropdown-top dropdown-end",
  left: "dropdown-left",
  right: "dropdown-right",
};
const spacing: Record<DropdownAlign, string> = {
  start: "mt-3",
  end: "mt-3",
  top: "mb-3",
  "top-end": "mb-3",
  left: "me-2",
  right: "ms-2",
};
// The notch is a 18px square rotated 45°, taking the menu's own background
// through bg-inherit, so the base and accent menus need no separate rule.
const notchBase =
  "before:absolute before:size-[1.125rem] before:rotate-45 before:rounded-[2px] before:bg-inherit before:content-['']";
const notchPosition: Record<DropdownAlign, string> = {
  start: "before:-top-2 before:start-5",
  end: "before:-top-2 before:end-3",
  top: "before:-bottom-2 before:start-5",
  "top-end": "before:-bottom-2 before:end-3",
  left: "",
  right: "",
};
const surface: Record<DropdownSurface, string> = {
  base: "bg-base-100 text-base-content",
  accent: "bg-accent text-accent-content",
};
const linkColor: Record<DropdownSurface, string> = {
  base: "text-primary hover:bg-primary/10",
  accent: "text-accent-content hover:bg-base-100/15",
};
// daisyUI's menu fills any [aria-current] item with --menu-active-bg; .italia
// marks the active voice with weight and an underline instead.
const linkActive: Record<DropdownSurface, string> = {
  base: "bg-transparent font-bold text-primary underline underline-offset-2",
  accent: "bg-transparent font-bold text-accent-content underline underline-offset-2",
};

const dropdownItem = (it: DropdownItem, tone: DropdownSurface) => {
  if (it.separator)
    return `<li class="pointer-events-none my-1 h-px ${tone === "accent" ? "bg-base-100/25" : "bg-base-content/15"}" role="separator"></li>`;
  const glyph = it.icon ? icon(it.icon, "size-4 text-primary") : "";
  const inner = cx(
    it.iconPosition === "right" ? "" : glyph,
    `<span>${it.label ?? ""}${it.active ? '<span class="sr-only"> attivo</span>' : ""}</span>`,
    it.iconPosition === "right" ? glyph : "",
  );
  const cls = cx(
    "rounded-sm px-4",
    it.large ? "py-3 text-base" : "py-2 text-sm",
    linkColor[tone],
    it.active && linkActive[tone],
    it.disabled && "pointer-events-none opacity-40",
  );
  if (it.text) return `<li><span class="${cx("px-4 py-2 text-sm", tone === "accent" ? "" : "text-primary")}">${it.label ?? ""}</span></li>`;
  const attrs = cx(
    it.active ? ' aria-current="true"' : "",
    it.disabled ? ' aria-disabled="true" tabindex="-1"' : "",
    " ",
  ).trim();
  return `<li${it.disabled ? ' class="menu-disabled"' : ""}><a href="${it.href ?? "#"}" class="${cls}"${attrs ? ` ${attrs}` : ""}>${inner}</a></li>`;
};

/** The menu panel on its own, so the header and the megamenu can reuse it. */
export function dropdownMenu(
  items: DropdownItem[],
  o: { header?: string; align?: DropdownAlign; surface?: DropdownSurface; dark?: boolean; fullWidth?: boolean; notch?: boolean; role?: "menu" } = {},
): string {
  const align = o.align ?? "start";
  const tone: DropdownSurface = o.surface ?? (o.dark ? "accent" : "base");
  const cls = cx(
    "dropdown-content menu z-30 gap-0 rounded-sm p-2 shadow-[0_4px_12px_rgb(0_0_0/0.15)]",
    surface[tone],
    spacing[align],
    o.fullWidth ? "w-full" : "w-56",
    o.notch !== false && notchPosition[align] && `${notchBase} ${notchPosition[align]}`,
  );
  const head = o.header
    ? `<li class="menu-title px-4 py-2 text-sm font-semibold ${tone === "accent" ? "text-accent-content/80" : "text-base-content/70"}">${o.header}</li>`
    : "";
  return `<ul class="${cls}"${o.role ? ` role="${o.role}"` : ""}>
    ${head}${head ? "\n    " : ""}${items.map((i) => dropdownItem(i, tone)).join("\n    ")}
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
  const cls = cx("dropdown group", alignment[align], a.fullWidth && "w-full", a.disabled && "pointer-events-none opacity-50");
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
  daisy: ["dropdown", "dropdown-content", "dropdown-end", "dropdown-top", "dropdown-left", "dropdown-right", "menu", "menu-title", "btn"],
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
      html: `<div class="grid h-80 grid-cols-3 place-items-center gap-2">
  <div class="col-start-2">${dropdown({ label: "Apri dropdown", align: "start" })}</div>
  <div class="col-start-1 row-start-2">${dropdown({ label: "Apri dropend", align: "right" })}</div>
  <div class="col-start-3 row-start-2">${dropdown({ label: "Apri dropstart", align: "left" })}</div>
  <div class="col-start-2 row-start-3">${dropdown({ label: "Apri dropup", align: "top" })}</div>
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
