import { icon, type IconName } from "../icons";
import { cx, type ComponentDoc } from "../types";
import { buttonClass } from "./button";

export type FieldSize = "sm" | "default" | "lg";
export type FieldState = "valid" | "invalid";
export type InputType = "text" | "email" | "password" | "number" | "tel" | "url" | "search" | "date" | "time";

export interface InputArgs {
  id?: string;
  name?: string;
  label?: string;
  /** Label only for screen readers. */
  labelHidden?: boolean;
  type?: InputType;
  placeholder?: string;
  value?: string;
  /** Help text under the field, tied with aria-describedby. */
  hint?: string;
  size?: FieldSize;
  disabled?: boolean;
  readonly?: boolean;
  /** Read-only value shown as plain text, without the field box. */
  plaintext?: boolean;
  required?: boolean;
  /** Server-side result: colours the field and shows `feedback`. */
  state?: FieldState;
  feedback?: string;
  /** Native constraint validation: daisyUI validator + validator-hint, shown after the user edits. */
  validator?: boolean;
  /** Message shown by the native validator when the value is not valid. */
  validatorHint?: string;
  pattern?: string;
  minlength?: number;
  maxlength?: number;
  min?: number;
  max?: number;
  step?: number;
  autocomplete?: string;
  /** Icon inside the field, on the left. */
  icon?: IconName;
  /** Short text inside the field, before or after the value (€, %, kg). */
  prefix?: string;
  suffix?: string;
  /** daisyUI floating-label: the label sits in the field and moves up on focus. */
  floating?: boolean;
  /** A <textarea> instead of an <input>. */
  textarea?: boolean;
  rows?: number;
  /** A button joined to the right of the field. */
  button?: string;
  /** datalist id, used by the autocomplete recipe. */
  list?: string;
}

// Literal class maps: Tailwind only sees classes written out in full.
const inputSizes: Record<FieldSize, string> = { sm: "input-sm", default: "", lg: "input-lg text-lg" };
const textareaSizes: Record<FieldSize, string> = { sm: "textarea-sm", default: "", lg: "textarea-lg text-lg" };
const inputStates: Record<FieldState, string> = { valid: "input-success", invalid: "input-error" };
const textareaStates: Record<FieldState, string> = { valid: "textarea-success", invalid: "textarea-error" };
const feedbackColor: Record<FieldState, string> = { valid: "text-success", invalid: "text-error" };
const feedbackIcon: Record<FieldState, IconName> = { valid: "it-check-circle", invalid: "it-error" };

/** The .italia field label: above the control, semibold. */
export const labelClass = "mb-1 block text-base font-semibold text-base-content";
/** Help text under a control. */
export const hintClass = "mt-1 text-sm text-base-content/70";

export const fieldLabel = (id: string, text: string, o: { required?: boolean; hidden?: boolean } = {}) =>
  `<label for="${id}" class="${o.hidden ? "sr-only" : labelClass}">${text}${
    o.required ? ` <span class="text-error" aria-hidden="true">*</span>` : ""
  }</label>`;

export const fieldHint = (id: string, text: string) => `<p id="${id}" class="${hintClass}">${text}</p>`;

/** Validation message with its icon; role is left off so it is read with the field, not on page load. */
export const fieldFeedback = (id: string, state: FieldState, text: string) =>
  `<p id="${id}" class="${cx("mt-1 flex items-center gap-1 text-sm font-semibold", feedbackColor[state])}">${icon(
    feedbackIcon[state],
    "size-4",
  )}<span>${text}</span></p>`;

/** The native-validation message: hidden until :user-invalid, then red. */
export const validatorHint = (id: string, text: string) =>
  `<p id="${id}" class="validator-hint mt-1 text-sm">${text}</p>`;

/** aria-describedby value from the ids that exist. */
export const describedBy = (...ids: Array<string | false | undefined>) => {
  const v = ids.filter(Boolean).join(" ");
  return v ? ` aria-describedby="${v}"` : "";
};

let counter = 0;

