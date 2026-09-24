import { cx, type ComponentDoc } from "../types";
import { describedBy, fieldFeedback, fieldHint, fieldLabel, validatorHint, type FieldSize, type FieldState } from "./input";

export interface SelectOption {
  value?: string;
  label: string;
  selected?: boolean;
  disabled?: boolean;
}
export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

export interface SelectArgs {
  id?: string;
  name?: string;
  label?: string;
  labelHidden?: boolean;
  /** Options, or groups of options rendered as <optgroup>. */
  options?: Array<SelectOption | SelectGroup>;
  /** First, empty option; with `required` it forces a real choice. */
  placeholder?: string;
  hint?: string;
  size?: FieldSize;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  /** Visible rows for a multiple select. */
  rows?: number;
  state?: FieldState;
  feedback?: string;
  validator?: boolean;
  validatorHint?: string;
}

// Literal class maps: Tailwind only sees classes written out in full.
const sizes: Record<FieldSize, string> = { sm: "select-sm", default: "", lg: "select-lg text-lg" };
const states: Record<FieldState, string> = { valid: "select-success", invalid: "select-error" };

const regioni: SelectOption[] = [
  { value: "abruzzo", label: "Abruzzo" },
  { value: "basilicata", label: "Basilicata" },
  { value: "calabria", label: "Calabria" },
  { value: "campania", label: "Campania" },
  { value: "lazio", label: "Lazio" },
  { value: "lombardia", label: "Lombardia" },
  { value: "toscana", label: "Toscana" },
];

const optionHtml = (o: SelectOption) =>
  `<option${o.value !== undefined ? ` value="${o.value}"` : ""}${o.selected ? " selected" : ""}${o.disabled ? " disabled" : ""}>${o.label}</option>`;

let counter = 0;

export function select(a: SelectArgs = {}): string {
  const { label = "Seleziona una regione", options = regioni, size = "default" } = a;
  const id = a.id ?? `select-${++counter}`;
  const hintId = a.hint && `${id}-hint`;
  const fbId = a.state && a.feedback && `${id}-feedback`;
  const vhId = a.validator && `${id}-vhint`;
  const cls = cx(
    "select w-full",
    sizes[size],
    a.state && states[a.state],
    a.validator && "validator",
    // daisyUI's select is one row tall; a list box needs its height back.
    a.multiple && "h-auto bg-none py-1 [&>option]:rounded-sm [&>option]:px-2 [&>option]:py-1",
  );
  const body = options
    .map((o) =>
      "options" in o
        ? `<optgroup label="${o.label}">${o.options.map(optionHtml).join("")}</optgroup>`
        : optionHtml(o),
    )
    .join("\n    ");
  const placeholder =
    a.placeholder && !a.multiple
      ? `<option value=""${options.some((o) => !("options" in o) && o.selected) ? "" : " selected"}>${a.placeholder}</option>\n    `
      : "";
  const attrs = cx(
    a.name && ` name="${a.name}"`,
    a.multiple && " multiple",
    a.multiple && a.rows !== undefined && ` size="${a.rows}"`,
    a.required && " required",
    a.disabled && " disabled",
    a.state === "invalid" && ` aria-invalid="true"`,
  ).replace(/ {2,}/g, " ");
  const parts = [
    fieldLabel(id, label, { required: a.required, hidden: a.labelHidden }),
    `<select id="${id}" class="${cls}"${attrs}${describedBy(hintId, fbId, vhId)}>
    ${placeholder}${body}
  </select>`,
    vhId ? validatorHint(vhId, a.validatorHint ?? "Seleziona un'opzione") : "",
    fbId && a.state ? fieldFeedback(fbId, a.state, a.feedback!) : "",
    hintId ? fieldHint(hintId, a.hint!) : "",
  ];
  return `<div class="w-full max-w-md">\n  ${parts.filter(Boolean).join("\n  ")}\n</div>`;
}

const grid = (items: string[]) => `<div class="grid gap-6 md:grid-cols-2">\n${items.join("\n")}\n</div>`;

export const doc: ComponentDoc = {
  slug: "select",
  name: "Select",
  replaces: "<it-select>",
  summary:
    "Menu di selezione su <select> nativo con daisyUI select: tastiera, lettori di schermo e selettore del sistema su mobile funzionano senza script.",
  daisy: ["select", "select-sm", "select-lg", "select-error", "select-success", "validator", "validator-hint"],
  cssOnly:
    "È il controllo nativo: niente ricerca dentro la lista (per quella c'è Autocomplete) e l'aspetto della lista aperta è quello del sistema operativo. Nei browser che supportano appearance: base-select daisyUI stila anche il pannello.",
  examples: [
    {
      id: "base",
      title: "Esempio base",
      html: grid([
        select({ placeholder: "Scegli un'opzione" }),
        select({ label: "Regione di residenza", options: regioni.map((r) => ({ ...r, selected: r.value === "lazio" })), hint: "Puoi cambiarla in seguito." }),
      ]),
    },
    {
      id: "gruppi",
      title: "Gruppi di opzioni",
      html: select({
        label: "Servizio",
        placeholder: "Scegli un servizio",
        options: [
          { label: "Anagrafe", options: [{ value: "residenza", label: "Cambio di residenza" }, { value: "certificati", label: "Certificati anagrafici" }] },
          { label: "Tributi", options: [{ value: "imu", label: "IMU" }, { value: "tari", label: "TARI" }] },
          { label: "Scuola", options: [{ value: "mensa", label: "Mensa scolastica" }, { value: "trasporto", label: "Trasporto scolastico", disabled: true }] },
        ],
      }),
    },
    {
      id: "disabilitato",
      title: "Disabilitato",
      html: grid([select({ label: "Select disabilitata", placeholder: "Non disponibile", disabled: true })]),
    },
    {
      id: "dimensioni",
      title: "Dimensioni",
      html: `<div class="flex flex-col gap-6">
${select({ label: "Select piccola", size: "sm", placeholder: "select-sm" })}
${select({ label: "Select standard", placeholder: "Standard" })}
${select({ label: "Select grande", size: "lg", placeholder: "select-lg" })}
</div>`,
    },
    {
      id: "multipla",
      title: "Selezione multipla",
      description: "Tieni premuto Ctrl (Cmd su Mac) per sceglierne più di una.",
      html: select({ label: "Regioni di interesse", multiple: true, rows: 5, options: regioni.map((r, i) => ({ ...r, selected: i === 1 || i === 4 })) }),
    },
    {
      id: "validazione",
      title: "Validazione",
      description: "A sinistra lo stato dal server, a destra la validazione nativa: apri la lista e scegli la voce vuota.",
      html: grid([
        select({ label: "Regione", placeholder: "Scegli un'opzione", required: true, state: "invalid", feedback: "Seleziona una regione" }),
        select({ label: "Regione", placeholder: "Scegli un'opzione", required: true, validator: true, validatorHint: "La regione è obbligatoria" }),
      ]),
    },
  ],
};
