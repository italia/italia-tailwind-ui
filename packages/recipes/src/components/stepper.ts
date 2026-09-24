import { icon, type IconName } from "../icons";
import { cx, type ComponentDoc } from "../types";
import { buttonClass } from "./button";

export interface Step {
  label: string;
  icon?: IconName;
}

export interface StepperArgs {
  steps?: Array<string | Step>;
  /** Index of the current step, from 0. Earlier steps are done. */
  current?: number;
  /**
   * Header style:
   * - "text": bootstrap-italia steppers-header, labels with an underline
   * - "number": numbered circles before each label
   * - "icon": each step's icon before its label
   * - "steps": daisyUI steps, circles joined by a line
   */
  header?: "text" | "number" | "icon" | "steps";
  /** Progress shown between the nav buttons. */
  nav?: "dots" | "progress" | "none";
  label?: string;
  /** Last step: the Avanti button becomes Conferma. */
  confirmLabel?: string;
  /**
   * One HTML panel per step. With panels the stepper becomes a whole
   * <form data-stepper>: only the current panel is visible, and Indietro /
   * Avanti submit the form with name="passo" so the server renders the next
   * step. The JS snippet in the docs turns it into a one-page stepper.
   */
  panels?: string[];
  /** Form action when `panels` is set. */
  action?: string;
}

const defaultSteps: Step[] = [
  { label: "Informativa", icon: "it-info-circle" },
  { label: "Dati personali", icon: "it-user" },
  { label: "Documenti", icon: "it-files" },
  { label: "Pagamento", icon: "it-card" },
  { label: "Riepilogo", icon: "it-check-circle" },
];

const toStep = (s: string | Step): Step => (typeof s === "string" ? { label: s } : s);
let counter = 0;

function header(steps: Step[], current: number, kind: NonNullable<StepperArgs["header"]>): string {
  if (kind === "steps") {
    // daisyUI steps: the colour class marks done and current steps.
    const items = steps.map((s, i) => {
      const cls = cx("step", i <= current && "step-primary", i === current && "font-semibold");
      const content = i < current ? ` data-content="✓"` : "";
      return `<li class="${cls}"${content}${i === current ? ` aria-current="step"` : ""}>${s.label}${i < current ? '<span class="sr-only"> (completato)</span>' : ""}</li>`;
    });
    return `<ol class="steps steps-vertical w-full sm:steps-horizontal">\n    ${items.join("\n    ")}\n  </ol>`;
  }
  const items = steps.map((s, i) => {
    const done = i < current;
    const active = i === current;
    const mark =
      kind === "number"
        ? `<span class="${cx(
            "grid size-8 shrink-0 place-items-center rounded-full border text-sm font-semibold",
            done ? "border-success bg-success text-success-content" : active ? "border-primary bg-primary text-primary-content" : "border-base-content/30",
          )}" aria-hidden="true">${done ? icon("it-check", "size-5") : i + 1}</span>`
        : kind === "icon" && s.icon
          ? icon(s.icon, cx("size-6 shrink-0", active ? "text-primary" : done ? "text-success" : "text-base-content/60"))
          : "";
    const check = done && kind !== "number" ? icon("it-check", "size-5 shrink-0 text-success ms-auto") : "";
    const cls = cx(
      "flex min-h-16 flex-1 items-center gap-3 border-b-2 px-3 text-base",
      active ? "border-primary font-semibold text-primary" : "border-base-content/15 text-base-content/70",
      !active && "max-lg:hidden",
    );
    return `<li class="${cls}"${active ? ` aria-current="step"` : ""}>${mark}<span>${s.label}</span>${done ? '<span class="sr-only"> (completato)</span>' : ""}${check}${
      active ? `<span class="ms-auto text-sm font-normal text-base-content/70 lg:hidden" aria-hidden="true">${i + 1}/${steps.length}</span>` : ""
    }</li>`;
  });
  return `<ol class="flex w-full">\n    ${items.join("\n    ")}\n  </ol>`;
}

