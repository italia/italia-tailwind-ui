import { cx, type ComponentDoc } from "../types";
import { describedBy, fieldFeedback, requiredMark, type FieldState } from "./input";

export type ChoiceKind = "checkbox" | "radio" | "toggle";

export interface ChoiceArgs {
  id?: string;
  name?: string;
  value?: string;
  label?: string;
  /** Second line under the label, tied with aria-describedby. */
  hint?: string;
  checked?: boolean;
  disabled?: boolean;
  required?: boolean;
  /** Toggle only: label on the left and switch pushed to the right edge. */
  labelFirst?: boolean;
  size?: "sm" | "default" | "lg";
  /** Adds daisyUI validator so :user-invalid turns it red. */
  validator?: boolean;
}

export interface ChoiceGroupArgs {
  legend?: string;
  /** Legend only for screen readers. */
  legendHidden?: boolean;
  items?: ChoiceArgs[];
  /** Items on one row. */
  inline?: boolean;
  hint?: string;
  state?: FieldState;
  feedback?: string;
  /** Required marker on the legend (radios: set required on the items too). */
  required?: boolean;
  disabled?: boolean;
}

// Literal class maps: Tailwind only sees classes written out in full.
const control: Record<ChoiceKind, string> = {
  checkbox: "ita-checkbox",
  radio: "ita-radio",
  toggle: "ita-toggle",
};
const sizes: Record<ChoiceKind, Record<NonNullable<ChoiceArgs["size"]>, string>> = {
  checkbox: { sm: "ita-checkbox-sm", default: "", lg: "ita-checkbox-lg" },
  radio: { sm: "ita-radio-sm", default: "", lg: "ita-radio-lg" },
  toggle: { sm: "ita-toggle-sm", default: "", lg: "ita-toggle-lg" },
};

let counter = 0;

/** One checkbox, radio or toggle with its label and optional hint. */
export function choice(kind: ChoiceKind, a: ChoiceArgs = {}): string {
  const { label = "Etichetta", size = "default" } = a;
  const id = a.id ?? `${kind}-${++counter}`;
  const hintId = a.hint && `${id}-hint`;
  const cls = cx(control[kind], sizes[kind][size], a.validator && "ita-validate");
  const attrs = cx(
    a.name && `name="${a.name}"`,
    a.value !== undefined && `value="${a.value}"`,
    a.checked && "checked",
    a.disabled && "disabled",
    a.required && "required",
    kind === "toggle" && `role="switch"`,
  );
  const inputHtml = `<input type="${kind === "radio" ? "radio" : "checkbox"}" id="${id}" class="${cls}"${attrs ? ` ${attrs}` : ""}${describedBy(hintId)}>`;
  const text = `<span class="ita-choice-text"><span>${label}</span>${
    hintId ? `<span id="${hintId}" class="ita-choice-hint">${a.hint}</span>` : ""
  }</span>`;
  const row = cx("ita-choice", a.labelFirst && "ita-choice-end");
  return a.labelFirst
    ? `<label for="${id}" class="${row}">${text}${inputHtml}</label>`
    : `<label for="${id}" class="${row}">${inputHtml}${text}</label>`;
}

/** A group of choices in a daisyUI fieldset with its legend. */
export function choiceGroup(kind: ChoiceKind, a: ChoiceGroupArgs = {}): string {
  const { legend = "Scegli le opzioni", items = [] } = a;
  const gid = `${kind}-group-${++counter}`;
  const hintId = a.hint && `${gid}-hint`;
  const fbId = a.state && a.feedback && `${gid}-feedback`;
  const list = cx("ita-choice-list", a.inline && "ita-choice-list-inline");
  const itemsHtml = items.map((it) => choice(kind, { ...it, disabled: it.disabled || a.disabled })).join("\n    ");
  return `<fieldset class="ita-choice-group"${describedBy(hintId, fbId)}>
  <legend class="${a.legendHidden ? "sr-only" : "ita-legend"}">${legend}${a.required ? requiredMark : ""}</legend>${
    hintId ? `\n  <p id="${hintId}" class="ita-hint">${a.hint}</p>` : ""
  }
  <div class="${list}">
    ${itemsHtml}
  </div>${fbId && a.state ? `\n  ${fieldFeedback(fbId, a.state, a.feedback!)}` : ""}
</fieldset>`;
}

export const checkbox = (a: ChoiceArgs = {}) => choice("checkbox", a);
export const checkboxGroup = (a: ChoiceGroupArgs = {}) => choiceGroup("checkbox", a);

const interessi: ChoiceArgs[] = [
  { label: "Cultura e turismo", name: "interessi", value: "cultura", checked: true },
  { label: "Mobilità e trasporti", name: "interessi", value: "mobilita" },
  { label: "Scuola e formazione", name: "interessi", value: "scuola" },
];