export function input(a: InputArgs = {}): string {
  const { label = "Campo di testo", type = "text", size = "default" } = a;
  const id = a.id ?? `input-${++counter}`;
  const hintId = a.hint && `${id}-hint`;
  const fbId = a.state && a.feedback && `${id}-feedback`;
  const vhId = a.validator && `${id}-vhint`;
  const wrapped = Boolean(a.icon || a.prefix || a.suffix);
  const area = a.textarea;

  // With an icon or a prefix, daisyUI puts .input on the wrapper and the
  // <input> inside it goes borderless; otherwise .input is on the control.
  const box = cx(
    area ? "textarea" : "input",
    "w-full",
    area ? textareaSizes[size] : inputSizes[size],
    a.state && (area ? textareaStates[a.state] : inputStates[a.state]),
    a.validator && "validator",
    a.plaintext && "border-transparent bg-transparent px-0 shadow-none",
  );
  const attrs = cx(
    a.name && `name="${a.name}"`,
    a.placeholder !== undefined && `placeholder="${a.placeholder}"`,
    a.value !== undefined && !area && `value="${a.value}"`,
    a.pattern && `pattern="${a.pattern}"`,
    a.minlength !== undefined && `minlength="${a.minlength}"`,
    a.maxlength !== undefined && `maxlength="${a.maxlength}"`,
    a.min !== undefined && `min="${a.min}"`,
    a.max !== undefined && `max="${a.max}"`,
    a.step !== undefined && `step="${a.step}"`,
    a.autocomplete && `autocomplete="${a.autocomplete}"`,
    a.list && `list="${a.list}"`,
    a.rows !== undefined && `rows="${a.rows}"`,
    a.required && "required",
    a.disabled && "disabled",
    (a.readonly || a.plaintext) && "readonly",
    a.state === "invalid" && `aria-invalid="true"`,
  );
  const aria = describedBy(hintId, fbId, vhId);
  const ctrlClass = wrapped ? "" : ` class="${box}"`;
  const control = area
    ? `<textarea id="${id}"${ctrlClass}${attrs ? ` ${attrs}` : ""}${aria}>${a.value ?? ""}</textarea>`
    : `<input type="${type}" id="${id}"${ctrlClass}${attrs ? ` ${attrs}` : ""}${aria}>`;

  let field = control;
  if (wrapped) {
    const pre = [
      a.icon ? icon(a.icon, "size-5 shrink-0 text-base-content/70") : "",
      a.prefix ? `<span class="text-base-content/70" aria-hidden="true">${a.prefix}</span>` : "",
    ].join("");
    const post = a.suffix ? `<span class="text-base-content/70" aria-hidden="true">${a.suffix}</span>` : "";
    field = `<div class="${box}">${pre}${control}${post}</div>`;
  }
  if (a.floating) {
    // The floating label wraps the control, so it needs no for/id pairing.
    field = `<label class="floating-label w-full">${field}<span>${label}</span></label>`;
  }
  if (a.button) field = `<div class="join w-full">${field.replace(/class="(input|textarea)/, 'class="join-item $1')}${a.button.replace(/class="/, 'class="join-item ')}</div>`;

  const parts = [
    a.floating ? "" : fieldLabel(id, label, { required: a.required, hidden: a.labelHidden }),
    field,
    vhId ? validatorHint(vhId, a.validatorHint ?? "Controlla il valore inserito") : "",
    fbId && a.state ? fieldFeedback(fbId, a.state, a.feedback!) : "",
    hintId ? fieldHint(hintId, a.hint!) : "",
  ];
  return `<div class="w-full max-w-md">\n  ${parts.filter(Boolean).join("\n  ")}\n</div>`;
}

const stack = (items: string[]) => `<div class="flex flex-col gap-6">\n${items.join("\n")}\n</div>`;
const grid = (items: string[]) => `<div class="grid gap-6 md:grid-cols-2">\n${items.join("\n")}\n</div>`;

