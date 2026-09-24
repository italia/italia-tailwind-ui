import { cx, type ComponentDoc } from "../types";
import { buttonClass } from "./button";

export type ProgressColor = "primary" | "success" | "warning" | "danger" | "info";

export interface ProgressArgs {
  /** 0–100; leave it out for an indeterminate bar. */
  value?: number;
  label?: string;
  /** Show the percentage next to the label. */
  showValue?: boolean;
  color?: ProgressColor;
  /** Bar height: bootstrap-italia's 4px, or a thicker 8/16px. */
  size?: "default" | "md" | "lg";
}

// Literal class maps: Tailwind only sees classes written out in full.
const colors: Record<ProgressColor, string> = {
  primary: "",
  success: "ita-progress-success",
  warning: "ita-progress-warning",
  danger: "ita-progress-danger",
  info: "ita-progress-info",
};
const tones: Record<ProgressColor, string> = {
  primary: "",
  success: "ita-tone-success",
  warning: "ita-tone-warning",
  danger: "ita-tone-danger",
  info: "ita-tone-info",
};
const heights = { default: "", md: "ita-progress-md", lg: "ita-progress-lg" } as const;

let counter = 0;

/** A linear bar on native <progress>, so the value is announced for free. */
export function progress(a: ProgressArgs = {}): string {
  const { color = "primary", size = "default" } = a;
  const id = `progress-${++counter}`;
  const bar = `<progress id="${id}" class="${cx("ita-progress", colors[color], heights[size])}"${
    a.value !== undefined ? ` value="${a.value}" max="100"` : ""
  }${a.label ? "" : ` aria-label="Avanzamento"`}></progress>`;
  if (!a.label) return bar;
  return `<div class="ita-progress-field">
  <div class="ita-progress-label">
    <label for="${id}">${a.label}</label>${a.showValue && a.value !== undefined ? `<span aria-hidden="true">${a.value}%</span>` : ""}
  </div>
  ${bar}
</div>`;
}

/** The .italia donut: daisyUI radial-progress, thin ring, value in the middle. */
export function progressDonut(a: { value?: number; label?: string; color?: ProgressColor; size?: "sm" | "lg" } = {}): string {
  const { value = 60, label = "Completamento", color = "primary", size = "lg" } = a;
  return `<div class="${cx("ita-donut", size === "sm" && "ita-donut-sm", tones[color])}" style="--value:${value}" role="progressbar" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100" aria-label="${label}"><span>${value}%</span></div>`;
}

/** A spinner with a status role and a hidden label. */
export function spinner(a: { size?: "sm" | "md" | "lg"; label?: string; color?: ProgressColor } = {}): string {
  const { size = "md", label = "Caricamento in corso", color = "primary" } = a;
  const sizes = { sm: "ita-spinner-sm", md: "", lg: "ita-spinner-lg" } as const;
  return `<span role="status" class="${cx("ita-spinner", sizes[size], tones[color])}"><span aria-hidden="true"></span><span class="sr-only">${label}</span></span>`;
}

/** A button busy with a task: spinner inside, or a thin bar along its bottom edge. */
export function progressButton(a: { label?: string; value?: number } = {}): string {
  const { label = "Caricamento" } = a;
  if (a.value === undefined)
    return `<button type="button" class="${buttonClass()} gap-2" disabled><span class="ita-btn-loading" aria-hidden="true"></span><span>${label}…</span></button>`;
  return `<button type="button" class="${buttonClass()} relative overflow-hidden" aria-busy="true">
  <span>${label}</span>
  <progress class="ita-btn-progress" value="${a.value}" max="100" aria-label="${label}"></progress>
</button>`;
}

const stack = (items: string[]) => `<div class="flex flex-col gap-6">\n${items.join("\n")}\n</div>`;
const row = (items: string[]) => `<div class="flex flex-wrap items-center gap-8">\n${items.join("\n")}\n</div>`;

export const doc: ComponentDoc = {
  slug: "progress",
  name: "Progress",
  replaces: "<it-progress>, <it-progress-donut>, <it-spinner>",
  summary:
    "Indicatori di avanzamento: barra sottile su <progress> nativo, ciambella daisyUI radial-progress, spinner e pulsante in caricamento.",
  classes: ["ita-progress", "ita-progress-success", "ita-progress-warning", "ita-progress-danger", "ita-progress-info", "ita-progress-md", "ita-progress-lg", "ita-progress-field", "ita-progress-label", "ita-donut", "ita-donut-sm", "ita-spinner", "ita-spinner-sm", "ita-spinner-lg", "ita-tone-success", "ita-btn-loading", "ita-btn-progress"],
  daisy: ["progress", "radial-progress", "loading", "btn"],
  cssOnly:
    "Senza value la barra è indeterminata e daisyUI la anima. Per aggiornare il valore nel tempo serve JavaScript (o una nuova pagina dal server). Lo spinner è dentro role=status con un testo nascosto, così viene annunciato.",
  examples: [
    {
      id: "barra",
      title: "Barra",
      html: stack([
        progress({ value: 25 }),
        progress({ value: 50, label: "Caricamento del documento", showValue: true }),
        progress({ value: 75, label: "Spazio usato", showValue: true, size: "md" }),
      ]),
    },
    {
      id: "colori",
      title: "Colori",
      html: stack(
        (["primary", "success", "info", "warning", "danger"] as ProgressColor[]).map((c, i) =>
          progress({ value: 20 + i * 18, label: c, showValue: true, color: c }),
        ),
      ),
    },
    { id: "indeterminata", title: "Indeterminata", html: stack([progress({ label: "Ricerca in corso" }), progress({ label: "Verifica dei dati", size: "md", color: "success" })]) },
    {
      id: "ciambella",
      title: "Ciambella",
      html: row([progressDonut({ value: 30 }), progressDonut({ value: 75, color: "success", label: "Pratiche evase" }), progressDonut({ value: 90, size: "sm", color: "warning" })]),
    },
    {
      id: "spinner",
      title: "Spinner",
      html: row([spinner({ size: "sm" }), spinner(), spinner({ size: "lg" }), spinner({ color: "success" })]),
    },
    {
      id: "pulsante",
      title: "Pulsante in caricamento",
      html: row([progressButton({ label: "Invio" }), progressButton({ label: "Caricamento file", value: 45 })]),
    },
  ],
};
