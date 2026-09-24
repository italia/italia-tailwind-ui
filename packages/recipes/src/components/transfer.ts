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
  // A one-pixel rule down the middle, drawn by the grid's own background.
  const grid = cx(
    "grid grid-flow-dense grid-cols-2 overflow-hidden rounded-box border border-base-content/20",
    "bg-[linear-gradient(to_right,transparent_calc(50%-0.5px),color-mix(in_oklab,var(--color-base-content)_20%,transparent)_calc(50%-0.5px),color-mix(in_oklab,var(--color-base-content)_20%,transparent)_calc(50%+0.5px),transparent_calc(50%+0.5px))]",
  );
  const head = "row-start-1 flex items-center gap-2 border-b border-base-content/20 bg-base-200 px-4 py-3 font-semibold";
  const row = (it: TransferItem) =>
    `<label class="${cx(
      "col-start-1 flex items-center gap-3 px-4 py-2 has-checked:col-start-2",
      it.disabled ? "cursor-not-allowed text-base-content/50" : "cursor-pointer hover:bg-primary/5",
    )}"><input type="checkbox" name="${name}" value="${it.value ?? it.label}" class="checkbox checkbox-primary checkbox-sm"${it.selected ? " checked" : ""}${
      it.disabled ? " disabled" : ""
    }><span>${it.label}</span></label>`;
  return `<fieldset class="fieldset w-full max-w-2xl gap-0 p-0"${hintId ? ` aria-describedby="${hintId}"` : ""}>
  <legend class="fieldset-legend mb-2 p-0 text-base font-semibold text-base-content">${legend}</legend>${
    a.hint ? `\n  <p id="${hintId}" class="mb-3 text-sm text-base-content/70">${a.hint}</p>` : ""
  }
  <div class="${grid}">
    <p class="${head} col-start-1" aria-hidden="true">${icon("it-list", "size-5")}${sourceTitle}</p>
    <p class="${head} col-start-2" aria-hidden="true">${icon("it-check-circle", "size-5 text-primary")}${targetTitle}</p>
    ${items.map(row).join("\n    ")}
    <span class="col-span-2 h-2" aria-hidden="true"></span>
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
  const box = (title: string, list: TransferItem[], field: string) => `<fieldset class="flex flex-col rounded-box border border-base-content/20">
      <legend class="sr-only">${title}</legend>
      <p class="flex items-center justify-between border-b border-base-content/20 bg-base-200 px-4 py-3 font-semibold" aria-hidden="true"><span>${title}</span><span class="badge badge-sm badge-ghost">${list.length}</span></p>
      <ul class="flex min-h-48 flex-col py-2">
        ${list
          .map(
            (it) =>
              `<li><label class="${cx("flex items-center gap-3 px-4 py-2", it.disabled ? "text-base-content/50" : "cursor-pointer hover:bg-primary/5")}"><input type="checkbox" name="${field}" value="${it.value ?? it.label}" class="checkbox checkbox-primary checkbox-sm"${
                it.disabled ? " disabled" : ""
              }><span>${it.label}</span></label></li>`,
          )
          .join("\n        ")}
      </ul>
    </fieldset>`;
  const src = items.filter((i) => !i.selected);
  const dst = items.filter((i) => i.selected);
  const move = (label: string, value: string, glyph: "it-arrow-right" | "it-arrow-left") =>
    `<button type="submit" name="azione" value="${value}" class="${buttonClass({ outline: true, size: "xs" })} btn-square" aria-label="${label}">${icon(glyph, "size-5")}</button>`;
  return `<form action="${action}" method="post" class="w-full max-w-3xl" data-transfer>
  <fieldset class="fieldset gap-0 p-0">
    <legend class="fieldset-legend mb-2 p-0 text-base font-semibold text-base-content">${legend}</legend>
    <div class="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
    ${box(sourceTitle, src, `${name}-aggiungi`)}
    <div class="flex justify-center gap-2 md:flex-col">
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
    for (const ul of [source, target]) ul.parentElement.querySelector(".badge").textContent = ul.children.length;
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
      <fieldset className="rounded-box border border-base-content/20">
        <legend className="sr-only">{title}</legend>
        <p className="flex justify-between border-b border-base-content/20 bg-base-200 px-4 py-3 font-semibold" aria-hidden>
          {title} <span className="badge badge-sm badge-ghost">{rows.length}</span>
        </p>
        <ul className="min-h-48 py-2">
          {rows.map((i) => (
            <li key={i.value}>
              <label className="flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-primary/5">
                <input type="checkbox" className="checkbox checkbox-primary checkbox-sm"
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
    <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
      {list("Disponibili", false)}
      <div className="flex justify-center gap-2 md:flex-col">
        <button type="button" className="btn btn-sm btn-square btn-outline btn-primary" aria-label="Sposta nei selezionati" onClick={() => move(true)}>→</button>
        <button type="button" className="btn btn-sm btn-square btn-outline btn-primary" aria-label="Rimuovi dai selezionati" onClick={() => move(false)}>←</button>
      </div>
      {list("Selezionati", true)}
      {[...selected].map((v) => <input key={v} type="hidden" name={\`\${name}[]\`} value={v} />)}
    </div>
  );
}`;

const filterJs = `// Filter box for long lists: hides the rows that don't match.
// <input type="search" class="input input-sm" data-filter="#my-transfer">
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
  daisy: ["checkbox", "fieldset", "btn", "badge"],
  cssOnly:
    "transfer(): un solo gruppo di checkbox su una griglia a due colonne. has-checked:col-start-2 porta la voce a destra e grid-flow-dense compatta le colonne dall'alto: clic o Spazio spostano la voce, il form invia i valori selezionati. transferForm(): la disposizione di bootstrap-italia con le frecce, che senza JavaScript inviano il form (name=\"azione\") e il server sposta le voci. Filtro di ricerca e spostamento lato client richiedono JavaScript: vedi sotto.",
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