export const doc: ComponentDoc = {
  slug: "input",
  name: "Input",
  replaces: "<it-input>",
  summary:
    "Campi di testo .italia: etichetta sopra, bordo ardesia, testo di aiuto e messaggi di validazione legati con aria-describedby. daisyUI input, textarea, floating-label e validator.",
  daisy: ["input", "textarea", "input-sm", "input-lg", "input-error", "input-success", "floating-label", "validator", "validator-hint", "join"],
  cssOnly:
    "Il bordo ardesia (contrasto 3:1) è una regola di @italia-daisy/css nello stesso sotto-layer di daisyUI, quindi input-error, validator e :focus lo sostituiscono. La validazione nativa usa :user-invalid tramite daisyUI validator: il messaggio compare solo dopo che l'utente ha modificato il campo. Mostra/nascondi password e contatore di caratteri richiedono JavaScript e non sono inclusi: il campo password resta type=password.",
  examples: [
    {
      id: "base",
      title: "Esempio base",
      html: grid([
        input({ label: "Nome", placeholder: "Mario", autocomplete: "given-name" }),
        input({ label: "Cognome", placeholder: "Rossi", autocomplete: "family-name" }),
        input({ label: "Indirizzo email", type: "email", placeholder: "nome@esempio.it", hint: "Useremo questo indirizzo solo per risponderti." }),
        input({ label: "Telefono", type: "tel", placeholder: "+39 06 1234567", autocomplete: "tel" }),
      ]),
    },
    {
      id: "tipi",
      title: "Tipologie di campo",
      html: grid([
        input({ label: "Password", type: "password", autocomplete: "current-password" }),
        input({ label: "Numero", type: "number", value: "3", min: 0, max: 10, step: 1 }),
        input({ label: "Data", type: "date" }),
        input({ label: "Ora", type: "time" }),
      ]),
    },
    {
      id: "area-testo",
      title: "Area di testo",
      html: input({ label: "Messaggio", textarea: true, rows: 4, placeholder: "Scrivi qui la tua richiesta", hint: "Massimo 500 caratteri." }),
    },
    {
      id: "stati",
      title: "Disabilitato e sola lettura",
      html: grid([
        input({ label: "Campo disabilitato", value: "Non modificabile", disabled: true }),
        input({ label: "Campo in sola lettura", value: "RSSMRA80A01H501U", readonly: true }),
        input({ label: "Testo semplice", value: "mario.rossi@esempio.it", plaintext: true }),
      ]),
    },
    {
      id: "dimensioni",
      title: "Dimensioni",
      html: stack([
        input({ label: "Campo piccolo", size: "sm", placeholder: "input-sm" }),
        input({ label: "Campo standard", placeholder: "40px, come bootstrap-italia" }),
        input({ label: "Campo grande", size: "lg", placeholder: "input-lg" }),
      ]),
    },
    {
      id: "icone",
      title: "Icone e unità",
      description: "Con un'icona o un'unità daisyUI sposta la classe input sul contenitore: il campo interno perde il bordo.",
      html: grid([
        input({ label: "Cerca", type: "search", icon: "it-search", placeholder: "Cerca nel sito" }),
        input({ label: "Email", type: "email", icon: "it-mail", placeholder: "nome@esempio.it" }),
        input({ label: "Importo", type: "number", prefix: "€", placeholder: "0,00", step: 0.01 }),
        input({ label: "Sconto", type: "number", suffix: "%", value: "10", min: 0, max: 100 }),
      ]),
    },
    {
      id: "pulsante",
      title: "Con pulsante",
      html: input({
        label: "Cerca un servizio",
        labelHidden: true,
        type: "search",
        icon: "it-search",
        placeholder: "Cerca un servizio",
        button: `<button type="submit" class="${buttonClass()}">Cerca</button>`,
      }),
    },
    {
      id: "validazione",
      title: "Validazione dal server",
      description: "Lo stato arriva già calcolato: input-error / input-success più un messaggio legato al campo.",
      html: grid([
        input({ label: "Codice fiscale", value: "RSSMRA80A01H501U", state: "valid", feedback: "Codice fiscale corretto" }),
        input({ label: "Email", type: "email", value: "mario.rossi@", state: "invalid", feedback: "Inserisci un indirizzo email valido", required: true }),
      ]),
    },
    {
      id: "validazione-nativa",
      title: "Validazione nativa",
      description: "daisyUI validator: scrivi un valore e spostati sul campo successivo. Il messaggio appare solo dopo l'interazione (:user-invalid).",
      html: grid([
        input({ label: "Email", type: "email", required: true, validator: true, placeholder: "nome@esempio.it", validatorHint: "Inserisci un indirizzo email valido" }),
        input({
          label: "CAP",
          required: true,
          validator: true,
          pattern: "[0-9]{5}",
          maxlength: 5,
          placeholder: "00100",
          validatorHint: "Il CAP è di 5 cifre",
        }),
      ]),
    },
    {
      id: "etichetta-flottante",
      title: "Etichetta flottante",
      description: "daisyUI floating-label: l'etichetta sale sopra il bordo quando il campo riceve il focus.",
      html: grid([
        input({ label: "Nome", floating: true, placeholder: "Nome" }),
        input({ label: "Città", floating: true, placeholder: "Città", size: "lg" }),
      ]),
    },
  ],
  snippets: [
    { title: "Mostra / nascondi password", lang: "js", description: "Aggiunge un pulsante accanto ai campi password; aria-pressed dice lo stato.", code: `document.querySelectorAll("input[type=password]").forEach((field) => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn btn-ghost btn-sm join-item";
  btn.textContent = "Mostra";
  btn.setAttribute("aria-pressed", "false");
  btn.setAttribute("aria-controls", field.id);
  btn.addEventListener("click", () => {
    const show = field.type === "password";
    field.type = show ? "text" : "password";
    btn.textContent = show ? "Nascondi" : "Mostra";
    btn.setAttribute("aria-pressed", String(show));
  });
  field.after(btn);
});` },
    { title: "Contatore di caratteri", lang: "js", description: "Per i campi con maxlength: il conteggio è annunciato con calma (aria-live=polite).", code: `document.querySelectorAll("textarea[maxlength], input[maxlength]").forEach((field) => {
  const out = document.createElement("p");
  out.className = "mt-1 text-sm text-base-content/70";
  out.setAttribute("aria-live", "polite");
  const max = field.maxLength;
  const update = () => (out.textContent = "Caratteri rimanenti: " + (max - field.value.length));
  field.addEventListener("input", update);
  field.after(out);
  update();
});` },
    { title: "Password in React", lang: "tsx", code: `import { useId, useState } from "react";

export function PasswordInput({ label }: { label: string }) {
  const id = useId();
  const [show, setShow] = useState(false);
  return (
    <div className="w-full max-w-md">
      <label htmlFor={id} className="mb-1 block font-semibold">{label}</label>
      <div className="join w-full">
        <input id={id} type={show ? "text" : "password"} autoComplete="current-password" className="input join-item w-full" />
        <button type="button" className="btn join-item" aria-pressed={show} aria-controls={id} onClick={() => setShow(!show)}>
          {show ? "Nascondi" : "Mostra"}
        </button>
      </div>
    </div>
  );
}` },
  ],
};
