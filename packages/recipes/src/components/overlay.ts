import { icon, type IconName } from "../icons";
import { cx, type ComponentDoc } from "../types";

export type OverlayTone = "primary" | "black";
export type OverlayHeight = "band" | "full";
export type DimmerVariant = "dark" | "primary";

export interface OverlayArgs {
  image?: string;
  imageAlt?: string;
  /** Caption inside the panel. */
  text?: string;
  tone?: OverlayTone;
  /** Band along the bottom, or a panel over the whole image. */
  height?: OverlayHeight;
  /** Centred icon instead of text. */
  icon?: IconName;
  /** Panel appears only on hover and on keyboard focus. */
  onHover?: boolean;
  href?: string;
  width?: string;
}

export interface DimmerArgs {
  /** The content the dimmer covers. */
  children?: string;
  text?: string;
  title?: string;
  icon?: IconName;
  variant?: DimmerVariant;
  /** Open from the start. */
  active?: boolean;
  /** Raw HTML for the actions. */
  actions?: string;
  toggleLabel?: string;
  id?: string;
}

// Literal class maps: Tailwind only sees classes written out in full.
// overlay-background-primary is the primary at 85%, overlay-background-light
// black at 50%: both read as a token plus an alpha step.
const tones: Record<OverlayTone, string> = {
  primary: "bg-primary/85 text-primary-content",
  black: "bg-neutral/60 text-neutral-content",
};
const dimmerTone: Record<DimmerVariant, string> = {
  dark: "bg-neutral/90 text-neutral-content",
  primary: "bg-primary/90 text-primary-content",
};
// daisyUI's .btn sets its own color, so a button on the veil cannot inherit it:
// each action names the token pair of the veil it sits on.
const actionSolid: Record<DimmerVariant, string> = {
  dark: "border-0 bg-neutral-content text-neutral hover:bg-neutral-content/90",
  primary: "border-0 bg-primary-content text-primary hover:bg-primary-content/90",
};
const actionOutline: Record<DimmerVariant, string> = {
  dark: "bg-transparent border-neutral-content text-neutral-content hover:bg-neutral-content hover:text-neutral",
  primary: "bg-transparent border-primary-content text-primary-content hover:bg-primary-content hover:text-primary",
};

/** A button readable on the dimmer's veil, whichever variant it uses. */
export function dimmerAction(label: string, o: { primary?: boolean; variant?: DimmerVariant } = {}): string {
  const v = o.variant ?? "dark";
  return `<button type="button" class="btn border-2 font-semibold ${o.primary ? actionSolid[v] : actionOutline[v]}">${label}</button>`;
}

let counter = 0;

/** An image with the .italia overlay panel over it. */
export function overlay(a: OverlayArgs = {}): string {
  const {
    image = "https://picsum.photos/seed/overlay/800/600",
    imageAlt = "Breve descrizione immagine",
    text = "Titolo del contenuto",
    tone = "primary",
    height = "band",
    width = "w-full max-w-sm",
  } = a;
  const panel = cx(
    "absolute inset-x-0 bottom-0 px-4 py-3 text-sm font-semibold md:text-base",
    tones[tone],
    height === "full" && "top-0 flex",
    height === "full" && (a.icon ? "items-center justify-center" : "items-end"),
    a.onHover && "opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100",
  );
  const body = a.icon
    ? icon(a.icon, "size-8", text)
    : `<span class="block min-w-0 truncate">${text}</span>`;
  const inner = `<img src="${image}" alt="${imageAlt}" class="block size-full object-cover" loading="lazy">
  <figcaption class="${panel}">${body}</figcaption>`;
  // The group has to sit on whatever can take focus, so group-focus-within
  // reveals a hover panel when the link is reached with the keyboard.
  const frame = cx("group relative block overflow-hidden", width);
  if (!a.href) return `<figure class="${frame} m-0">\n  ${inner}\n</figure>`;
  return `<a href="${a.href}" class="${frame} no-underline">
  <figure class="relative m-0">
  ${inner}
  </figure>
</a>`;
}

/**
 * The dimmer: a panel that covers its container with a message and actions.
 * Opened and closed by a checkbox, so no script is involved.
 */