// data-stepper-* attributes are inert hooks for the optional JS snippet.
function progressNav(total: number, current: number, kind: NonNullable<StepperArgs["nav"]>): string {
  const sr = `<p class="sr-only" aria-live="polite" data-stepper-status>Passo ${current + 1} di ${total}</p>`;
  if (kind === "none") return sr;
  if (kind === "progress")
    return `<div class="hidden flex-1 px-4 sm:block">${sr}<progress class="progress progress-primary h-1 w-full bg-base-300" value="${current + 1}" max="${total}" aria-hidden="true" data-stepper-progress></progress></div>`;
  const dots = Array.from({ length: total }, (_, i) => `<li class="${cx("size-2 rounded-full", i <= current ? "bg-primary" : "bg-base-300")}"></li>`);
  return `<div class="hidden sm:block">${sr}<ul class="flex items-center gap-2" aria-hidden="true" data-stepper-dots>${dots.join("")}</ul></div>`;
}

export function stepper(a: StepperArgs = {}): string {
  const { current = 1, header: kind = "text", nav = "dots", label = "Passaggi della domanda", confirmLabel = "Conferma" } = a;
  const steps = (a.steps ?? defaultSteps).map(toStep);
  const last = current === steps.length - 1;
  // Both buttons submit: without JS each step is a round trip to the server
  // (name="passo" carries the step to show). Indietro skips validation.
  const backBtn = `<button type="submit" name="passo" value="${Math.max(current - 1, 0)}" formnovalidate class="${buttonClass({ outline: true, size: "xs" })} gap-2"${current === 0 ? " disabled" : ""} data-stepper-back>${icon("it-chevron-left", "size-5")}<span>Indietro</span></button>`;
  const nextBtn = `<button type="submit" name="passo" value="${last ? "invia" : current + 1}" class="${cx(buttonClass({ variant: last ? "success" : "primary", size: "xs" }), "gap-2")}" data-stepper-next data-confirm="${confirmLabel}"><span>${last ? confirmLabel : "Avanti"}</span>${icon("it-chevron-right", cx("size-5", last && "hidden"))}</button>`;
  const uid = `stepper-${++counter}`;
  const panels = a.panels
    ? `
  ${a.panels
        .map(
          (html, i) => `<section data-step aria-labelledby="${uid}-${i + 1}-title"${i === current ? "" : " hidden"}>
    <h3 id="${uid}-${i + 1}-title" tabindex="-1" class="mb-4 text-2xl font-bold focus:outline-none">${steps[i]?.label ?? `Passo ${i + 1}`}</h3>
    ${html}
  </section>`,
        )
        .join("\n  ")}`
    : "";
  const body = `
  <nav aria-label="${label}">
  ${header(steps, current, kind)}
  </nav>${panels}
  <div class="flex items-center justify-between gap-4 border-t border-base-content/15 pt-4">
    ${backBtn}
    ${progressNav(steps.length, current, nav)}
    ${nextBtn}
  </div>
`;
  return a.panels
    ? `<form action="${a.action ?? "#"}" method="post" class="flex w-full flex-col gap-6" data-stepper>${body}</form>`
    : `<div class="flex w-full flex-col gap-6">${body}</div>`;
}

const demoPanels = [
  `<p class="mb-4">Prima di iniziare leggi l'informativa sul trattamento dei dati personali.</p>
    <label class="flex cursor-pointer items-center gap-3"><input type="checkbox" name="informativa" required class="checkbox checkbox-primary"><span>Ho letto l'informativa</span></label>`,
  `<div class="grid max-w-2xl gap-4 md:grid-cols-2">
      <div><label for="st-nome" class="mb-1 block font-semibold">Nome</label><input id="st-nome" name="nome" required autocomplete="given-name" class="input w-full"></div>
      <div><label for="st-cognome" class="mb-1 block font-semibold">Cognome</label><input id="st-cognome" name="cognome" required autocomplete="family-name" class="input w-full"></div>
    </div>`,
  `<label for="st-doc" class="mb-1 block font-semibold">Documento d'identità</label>
    <input id="st-doc" type="file" name="documento" class="file-input file-input-primary w-full max-w-md">`,
  `<p>Il costo del servizio è di 16,00 €, pagabile con pagoPA al termine della domanda.</p>`,
  `<p>Controlla i dati inseriti, poi premi «Invia la domanda».</p>`,
];

