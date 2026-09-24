import { icon, type IconName } from "../icons";
import { cx, type ComponentDoc } from "../types";

/** Panel colour. "black" is the deprecated name of "neutral". */
export type OverlayTone = "primary" | "neutral" | "black";
export type OverlayHeight = "band" | "full";
/** Veil colour. "dark" is the deprecated name of "neutral". */
export type DimmerVariant = "neutral" | "primary" | "dark";
type Veil = Exclude<DimmerVariant, "dark">;
const veilOf = (v: DimmerVariant): Veil => (v === "dark" ? "neutral" : v);

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

/**
 * A button readable on the dimmer's veil: it takes the veil's colours from the
 * enclosing ita-dimmer, so `variant` is no longer needed (kept for compatibility).
 */
export function dimmerAction(label: string, o: { primary?: boolean; variant?: DimmerVariant } = {}): string {
  return `<button type="button" class="${cx("ita-btn ita-dimmer-action", o.primary && "ita-dimmer-action-primary")}">${label}</button>`;
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
  } = a;
  const body = a.icon ? icon(a.icon, "", text) : `<span>${text}</span>`;
  const inner = `<img src="${image}" alt="${imageAlt}" loading="lazy">
  <figcaption class="ita-overlay-panel">${body}</figcaption>`;
  // The frame is whatever can take focus, so :focus-within reveals a hover
  // panel when the link is reached with the keyboard.
  const frame = cx(
    "ita-overlay",
    tone !== "primary" && "ita-overlay-neutral",
    height === "full" && "ita-overlay-full",
    a.onHover && "ita-overlay-hover",
    a.width,
  );
  if (!a.href) return `<figure class="${frame}">\n  ${inner}\n</figure>`;
  return `<a href="${a.href}" class="${frame}">
  <figure>
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
    variant: requested = "neutral",
    toggleLabel = "Toggle dimmer",
  } = a;
  const variant = veilOf(requested);
  const id = a.id ?? `dimmer-${++counter}`;
  return `<div class="${cx("ita-dimmer", variant === "primary" && "ita-dimmer-primary")}">
  <input type="checkbox" id="${id}" class="sr-only"${a.active ? " checked" : ""} aria-label="${toggleLabel}">
  <label for="${id}" class="ita-btn ita-btn-primary ita-dimmer-toggle">${toggleLabel}</label>
  <div class="relative">
    ${children}
    <div class="ita-dimmer-panel" role="group" aria-labelledby="${id}-title">
      <div>
        ${a.icon ? `<div class="ita-dimmer-icon">${icon(a.icon, "")}</div>` : ""}
        ${a.title ? `<h4 id="${id}-title" class="ita-dimmer-title">${a.title}</h4>` : `<span id="${id}-title" class="sr-only">${toggleLabel}</span>`}
        <p class="ita-dimmer-text">${text}</p>
        ${a.actions ? `<div class="ita-dimmer-actions">${a.actions}</div>` : ""}
      </div>
    </div>
  </div>
</div>`;
}

const sampleCard = (seed: string) => `<article class="card card-border border-base-content/20 bg-base-100">
      <figure class="aspect-video bg-base-300"><img src="https://picsum.photos/seed/${seed}/800/600" alt="" class="size-full object-cover" loading="lazy"></figure>
      <div class="card-body gap-2 p-4">
        <h3 class="card-title text-xl font-bold"><a href="#" class="ita-link">Titolo del contenuto</a></h3>
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
  classes: ["ita-overlay", "ita-overlay-panel", "ita-overlay-neutral", "ita-overlay-full", "ita-overlay-hover", "ita-dimmer", "ita-dimmer-primary", "ita-dimmer-toggle", "ita-dimmer-panel", "ita-dimmer-icon", "ita-dimmer-title", "ita-dimmer-text", "ita-dimmer-actions", "ita-dimmer-action", "ita-dimmer-action-primary"],
  daisy: ["card", "btn"],
  cssOnly:
    "Il dimmer usa una checkbox sr-only (ita-dimmer:has(> input:checked)) al posto dei metodi show()/hide()/toggle() del web component. Il pannello in hover compare anche con :focus-within, così è raggiungibile da tastiera quando l'immagine è dentro un link.",
  examples: [
    {
      id: "pannello",
      title: "Pannello sull'immagine",
      html: row([
        overlay({ text: "Titolo del contenuto" }),
        overlay({ text: "Pannello neutral", tone: "neutral" }),
      ]),
    },
    {
      id: "altezza",
      title: "Pannello a tutta altezza e con icona",
      html: row([
        overlay({ height: "full", text: "Pannello a tutta altezza" }),
        overlay({ height: "full", icon: "it-zoom-in", text: "Ingrandisci l'immagine" }),
        overlay({ height: "full", tone: "neutral", icon: "it-video", text: "Riproduci il video" }),
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
