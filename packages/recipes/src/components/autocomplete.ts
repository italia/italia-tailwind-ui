import type { IconName } from "../icons";
import type { ComponentDoc } from "../types";
import { buttonClass } from "./button";
import { input, type FieldSize } from "./input";

export interface AutocompleteSuggestion {
  value: string;
  /** Extra text the browser shows next to the value (a province, a code). */
  label?: string;
}

export interface AutocompleteArgs {
  id?: string;
  name?: string;
  label?: string;
  labelHidden?: boolean;
  placeholder?: string;
  hint?: string;
  size?: FieldSize;
  required?: boolean;
  disabled?: boolean;
  suggestions?: Array<string | AutocompleteSuggestion>;
  icon?: IconName | false;
  /** A submit button joined to the field. */
  submitLabel?: string;
}

const comuni: AutocompleteSuggestion[] = [
  { value: "Bari", label: "BA" },
  { value: "Bologna", label: "BO" },
  { value: "Firenze", label: "FI" },
  { value: "Genova", label: "GE" },
  { value: "Milano", label: "MI" },
  { value: "Napoli", label: "NA" },
  { value: "Palermo", label: "PA" },
  { value: "Roma", label: "RM" },
  { value: "Torino", label: "TO" },
  { value: "Venezia", label: "VE" },
];

let counter = 0;

export function autocomplete(a: AutocompleteArgs = {}): string {
  const { label = "Comune", suggestions = comuni, size = "default" } = a;
  const id = a.id ?? `autocomplete-${++counter}`;
  const listId = `${id}-list`;
  const field = input({
    id,
    name: a.name,
    label,
    labelHidden: a.labelHidden,
    type: "text",
    placeholder: a.placeholder ?? "Inizia a scrivere",
    hint: a.hint,
    size,
    required: a.required,
    disabled: a.disabled,
    autocomplete: "off",
    list: listId,
    icon: a.icon === false ? undefined : (a.icon ?? "it-search"),
    button: a.submitLabel ? `<button type="submit" class="${buttonClass()}">${a.submitLabel}</button>` : undefined,
  });
  const options = suggestions
    .map((s) => (typeof s === "string" ? { value: s } : s))
    .map((s) => `<option value="${s.value}"${s.label ? ` label="${s.label}"` : ""}></option>`)
    .join("");
  return field.replace(/\n<\/div>$/, `\n  <datalist id="${listId}">${options}</datalist>\n</div>`);
}

const grid = (items: string[]) => `<div class="grid gap-6 md:grid-cols-2">\n${items.join("\n")}\n</div>`;

export const doc: ComponentDoc = {
  slug: "autocomplete",
  name: "Autocomplete",
  replaces: "<it-autocomplete>",
  summary:
    "Campo con suggerimenti mentre si scrive: input daisyUI legato a un <datalist> nativo. Filtraggio, frecce e Invio li gestisce il browser.",
  daisy: ["input", "join"],
  cssOnly:
    "Il pannello dei suggerimenti è quello del browser e non si può stilare. Il filtro lavora sulle opzioni già nella pagina: per cercare su un server serve JavaScript (o un form che ricarica la pagina con i risultati). Il valore resta libero: per obbligare una voce dell'elenco usa Select.",
  examples: [
    {
      id: "base",
      title: "Esempio base",
      description: "Scrivi «Bo» o «ro».",
      html: grid([autocomplete({ hint: "Il comune di residenza." })]),
    },
    {
      id: "senza-icona",
      title: "Senza icona",
      html: grid([
        autocomplete({
          label: "Linguaggio di programmazione",
          icon: false,
          placeholder: "Es. TypeScript",
          suggestions: ["C", "C++", "Go", "Java", "JavaScript", "Kotlin", "Python", "Rust", "Swift", "TypeScript"],
        }),
      ]),
    },
    {
      id: "ricerca",
      title: "Ricerca con pulsante",
      html: autocomplete({
        label: "Cerca un servizio",
        labelHidden: true,
        placeholder: "Cerca un servizio",
        size: "lg",
        submitLabel: "Cerca",
        suggestions: ["Carta d'identità elettronica", "Cambio di residenza", "Iscrizione all'asilo nido", "Pagamento TARI", "Permesso ZTL"],
      }),
    },
    {
      id: "disabilitato",
      title: "Disabilitato",
      html: grid([autocomplete({ disabled: true })]),
    },
  ],
};
