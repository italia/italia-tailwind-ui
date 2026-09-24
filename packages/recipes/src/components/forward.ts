import { icon } from "../icons";
import { cx, type ComponentDoc } from "../types";

export interface ForwardArgs {
  /** The id of the section to scroll to, with the leading #. */
  href?: string;
  /** Accessible name; the link shows only the arrow. */
  label?: string;
  size?: "default" | "lg";
  /** @deprecated Put the arrow inside an it-surface-primary container instead. */
  inverse?: boolean;
}

export function forward(a: ForwardArgs = {}): string {
  const { href = "#contenuto", label = "Vai al contenuto successivo", size = "default" } = a;
  const cls = cx(
    "btn btn-circle btn-ghost motion-safe:animate-bounce",
    size === "lg" ? "btn-lg" : "",
    a.inverse ? "text-primary-content hover:bg-primary-content/15" : "text-primary hover:bg-primary/10",
  );
  return `<a href="${href}" class="${cls}" aria-label="${label}">${icon("it-arrow-down", size === "lg" ? "size-8" : "size-6")}</a>`;
}

export const doc: ComponentDoc = {
  slug: "forward",
  name: "Forward",
  replaces: "<it-forward>",
  summary:
    "La freccia che porta alla sezione successiva, di solito in fondo a un hero: un link ad ancora con scorrimento fluido del browser.",
  daisy: ["btn", "btn-circle", "btn-ghost", "btn-lg"],
  cssOnly:
    "Lo scorrimento fluido viene da scroll-behavior: smooth (classe scroll-smooth su <html>), che il browser disattiva da solo con «riduci movimento». Il rimbalzo usa motion-safe:, quindi rispetta la stessa preferenza.",
  examples: [
    {
      id: "base",
      title: "Esempio base",
      description: "Il link porta alla sezione con id «contenuto-forward».",
      html: `<div class="h-72 overflow-y-auto scroll-smooth rounded-box border border-base-content/15">
  <div class="flex h-full flex-col items-center justify-center gap-4 bg-base-200">
    <p class="text-xl font-semibold">Prima sezione</p>
    ${forward({ href: "#contenuto-forward" })}
  </div>
  <section id="contenuto-forward" class="flex h-full items-center justify-center">
    <p class="text-xl font-semibold">Sezione successiva</p>
  </section>
</div>`,
    },
    {
      id: "hero",
      title: "Su sfondo primario",
      description: "Dentro it-surface-primary la freccia prende da sola il colore del testo della fascia.",
      html: `<div class="it-surface-primary flex flex-col items-center gap-4 rounded-box p-10">
  <p class="text-2xl font-bold">Benvenuti nel portale del Comune</p>
  ${forward({ size: "lg" })}
</div>`,
    },
  ],
};
