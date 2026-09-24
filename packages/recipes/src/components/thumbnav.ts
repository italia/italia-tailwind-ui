import { cx, type ComponentDoc } from "../types";
import { carousel } from "./carousel";

export type ThumbnavSize = "sm" | "md" | "lg";

export interface ThumbnavItem {
  src: string;
  alt: string;
  /** Where the thumbnail points: a slide id (#…) or a page. */
  href?: string;
  /** Server-rendered current item. */
  active?: boolean;
}

export interface ThumbnavArgs {
  items?: ThumbnavItem[];
  label?: string;
  size?: ThumbnavSize;
  vertical?: boolean;
  /** Live highlight of the thumbnail whose slide is in view (links must point at slide ids). */
  spy?: boolean;
}

// Literal class maps: Tailwind only sees classes written out in full.
const sizes: Record<ThumbnavSize, string> = { sm: "ita-thumbnav-sm", md: "", lg: "ita-thumbnav-lg" };

const pic = (n: number) => `https://picsum.photos/id/${n}/1200/675`;
const thumb = (n: number) => `https://picsum.photos/id/${n}/200/200`;
const ids = [1015, 1016, 1018, 1019, 1020, 1021, 1022];

const defaultItems: ThumbnavItem[] = ids.map((n, i) => ({ src: thumb(n), alt: `Paesaggio ${i + 1}`, href: "#", active: i === 0 }));

export function thumbnav(a: ThumbnavArgs = {}): string {
  const { items = defaultItems, label = "Miniature", size = "md" } = a;
  const cls = cx("ita-thumbnav", sizes[size], a.vertical && "ita-thumbnav-vertical", a.spy && "ita-thumbnav-spy");
  return `<nav aria-label="${label}" class="${cls}">
  <ul>
    ${items
      .map(
        (it) =>
          `<li><a href="${it.href ?? "#"}"${it.active ? ` aria-current="true"` : ""}><img src="${it.src}" alt="${it.alt}" loading="lazy"></a></li>`,
      )
      .join("\n    ")}
  </ul>
</nav>`;
}

/** A gallery: a one-image carousel with a thumbnav whose links point at its slides. */
export function thumbnavGallery(o: { id?: string; label?: string } = {}): string {
  const id = o.id ?? "galleria";
  const slides = ids.map((n, i) => ({ title: `Paesaggio ${i + 1}`, image: pic(n), imageAlt: `Paesaggio ${i + 1}` }));
  return `<div class="flex flex-col gap-4">
${carousel({ id, type: "image", label: o.label ?? "Galleria", slides, controls: "none" })}
${thumbnav({ label: "Scegli l'immagine", spy: true, items: ids.map((n, i) => ({ src: thumb(n), alt: `Paesaggio ${i + 1}`, href: `#${id}-${i + 1}` })) })}
</div>`;
}

const syncJs = `// Keep aria-current on the thumbnail of the visible slide (all browsers),
// and scroll the carousel without moving the page when a thumbnail is clicked.
document.querySelectorAll("nav[aria-label] ul").forEach((list) => {
  const links = [...list.querySelectorAll("a[href^='#']")];
  const slides = links.map((a) => document.querySelector(a.hash)).filter(Boolean);
  if (!slides.length) return;

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.intersectionRatio < 0.6) continue;
      for (const a of links) {
        if (a.hash === "#" + e.target.id) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      }
    }
  }, { threshold: 0.6 });
  slides.forEach((s) => io.observe(s));

  list.addEventListener("click", (ev) => {
    const a = ev.target.closest("a[href^='#']");
    if (!a) return;
    ev.preventDefault();
    document.querySelector(a.hash)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  });
});`;

const reactTsx = `import { useRef, useState } from "react";

type Photo = { src: string; thumb: string; alt: string };

/** Gallery with thumbnails: React owns the current index. */
export function Gallery({ photos }: { photos: Photo[] }) {
  const [current, setCurrent] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const show = (i: number) => {
    setCurrent(i);
    track.current?.children[i]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };
  return (
    <div className="flex flex-col gap-4">
      <div ref={track} className="carousel w-full gap-4 rounded-box" tabIndex={0}
           onScroll={(e) => setCurrent(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}>
        {photos.map((p) => (
          <img key={p.src} src={p.src} alt={p.alt} className="carousel-item aspect-video w-full object-cover" />
        ))}
      </div>
      <nav aria-label="Scegli l'immagine" className="ita-thumbnav">
        <ul>
          {photos.map((p, i) => (
            <li key={p.thumb}>
              <button type="button" onClick={() => show(i)} aria-current={i === current || undefined}>
                <img src={p.thumb} alt={p.alt} />
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}`;

export const doc: ComponentDoc = {
  slug: "thumbnav",
  name: "Thumbnav",
  replaces: "<it-thumbnav>",
  summary:
    "Una fila di miniature per scegliere un'immagine: link ad ancora verso le slide di un carosello, con la miniatura corrente evidenziata durante lo scorrimento.",
  classes: ["ita-thumbnav", "ita-thumbnav-sm", "ita-thumbnav-lg", "ita-thumbnav-vertical", "ita-thumbnav-spy"],
  daisy: ["carousel", "carousel-item"],
  cssOnly:
    "Ogni miniatura è un link alla sua slide (#galleria-3): il browser scorre il carosello fino all'immagine. La miniatura corrente usa scroll-target-group e :target-current (Chrome 140+), altrimenti aria-current dal server. Il salto dell'ancora può scorrere anche la pagina e aggiorna l'hash: il frammento JavaScript sotto lo evita.",
  examples: [
    { id: "base", title: "Esempio base", html: thumbnav() },
    {
      id: "dimensioni",
      title: "Dimensioni",
      html: `<div class="flex flex-col gap-6">
${thumbnav({ size: "sm", label: "Miniature piccole" })}
${thumbnav({ size: "lg", label: "Miniature grandi", items: defaultItems.slice(0, 5) })}
</div>`,
    },
    { id: "verticale", title: "Verticale", html: thumbnav({ vertical: true, items: defaultItems.slice(0, 5) }) },
    {
      id: "galleria",
      title: "Con un carosello",
      description: "Clicca una miniatura: il carosello va all'immagine e la miniatura si evidenzia mentre scorri.",
      html: thumbnavGallery(),
    },
  ],
  snippets: [
    { title: "Miniatura corrente in tutti i browser", lang: "js", description: "Aggiorna aria-current con IntersectionObserver e scorre il carosello senza muovere la pagina.", code: syncJs },
    { title: "Galleria in React", lang: "tsx", code: reactTsx },
  ],
};
