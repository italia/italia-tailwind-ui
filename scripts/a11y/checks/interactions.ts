/**
 * Keyboard interaction scenarios, one or more per component: the automated
 * part of the "Enter / Space / arrows / Esc" checks in the designers.italia.it
 * keyboard checklist, like dev-kit-italia's sendKeys tests.
 */
import type { Locator, Page } from "playwright";
import type { Findings } from "../shared.ts";

export interface Ctx {
  page: Page;
  root: Locator;
  /** Records a finding when `ok` is false. */
  expect(ok: boolean, rule: string, wcag: string, help: string, detail?: string): void;
}

export interface Spec {
  component: string;
  example: string;
  name: string;
  run(ctx: Ctx): Promise<void>;
}

/**
 * Locators are lazy: `details:not([open])` points at another element once the
 * first one opens. `pin` tags the element found now and returns a locator for it.
 */
let pins = 0;
async function pin(l: Locator): Promise<Locator> {
  const id = String(++pins);
  await l.evaluate((el, id) => el.setAttribute("data-a11y-pin", id), id);
  return l.page().locator(`[data-a11y-pin="${id}"]`);
}

const isOpen = (l: Locator) => l.evaluate((el) => (el as HTMLDetailsElement | HTMLDialogElement).open);
const isVisible = (l: Locator) => l.evaluate((el) => el.checkVisibility({ visibilityProperty: true, opacityProperty: true } as CheckVisibilityOptions));
const focusInside = (l: Locator) => l.evaluate((el) => el.contains(document.activeElement));
const isFocused = (l: Locator) => l.evaluate((el) => el === document.activeElement);
const checked = (l: Locator) => l.evaluate((el) => (el as HTMLInputElement).checked);

/** Enter and Space open and close a <details> disclosure (accordion, collapse, dropdown, megamenu). */
const disclosure = (component: string, example: string, selector = "details"): Spec => ({
  component,
  example,
  name: "Invio e Spazio aprono e chiudono",
  async run({ page, root, expect }) {
    const details = await pin(root.locator(`${selector}:not([open])`).first());
    await details.locator("summary").first().focus();
    await page.keyboard.press("Enter");
    expect(await isOpen(details), "enter-opens", "2.1.1", "Invio non apre il pannello");
    await page.keyboard.press("Space");
    expect(!(await isOpen(details)), "space-closes", "2.1.1", "Spazio non chiude il pannello");
  },
});

/** Space on the hidden checkbox of a CSS-only "close" hides the container. */
const dismiss = (component: string, example: string, container: string): Spec => ({
  component,
  example,
  name: "Spazio sul pulsante di chiusura nasconde il contenuto",
  async run({ page, root, expect }) {
    const box = root.locator(`${container}:has(input[type="checkbox"])`).first();
    await box.locator('input[type="checkbox"]').first().focus();
    await page.keyboard.press("Space");
    expect(!(await isVisible(box)), "dismiss", "2.1.1", "Spazio sul pulsante di chiusura non nasconde il contenuto");
  },
});

