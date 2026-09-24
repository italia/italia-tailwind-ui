import { icon, type IconName } from "../icons";
import { cx, type ComponentDoc } from "../types";
import { chevron } from "./dropdown";
import { megamenuPanel } from "./megamenu";

/**
 * Which surface the bands sit on: "primary" (the default, blue bands) or
 * "base" (the page background with primary text). The name is the daisyUI
 * token, so it stays true in every theme.
 */
export type HeaderSurface = "primary" | "base";
/** @deprecated Use HeaderSurface: "default" is "primary", "light" is "base". */
export type HeaderTheme = "default" | "light";

export interface NavLink {
  label: string;
  href?: string;
  active?: boolean;
  disabled?: boolean;
  /** Sub-links: renders a <details> dropdown (inline accordion under lg). */
  items?: NavLink[];
  /** Wide two-column panel with a description: the megamenu variant. */
  mega?: boolean;
}

export interface HeaderSlimArgs {
  owner?: string;
  links?: NavLink[];
  surface?: HeaderSurface;
  /** @deprecated Use `surface`: `theme: "light"` is `surface: "base"`. */
  theme?: HeaderTheme;
  /** Login control: a small button, or the full-width one with a circled icon. */
  access?: "button" | "full" | "none";
  languages?: string[];
}

export interface HeaderCenterArgs {
  title?: string;
  tagline?: string;
  brandIcon?: IconName;
  surface?: HeaderSurface;
  /** @deprecated Use `surface`: `theme: "light"` is `surface: "base"`. */
  theme?: HeaderTheme;
  /** 64/104px band instead of 72/120px. */
  compact?: boolean;
  socials?: Array<{ name: IconName; label: string; href?: string }>;
  search?: boolean;
  /** id of the checkbox the burger toggles; set by header(). */
  toggleFor?: string;
}

export interface HeaderNavArgs {
  links?: NavLink[];
  secondary?: NavLink[];
  surface?: HeaderSurface;
  /** @deprecated Use `surface`: `theme: "light"` is `surface: "base"`. */
  theme?: HeaderTheme;
}

export interface HeaderArgs extends HeaderSlimArgs, HeaderCenterArgs, HeaderNavArgs {
  slimLinks?: NavLink[];
  shadow?: boolean;
}

// Literal class maps: Tailwind only sees classes written out in full.
const slimSurface: Record<HeaderSurface, string> = {
  primary: "bg-accent text-accent-content",
  base: "border-b border-primary/20 bg-base-100 text-primary",
};
const centerSurface: Record<HeaderSurface, string> = {
  primary: "bg-primary text-primary-content",
  base: "bg-base-100 text-primary",
};
const navSurface: Record<HeaderSurface, string> = {
  primary: "bg-primary text-primary-content",
  base: "bg-base-100 text-primary lg:border-b lg:border-primary/20",
};
const accessButton: Record<HeaderSurface, string> = {
  primary: "btn btn-sm border-0 bg-base-100 font-semibold text-primary hover:bg-base-200",
  base: "btn btn-sm btn-primary font-semibold",
};
// daisyUI's menu paints [aria-current] with --menu-active-bg: the active nav
// item names its own colours so it keeps the .italia underline instead.
const navActive: Record<HeaderSurface, string> = {
  primary: "bg-transparent text-primary-content lg:border-b-4 lg:border-primary-content",
  base: "bg-transparent text-primary lg:border-b-4 lg:border-primary",
};
const searchButton: Record<HeaderSurface, string> = {
  primary: "md:bg-base-100 md:text-primary lg:hover:bg-base-200",
  base: "md:bg-primary md:text-primary-content lg:hover:bg-accent",
};

/** The surface to use: `surface`, or the deprecated `theme` alias. */
const surfaceOf = (a: { surface?: HeaderSurface; theme?: HeaderTheme }): HeaderSurface =>
  a.surface ?? (a.theme === "light" ? "base" : "primary");

const container = "mx-auto flex w-full max-w-[1320px] items-center gap-4 px-4";

let counter = 0;

