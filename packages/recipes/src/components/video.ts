import { icon } from "../icons";
import { cx, type ComponentDoc } from "../types";
import { buttonClass } from "./button";

export type VideoRatio = "16/9" | "4/3" | "1/1" | "21/9";

export interface VideoArgs {
  src?: string;
  /** Extra <source>s, e.g. a WebM next to the MP4. */
  sources?: Array<{ src: string; type: string }>;
  poster?: string;
  /** Visible title under the player. */
  title?: string;
  /** WebVTT captions URL (or data: URL). */
  captions?: string;
  captionsLang?: string;
  ratio?: VideoRatio;
  /** Text transcript, in a collapsible panel under the video. */
  transcript?: string;
}

// Literal class maps: Tailwind only sees classes written out in full.
const ratios: Record<VideoRatio, string> = {
  "16/9": "",
  "4/3": "ita-video-4-3",
  "1/1": "ita-video-1-1",
  "21/9": "ita-video-21-9",
};

const flowerMp4 = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
const flowerWebm = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm";
// Tiny Italian captions inlined as a data: URL, so the example needs no extra file.
const flowerVtt =
  "data:text/vtt;charset=utf-8," +
  encodeURIComponent("WEBVTT\n\n00:00.000 --> 00:02.500\nUn fiore si apre al sole.\n\n00:02.500 --> 00:05.000\nUn'ape si posa sui petali.\n");

const transcriptPanel = (text: string) => `<details class="collapse collapse-arrow ita-video-transcript">
    <summary class="collapse-title">Trascrizione</summary>
    <div class="collapse-content">${text.trimStart().startsWith("<") ? text : `<p>${text}</p>`}</div>
  </details>`;

/** Native <video> with controls, captions track and transcript: no player library. */
export function video(a: VideoArgs = {}): string {
  const { src = flowerMp4, ratio = "16/9", captionsLang = "it" } = a;
  const sources = a.sources ?? (a.src ? [] : [{ src: flowerWebm, type: "video/webm" }]);
  const track = a.captions
    ? `\n    <track kind="captions" src="${a.captions}" srclang="${captionsLang}" label="Italiano" default>`
    : "";
  return `<figure class="${cx("ita-video", ratios[ratio])}">
  <video controls preload="metadata" playsinline${a.poster ? ` poster="${a.poster}"` : ""}${
    a.title ? ` aria-label="${a.title}"` : ""
  }${a.captions?.startsWith("http") ? ` crossorigin="anonymous"` : ""}>
    ${sources.map((s) => `<source src="${s.src}" type="${s.type}">`).join("\n    ")}${sources.length ? "\n    " : ""}<source src="${src}" type="video/mp4">${track}
    <p>Il tuo browser non riproduce video: <a href="${src}">scarica il video</a>.</p>
  </video>${a.title ? `\n  <figcaption>${a.title}</figcaption>` : ""}${a.transcript ? `\n  ${transcriptPanel(a.transcript)}` : ""}
</figure>`;
}

export interface VideoEmbedArgs {
  /** YouTube video id. */
  youtubeId?: string;
  title?: string;
  ratio?: VideoRatio;
  /** Thumbnail shown behind the consent overlay. */
  poster?: string;
  /** Load the iframe straight away (consent already given, e.g. from a cookie read server-side). */
  consented?: boolean;
  transcript?: string;
}

/**
 * A third-party video (YouTube) behind the bootstrap-italia consent overlay.
 * The iframe is not in the page until consent: without JS the overlay offers
 * a link to watch on YouTube; "Accetta" is wired by the snippet below (or the
 * server renders `consented: true`).
 */