export const specs: Spec[] = [
  disclosure("accordion", "base"),
  disclosure("collapse", "base"),
  disclosure("megamenu", "base", "details"),
  {
    component: "dropdown",
    example: "varianti",
    name: "Invio apre il menu e Tab entra nelle voci",
    async run({ page, root, expect }) {
      const dd = root.locator("details.dropdown").first();
      await dd.locator("summary").focus();
      await page.keyboard.press("Enter");
      expect(await isOpen(dd), "enter-opens", "2.1.1", "Invio non apre il menu");
      await page.keyboard.press("Tab");
      expect(await focusInside(dd.locator(".dropdown-content")), "tab-into-menu", "2.4.3", "Dopo l'apertura Tab non porta alla prima voce del menu");
    },
  },
  {
    component: "modal",
    example: "apertura",
    name: "Invio apre la modale, Esc la chiude e il focus torna al pulsante",
    async run({ page, root, expect }) {
      const trigger = root.locator('button[command="show-modal"]').first();
      const dialog = root.locator(`dialog#${await trigger.getAttribute("commandfor")}`);
      await trigger.focus();
      await page.keyboard.press("Enter");
      expect(await isOpen(dialog), "enter-opens", "2.1.1", "Invio sul pulsante non apre la modale");
      expect(await focusInside(dialog), "focus-into-dialog", "2.4.3", "All'apertura il focus non entra nella modale");
      await page.keyboard.press("Escape");
      expect(!(await isOpen(dialog)), "escape-closes", "2.1.1", "Esc non chiude la modale");
      expect(await isFocused(trigger), "focus-returns", "2.4.3", "Alla chiusura il focus non torna al pulsante che l'ha aperta");
    },
  },
  {
    component: "popover",
    example: "base",
    name: "Invio apre, Tab entra, Esc chiude e il focus torna al pulsante",
    async run({ page, root, expect }) {
      const trigger = root.locator("button[popovertarget]").first();
      const pop = root.locator(`#${await trigger.getAttribute("popovertarget")}`);
      const open = () => pop.evaluate((el) => el.matches(":popover-open"));
      await trigger.focus();
      await page.keyboard.press("Enter");
      expect(await open(), "enter-opens", "2.1.1", "Invio non apre il popover");
      await page.keyboard.press("Tab");
      expect(await focusInside(pop), "tab-into-popover", "2.4.3", "Tab non porta al contenuto del popover");
      await page.keyboard.press("Escape");
      expect(!(await open()), "escape-closes", "2.1.1", "Esc non chiude il popover");
      expect(await isFocused(trigger), "focus-returns", "2.4.3", "Alla chiusura il focus non torna al pulsante");
    },
  },
  {
    component: "notification",
    example: "posizioni",
    name: "Invio apre la notifica e il pulsante di chiusura la chiude",
    async run({ page, root, expect }) {
      const trigger = root.locator("button[popovertarget]").first();
      const pop = root.locator(`#${await trigger.getAttribute("popovertarget")}`);
      const open = () => pop.evaluate((el) => el.matches(":popover-open"));
      await trigger.focus();
      await page.keyboard.press("Enter");
      expect(await open(), "enter-opens", "2.1.1", "Invio non mostra la notifica");
      await page.keyboard.press("Tab");
      expect(await focusInside(pop), "tab-into-popover", "2.4.3", "Tab non porta alla notifica appena aperta");
      await pop.locator('button[popovertargetaction="hide"]').focus();
      await page.keyboard.press("Enter");
      expect(!(await open()), "close-button", "2.1.1", "Il pulsante di chiusura non chiude la notifica");
    },
  },
  {
    component: "tooltip",
    example: "accessibile",
    name: "Il tooltip compare col focus e si chiude con Esc (WCAG 1.4.13)",
    async run({ page, root, expect }) {
      const trigger = root.locator("[aria-describedby]").first();
      const tip = root.locator(`#${await trigger.getAttribute("aria-describedby")}`);
      const shown = () => tip.evaluate((el) => Number(getComputedStyle(el).opacity) > 0.5);
      await trigger.focus();
      await page.waitForTimeout(250);
      expect(await shown(), "shows-on-focus", "1.4.13", "Il tooltip non compare con il focus da tastiera");
      await page.keyboard.press("Escape");
      await page.waitForTimeout(250);
      expect(!(await shown()), "dismissible", "1.4.13", "Il tooltip non si chiude con Esc senza spostare il focus");
    },
  },
  {
    component: "tabs",
    example: "base",
    name: "Le frecce cambiano scheda e mostrano il pannello",
    async run({ page, root, expect }) {
      const radios = root.locator('.tab input[type="radio"]');
      await radios.first().focus();
      await page.keyboard.press("ArrowRight");
      expect(await checked(radios.nth(1)), "arrow-selects", "2.1.1", "Freccia destra non seleziona la scheda successiva");
      expect(await isVisible(root.locator(".tab-content").nth(1)), "panel-shown", "2.1.1", "Il pannello della scheda selezionata non è visibile");
    },
  },
  {
    component: "checkbox",
    example: "base",
    name: "Spazio seleziona la casella",
    async run({ page, root, expect }) {
      const box = root.locator('input[type="checkbox"]').first();
      const before = await checked(box);
      await box.focus();
      await page.keyboard.press("Space");
      expect((await checked(box)) !== before, "space-toggles", "2.1.1", "Spazio non cambia lo stato della casella");
    },
  },
  {
    component: "toggle",
    example: "base",
    name: "Spazio accende e spegne l'interruttore",
    async run({ page, root, expect }) {
      const sw = root.locator('[role="switch"]').first();
      const before = await checked(sw);
      await sw.focus();
      await page.keyboard.press("Space");
      expect((await checked(sw)) !== before, "space-toggles", "2.1.1", "Spazio non cambia lo stato dell'interruttore");
    },
  },
  {
    component: "radio",
    example: "base",
    name: "Le frecce spostano la selezione nel gruppo",
    async run({ page, root, expect }) {
      const current = await pin(root.locator('input[type="radio"]:checked').first());
      const name = await current.getAttribute("name");
      await current.focus();
      await page.keyboard.press("ArrowDown");
      const now = await root.locator(`input[type="radio"][name="${name}"]:checked`).evaluate((el) => el === document.activeElement);
      expect(now && !(await isFocused(current)), "arrow-selects", "2.1.1", "Freccia giù non seleziona l'opzione successiva");
    },
  },
  {
    component: "rating",
    example: "base",
    name: "Le frecce cambiano il voto",
    async run({ page, root, expect }) {
      const current = await pin(root.locator('input[type="radio"]:checked').first());
      const before = Number(await current.getAttribute("value"));
      await current.focus();
      await page.keyboard.press("ArrowRight");
      const after = Number(await root.locator('input[type="radio"]:checked').first().getAttribute("value"));
      expect(after > before, "arrow-changes", "2.1.1", "Freccia destra non aumenta il voto", `prima ${before}, dopo ${after}`);
    },
  },
  dismiss("alert", "chiusura", '[role="alert"]'),
  dismiss("chip", "chiusura", ".badge"),
  dismiss("notification", "chiusura", '[role="status"], [role="alert"]'),
  {
    component: "skiplinks",
    example: "base",
    name: "Il primo Tab mostra i link di salto",
    async run({ page, root, expect }) {
      await page.focus("#a11y-before");
      await page.keyboard.press("Tab");
      const link = root.locator("nav a").first();
      const box = await link.boundingBox();
      expect(await isFocused(link), "first-tab", "2.4.1", "Il primo Tab non porta al link di salto");
      expect(!!box && box.width > 40 && box.height > 16, "visible-on-focus", "2.4.7", "Il link di salto con il focus non è visibile", box ? `${Math.round(box.width)}×${Math.round(box.height)}px` : "");
    },
  },
  {
    component: "carousel",
    example: "card",
    name: "Le frecce scorrono il carosello a fuoco",
    async run({ page, root, expect }) {
      const track = root.locator('.carousel[tabindex="0"]').first();
      await track.focus();
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(500);
      expect((await track.evaluate((el) => el.scrollLeft)) > 0, "arrow-scrolls", "2.1.1", "Freccia destra non scorre il carosello");
    },
  },
  {
    component: "transfer",
    example: "base",
    name: "Spazio sposta la voce nella colonna dei selezionati",
    async run({ page, root, expect }) {
      const box = await pin(root.locator('input[type="checkbox"]:not(:checked):not(:disabled)').first());
      await box.focus();
      await page.keyboard.press("Space");
      const col = await box.evaluate((el) => getComputedStyle(el.closest("label")!).gridColumnStart);
      expect(col === "2", "space-moves", "2.1.1", "Spazio non sposta la voce tra i selezionati", `colonna ${col}`);
    },
  },
  {
    component: "input",
    example: "validazione-nativa",
    name: "Un valore non valido mostra il messaggio, collegato al campo",
    async run({ page, root, expect }) {
      const field = root.locator("input.validator").first();
      await field.focus();
      await page.keyboard.type("non-valido");
      await page.keyboard.press("Tab");
      const hintId = (await field.getAttribute("aria-describedby"))?.split(" ").find((id) => id.endsWith("vhint"));
      expect(!!hintId, "error-described", "3.3.1", "Il messaggio di errore non è collegato al campo con aria-describedby");
      if (hintId) {
        const vis = await root.locator(`#${hintId}`).evaluate((el) => getComputedStyle(el).visibility);
        expect(vis === "visible", "error-shown", "3.3.1", "Dopo un valore non valido il messaggio di errore non compare");
      }
    },
  },
];

export async function runInteraction(page: Page, findings: Findings, spec: Spec, theme: string): Promise<void> {
  const root = page.locator("#root");
  page.setDefaultTimeout(3000);
  const expect: Ctx["expect"] = (ok, rule, wcag, help, detail = "") => {
    if (!ok)
      findings.add(
        { check: "interactions", severity: "error", component: spec.component, example: spec.example, rule, wcag, help, target: spec.name, detail },
        theme,
      );
  };
  try {
    await spec.run({ page, root, expect });
  } catch (err) {
    findings.add(
      {
        check: "interactions",
        severity: "error",
        component: spec.component,
        example: spec.example,
        rule: "scenario-failed",
        help: "Lo scenario non è stato eseguito fino in fondo (markup cambiato?)",
        target: spec.name,
        detail: String((err as Error).message).split("\n")[0],
      },
      theme,
    );
  }
}
