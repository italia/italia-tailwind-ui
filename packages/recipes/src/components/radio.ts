import type { ComponentDoc } from "../types";
import { choice, choiceGroup, type ChoiceArgs, type ChoiceGroupArgs } from "./checkbox";

export const radio = (a: ChoiceArgs = {}) => choice("radio", a);

let counter = 0;

/** A radio group: every item gets the same name, so only one can be checked. */
export function radioGroup(a: ChoiceGroupArgs & { name?: string } = {}): string {
  const name = a.name ?? `radio-${++counter}`;
  const items = a.items ?? defaultItems;
  return choiceGroup("radio", { legend: "Scegli un'opzione", ...a, items: items.map((it) => ({ name, ...it })) });
}

const defaultItems: ChoiceArgs[] = [
  { label: "Opzione 1", value: "1", checked: true },
  { label: "Opzione 2", value: "2" },
  { label: "Opzione 3", value: "3" },
];

export const doc: ComponentDoc = {
  slug: "radio",
  name: "Radio",
  replaces: "<it-radio>, <it-radio-group>",
  summary:
    "Pulsanti di opzione nativi con daisyUI radio nel colore primario, in un fieldset con legenda: lo stesso name li rende esclusivi e le frecce si muovono nel gruppo.",
  daisy: ["radio", "radio-primary", "radio-sm", "radio-lg", "fieldset", "fieldset-legend", "validator"],
  cssOnly: "Esclusività e navigazione con le frecce sono del browser. Per un gruppo obbligatorio basta required su un elemento.",
  examples: [
    { id: "base", title: "Esempio base", html: radioGroup({ legend: "Modalità di ritiro" , items: [
      { label: "Presso lo sportello", value: "sportello", checked: true },
      { label: "Spedizione a domicilio", value: "domicilio" },
      { label: "Download dal fascicolo online", value: "online" },
    ] }) },
    {
      id: "in-linea",
      title: "In linea",
      html: radioGroup({ legend: "Hai già un'utenza?", inline: true, items: [{ label: "Sì", value: "si" }, { label: "No", value: "no", checked: true }] }),
    },
    {
      id: "descrizione",
      title: "Con descrizione",
      html: radioGroup({
        legend: "Tipo di pagamento",
        hint: "Il costo del servizio è di 16,00 €.",
        items: [
          { label: "pagoPA", hint: "Carta, conto corrente o app della tua banca.", value: "pagopa", checked: true },
          { label: "Bonifico", hint: "Accredito entro 3 giorni lavorativi.", value: "bonifico" },
          { label: "Allo sportello", hint: "Solo con bancomat.", value: "sportello", disabled: true },
        ],
      }),
    },
    {
      id: "disabilitato",
      title: "Gruppo disabilitato",
      html: radioGroup({ legend: "Fascia oraria", disabled: true, items: [{ label: "Mattina", value: "m", checked: true }, { label: "Pomeriggio", value: "p" }] }),
    },
    {
      id: "dimensioni",
      title: "Dimensioni",
      html: `<div class="flex flex-wrap items-center gap-6">
  ${radio({ label: "Piccolo", name: "dim", size: "sm", checked: true })}
  ${radio({ label: "Standard", name: "dim" })}
  ${radio({ label: "Grande", name: "dim", size: "lg" })}
</div>`,
    },
    {
      id: "validazione",
      title: "Validazione",
      html: radioGroup({
        legend: "Sei residente nel comune?",
        required: true,
        inline: true,
        state: "invalid",
        feedback: "Scegli una delle due risposte",
        items: [{ label: "Sì", value: "si", required: true }, { label: "No", value: "no" }],
      }),
    },
  ],
};