export const doc: ComponentDoc = {
  slug: "stepper",
  name: "Stepper",
  replaces: "<it-steppers>",
  summary:
    "L'intestazione dei moduli a più passaggi, con passi completati, passo corrente e navigazione Indietro/Avanti con punti o barra di avanzamento.",
  daisy: ["steps", "step", "step-primary", "steps-horizontal", "steps-vertical", "progress", "btn"],
  cssOnly:
    "Lo stato arriva dal server: current indica il passo attivo, i precedenti sono completati. Indietro e Avanti sono pulsanti di invio (name=\"passo\"): ogni passo è un giro dal server, e Indietro usa formnovalidate. Con panels il componente include i pannelli dei passi in un <form data-stepper>. Per cambiare passo nella pagina senza ricaricarla serve JavaScript: vedi sotto. Il passo corrente ha aria-current=\"step\". Sotto lg l'intestazione mostra solo il passo corrente e l'indice «2/5».",
  examples: [
    { id: "base", title: "Esempio base", html: stepper() },
    { id: "numeri", title: "Con numeri", html: stepper({ header: "number", current: 2 }) },
    { id: "icone", title: "Con icone", html: stepper({ header: "icon", current: 3, nav: "progress" }) },
    {
      id: "daisy-steps",
      title: "Cerchi uniti (daisyUI steps)",
      description: "L'alternativa daisyUI: su mobile i passi diventano verticali.",
      html: stepper({ header: "steps", current: 2, nav: "progress" }),
    },
    {
      id: "ultimo",
      title: "Ultimo passo",
      html: stepper({ steps: ["Dati", "Allegati", "Riepilogo"], current: 2, header: "number", confirmLabel: "Invia la domanda" }),
    },
    {
      id: "sfondo-primario",
      title: "Su sfondo primario",
      description: "Il contenitore ha la classe it-surface-primary: i token si scambiano (base diventa primary, primary diventa primary-content) e il componente si adatta senza opzioni.",
      html: `<div class="it-surface-primary rounded-box p-6">${stepper({ header: "number", current: 1 })}</div>`,
    },
    {
      id: "modulo",
      title: "Modulo a passi",
      description:
        "Con panels il componente diventa un <form>: senza JavaScript Avanti invia il passo al server. Con il frammento JavaScript qui sotto i passi cambiano nella pagina, e prima di andare avanti controlla i campi del passo corrente.",
      html: stepper({ header: "steps", nav: "progress", current: 0, confirmLabel: "Invia la domanda", panels: demoPanels }),
    },
  ],
  snippets: [
    {
      title: "Passi nella stessa pagina",
      lang: "js",
      description:
        "Per il markup di stepper({ panels, header: \"steps\" }). Intercetta Indietro e Avanti, controlla solo i campi del passo visibile, aggiorna intestazione, barra o punti, e sposta il focus sul titolo del nuovo passo. All'ultimo passo il pulsante invia davvero il form.",
      code: `document.querySelectorAll("form[data-stepper]").forEach((form) => {
  const panels = [...form.querySelectorAll("[data-step]")];
  const steps = [...form.querySelectorAll("nav ol > li")];
  const back = form.querySelector("[data-stepper-back]");
  const next = form.querySelector("[data-stepper-next]");
  const bar = form.querySelector("[data-stepper-progress]");
  const dots = [...form.querySelectorAll("[data-stepper-dots] li")];
  const status = form.querySelector("[data-stepper-status]");
  const last = panels.length - 1;
  let current = Math.max(0, panels.findIndex((p) => !p.hidden));

  function show(i, focus = true) {
    current = i;
    panels.forEach((p, k) => (p.hidden = k !== i));
    // daisyUI steps header: step-primary up to the current step, a check on the done ones
    steps.forEach((li, k) => {
      li.classList.toggle("step-primary", k <= i);
      li.classList.toggle("font-semibold", k === i);
      if (k < i) li.dataset.content = "✓";
      else delete li.dataset.content;
      li.querySelector(".sr-only")?.remove();
      if (k < i) li.insertAdjacentHTML("beforeend", '<span class="sr-only"> (completato)</span>');
      if (k === i) li.setAttribute("aria-current", "step");
      else li.removeAttribute("aria-current");
    });
    dots.forEach((d, k) => {
      d.classList.toggle("bg-primary", k <= i);
      d.classList.toggle("bg-base-300", k > i);
    });
    if (bar) bar.value = i + 1;
    if (status) status.textContent = "Passo " + (i + 1) + " di " + panels.length;
    back.disabled = i === 0;
    const isLast = i === last;
    next.querySelector("span").textContent = isLast ? next.dataset.confirm : "Avanti";
    next.querySelector("svg")?.classList.toggle("hidden", isLast);
    next.classList.toggle("btn-success", isLast);
    next.classList.toggle("btn-primary", !isLast);
    if (focus) panels[i].querySelector("[tabindex='-1']")?.focus();
  }

  back.addEventListener("click", (ev) => {
    ev.preventDefault();
    show(current - 1);
  });
  next.addEventListener("click", (ev) => {
    if (current === last) return; // last step: a real submit, validated by the browser
    ev.preventDefault();
    const invalid = [...panels[current].querySelectorAll("input, select, textarea")].find((el) => !el.checkValidity());
    if (invalid) return invalid.reportValidity();
    show(current + 1);
  });
  show(current, false);
});`,
    },
    {
      title: "Componente React",
      lang: "tsx",
      description: "React tiene l'indice del passo; ogni passo è un fieldset e viene validato prima di andare avanti.",
      code: `import { useRef, useState, type FormEvent, type ReactNode } from "react";

type Step = { label: string; content: ReactNode };

export function StepperForm({ steps, onSubmit, confirmLabel = "Conferma" }: {
  steps: Step[];
  onSubmit: (data: FormData) => void;
  confirmLabel?: string;
}) {
  const [current, setCurrent] = useState(0);
  const panels = useRef<(HTMLFieldSetElement | null)[]>([]);
  const titles = useRef<(HTMLHeadingElement | null)[]>([]);
  const last = steps.length - 1;

  const go = (i: number) => {
    setCurrent(i);
    requestAnimationFrame(() => titles.current[i]?.focus());
  };
  const next = () => {
    const invalid = [...(panels.current[current]?.elements ?? [])]
      .find((el) => "checkValidity" in el && !(el as HTMLInputElement).checkValidity()) as HTMLInputElement | undefined;
    if (invalid) return invalid.reportValidity();
    go(current + 1);
  };
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (current < last) return next(); // Enter in a field moves forward
    onSubmit(new FormData(e.currentTarget));
  };

  return (
    <form onSubmit={submit} noValidate={current < last} className="flex w-full flex-col gap-6">
      <nav aria-label="Passaggi della domanda">
        <ol className="steps steps-vertical w-full sm:steps-horizontal">
          {steps.map((s, i) => (
            <li key={s.label} aria-current={i === current ? "step" : undefined}
                data-content={i < current ? "✓" : undefined}
                className={"step" + (i <= current ? " step-primary" : "") + (i === current ? " font-semibold" : "")}>
              {s.label}{i < current && <span className="sr-only"> (completato)</span>}
            </li>
          ))}
        </ol>
      </nav>

      {steps.map((s, i) => (
        // Hidden steps stay mounted so their values are still posted.
        <fieldset key={s.label} ref={(el) => { panels.current[i] = el; }} hidden={i !== current}>
          <h3 ref={(el) => { titles.current[i] = el; }} tabIndex={-1} className="mb-4 text-2xl font-bold focus:outline-none">{s.label}</h3>
          {s.content}
        </fieldset>
      ))}

      <div className="flex items-center justify-between gap-4 border-t border-base-content/15 pt-4">
        <button type="button" className="btn btn-sm btn-outline btn-primary border-2 font-semibold" disabled={current === 0} onClick={() => go(current - 1)}>
          ‹ Indietro
        </button>
        <p className="sr-only" aria-live="polite">Passo {current + 1} di {steps.length}</p>
        <progress className="progress progress-primary hidden h-1 max-w-xs flex-1 bg-base-300 sm:block" value={current + 1} max={steps.length} aria-hidden />
        {current < last ? (
          <button type="button" className="btn btn-sm btn-primary font-semibold" onClick={next}>Avanti ›</button>
        ) : (
          <button type="submit" className="btn btn-sm btn-success font-semibold">{confirmLabel}</button>
        )}
      </div>
    </form>
  );
}

// <StepperForm confirmLabel="Invia la domanda" onSubmit={(data) => fetch("/api/domanda", { method: "POST", body: data })}
//   steps={[{ label: "Dati personali", content: <DatiPersonali /> }, { label: "Documenti", content: <Documenti /> }]} />`,
    },
  ],
};
