import { cx, type ComponentDoc } from "../types";
import { card } from "./card";

export type CarouselType = "cards" | "image" | "peek";

export interface CarouselSlide {
  title: string;
  text?: string;
  image?: string;
  imageAlt?: string;
  href?: string;
  category?: string;
  date?: string;
}

export interface CarouselArgs {
  id?: string;
  /** Heading above the carousel. */
  title?: string;
  /** Accessible name of the carousel region (defaults to the title). */
  label?: string;
  slides?: CarouselSlide[];
  /**
   * - "cards": three cards per view on desktop, two on tablet, one on mobile
   * - "image": one landscape image per view, with a caption
   * - "peek": one card per view with the next one peeking in
   */
  type?: CarouselType;
  /**
   * - "css": ::scroll-button + ::scroll-marker (Chrome 135+, swipe elsewhere)
   * - "links": numbered anchor links under the slides, work everywhere
   * - "none": swipe / scroll only
   */
  controls?: "css" | "links" | "none";
}

// Literal class maps: Tailwind only sees classes written out in full.
const types: Record<CarouselType, string> = { cards: "", image: "ita-carousel-image", peek: "ita-carousel-peek" };

const img = (n: number, w = 800, h = 450) => `https://picsum.photos/id/${n}/${w}/${h}`;

const defaultSlides: CarouselSlide[] = [
  { title: "Nuovo sportello digitale", text: "Prenota un appuntamento con l'anagrafe direttamente online.", category: "Servizi", date: "18 set 2026", image: img(1031), imageAlt: "Edificio comunale" },
  { title: "Mobilità sostenibile", text: "Quaranta nuove stazioni di bike sharing in tutta la città.", category: "Mobilità", date: "12 set 2026", image: img(1067), imageAlt: "Strada cittadina" },
  { title: "Scuole aperte", text: "Iscrizioni ai servizi di mensa e trasporto fino al 30 settembre.", category: "Scuola", date: "5 set 2026", image: img(1073), imageAlt: "Aula scolastica" },
  { title: "Estate in città", text: "Il programma completo degli eventi culturali nei parchi.", category: "Cultura", date: "1 set 2026", image: img(1044), imageAlt: "Parco cittadino" },
  { title: "Raccolta differenziata", text: "Cambiano i giorni di ritiro nei quartieri nord.", category: "Ambiente", date: "28 ago 2026", image: img(1018), imageAlt: "Paesaggio verde" },
];

let counter = 0;

export function carousel(a: CarouselArgs = {}): string {
  const { slides = defaultSlides, type = "cards", controls = "css" } = a;
  const id = a.id ?? `carousel-${++counter}`;
  const label = a.label ?? a.title ?? "Carosello";
  const total = slides.length;

  const slide = (s: CarouselSlide, i: number) => {
    const attrs = `id="${id}-${i + 1}" role="group" aria-roledescription="slide" aria-label="${i + 1} di ${total}"`;
    if (type === "image")
      return `<figure ${attrs} class="carousel-item">
      <img src="${s.image ?? img(1031, 1200, 600)}" alt="${s.imageAlt ?? ""}" loading="lazy">
      <figcaption class="ita-carousel-caption">
        <p>${s.href ? `<a href="${s.href}">${s.title}</a>` : s.title}</p>${s.text ? `\n        <p>${s.text}</p>` : ""
        }
      </figcaption>
    </figure>`;
    return `<div ${attrs} class="carousel-item">
      ${card({ title: s.title, text: s.text, href: s.href ?? "#", image: s.image, imageAlt: s.imageAlt, category: s.category, date: s.date, shadow: "sm", headingLevel: 3 })}
    </div>`;
  };

  const scroller = cx("carousel", controls === "css" && "it-carousel");
  const links =
    controls === "links"
      ? `\n  <nav class="ita-carousel-pager" aria-label="Scegli la slide">
    ${slides.map((_, i) => `<a href="#${id}-${i + 1}">${i + 1}</a>`).join("\n    ")}
  </nav>`
      : "";
  const heading = a.title
    ? `\n  <h2 id="${id}-title" class="ita-carousel-title">${a.title}</h2>`
    : "";
  const named = a.title ? `aria-labelledby="${id}-title"` : `aria-label="${label}"`;
  return `<section class="${cx("ita-carousel", types[type])}" aria-roledescription="carosello" ${named}>${heading}
  <div>
    <div class="${scroller}" tabindex="0">
    ${slides.map(slide).join("\n    ")}
    </div>
  </div>${links}
</section>`;
}

