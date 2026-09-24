import { icon, type IconName } from "../icons";
import { cx, type ComponentDoc } from "../types";
import { chevron, dropdownMenu, type DropdownItem } from "./dropdown";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
export type AvatarColor = "default" | "primary" | "secondary";
export type AvatarStatus = "online" | "busy" | "away" | "offline";

export interface AvatarArgs {
  /** Image URL; without it the avatar shows `initials` or `icon`. */
  src?: string;
  /** Alt text for the image, or the accessible name of initials and icon. */
  alt?: string;
  initials?: string;
  icon?: IconName;
  size?: AvatarSize;
  color?: AvatarColor;
  status?: AvatarStatus;
  /** Wraps the avatar in a link. */
  href?: string;
}

// bootstrap-italia sizes: 16, 24, 40, 56, 80, 112px.
// Literal class maps: Tailwind only sees classes written out in full.
const boxSize: Record<AvatarSize, string> = {
  xs: "size-4 text-[0.625rem]",
  sm: "size-6 text-xs",
  md: "size-10 text-base",
  lg: "size-14 text-xl",
  xl: "size-20 text-3xl",
  xxl: "size-28 text-5xl",
};
const iconSize: Record<AvatarSize, string> = {
  xs: "size-2.5",
  sm: "size-3.5",
  md: "size-5",
  lg: "size-7",
  xl: "size-10",
  xxl: "size-14",
};
const dotSize: Record<AvatarSize, string> = {
  xs: "size-1.5 ring-1",
  sm: "size-2 ring-1",
  md: "size-3 ring-2",
  lg: "size-3.5 ring-2",
  xl: "size-4 ring-2",
  xxl: "size-5 ring-2",
};
const colors: Record<AvatarColor, string> = {
  default: "bg-secondary/15 text-secondary",
  primary: "bg-primary text-primary-content",
  secondary: "bg-secondary text-secondary-content",
};
const statusColor: Record<AvatarStatus, string> = {
  online: "status-success",
  busy: "status-error",
  away: "status-warning",
  offline: "bg-base-content/40",
};
const statusLabel: Record<AvatarStatus, string> = {
  online: "in linea",
  busy: "occupato",
  away: "assente",
  offline: "non in linea",
};

export function avatar(a: AvatarArgs = {}): string {
  const { size = "md", color = "default" } = a;
  const alt = a.alt ?? (a.initials ? "" : "Utente");
  const inner = a.src
    ? `<img src="${a.src}" alt="${alt}">`
    : a.initials
      ? `<span${alt ? ` aria-hidden="true"` : ""}>${a.initials}</span>${alt ? `<span class="sr-only">${alt}</span>` : ""}`
      : `${icon(a.icon ?? "it-user", iconSize[size])}<span class="sr-only">${alt}</span>`;
  const box = cx(
    // daisyUI styles only `.avatar > div`; a span keeps the markup valid inside links and summaries.
    "flex items-center justify-center overflow-hidden rounded-full font-semibold leading-none",
    boxSize[size],
    !a.src && colors[color],
    a.href && "transition group-hover:ring-2 group-hover:ring-primary group-hover:ring-offset-2 group-hover:ring-offset-base-100",
  );
  const dot = a.status
    ? `<span class="${cx("status absolute end-0 top-0 rounded-full ring-base-100", dotSize[size], statusColor[a.status])}"></span><span class="sr-only">, ${statusLabel[a.status]}</span>`
    : "";
  const body = `<span class="${cx("avatar", !a.src && "avatar-placeholder", a.href && "group")}"><span class="${box}">${inner}</span>${dot}</span>`;
  return a.href ? `<a href="${a.href}" class="inline-flex rounded-full">${body}</a>` : body;
}

/** Overlapping avatars, with an optional "+N" counter. */
export function avatarGroup(items: AvatarArgs[], o: { size?: AvatarSize; more?: number; label?: string } = {}): string {
  const size = o.size ?? "md";
  const faces = items.map((it) => `<li class="flex">${avatar({ ...it, size }).replace('class="avatar', 'class="avatar border-2 border-base-100')}</li>`);
  if (o.more)
    faces.push(
      `<li class="flex">${avatar({ initials: `+${o.more}`, alt: `e altre ${o.more} persone`, size, color: "secondary" }).replace('class="avatar', 'class="avatar border-2 border-base-100')}</li>`,
    );
  return `<ul class="avatar-group -space-x-3 overflow-visible"${o.label ? ` aria-label="${o.label}"` : ""}>\n  ${faces.join("\n  ")}\n</ul>`;
}

/** Avatar with a name and a second line beside it. */
export function avatarWithText(a: AvatarArgs & { name: string; detail?: string }): string {
  return `<div class="flex items-center gap-3">
  ${avatar({ ...a, alt: a.alt ?? "" })}
  <div class="flex flex-col leading-tight">
    <span class="font-semibold">${a.name}</span>${a.detail ? `\n    <span class="text-sm text-base-content/70">${a.detail}</span>` : ""}
  </div>
</div>`;
}

