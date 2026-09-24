import { icon } from "../icons";
import { cx, type ComponentDoc } from "../types";
import { buttonClass } from "./button";

export interface BackArgs {
  label?: string;
  /** Where "back" goes: the parent page. Required, since history.back() is JavaScript. */
  href?: string;
  /** A small link-style button instead of a plain text link. */
  asButton?: boolean;
  /** Arrow only; the label stays for screen readers. */
  iconOnly?: boolean;
}

export function back(a: BackArgs = {}): string {
  const { label = "Torna indietro", href = "#" } = a;
  const glyph = icon("it-arrow-left", "");
  const text = a.iconOnly ? `<span class="sr-only">${label}</span>` : `<span>${label}</span>`;
  const cls = a.asButton
    ? cx(buttonClass({ variant: "primary", outline: true, size: "xs" }), "gap-2", a.iconOnly && "ita-btn-square")
    : "ita-back";
  return `<a href="${href}" class="${cls}">${glyph}${text}</a>`;
}

const row = (items: string[]) => `<div class="flex flex-wrap items-center gap-6">\n  ${items.join("\n  ")}\n</div>`;

export const doc: ComponentDoc = {
  slug: "back",
  name: "Back",
  replaces: "<it-back>",
  summary:
    "Il link «Torna indietro» con la freccia a sinistra: un <a> verso la pagina padre, come link semplice o come pulsante piccolo.",
  classes: ["ita-back", "ita-btn", "ita-btn-outline", "ita-btn-xs", "ita-btn-square"],
  daisy: ["btn"],
  cssOnly:
    "<it-back> chiama history.back(), che è JavaScript. La ricetta punta alla pagina padre con un href vero: funziona anche aperta da un link esterno, dove la cronologia è vuota. Se ti serve proprio la cronologia, aggiungi tu onclick=\"history.back(); return false\".",
  examples: [
    { id: "base", title: "Esempio base", html: row([back({ href: "#" }), back({ href: "#", label: "Torna all'elenco dei servizi" })]) },
    { id: "pulsante", title: "Come pulsante", html: row([back({ asButton: true }), back({ asButton: true, iconOnly: true })]) },
    {
      id: "in-pagina",
      title: "In cima a una pagina",
      html: `<div class="flex flex-col gap-4">
  ${back({ label: "Servizi" })}
  <h2 class="text-3xl font-bold">Richiedere la carta d'identità elettronica</h2>
</div>`,
    },
  ],
  snippets: [
    { title: "Usare la cronologia quando c'è", lang: "js", description: "Il link resta un href verso la pagina padre; se l'utente arriva da una pagina dello stesso sito, torna indietro nella cronologia.", code: `// <a href="/servizi" data-back>Torna indietro</a>
document.querySelectorAll("a[data-back]").forEach((link) => {
  link.addEventListener("click", (ev) => {
    const sameSite = document.referrer.startsWith(location.origin);
    if (sameSite && history.length > 1) {
      ev.preventDefault();
      history.back();
    }
  });
});` },
    { title: "Componente React", lang: "tsx", code: `export function Back({ href, label = "Torna indietro" }: { href: string; label?: string }) {
  const onClick = (ev: React.MouseEvent) => {
    if (document.referrer.startsWith(location.origin) && history.length > 1) {
      ev.preventDefault();
      history.back(); // with a router: navigate(-1)
    }
  };
  return (
    <a href={href} onClick={onClick} className="inline-flex items-center gap-2 font-semibold text-primary underline-offset-2 hover:underline">
      <span aria-hidden="true">←</span> {label}
    </a>
  );
}` },
  ],
};