const autoplayJs = `// Autoplay that stops on hover, on focus and with "reduce motion".
// Works with or without the CSS scroll buttons.
document.querySelectorAll("[aria-roledescription='carosello']").forEach((region) => {
  const track = region.querySelector(".carousel");
  if (!track || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let paused = false;
  for (const [on, off] of [["mouseenter", "mouseleave"], ["focusin", "focusout"]]) {
    region.addEventListener(on, () => (paused = true));
    region.addEventListener(off, () => (paused = false));
  }
  setInterval(() => {
    if (paused) return;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
    track.scrollTo({ left: atEnd ? 0 : track.scrollLeft + track.clientWidth });
  }, 6000);
});`;

const buttonsJs = `// Prev/next buttons for browsers without ::scroll-button (Safari, Firefox).
// Skipped where the CSS buttons exist, so the two never show together.
if (!CSS.supports("selector(::scroll-button(*))")) {
  document.querySelectorAll(".it-carousel").forEach((track) => {
    const make = (dir, label, glyph) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = \`ita-btn ita-btn-primary ita-btn-circle absolute top-1/2 -translate-y-1/2 \${dir < 0 ? "start-2" : "end-2"}\`;
      b.setAttribute("aria-label", label);
      b.textContent = glyph;
      b.addEventListener("click", () => track.scrollBy({ left: dir * track.clientWidth }));
      return b;
    };
    track.parentElement.append(make(-1, "Precedente", "‹"), make(1, "Successivo", "›"));
  });
}`;

const reactTsx = `import { useRef, type ReactNode } from "react";

/** The recipe's markup as a component; buttons use scrollBy, so they work in every browser. */
export function Carousel({ label, children }: { label: string; children: ReactNode[] }) {
  const track = useRef<HTMLDivElement>(null);
  const go = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * track.current.clientWidth });
  return (
    <section className="ita-carousel" aria-roledescription="carosello" aria-label={label}>
      <div>
        <div ref={track} className="carousel" tabIndex={0}>
          {children.map((child, i) => (
            <div key={i} role="group" aria-roledescription="slide" aria-label={\`\${i + 1} di \${children.length}\`}
                 className="carousel-item">
              {child}
            </div>
          ))}
        </div>
        <button type="button" className="ita-btn ita-btn-primary ita-btn-circle absolute start-2 top-1/2 -translate-y-1/2" aria-label="Precedente" onClick={() => go(-1)}>‹</button>
        <button type="button" className="ita-btn ita-btn-primary ita-btn-circle absolute end-2 top-1/2 -translate-y-1/2" aria-label="Successivo" onClick={() => go(1)}>›</button>
      </div>
    </section>
  );
}`;

export const doc: ComponentDoc = {
  slug: "carousel",
  name: "Carousel",
  replaces: "<it-carousel>, <it-carousel-item>",
  summary:
    "Caroselli di card o immagini su daisyUI carousel (scroll-snap). Pulsanti avanti/indietro e punti di navigazione sono pseudo-elementi CSS (::scroll-button, ::scroll-marker): nessuno script.",
  classes: ["ita-carousel", "ita-carousel-image", "ita-carousel-peek", "ita-carousel-caption", "ita-carousel-title", "ita-carousel-pager"],
  daisy: ["carousel", "carousel-item", "card"],
  extensions: ["it-carousel"],
  cssOnly:
    "Lo scorrimento è nativo (scroll-snap): swipe, trackpad, Maiusc+rotella e frecce da tastiera sul contenitore a fuoco. it-carousel aggiunge pulsanti e punti con ::scroll-button e ::scroll-marker (Chrome 135+); negli altri browser resta lo scorrimento, oppure usa controls: \"links\" con link ad ancora, che funzionano ovunque ma cambiano l'hash e possono scorrere la pagina. Autoplay e pulsanti per Safari/Firefox richiedono JavaScript: vedi sotto.",
  examples: [
    { id: "card", title: "Carosello di card", html: carousel({ title: "Notizie in evidenza" }) },
    {
      id: "immagini",
      title: "Immagini a tutta larghezza",
      html: carousel({ type: "image", label: "Galleria del territorio", slides: defaultSlides.map((s) => ({ ...s, image: s.image!.replace("800/450", "1200/600") })) }),
    },
    { id: "anteprima", title: "Con anteprima della slide successiva", html: carousel({ type: "peek", label: "Servizi" }) },
    {
      id: "link",
      title: "Navigazione con link",
      description: "Link ad ancora numerati: funzionano in ogni browser, ma aggiornano l'hash dell'URL.",
      html: carousel({ controls: "links", label: "Notizie", slides: defaultSlides.slice(0, 4) }),
    },
  ],
  snippets: [
    { title: "Pulsanti per Safari e Firefox", lang: "js", description: "Aggiunge i pulsanti solo dove mancano quelli CSS.", code: buttonsJs },
    { title: "Autoplay accessibile", lang: "js", description: "bootstrap-italia non lo fa di default: se ti serve, si ferma al passaggio del mouse, al focus e con «riduci movimento».", code: autoplayJs },
    { title: "Componente React", lang: "tsx", code: reactTsx },
  ],
};
