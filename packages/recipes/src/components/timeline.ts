import { icon, type IconName } from "../icons";
import { cx, type ComponentDoc } from "../types";

export interface TimelineEvent {
  /** The date label beside the pin (pin-text). */
  date: string;
  title: string;
  text?: string;
  href?: string;
  linkLabel?: string;
  icon?: IconName;
  /** "past" (default), "now" (the present, labelled Oggi) or "future". */
  when?: "past" | "now" | "future";
  /** Highlighted card (bootstrap-italia it-evidence). */
  evidence?: boolean;
}

export interface TimelineArgs {
  events?: TimelineEvent[];
  /** Everything on one side, also on desktop. */
  compact?: boolean;
  /** Label of the "now" marker. */
  nowLabel?: string;
}

const defaultEvents: TimelineEvent[] = [
  { date: "Gennaio 2024", title: "Avvio del progetto", text: "Approvato il piano di rinnovo della rete dei servizi digitali.", icon: "it-flag" },
  { date: "Maggio 2024", title: "Consultazione pubblica", text: "Cittadini e associazioni hanno inviato oltre 1.200 contributi.", icon: "it-comment", href: "#", linkLabel: "Leggi il report" },
  { date: "Settembre 2026", title: "Apertura del cantiere", text: "I lavori sono in corso nei quartieri nord.", icon: "it-tool", when: "now", evidence: true },
  { date: "Marzo 2027", title: "Collaudo", text: "Verifica tecnica delle nuove infrastrutture.", icon: "it-check-circle", when: "future" },
  { date: "Giugno 2027", title: "Inaugurazione", icon: "it-calendar", when: "future" },
];

export function timeline(a: TimelineArgs = {}): string {
  const { events = defaultEvents, nowLabel = "Oggi" } = a;
  const items = events.map((e, i) => {
    const when = e.when ?? "past";
    // The line after a pin is solid up to "now", pale after it: the CSS reads it from the item classes.
    const before = i > 0 ? `<hr>` : "";
    const after = i < events.length - 1 ? `<hr>` : "";
    const mark = `<div class="timeline-middle"><span>${icon(e.icon ?? "it-calendar", "")}</span></div>`;
    const date = `<div class="timeline-start">
      <p>${e.date}</p>${when === "now" ? `\n      <span class="ita-timeline-badge">${nowLabel}</span>` : ""}
    </div>`;
    const card = `<div class="timeline-end">
      <h3>${e.title}</h3>${e.text ? `\n      <p>${e.text}</p>` : ""}${
        e.href ? `\n      <a href="${e.href}">${e.linkLabel ?? "Leggi di più"}${icon("it-arrow-right", "")}</a>` : ""
      }
    </div>`;
    const cls = cx(when === "now" && "ita-timeline-now", when === "future" && "ita-timeline-future", e.evidence && "ita-timeline-evidence");
    return `  <li${cls ? ` class="${cls}"` : ""}${when === "now" ? ` aria-current="step"` : ""}>
    ${before}
    ${date}
    ${mark}
    ${card}
    ${after}
  </li>`;
  });
  const cls = cx("timeline timeline-vertical timeline-snap-icon", a.compact ? "timeline-compact" : "max-md:timeline-compact", "ita-timeline");
  return `<ol class="${cls}">\n${items.join("\n")}\n</ol>`;
}

export const doc: ComponentDoc = {
  slug: "timeline",
  name: "Timeline",
  replaces: "<it-timeline>, <it-timeline-item>",
  summary:
    "La linea del tempo di bootstrap-italia: pin rotondi con icona, data accanto al pin, card con titolo e link, e l'indicatore «Oggi» fra passato e futuro. daisyUI timeline verticale.",
  classes: ["ita-timeline", "ita-timeline-now", "ita-timeline-future", "ita-timeline-evidence", "ita-timeline-badge"],
  daisy: ["timeline", "timeline-vertical", "timeline-snap-icon", "timeline-compact", "timeline-start", "timeline-middle", "timeline-end", "badge"],
  cssOnly:
    "È un elenco ordinato: l'ordine è quello della lettura. La linea è piena fino all'evento corrente e chiara dopo; il presente ha aria-current=\"step\". Sotto md la timeline diventa compatta, con data e card sullo stesso lato.",
  examples: [
    { id: "base", title: "Esempio base", html: timeline() },
    {
      id: "compatta",
      title: "Compatta",
      html: timeline({
        compact: true,
        events: [
          { date: "3 marzo", title: "Domanda inviata", icon: "it-mail", text: "Protocollo n. 2026/1234." },
          { date: "10 marzo", title: "Istruttoria", icon: "it-files", when: "now", text: "L'ufficio sta verificando i documenti." },
          { date: "entro 30 aprile", title: "Esito", icon: "it-check-circle", when: "future" },
        ],
      }),
    },
    {
      id: "sfondo-primario",
      title: "Su sfondo primario",
      description: "Il contenitore ha la classe it-surface-primary: i token si scambiano (base diventa primary, primary diventa primary-content) e il componente si adatta senza opzioni.",
      html: `<div class="it-surface-primary rounded-box p-6">${timeline({ events: defaultEvents.slice(1, 4) })}</div>`,
    },
  ],
};
