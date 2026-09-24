import type { ComponentDoc } from "../types";
import { choice, choiceGroup, type ChoiceArgs, type ChoiceGroupArgs } from "./checkbox";

/**
 * A switch: a checkbox with role="switch" and daisyUI's toggle. .italia puts
 * the label first and the switch on the right edge, as in a settings list.
 */
export const toggle = (a: ChoiceArgs = {}) => choice("toggle", { labelFirst: true, ...a });
export const toggleGroup = (a: ChoiceGroupArgs = {}) =>
  choiceGroup("toggle", { ...a, items: (a.items ?? []).map((it) => ({ labelFirst: true, ...it })) });

export const doc: ComponentDoc = {
  slug: "toggle",
  name: "Toggle",
  replaces: "<it-toggle>",
  summary:
    "Interruttori acceso/spento: checkbox nativo con role=switch e daisyUI toggle nel colore primario. L'etichetta sta a sinistra e l'interruttore sul bordo destro, come in bootstrap-italia.",
  classes: ["ita-toggle", "ita-toggle-sm", "ita-toggle-lg", "ita-choice", "ita-choice-end", "ita-choice-text", "ita-choice-hint", "ita-choice-group", "ita-legend", "ita-choice-list"],
  daisy: ["toggle", "fieldset"],
  cssOnly: "È un checkbox: Spazio lo attiva, il valore viaggia col form. role=switch fa annunciare «attivo/disattivo» invece di «selezionato».",
  examples: [
    {
      id: "base",
      title: "Esempio base",
      html: `<div class="flex max-w-md flex-col gap-4">
  ${toggle({ label: "Notifiche push" })}
  ${toggle({ label: "Modalità risparmio dati", checked: true })}
</div>`,
    },
    {
      id: "gruppo",
      title: "Gruppo di impostazioni",
      html: `<div class="max-w-md">${toggleGroup({
        legend: "Preferenze di contatto",
        items: [
          { label: "Email", hint: "Un riepilogo alla settimana.", checked: true },
          { label: "SMS", hint: "Solo per le scadenze." },
          { label: "App IO", hint: "Avvisi e ricevute di pagamento.", checked: true },
        ],
      })}</div>`,
    },
    {
      id: "etichetta-destra",
      title: "Etichetta a destra",
      html: `<div class="flex flex-col gap-4">
  ${toggle({ label: "Ricordami su questo dispositivo", labelFirst: false })}
  ${toggle({ label: "Mostra il contrasto elevato", labelFirst: false, checked: true })}
</div>`,
    },
    {
      id: "disabilitato",
      title: "Disabilitato",
      html: `<div class="flex max-w-md flex-col gap-4">
  ${toggle({ label: "Interruttore disabilitato", disabled: true })}
  ${toggle({ label: "Interruttore attivo e disabilitato", checked: true, disabled: true })}
</div>`,
    },
    {
      id: "dimensioni",
      title: "Dimensioni",
      description: "toggle-lg si avvicina al 56×32px di bootstrap-italia.",
      html: `<div class="flex max-w-md flex-col gap-4">
  ${toggle({ label: "Piccolo", size: "sm", checked: true })}
  ${toggle({ label: "Standard", checked: true })}
  ${toggle({ label: "Grande", size: "lg", checked: true })}
</div>`,
    },
  ],
};
