import { icon } from "../icons";
import { cx, type ComponentDoc } from "../types";
import { buttonClass } from "./button";

export interface TransferItem {
  label: string;
  value?: string;
  /** Starts in the "selected" column. */
  selected?: boolean;
  disabled?: boolean;
}

export interface TransferArgs {
  legend?: string;
  sourceTitle?: string;
  targetTitle?: string;
  items?: TransferItem[];
  name?: string;
  hint?: string;
}

const defaultItems: TransferItem[] = [
  { label: "Anagrafe", value: "anagrafe" },
  { label: "Tributi", value: "tributi", selected: true },
  { label: "Servizi sociali", value: "sociali" },
  { label: "Mobilità", value: "mobilita", selected: true },
  { label: "Scuola", value: "scuola" },
  { label: "Urbanistica", value: "urbanistica", disabled: true },
];

let counter = 0;

/**
 * CSS-only transfer: one list of checkboxes laid out on a two-column grid.
 * Unchecked items sit in the left column; checking one moves it to the right
 * column (has-checked:col-start-2), and grid-flow-dense packs both columns
 * from the top. The form submits the checked values like any checkbox group.
 */
export function transfer(a: TransferArgs = {}): string {
  const {
    legend = "Uffici da cui ricevere comunicazioni",
    sourceTitle = "Disponibili",
    targetTitle = "Selezionati",
    items = defaultItems,
  } = a;
  const name = a.name ?? `transfer-${++counter}`;
  const hintId = a.hint ? `${name}-hint` : "";
  const row = (it: TransferItem) =>
    `<label><input type="checkbox" name="${name}" value="${it.value ?? it.label}" class="ita-checkbox ita-checkbox-sm"${it.selected ? " checked" : ""}${
      it.disabled ? " disabled" : ""
    }><span>${it.label}</span></label>`;
  return `<fieldset class="ita-transfer"${hintId ? ` aria-describedby="${hintId}"` : ""}>
  <legend>${legend}</legend>${a.hint ? `\n  <p id="${hintId}">${a.hint}</p>` : ""}
  <div class="ita-transfer-grid">
    <p class="ita-transfer-head" aria-hidden="true">${icon("it-list", "")}${sourceTitle}</p>
    <p class="ita-transfer-head" aria-hidden="true">${icon("it-check-circle", "")}${targetTitle}</p>
    ${items.map(row).join("\n    ")}
    <span aria-hidden="true"></span>
  </div>
</fieldset>`;
}

/**
 * The bootstrap-italia layout: two boxed lists and move buttons between them.
 * Without JS the buttons submit the form and the server moves the items.
 */
export function transferForm(a: TransferArgs & { action?: string } = {}): string {
  const { legend = "Uffici da cui ricevere comunicazioni", sourceTitle = "Disponibili", targetTitle = "Selezionati", items = defaultItems, action = "#" } = a;
  const name = a.name ?? `transfer-form-${++counter}`;
  const box = (title: string, list: TransferItem[], field: string) => `<fieldset class="ita-transfer-box">
      <legend class="sr-only">${title}</legend>
      <p class="ita-transfer-head" aria-hidden="true"><span>${title}</span><span class="ita-transfer-count">${list.length}</span></p>
      <ul>
        ${list
          .map(
            (it) =>
              `<li><label><input type="checkbox" name="${field}" value="${it.value ?? it.label}" class="ita-checkbox ita-checkbox-sm"${
                it.disabled ? " disabled" : ""
              }><span>${it.label}</span></label></li>`,
          )
          .join("\n        ")}
      </ul>
    </fieldset>`;
  const src = items.filter((i) => !i.selected);
  const dst = items.filter((i) => i.selected);
  const move = (label: string, value: string, glyph: "it-arrow-right" | "it-arrow-left") =>
    `<button type="submit" name="azione" value="${value}" class="${buttonClass({ outline: true, size: "xs" })} ita-btn-square" aria-label="${label}">${icon(glyph, "")}</button>`;
  return `<form action="${action}" method="post" class="ita-transfer-form" data-transfer>
  <fieldset>
    <legend>${legend}</legend>
    <div class="ita-transfer-layout">
    ${box(sourceTitle, src, `${name}-aggiungi`)}
    <div class="ita-transfer-moves">
      ${move("Sposta nei selezionati", "aggiungi", "it-arrow-right")}
      ${move("Rimuovi dai selezionati", "rimuovi", "it-arrow-left")}
    </div>
    ${box(targetTitle, dst, `${name}-rimuovi`)}
    </div>
  </fieldset>
</form>`;
}

const vanillaJs = `// Client-side moves for transferForm(): the arrow buttons stop submitting
// and move the checked items between the two lists instead.
// Checkbox names end in -aggiungi (left list) or -rimuovi (right list).
const swap = (name) => (name.endsWith("-aggiungi") ? name.replace(/-aggiungi$/, "-rimuovi") : name.replace(/-rimuovi$/, "-aggiungi"));

document.querySelectorAll("form[data-transfer]").forEach((form) => {
  const [source, target] = form.querySelectorAll("ul");
  form.addEventListener("submit", (ev) => {
    const action = ev.submitter?.value;
    if (action !== "aggiungi" && action !== "rimuovi") return;
    ev.preventDefault();
    const [from, to] = action === "aggiungi" ? [source, target] : [target, source];
    for (const box of from.querySelectorAll("input:checked")) {
      box.checked = false;
      box.name = swap(box.name);
      to.append(box.closest("li"));
    }
    // keep the counters in the box headers in sync
    for (const ul of [source, target]) ul.parentElement.querySelector(".ita-transfer-count").textContent = ul.children.length;
  });
});`;