/** Avatar as the toggle of a dropdown menu, as in a logged-in header. */
export function avatarDropdown(a: AvatarArgs & { name: string; items?: DropdownItem[] }): string {
  const items = a.items ?? [
    { label: "Il mio profilo", href: "#", icon: "it-user" },
    { label: "Impostazioni", href: "#", icon: "it-settings" },
    { separator: true },
    { label: "Esci", href: "#", icon: "it-logout" },
  ];
  return `<details class="dropdown group">
  <summary class="flex cursor-pointer list-none items-center gap-2 rounded-full pe-2 text-primary [&::-webkit-details-marker]:hidden">
    ${avatar({ ...a, alt: "" })}<span class="font-semibold">${a.name}</span>${chevron()}
  </summary>
  ${dropdownMenu(items)}
</details>`;
}

const sizes: AvatarSize[] = ["xs", "sm", "md", "lg", "xl", "xxl"];
const row = (items: string[]) => `<div class="flex flex-wrap items-end gap-4">\n  ${items.join("\n  ")}\n</div>`;
const photo = (n: number) => `https://picsum.photos/id/${n}/224/224`;

export const doc: ComponentDoc = {
  slug: "avatar",
  name: "Avatar",
  replaces: "<it-avatar>, <it-avatar-group>",
  summary:
    "Immagine, iniziali o icona dell'utente in un cerchio, nelle sei misure di bootstrap-italia (16–112px), con stato, gruppi sovrapposti e menu.",
  daisy: ["avatar", "avatar-placeholder", "avatar-group", "status", "status-success", "dropdown"],
  cssOnly:
    "Lo stato è un daisyUI status posizionato sull'angolo, ripetuto in testo per i lettori di schermo. Il menu dell'avatar è lo stesso Dropdown su <details>.",
  examples: [
    {
      id: "immagine",
      title: "Con immagine",
      html: row(sizes.map((s) => avatar({ src: photo(64), alt: "Mario Rossi", size: s }))),
    },
    {
      id: "iniziali",
      title: "Con iniziali",
      html: `<div class="flex flex-col gap-4">
${row(sizes.map((s) => avatar({ initials: "MR", alt: "Mario Rossi", size: s })))}
${row(sizes.map((s) => avatar({ initials: "AV", alt: "Anna Verdi", size: s, color: "primary" })))}
${row(sizes.map((s) => avatar({ initials: "GB", alt: "Giulia Bianchi", size: s, color: "secondary" })))}
</div>`,
    },
    {
      id: "icona",
      title: "Con icona",
      html: row([
        ...sizes.map((s) => avatar({ size: s })),
        avatar({ icon: "it-pa", alt: "Ente", size: "lg", color: "primary" }),
        avatar({ icon: "it-mail", alt: "Messaggi", size: "lg", color: "secondary" }),
      ]),
    },
    {
      id: "stato",
      title: "Con stato",
      html: row([
        avatar({ src: photo(64), alt: "Anna Verdi", size: "lg", status: "online" }),
        avatar({ initials: "MR", alt: "Mario Rossi", size: "lg", status: "busy" }),
        avatar({ initials: "GB", alt: "Giulia Bianchi", size: "lg", color: "primary", status: "away" }),
        avatar({ size: "lg", status: "offline" }),
        avatar({ src: photo(1005), alt: "Luca Neri", size: "xl", status: "online" }),
      ]),
    },
    {
      id: "link",
      title: "Come link",
      description: "Al passaggio del mouse compare un anello primario.",
      html: row([avatar({ src: photo(1012), alt: "Profilo di Mario Rossi", size: "lg", href: "#" }), avatar({ initials: "AV", alt: "Profilo di Anna Verdi", size: "lg", href: "#", color: "primary" })]),
    },
    {
      id: "gruppo",
      title: "Gruppo di avatar",
      html: `<div class="flex flex-col gap-6">
${avatarGroup([{ src: photo(1011), alt: "Mario Rossi" }, { src: photo(64), alt: "Anna Verdi" }, { initials: "GB", alt: "Giulia Bianchi", color: "primary" }, { src: photo(1005), alt: "Luca Neri" }], { more: 5, label: "Partecipanti" })}
${avatarGroup([{ src: photo(1027), alt: "Sara Blu" }, { initials: "PL", alt: "Paolo Lilla", color: "secondary" }, { src: photo(338), alt: "Carla Gialli" }], { size: "lg", label: "Redazione" })}
</div>`,
    },
    {
      id: "testo",
      title: "Con testo",
      html: `<div class="flex flex-wrap gap-8">
${avatarWithText({ src: photo(64), name: "Mario Rossi", detail: "Ufficio anagrafe" })}
${avatarWithText({ initials: "AV", color: "primary", name: "Anna Verdi", detail: "Responsabile del procedimento", size: "lg" })}
</div>`,
    },
    {
      id: "menu",
      title: "Con menu",
      html: `<div class="h-56">${avatarDropdown({ src: photo(64), name: "Mario Rossi", size: "sm" })}</div>`,
    },
  ],
};
