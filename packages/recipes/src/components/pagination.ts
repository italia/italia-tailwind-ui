import { icon } from "../icons";
import { cx, type ComponentDoc } from "../types";

export interface PaginationArgs {
  current?: number;
  total?: number;
  /** How many numbered pages to show around the current one (odd number). */
  visible?: number;
  align?: "start" | "center" | "end";
  /** Prev/next as text ("Precedente"/"Successiva") instead of chevrons. */
  textLinks?: boolean;
  /** Caption under the list, e.g. "Totale 300 elementi". */
  totalLabel?: string;
  /** Build hrefs; defaults to "?page=N". */
  href?: (page: number) => string;
  label?: string;
}

const item = "ita-page-link";
// Literal class maps: Tailwind only sees classes written out in full.
const alignCls = { start: "ita-pagination-start", center: "", end: "ita-pagination-end" } as const;

/** Page numbers to render, with 0 standing for an ellipsis. */
export function pageWindow(current: number, total: number, visible = 5): number[] {
  if (total <= visible + 2) return Array.from({ length: total }, (_, i) => i + 1);
  const half = Math.floor(visible / 2);
  let start = Math.max(1, current - half);
  let end = Math.min(total, start + visible - 1);
  start = Math.max(1, end - visible + 1);
  const pages: number[] = [];
  if (start > 1) pages.push(1, ...(start > 2 ? [0] : []));
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total) pages.push(...(end < total - 1 ? [0] : []), total);
  return pages;
}

export function pagination(a: PaginationArgs = {}): string {
  const { current = 3, total = 5, visible = 5, align = "center", label = "Paginazione" } = a;
  const href = a.href ?? ((p: number) => `?page=${p}`);
  const prevDisabled = current <= 1;
  const nextDisabled = current >= total;
  const edge = (dir: "prev" | "next", disabled: boolean, page: number) => {
    const inner = a.textLinks
      ? dir === "prev" ? "Precedente" : "Successiva"
      : `${icon(dir === "prev" ? "it-chevron-left" : "it-chevron-right", "size-6")}<span class="sr-only">${dir === "prev" ? "Pagina precedente" : "Pagina successiva"}</span>`;
    return disabled
      ? `<li><a class="${item}" role="link" aria-disabled="true">${inner}</a></li>`
      : `<li><a class="${item}" href="${href(page)}">${inner}</a></li>`;
  };
  const pages = pageWindow(current, total, visible)
    .map((p) => {
      if (p === 0) return `<li class="hidden sm:block"><span class="${item}" aria-hidden="true">…</span></li>`;
      if (p === current)
        return `<li><a class="${item}" href="${href(p)}" aria-current="page"><span class="sm:hidden">Pagina&nbsp;</span>${p}</a></li>`;
      return `<li class="hidden sm:block"><a class="${item}" href="${href(p)}">${p}</a></li>`;
    })
    .join("\n    ");
  const caption = a.totalLabel ? `\n  <p class="ita-pagination-text">${a.totalLabel}</p>` : "";
  return `<nav class="${cx("ita-pagination", alignCls[align])}" aria-label="${label}">
  <ul>
    ${edge("prev", prevDisabled, current - 1)}
    ${pages}
    ${edge("next", nextDisabled, current + 1)}
  </ul>${caption}
</nav>`;
}

/** "Simple mode": 1 / 5 between the arrows. */
export function paginationSimple(current = 1, total = 5): string {
  return `<nav class="ita-pagination" aria-label="Paginazione">
  <ul>
    <li><a class="${item}"${current <= 1 ? ` role="link" aria-disabled="true"` : ` href="?page=${current - 1}"`}>${icon("it-chevron-left", "size-6")}<span class="sr-only">Pagina precedente</span></a></li>
    <li><span class="${item}" aria-current="page">${current}</span></li>
    <li class="ita-pagination-text px-2">/</li>
    <li><span class="ita-pagination-text px-2">${total}</span></li>
    <li><a class="${item}" href="?page=${current + 1}">${icon("it-chevron-right", "size-6")}<span class="sr-only">Pagina successiva</span></a></li>
  </ul>
</nav>`;
}

export const doc: ComponentDoc = {
  slug: "pagination",
  name: "Pagination",
  replaces: "<it-pagination>, <it-pagination-item>",
  summary:
    "Paginazione a link reali: daisyUI btn-ghost 48×48px con bordo 2px sulla pagina corrente. Sotto i 640px resta visibile solo la pagina corrente.",
  classes: ["ita-pagination", "ita-pagination-start", "ita-pagination-end", "ita-page-link", "ita-pagination-text"],
  daisy: ["btn", "btn-ghost", "btn-disabled"],
  cssOnly:
    "La finestra di pagine si calcola lato server (pageWindow) e ogni pagina è un link: nessun evento it-pagination-change, la pagina si ricarica.",
  examples: [
    { id: "base", title: "Con pulsanti avanti e indietro", html: pagination() },
    { id: "testuali", title: "Con link testuali", html: pagination({ textLinks: true }) },
    {
      id: "allineamento",
      title: "Allineamento",
      html: (["start", "center", "end"] as const)
        .map((al) => pagination({ align: al, totalLabel: "Totale 300 elementi" }))
        .join('\n<hr class="my-6 border-base-content/15">\n'),
    },
    { id: "more", title: "Più pagine", description: "25 di 50, 5 pagine visibili.", html: pagination({ current: 25, total: 50 }) },
    { id: "simple", title: "Simple mode", html: paginationSimple() },
    {
      id: "selettore",
      title: "Con selettore pagine e salto a pagina",
      html: `<div class="flex flex-col items-center gap-4">
${pagination({ current: 2, total: 10 })}
<div class="flex flex-wrap items-end justify-center gap-6">
  <label class="flex items-center gap-2 text-base">Elementi per pagina:
    <select class="ita-select w-auto"><option>10/pagina</option><option>20/pagina</option><option>50/pagina</option><option>100/pagina</option></select>
  </label>
  <form class="join">
    <label class="sr-only" for="jump">Vai alla pagina</label>
    <input id="jump" name="page" type="number" min="1" max="10" class="ita-input join-item w-28" placeholder="Vai a ...">
    <button class="ita-btn ita-btn-primary join-item">Vai</button>
  </form>
</div>
</div>`,
    },
  ],
};