/** Band 1: owner, accessory nav, language switcher, login. */
export function headerSlim(a: HeaderSlimArgs = {}): string {
  const surface = surfaceOf(a);
  const {
    owner = "Ente appartenenza",
    access = "button",
    languages = ["ITA", "ENG"],
    links = [
      { label: "Link 1", href: "#" },
      { label: "Link 2 (Attivo)", href: "#", active: true },
    ],
  } = a;
  const item = (l: NavLink) =>
    `<li><a href="${l.href ?? "#"}" class="${cx(
      "px-3 py-2 text-sm hover:underline",
      l.active && "font-semibold shadow-[inset_0_-2px_0_currentColor]",
    )}"${l.active ? ' aria-current="page"' : ""}>${l.label}</a></li>`;
  const login =
    access === "full"
      ? `<a href="#" class="${accessButton[surface]} gap-2 px-2 md:px-3" aria-label="Accedi all'area personale">
            <span class="grid size-6 place-items-center rounded-full bg-primary text-primary-content">${icon("it-user", "size-4")}</span>
            <span class="hidden lg:block" aria-hidden="true">Accedi all'area personale</span>
          </a>`
      : access === "button"
        ? `<a href="#" class="${accessButton[surface]}">Accedi</a>`
        : "";
  return `<div class="${slimSurface[surface]}">
  <div class="${container} h-12 justify-between">
    <a href="#" class="min-w-0 truncate text-sm font-semibold hover:underline">${owner}</a>
    <nav aria-label="Navigazione accessoria" class="hidden grow lg:block">
      <ul class="flex items-center justify-end border-x border-current/20 px-1">
        ${links.map(item).join("\n        ")}
      </ul>
    </nav>
    <div class="flex shrink-0 items-center gap-3">
      <details class="dropdown dropdown-end group">
        <summary class="btn btn-ghost btn-sm gap-1 text-sm font-normal uppercase text-current hover:bg-current/10" aria-label="Selettore lingua. Lingua attiva: ${languages[0]}">${languages[0]}${chevron()}</summary>
        <ul class="dropdown-content menu z-40 mt-1 w-32 rounded-box bg-base-100 p-2 text-base-content shadow-lg">
          ${languages
            .map(
              (l, i) =>
                `<li><a href="#"${i === 0 ? ' class="menu-active"' : ""}>${l}${i === 0 ? ' <span class="sr-only">selezionata</span>' : ""}</a></li>`,
            )
            .join("\n          ")}
        </ul>
      </details>${login ? `\n      ${login}` : ""}
    </div>
  </div>
</div>`;
}

/** Band 2: institution brand, socials, search, and the burger on mobile. */
export function headerCenter(a: HeaderCenterArgs = {}): string {
  const surface = surfaceOf(a);
  const {
    title = "Nome dell'Istituzione",
    tagline = "Tag line dell'Istituzione",
    brandIcon = "it-pa",
    search = true,
    socials = [
      { name: "it-facebook", label: "Facebook" },
      { name: "it-github", label: "Github" },
      { name: "it-twitter", label: "Twitter" },
    ],
  } = a;
  const brandSize = a.compact ? "size-10 md:size-12 lg:size-14" : "size-10 md:size-14 lg:size-18";
  return `<div class="${centerSurface[surface]}">
  <div class="${container} ${a.compact ? "h-16 lg:h-26" : "h-18 lg:h-30"} justify-between">
    <div class="min-w-0">
      <a href="#" class="flex min-w-0 items-center gap-2 no-underline hover:no-underline">
        ${icon(brandIcon, `${brandSize} shrink-0`)}
        <span class="min-w-0">
          <span class="block truncate text-xl font-bold leading-tight lg:text-3xl">${title}</span>
          <span class="hidden truncate text-base md:block">${tagline}</span>
        </span>
      </a>
    </div>
    <div class="flex shrink-0 items-center gap-2 md:gap-4">
      ${
        socials.length
          ? `<div class="hidden items-center gap-1 text-xs md:flex">
        <span>Seguici su</span>
        <ul class="flex items-center">
          ${socials
            .map(
              (s) =>
                `<li><a href="${s.href ?? "#"}" class="grid size-8 place-items-center hover:opacity-80" aria-label="${s.label}" target="_blank" rel="noopener">${icon(s.name, "size-5")}</a></li>`,
            )
            .join("\n          ")}
        </ul>
      </div>`
          : ""
      }
      ${
        search
          ? `<div class="flex items-center gap-2 text-xs md:ms-6">
        <span class="hidden md:block">Cerca</span>
        <a href="#" class="grid size-12 place-items-center rounded-full lg:size-14 ${searchButton[surface]}" aria-label="Cerca nel sito">${icon("it-search", "size-6")}</a>
      </div>`
          : ""
      }
      ${
        a.toggleFor
          ? `<input id="${a.toggleFor}" type="checkbox" class="peer sr-only" aria-label="Mostra la navigazione">
      <label for="${a.toggleFor}" class="btn btn-ghost btn-square text-current peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 lg:hidden">
        ${icon("it-burger", "size-6")}
      </label>`
          : ""
      }
    </div>
  </div>
</div>`;
}