export function videoEmbed(a: VideoEmbedArgs = {}): string {
  const { youtubeId = "_0j7ZQ67KtY", title = "Centrato l'obiettivo PNRR: le PA locali verso il cloud", ratio = "16/9" } = a;
  const poster = a.poster ?? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
  const watch = `https://www.youtube.com/watch?v=${youtubeId}`;
  const player = `<iframe src="https://www.youtube-nocookie.com/embed/${youtubeId}" title="${title}" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
  const overlay = `<div class="ita-video-consent" style="background-image:url('${poster}')" data-video-consent data-youtube-id="${youtubeId}" data-title="${title}">
      <div>
        <p>Contenuto di terze parti</p>
        <p>Il video è ospitato da YouTube, che potrebbe raccogliere dati sulla tua navigazione. Per vederlo qui accetta i cookie di YouTube, oppure aprilo sul sito originale.</p>
        <div>
          <button type="button" class="${buttonClass({ size: "xs" })}" data-video-accept>Accetta e guarda</button>
          <a href="${watch}" class="${buttonClass({ size: "xs", outline: true })}" target="_blank" rel="noopener">Guarda su YouTube${icon("it-external-link", "")}<span class="sr-only"> (si apre in una nuova scheda)</span></a>
        </div>
      </div>
    </div>`;
  return `<figure class="${cx("ita-video", ratios[ratio])}">
  <div class="ita-video-embed">
    ${a.consented ? player : overlay}
  </div>
  <figcaption>${title}</figcaption>${a.transcript ? `\n  ${transcriptPanel(a.transcript)}` : ""}
</figure>`;
}

const consentJs = `// "Accetta e guarda": swap the overlay for the iframe, and remember the choice.
const KEY = "consenso-youtube";
function loadVideo(overlay) {
  const iframe = document.createElement("iframe");
  iframe.src = \`https://www.youtube-nocookie.com/embed/\${overlay.dataset.youtubeId}?autoplay=1\`;
  iframe.title = overlay.dataset.title;
  iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
  iframe.allowFullscreen = true;
  overlay.replaceWith(iframe);
}
document.querySelectorAll("[data-video-consent]").forEach((overlay) => {
  if (localStorage.getItem(KEY) === "si") return loadVideo(overlay);
  overlay.querySelector("[data-video-accept]").addEventListener("click", () => {
    localStorage.setItem(KEY, "si");
    document.querySelectorAll("[data-video-consent]").forEach(loadVideo);
  });
});`;

const reactTsx = `import { useEffect, useState } from "react";

const KEY = "consenso-youtube";

/** YouTube behind a consent overlay; the iframe exists only after consent. */
export function ConsentVideo({ youtubeId, title }: { youtubeId: string; title: string }) {
  const [ok, setOk] = useState(false);
  useEffect(() => setOk(localStorage.getItem(KEY) === "si"), []);
  const accept = () => { localStorage.setItem(KEY, "si"); setOk(true); };
  return (
    <figure className="ita-video">
      <div className="ita-video-embed">
        {ok ? (
          <iframe title={title} allowFullScreen
                  src={\`https://www.youtube-nocookie.com/embed/\${youtubeId}\`}
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" />
        ) : (
          <div className="ita-video-consent"
               style={{ backgroundImage: \`url(https://i.ytimg.com/vi/\${youtubeId}/hqdefault.jpg)\` }}>
            <div>
              <p>Contenuto di terze parti</p>
              <p>Il video è ospitato da YouTube, che potrebbe raccogliere dati sulla tua navigazione.</p>
              <div><button type="button" className="ita-btn ita-btn-primary ita-btn-xs" onClick={accept}>Accetta e guarda</button></div>
            </div>
          </div>
        )}
      </div>
      <figcaption>{title}</figcaption>
    </figure>
  );
}`;

export const doc: ComponentDoc = {
  slug: "video",
  name: "Video",
  replaces: "<it-video>",
  summary:
    "Video nativi con controlli del browser, sottotitoli WebVTT e trascrizione in un pannello richiudibile; video di YouTube dietro l'avviso di consenso di bootstrap-italia.",
  classes: ["ita-video", "ita-video-4-3", "ita-video-1-1", "ita-video-21-9", "ita-video-embed", "ita-video-consent", "ita-video-transcript"],
  daisy: ["collapse", "collapse-arrow", "btn"],
  cssOnly:
    "Il player è il <video> nativo: controlli, tastiera, schermo intero e sottotitoli (<track kind=\"captions\">) sono del browser, senza librerie (dev-kit-italia usa video.js). Le proporzioni sono 16:9, oppure ita-video-4-3, -1-1, -21-9. Per i video di terze parti l'iframe non è nella pagina finché l'utente non accetta: senza JavaScript l'avviso offre il link al sito originale, oppure il server rende l'iframe se il consenso è già in un cookie. Il pulsante «Accetta» richiede JavaScript: vedi sotto.",
  examples: [
    {
      id: "base",
      title: "Video con sottotitoli",
      description: "Attiva i sottotitoli dal menu del player.",
      html: video({
        title: "Un fiore in primavera",
        captions: flowerVtt,
        transcript: "Un fiore si apre al sole. Un'ape si posa sui petali e poi riparte.",
      }),
    },
    {
      id: "proporzioni",
      title: "Proporzioni",
      html: `<div class="grid gap-6 md:grid-cols-2">
${video({ ratio: "4/3", title: "4:3" })}
${video({ ratio: "1/1", title: "1:1" })}
</div>`,
    },
    {
      id: "youtube",
      title: "YouTube con consenso",
      description: "Senza JavaScript resta il link a YouTube; con il frammento qui sotto «Accetta e guarda» carica il video.",
      html: videoEmbed({ transcript: "Trascrizione del video del Dipartimento per la trasformazione digitale sulla migrazione al cloud delle amministrazioni locali." }),
    },
  ],
  snippets: [
    { title: "Pulsante «Accetta e guarda»", lang: "js", description: "Sostituisce l'avviso con l'iframe e ricorda la scelta.", code: consentJs },
    { title: "Componente React", lang: "tsx", code: reactTsx },
  ],
};