export function dimmer(a: DimmerArgs = {}): string {
  const {
    children = "",
    text = "Platea dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim cras.",
    variant = "dark",
    toggleLabel = "Toggle dimmer",
  } = a;
  const id = a.id ?? `dimmer-${++counter}`;
  const panel = cx(
    "pointer-events-none absolute inset-0 z-10 flex flex-wrap items-start justify-center p-8 opacity-0 transition-opacity",
    "group-has-checked/dimmer:pointer-events-auto group-has-checked/dimmer:opacity-100 lg:items-center",
    dimmerTone[variant],
  );
  return `<div class="group/dimmer relative">
  <input type="checkbox" id="${id}" class="peer sr-only"${a.active ? " checked" : ""} aria-label="${toggleLabel}">
  <label for="${id}" class="btn btn-primary mb-4 font-semibold peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2">${toggleLabel}</label>
  <div class="relative">
    ${children}
    <div class="${panel}" role="group" aria-labelledby="${id}-title">
      <div class="w-full max-w-[480px] text-center">
        ${a.icon ? `<div class="mb-4 flex justify-center">${icon(a.icon, "size-12")}</div>` : ""}
        ${a.title ? `<h4 id="${id}-title" class="mb-4 text-2xl font-bold">${a.title}</h4>` : `<span id="${id}-title" class="sr-only">${toggleLabel}</span>`}
        <p class="font-serif leading-relaxed">${text}</p>
        ${a.actions ? `<div class="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">${a.actions}</div>` : ""}
      </div>
    </div>
  </div>
</div>`;
}

const sampleCard = (seed: string) => `<article class="card card-border border-base-content/20 bg-base-100">
      <figure class="aspect-video bg-base-300"><img src="https://picsum.photos/seed/${seed}/800/600" alt="" class="size-full object-cover" loading="lazy"></figure>
      <div class="card-body gap-2 p-4">
        <h3 class="card-title text-xl font-bold"><a href="#" class="link link-primary">Titolo del contenuto</a></h3>
        <p class="text-sm">Questo è un testo breve che riassume il contenuto della pagina di destinazione.</p>
      </div>
    </article>`;
const cards = `<div class="grid gap-6 sm:grid-cols-2">
    ${sampleCard("city")}
    ${sampleCard("nature")}
  </div>`;
const row = (items: string[]) => `<div class="flex flex-wrap items-start gap-6">\n  ${items.join("\n  ")}\n</div>`;

export const doc: ComponentDoc = {
  slug: "overlay",
  name: "Overlay",
  replaces: "<it-dimmer>, .overlay-panel (bootstrap-italia)",
  summary:
    "Due sovrapposizioni: il pannello sopra un'immagine (didascalia, icona, a tutta altezza) e il dimmer che copre un contenitore con messaggio e azioni. Il dimmer si apre con una checkbox, senza JavaScript.",
  daisy: ["card", "btn"],
  cssOnly:
    "Il dimmer usa una checkbox sr-only con peer-checked al posto dei metodi show()/hide()/toggle() del web component. Il pannello in hover compare anche con group-focus-within, così è raggiungibile da tastiera quando l'immagine è dentro un link.",
  examples: [
    {
      id: "pannello",
      title: "Pannello sull'immagine",
      html: row([
        overlay({ text: "Titolo del contenuto" }),
        overlay({ text: "Versione scura", tone: "black" }),
      ]),
    },
    {
      id: "altezza",
      title: "Pannello a tutta altezza e con icona",
      html: row([
        overlay({ height: "full", text: "Pannello a tutta altezza" }),
        overlay({ height: "full", icon: "it-zoom-in", text: "Ingrandisci l'immagine" }),
        overlay({ height: "full", tone: "black", icon: "it-video", text: "Riproduci il video" }),
      ]),
    },
    {
      id: "hover",
      title: "Pannello al passaggio del mouse",
      description: "Compare anche col focus da tastiera, perché l'immagine è dentro un link.",
      html: row([
        overlay({ onHover: true, height: "full", icon: "it-zoom-in", text: "Ingrandisci", href: "#" }),
        overlay({ onHover: true, text: "Titolo del contenuto", href: "#" }),
      ]),
    },
    {
      id: "dimmer",
      title: "Dimmer",
      html: dimmer({ icon: "it-info-circle", children: cards }),
    },
    {
      id: "dimmer-primario",
      title: "Dimmer di colore primario",
      html: dimmer({
        variant: "primary",
        icon: "it-pa",
        children: cards,
        text: "Platea dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim cras. Dictum sit amet justo donec enim diam vulputate ut.",
      }),
    },
    {
      id: "dimmer-azioni",
      title: "Dimmer con azioni",
      html: dimmer({
        title: "Titolo del dimmer",
        icon: "it-warning-circle",
        children: cards,
        actions: `${dimmerAction("Azione secondaria")}${dimmerAction("Azione primaria", { primary: true })}`,
      }),
    },
  ],
};