const navLink = (l: NavLink, surface: HeaderSurface, secondary = false) => {
  const cls = cx(
    "rounded-none px-3 py-3 hover:bg-current/10",
    secondary ? "text-sm" : "font-semibold",
    l.active && navActive[surface],
    l.disabled && "pointer-events-none opacity-50",
  );
  if (!l.items?.length)
    return `<li><a href="${l.href ?? "#"}" class="${cls}"${l.active ? ' aria-current="page"' : ""}${l.disabled ? ' aria-disabled="true" tabindex="-1"' : ""}>${l.label}</a></li>`;
  const panel = l.mega
    ? megamenuPanel({
        label: l.label,
        links: (l.items ?? []).map((s) => ({ label: s.label, href: s.href })),
        headerLink: `Esplora la sezione ${l.label}`,
      })
    : `<ul class="w-56 text-base-content">
            ${(l.items ?? []).map((s) => `<li><a href="${s.href ?? "#"}">${s.label}</a></li>`).join("\n            ")}
          </ul>`;
  return `<li${l.mega ? ' class="lg:static"' : ""}>
        <details class="${l.mega ? "group relative lg:static lg:overflow-visible" : "group relative"}">
          <summary class="${cls}">${l.label}</summary>
          ${panel}
        </details>
      </li>`;
};

/** Band 3: the main navigation. */
export function headerNav(a: HeaderNavArgs = {}): string {
  const surface = surfaceOf(a);
  const {
    links = [
      { label: "Link attivo", href: "#", active: true },
      { label: "Link disabilitato", href: "#", disabled: true },
      {
        label: "Dropdown",
        items: [
          { label: "Link lista 1", href: "#" },
          { label: "Link lista 2", href: "#" },
          { label: "Link lista 3", href: "#" },
        ],
      },
      {
        label: "Megamenu",
        mega: true,
        items: [1, 2, 3, 4, 5, 6].map((n) => ({ label: `Link lista ${n}`, href: "#" })),
      },
    ],
    secondary = [],
  } = a;
  return `<div class="${navSurface[surface]} border-t border-current/20 lg:relative lg:border-t-0">
  <nav aria-label="Navigazione principale" class="mx-auto w-full max-w-[1320px] px-4">
    <div class="flex flex-col justify-between gap-0 lg:flex-row lg:items-end">
      <ul class="menu menu-vertical w-full gap-0 p-0 lg:menu-horizontal lg:w-auto lg:items-end">
        ${links.map((l) => navLink(l, surface)).join("\n        ")}
      </ul>
      ${
        secondary.length
          ? `<ul class="menu menu-vertical w-full gap-0 p-0 lg:menu-horizontal lg:w-auto lg:items-end lg:justify-end">
        ${secondary.map((l) => navLink(l, surface, true)).join("\n        ")}
      </ul>`
          : ""
      }
    </div>
  </nav>
</div>`;
}

/** The three bands together, with the CSS-only mobile menu toggle. */
export function header(a: HeaderArgs = {}): string {
  const surface = surfaceOf(a);
  const id = `header-nav-${++counter}`;
  return `<header class="${cx("group/nav relative", a.shadow && "shadow-[0_8px_16px_rgb(0_0_0/0.1)]")}">
${headerSlim({ owner: a.owner, links: a.slimLinks, surface, access: a.access, languages: a.languages })}
${headerCenter({ title: a.title, tagline: a.tagline, brandIcon: a.brandIcon, surface, compact: a.compact, socials: a.socials, search: a.search, toggleFor: id })}
<div class="hidden group-has-checked/nav:block lg:block">
${headerNav({ links: a.links, secondary: a.secondary, surface })}
</div>
</header>`;
}

export const doc: ComponentDoc = {
  slug: "header",
  name: "Header",
  replaces: "<it-header>",
  summary:
    "Le tre fasce dell'intestazione .italia — slim, centrale e navigazione — su daisyUI menu, dropdown e navbar. Su mobile il menu si apre con una checkbox, senza JavaScript.",
  daisy: ["menu", "menu-horizontal", "menu-vertical", "menu-active", "dropdown", "dropdown-end", "btn", "btn-ghost"],
  cssOnly:
    "Il passaggio desktop/mobile è una media query, non matchMedia: menu-vertical sotto lg, menu-horizontal da lg. I dropdown sono <details>/<summary>, quindi tastiera e chiusura funzionano da sole. Il menu mobile è una checkbox sr-only con peer-checked, al posto della modale del web component.",
  examples: [
    { id: "slim", fullBleed: true, title: "Slim Header", html: headerSlim() },
    { id: "slim-full", fullBleed: true, title: "Slim Header con pulsante full-responsive", html: headerSlim({ access: "full" }) },
    { id: "slim-base", fullBleed: true, title: "Slim Header - sfondo base", html: headerSlim({ surface: "base" }) },
    { id: "centrale", fullBleed: true, title: "Header centrale", html: headerCenter() },
    { id: "centrale-compatto", fullBleed: true, title: "Header centrale - versione compatta", html: headerCenter({ compact: true }) },
    { id: "centrale-base", fullBleed: true, title: "Header centrale - sfondo base", html: headerCenter({ surface: "base" }) },
    { id: "nav", fullBleed: true, title: "Header nav", html: headerNav() },
    { id: "nav-base", fullBleed: true, title: "Header nav - sfondo base", html: headerNav({ surface: "base" }) },
    {
      id: "nav-secondaria",
      fullBleed: true,
      title: "Header nav con navigazione secondaria",
      html: headerNav({
        links: [
          { label: "Link attivo", href: "#", active: true },
          { label: "Link disabilitato", href: "#", disabled: true },
          { label: "Link", href: "#" },
        ],
        secondary: [
          { label: "Link secondario", href: "#" },
          { label: "Link secondario", href: "#" },
        ],
      }),
    },
    {
      id: "completo",
      fullBleed: true,
      title: "Header completo",
      description: "Sotto lg la fascia di navigazione si apre con il pulsante burger.",
      html: header(),
    },
    { id: "completo-base", fullBleed: true, title: "Header completo - sfondo base", html: header({ surface: "base", shadow: true }) },
  ],
};
