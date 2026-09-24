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

// Literal class maps: Tailwind only sees classes written out in full.
const pin: Record<NonNullable<TimelineEvent["when"]>, string> = {
  past: "bg-accent text-accent-content",
  now: "bg-primary text-primary-content ring-4 ring-primary/25",
  future: "border-2 border-accent bg-base-100 text-accent",
};
// The line after a pin is solid up to "now", pale after it.
const line: Record<NonNullable<TimelineEvent["when"]>, string> = {
  past: "bg-accent",
  now: "bg-base-content/20",
  future: "bg-base-content/20",
};

export function timeline(a: TimelineArgs = {}): string {
  const { events = defaultEvents, nowLabel = "Oggi" } = a;
  const items = events.map((e, i) => {
    const when = e.when ?? "past";
    const before = i > 0 ? `<hr class="${line[events[i - 1].when ?? "past"]}">` : "";
    const after = i < events.length - 1 ? `<hr class="${line[when]}">` : "";
    const mark = `<div class="timeline-middle"><span class="${cx("grid size-12 place-items-center rounded-full", pin[when])}">${icon(e.icon ?? "it-calendar", "size-6")}</span></div>`;
    const date = `<div class="timeline-start mb-2 self-start md:mb-0 md:me-4 md:pt-3 md:text-end">
      <p class="${cx("font-semibold uppercase tracking-wide", when === "now" ? "text-primary" : "text-base-content/70")}">${e.date}</p>${
        when === "now" ? `\n      <span class="badge badge-primary badge-sm mt-1 font-semibold">${nowLabel}</span>` : ""
      }
    </div>`;
    const card = `<div class="${cx(
      "timeline-end mb-10 w-full max-w-md rounded-sm border bg-base-100 p-5 shadow-[0_2px_12px_rgb(0_0_0/0.08)] md:ms-4",
      e.evidence ? "border-primary border-s-4" : "border-base-content/15",
    )}">
      <h3 class="mb-1 text-xl font-bold">${e.title}</h3>${e.text ? `\n      <p class="text-base-content/80">${e.text}</p>` : ""}${
        e.href ? `\n      <a href="${e.href}" class="mt-3 inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-2 hover:no-underline">${e.linkLabel ?? "Leggi di più"}${icon("it-arrow-right", "size-4")}</a>` : ""
      }
    </div>`;
    return `  <li${when === "now" ? ` aria-current="step"` : ""}>
    ${before}
    ${date}
    ${mark}
    ${card}
    ${after}
  </li>`;
  });
  const cls = cx("timeline timeline-vertical timeline-snap-icon", a.compact ? "timeline-compact" : "max-md:timeline-compact");
  return `<ol class="${cls}">\n${items.join("\n")}\n</ol>`;
}

export const doc: ComponentDoc = {
  slug: "timeline",
  name: "Timeline",
  replaces: "<it-timeline>, <it-timeline-item>",
  summary:
    "La linea del tempo di bootstrap-italia: pin rotondi con icona, data accanto al pin, card con titolo e link, e l'indicatore «Oggi» fra passato e futuro. daisyUI timeline verticale.",
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