export const doc: ComponentDoc = {
  slug: "checkbox",
  name: "Checkbox",
  replaces: "<it-checkbox>",
  summary:
    "Caselle di controllo native con daisyUI checkbox nel colore primario, raggruppate in un fieldset con legenda, testo di aiuto e messaggio di errore.",
  classes: ["ita-checkbox", "ita-checkbox-sm", "ita-checkbox-lg", "ita-choice", "ita-choice-end", "ita-choice-text", "ita-choice-hint", "ita-choice-group", "ita-legend", "ita-choice-list", "ita-choice-list-inline", "ita-validate"],
  daisy: ["checkbox", "fieldset", "validator"],
  cssOnly:
    "Lo stato indeterminato esiste solo come proprietà DOM (el.indeterminate = true): non ha un attributo HTML, quindi serve una riga di JavaScript. L'etichetta avvolge il controllo, così tutta la riga è cliccabile.",
  examples: [
    {
      id: "base",
      title: "Esempio base",
      html: `<div class="flex flex-col gap-3">
  ${checkbox({ label: "Accetto i termini del servizio", name: "termini" })}
  ${checkbox({ label: "Iscrivimi alla newsletter", name: "newsletter", checked: true })}
</div>`,
    },
    {
      id: "gruppo",
      title: "Gruppo con legenda",
      html: checkboxGroup({ legend: "Argomenti di interesse", hint: "Puoi sceglierne più di uno.", items: interessi }),
    },
    {
      id: "in-linea",
      title: "In linea",
      html: checkboxGroup({ legend: "Giorni di reperibilità", inline: true, items: ["Lun", "Mar", "Mer", "Gio", "Ven"].map((d, i) => ({ label: d, name: "giorni", value: d.toLowerCase(), checked: i < 2 })) }),
    },
    {
      id: "descrizione",
      title: "Con descrizione",
      html: checkboxGroup({
        legend: "Notifiche",
        items: [
          { label: "Email", hint: "Ricevi un riepilogo settimanale all'indirizzo registrato.", checked: true },
          { label: "SMS", hint: "Solo per scadenze e pagamenti." },
          { label: "App IO", hint: "Messaggi e avvisi sull'app dei servizi pubblici." },
        ],
      }),
    },
    {
      id: "disabilitato",
      title: "Disabilitato",
      html: `<div class="flex flex-col gap-3">
  ${checkbox({ label: "Opzione disabilitata", disabled: true })}
  ${checkbox({ label: "Opzione selezionata e disabilitata", checked: true, disabled: true })}
</div>`,
    },
    {
      id: "dimensioni",
      title: "Dimensioni",
      html: `<div class="flex flex-wrap items-center gap-6">
  ${checkbox({ label: "Piccola", size: "sm", checked: true })}
  ${checkbox({ label: "Standard", checked: true })}
  ${checkbox({ label: "Grande", size: "lg", checked: true })}
</div>`,
    },
    {
      id: "validazione",
      title: "Validazione",
      description: "A sinistra lo stato dal server; a destra la validazione nativa: seleziona e deseleziona la casella.",
      html: `<div class="grid gap-8 md:grid-cols-2">
${checkboxGroup({ legend: "Privacy", required: true, state: "invalid", feedback: "Devi accettare l'informativa per proseguire", items: [{ label: "Ho letto l'informativa sulla privacy", required: true }] })}
${checkboxGroup({ legend: "Privacy", required: true, items: [{ label: "Ho letto l'informativa sulla privacy", required: true, validator: true }] })}
</div>`,
    },
  ],
  snippets: [
    { title: "«Seleziona tutti» con stato indeterminato", lang: "js", description: "indeterminate esiste solo come proprietà DOM: una casella padre che riflette le figlie.", code: `// <input type="checkbox" class="ita-checkbox" data-all="interessi"> + children name="interessi"
document.querySelectorAll("input[data-all]").forEach((all) => {
  const kids = [...document.querySelectorAll('input[name="' + all.dataset.all + '"]')];
  const sync = () => {
    const n = kids.filter((k) => k.checked).length;
    all.checked = n === kids.length;
    all.indeterminate = n > 0 && n < kids.length;
  };
  all.addEventListener("change", () => { kids.forEach((k) => (k.checked = all.checked)); sync(); });
  kids.forEach((k) => k.addEventListener("change", sync));
  sync();
});` },
    { title: "Checkbox indeterminato in React", lang: "tsx", code: `import { useEffect, useRef, type InputHTMLAttributes } from "react";

export function Checkbox({ indeterminate = false, label, ...rest }: InputHTMLAttributes<HTMLInputElement> & { indeterminate?: boolean; label: string }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (ref.current) ref.current.indeterminate = indeterminate; }, [indeterminate]);
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input ref={ref} type="checkbox" className="ita-checkbox" {...rest} />
      <span>{label}</span>
    </label>
  );
}` },
  ],
};
