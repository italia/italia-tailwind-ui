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
const accessButton: Record<HeaderSurface, string> = {
  primary: "ita-btn ita-btn-inverse ita-btn-xs",
  base: "ita-btn ita-btn-primary ita-btn-xs",
};
const base = (surface: HeaderSurface) => (surface === "base" ? " ita-header-base" : "");

/** The surface to use: `surface`, or the deprecated `theme` alias. */
const surfaceOf = (a: { surface?: HeaderSurface; theme?: HeaderTheme }): HeaderSurface =>
  a.surface ?? (a.theme === "light" ? "base" : "primary");

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
  const item = (l: NavLink) => `<li><a href="${l.href ?? "#"}"${l.active ? ' aria-current="page"' : ""}>${l.label}</a></li>`;
  const login =
    access === "full"
      ? `<a href="#" class="${accessButton[surface]} ita-header-login" aria-label="Accedi all'area personale">
            <span>${icon("it-user", "")}</span>
            <span aria-hidden="true">Accedi all'area personale</span>
          </a>`
      : access === "button"
        ? `<a href="#" class="${accessButton[surface]}">Accedi</a>`
        : "";
  return `<div class="ita-header-slim${base(surface)}">
  <div class="ita-header-container">
    <a href="#" class="ita-header-owner">${owner}</a>
    <nav aria-label="Navigazione accessoria" class="ita-header-links">
      <ul>
        ${links.map(item).join("\n        ")}
      </ul>
    </nav>
    <div class="ita-header-tools">
      <details class="dropdown dropdown-end ita-header-lang">
        <summary aria-label="Selettore lingua. Lingua attiva: ${languages[0]}">${languages[0]}${chevron()}</summary>
        <ul class="dropdown-content menu">
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
  return `<div class="${cx("ita-header-center", surface === "base" && "ita-header-base", a.compact && "ita-header-compact")}">
  <div class="ita-header-container">
    <div class="ita-header-brand">
      <a href="#">
        ${icon(brandIcon, "")}
        <span>
          <span class="ita-header-name">${title}</span>
          <span class="ita-header-tagline">${tagline}</span>
        </span>
      </a>
    </div>
    <div class="ita-header-tools">
      ${
        socials.length
          ? `<div class="ita-header-socials">
        <span>Seguici su</span>
        <ul>
          ${socials
            .map(
              (s) =>
                `<li><a href="${s.href ?? "#"}" aria-label="${s.label}" target="_blank" rel="noopener">${icon(s.name, "")}</a></li>`,
            )
            .join("\n          ")}
        </ul>
      </div>`
          : ""
      }
      ${
        search
          ? `<div class="ita-header-search">
        <span>Cerca</span>
        <a href="#" aria-label="Cerca nel sito">${icon("it-search", "")}</a>
      </div>`
          : ""
      }
      ${
        a.toggleFor
          ? `<input id="${a.toggleFor}" type="checkbox" class="sr-only" aria-label="Mostra la navigazione">
      <label for="${a.toggleFor}" class="ita-header-burger">
        ${icon("it-burger", "")}
      </label>`
          : ""
      }
    </div>
  </div>
</div>`;
}

const navLink = (l: NavLink) => {
  if (!l.items?.length)
    return `<li><a href="${l.href ?? "#"}"${l.active ? ' aria-current="page"' : ""}${l.disabled ? ' aria-disabled="true" tabindex="-1"' : ""}>${l.label}</a></li>`;
  const panel = l.mega
    ? megamenuPanel({
        label: l.label,
        links: (l.items ?? []).map((s) => ({ label: s.label, href: s.href })),
        headerLink: `Esplora la sezione ${l.label}`,
      })
    : `<ul class="ita-header-submenu">
            ${(l.items ?? []).map((s) => `<li><a href="${s.href ?? "#"}">${s.label}</a></li>`).join("\n            ")}
          </ul>`;
  return `<li${l.mega ? ' class="ita-header-mega"' : ""}>
        <details>
          <summary${l.active ? ' aria-current="page"' : ""}${l.disabled ? ' aria-disabled="true"' : ""}>${l.label}</summary>
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
  return `<div class="ita-header-nav${base(surface)}">
  <nav aria-label="Navigazione principale">
    <div>
      <ul class="menu menu-vertical lg:menu-horizontal">
        ${links.map((l) => navLink(l)).join("\n        ")}
      </ul>
      ${
        secondary.length
          ? `<ul class="menu menu-vertical lg:menu-horizontal ita-header-secondary">
        ${secondary.map((l) => navLink(l)).join("\n        ")}
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
  return `<header class="${cx("ita-header", a.shadow && "ita-header-shadow")}">
${headerSlim({ owner: a.owner, links: a.slimLinks, surface, access: a.access, languages: a.languages })}
${headerCenter({ title: a.title, tagline: a.tagline, brandIcon: a.brandIcon, surface, compact: a.compact, socials: a.socials, search: a.search, toggleFor: id })}
<div class="ita-header-collapse">
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
  classes: ["ita-header", "ita-header-shadow", "ita-header-base", "ita-header-slim", "ita-header-center", "ita-header-compact", "ita-header-nav", "ita-header-container", "ita-header-tools", "ita-header-owner", "ita-header-links", "ita-header-lang", "ita-header-login", "ita-header-brand", "ita-header-name", "ita-header-tagline", "ita-header-socials", "ita-header-search", "ita-header-burger", "ita-header-collapse", "ita-header-secondary", "ita-header-mega", "ita-header-submenu"],
  daisy: ["menu", "menu-horizontal", "menu-vertical", "menu-active", "dropdown", "dropdown-end", "btn", "btn-ghost"],
  cssOnly:
    "Il passaggio desktop/mobile è una media query, non matchMedia: menu-vertical sotto lg, menu-horizontal da lg. I dropdown sono <details>/<summary>, quindi tastiera e chiusura funzionano da sole. Il menu mobile è una checkbox sr-only (ita-header:has(:checked)), al posto della modale del web component.",
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