const reactTsx = `import { useState } from "react";

type Item = { value: string; label: string };

/** Two lists with checkboxes; the selected values are posted as <name>[]. */
export function Transfer({ items, name, initial = [] }: { items: Item[]; name: string; initial?: string[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initial));
  const [marked, setMarked] = useState<Set<string>>(new Set());
  const toggleMark = (v: string) => setMarked((m) => new Set(m.has(v) ? [...m].filter((x) => x !== v) : [...m, v]));
  const move = (toSelected: boolean) => {
    setSelected((s) => {
      const next = new Set(s);
      for (const v of marked) toSelected ? next.add(v) : next.delete(v);
      return next;
    });
    setMarked(new Set());
  };
  const list = (title: string, inSelected: boolean) => {
    const rows = items.filter((i) => selected.has(i.value) === inSelected);
    return (
      <fieldset className="ita-transfer-box">
        <legend className="sr-only">{title}</legend>
        <p className="ita-transfer-head" aria-hidden>
          <span>{title}</span><span className="ita-transfer-count">{rows.length}</span>
        </p>
        <ul>
          {rows.map((i) => (
            <li key={i.value}>
              <label>
                <input type="checkbox" className="ita-checkbox ita-checkbox-sm"
                       checked={marked.has(i.value)} onChange={() => toggleMark(i.value)} />
                {i.label}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
    );
  };
  return (
    <div className="ita-transfer-layout">
      {list("Disponibili", false)}
      <div className="ita-transfer-moves">
        <button type="button" className="ita-btn ita-btn-primary ita-btn-outline ita-btn-xs ita-btn-square" aria-label="Sposta nei selezionati" onClick={() => move(true)}>→</button>
        <button type="button" className="ita-btn ita-btn-primary ita-btn-outline ita-btn-xs ita-btn-square" aria-label="Rimuovi dai selezionati" onClick={() => move(false)}>←</button>
      </div>
      {list("Selezionati", true)}
      {[...selected].map((v) => <input key={v} type="hidden" name={\`\${name}[]\`} value={v} />)}
    </div>
  );
}`;

const filterJs = `// Filter box for long lists: hides the rows that don't match.
// <input type="search" class="ita-input ita-input-sm" data-filter="#my-transfer">
document.querySelectorAll("[data-filter]").forEach((box) => {
  const scope = document.querySelector(box.dataset.filter);
  box.addEventListener("input", () => {
    const q = box.value.trim().toLowerCase();
    for (const row of scope.querySelectorAll("label")) {
      row.hidden = q !== "" && !row.textContent.toLowerCase().includes(q);
    }
  });
});`;

export const doc: ComponentDoc = {
  slug: "transfer",
  name: "Transfer",
  replaces: "<it-transfer>",
  summary:
    "Spostare voci da un elenco «disponibili» a un elenco «selezionati». Nella versione solo CSS ogni voce è un checkbox che cambia colonna quando viene selezionato; la versione classica usa due elenchi e pulsanti di invio.",
  classes: ["ita-transfer", "ita-transfer-grid", "ita-transfer-head", "ita-transfer-form", "ita-transfer-layout", "ita-transfer-box", "ita-transfer-moves", "ita-transfer-count", "ita-checkbox"],
  daisy: ["checkbox", "fieldset", "btn", "badge"],
  cssOnly:
    "transfer(): un solo gruppo di checkbox su una griglia a due colonne. label:has(:checked) porta la voce a destra e grid-flow-dense compatta le colonne dall'alto: clic o Spazio spostano la voce, il form invia i valori selezionati. transferForm(): la disposizione di bootstrap-italia con le frecce, che senza JavaScript inviano il form (name=\"azione\") e il server sposta le voci. Filtro di ricerca e spostamento lato client richiedono JavaScript: vedi sotto.",
  examples: [
    {
      id: "base",
      title: "Solo CSS",
      description: "Seleziona una voce: passa nella colonna di destra. Deselezionala per riportarla a sinistra.",
      html: transfer({ hint: "Riceverai avvisi e scadenze solo dagli uffici selezionati." }),
    },
    {
      id: "form",
      title: "Con pulsanti (invio al server)",
      description: "La disposizione di bootstrap-italia: le frecce inviano il form con azione=aggiungi o azione=rimuovi.",
      html: transferForm(),
    },
  ],
  snippets: [
    { title: "Spostamento lato client per transferForm()", lang: "js", description: "Intercetta l'invio delle frecce e sposta le voci senza ricaricare la pagina.", code: vanillaJs },
    { title: "Filtro di ricerca", lang: "js", code: filterJs },
    { title: "Componente React", lang: "tsx", code: reactTsx },
  ],
};
