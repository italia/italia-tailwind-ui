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
  primary: "progress-primary",
  success: "progress-success",
  warning: "progress-warning",
  danger: "progress-error",
  info: "progress-info",
};
const text: Record<ProgressColor, string> = {
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-error",
  info: "text-info",
};
const heights = { default: "h-1", md: "h-2", lg: "h-4" } as const;

let counter = 0;

/** A linear bar on native <progress>, so the value is announced for free. */
export function progress(a: ProgressArgs = {}): string {
  const { color = "primary", size = "default" } = a;
  const id = `progress-${++counter}`;
  const bar = `<progress id="${id}" class="${cx("progress w-full rounded-full bg-base-300", colors[color], heights[size])}"${
    a.value !== undefined ? ` value="${a.value}" max="100"` : ""
  }${a.label ? "" : ` aria-label="Avanzamento"`}></progress>`;
  if (!a.label) return bar;
  return `<div class="flex w-full flex-col gap-1">
  <div class="flex items-baseline justify-between text-sm font-semibold">
    <label for="${id}">${a.label}</label>${a.showValue && a.value !== undefined ? `<span aria-hidden="true">${a.value}%</span>` : ""}
  </div>
  ${bar}
</div>`;
}

/** The .italia donut: daisyUI radial-progress, thin ring, value in the middle. */
export function progressDonut(a: { value?: number; label?: string; color?: ProgressColor; size?: "sm" | "lg" } = {}): string {
  const { value = 60, label = "Completamento", color = "primary", size = "lg" } = a;
  const dims = size === "sm" ? "--size:4rem;--thickness:0.25rem" : "--size:8rem;--thickness:0.375rem";
  return `<div class="${cx("radial-progress font-bold", text[color], size === "sm" ? "text-sm" : "text-2xl")}" style="--value:${value};${dims}" role="progressbar" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100" aria-label="${label}"><span class="text-base-content">${value}%</span></div>`;
}

/** A spinner with a status role and a hidden label. */
export function spinner(a: { size?: "sm" | "md" | "lg"; label?: string; color?: ProgressColor } = {}): string {
  const { size = "md", label = "Caricamento in corso", color = "primary" } = a;
  const sizes = { sm: "loading-sm", md: "loading-md", lg: "loading-lg" } as const;
  return `<span role="status" class="inline-flex"><span class="${cx("loading loading-spinner", sizes[size], text[color])}" aria-hidden="true"></span><span class="sr-only">${label}</span></span>`;
}

/** A button busy with a task: spinner inside, or a thin bar along its bottom edge. */
export function progressButton(a: { label?: string; value?: number } = {}): string {
  const { label = "Caricamento" } = a;
  if (a.value === undefined)
    return `<button type="button" class="${buttonClass()} gap-2" disabled><span class="loading loading-spinner loading-sm" aria-hidden="true"></span><span>${label}…</span></button>`;
  return `<button type="button" class="${buttonClass()} relative overflow-hidden" aria-busy="true">
  <span>${label}</span>
  <progress class="progress absolute inset-x-0 bottom-0 h-1 w-full rounded-none bg-primary-content/30 text-primary-content" value="${a.value}" max="100" aria-label="${label}"></progress>
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
  daisy: ["progress", "progress-primary", "radial-progress", "loading", "loading-spinner", "btn"],
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
