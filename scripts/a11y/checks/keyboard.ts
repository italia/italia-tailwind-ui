/**
 * Keyboard check, automating the designers.italia.it keyboard checklist:
 * - 2.1.1  every visible interactive element is reached with Tab
 * - 2.1.2  Tab and Shift+Tab leave the example (no keyboard trap)
 * - 2.4.7  the focused element visibly changes (on itself or the box around it)
 * - 2.4.11 the focused element is not covered by other content
 */
import type { Page } from "playwright";
import type { Findings } from "../shared.ts";

type Where = { component: string; example: string; theme: string };

const FOCUSABLE =
  'a[href], area[href], button, input:not([type="hidden"]), select, textarea, summary, iframe, audio[controls], video[controls], [tabindex], [contenteditable]:not([contenteditable="false"])';

/** Styles that can show focus; compared before and after focus on the element and its ancestors. */
const FOCUS_PROPS = ["outline-style", "outline-width", "outline-color", "box-shadow", "border-color", "border-width", "background-color", "color", "text-decoration-line", "opacity"];

export async function runKeyboard(page: Page, findings: Findings, where: Where): Promise<void> {
  // 1. What should be reachable, with a style signature taken while unfocused.
  const expected = await page.evaluate(
    ({ FOCUSABLE, FOCUS_PROPS }) => {
      const root = document.getElementById("root")!;
      const sig = (el: Element) => {
        const parts: string[] = [];
        let node: Element | null = el;
        for (let i = 0; node && node !== root && i < 4; i++, node = node.parentElement) {
          const cs = getComputedStyle(node);
          parts.push(FOCUS_PROPS.map((p) => cs.getPropertyValue(p)).join(";"));
        }
        return parts.join("|");
      };
      const radioSeen = new Set<string>();
      const list: { k: string; label: string; sig: string }[] = [];
      [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].forEach((el, i) => {
        if ((el as HTMLButtonElement).disabled || el.closest("[inert], fieldset:disabled")) return;
        if (el.tabIndex < 0) return;
        if (!el.checkVisibility({ visibilityProperty: true } as CheckVisibilityOptions)) return;
        const closedDetails = el.closest("details:not([open])");
        if (closedDetails && !(el.tagName === "SUMMARY" && el.parentElement === closedDetails)) return;
        if (el instanceof HTMLInputElement && el.type === "radio") {
          // Only one radio per group is in the Tab order.
          if (radioSeen.has(el.name)) return;
          radioSeen.add(el.name);
          el.dataset.a11yRadio = el.name;
        }
        el.dataset.a11yK = String(i);
        const label = (el.getAttribute("aria-label") || el.textContent || el.getAttribute("title") || el.tagName).trim().replace(/\s+/g, " ").slice(0, 40);
        list.push({ k: String(i), label: `<${el.tagName.toLowerCase()}> ${label}`, sig: sig(el) });
      });
      return list;
    },
    { FOCUSABLE, FOCUS_PROPS },
  );
  const byK = new Map(expected.map((e) => [e.k, e]));
  const reached = new Set<string>();
  const add = (rule: string, wcag: string, help: string, target: string, detail = "") =>
    findings.add({ check: "keyboard", severity: "error", component: where.component, example: where.example, rule, wcag, help, target, detail }, where.theme);

  // 2. Tab from the "before" sentinel until the "after" one.
  await page.focus("#a11y-before");
  const limit = expected.length * 3 + 15;
  let escaped = false;
  let last = "";
  for (let i = 0; i < limit; i++) {
    await page.keyboard.press("Tab");
    const probe = () => page.evaluate(({ FOCUS_PROPS }) => {
      const root = document.getElementById("root")!;
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return { where: "body" as const };
      if (el.id === "a11y-after") return { where: "after" as const };
      if (!root.contains(el)) return { where: "outside" as const };
      // Focus on a pseudo-element (a CSS carousel ::scroll-button) reports the
      // scroller as active without matching :focus; its ring is on the pseudo.
      if (!el.matches(":focus")) return { where: "pseudo" as const };
      // A radio group is one stop: any radio of the group counts.
      const k = el.dataset.a11yK ?? (el instanceof HTMLInputElement && el.type === "radio"
        ? root.querySelector<HTMLElement>(`[data-a11y-radio="${CSS.escape(el.name)}"]`)?.dataset.a11yK
        : undefined);
      const parts: string[] = [];
      let node: Element | null = el;
      for (let j = 0; node && node !== root && j < 4; j++, node = node.parentElement) {
        const cs = getComputedStyle(node);
        parts.push(FOCUS_PROPS.map((p) => cs.getPropertyValue(p)).join(";"));
      }
      // The visible box: sr-only inputs are 1px, so use the first ancestor with a real size.
      let host: Element = el;
      while (host.parentElement && host !== root && (host.getBoundingClientRect().width < 4 || host.getBoundingClientRect().height < 4)) host = host.parentElement;
      const r = host.getBoundingClientRect();
      const cx = Math.min(Math.max(r.left + r.width / 2, 0), innerWidth - 1);
      const cy = Math.min(Math.max(r.top + r.height / 2, 0), innerHeight - 1);
      // elementFromPoint skips pointer-events:none layers (veils, overlays) that
      // still cover the element visually, so make everything hit-testable.
      const probeStyle = document.createElement("style");
      probeStyle.textContent = "#root, #root * { pointer-events: auto !important; }";
      document.head.append(probeStyle);
      const hit = document.elementFromPoint(cx, cy);
      probeStyle.remove();
      const inView = r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth;
      const covered = inView && !!hit && !(hit === el || el.contains(hit) || hit.contains(el) || host.contains(hit) || hit.contains(host));
      const desc = `<${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ""}${el.className && typeof el.className === "string" ? `.${el.className.trim().split(/\s+/).slice(0, 3).join(".")}` : ""}>`;
      return { where: "root" as const, k, sig: parts.join("|"), covered, hidden: !inView, hit: hit ? `<${hit.tagName.toLowerCase()}>` : "", desc };
    }, { FOCUS_PROPS });

    let state = await probe();
    // Focus can start a smooth scroll (scroll-smooth carousels, scroll-snap):
    // give it time to settle before calling the element covered or off-screen.
    if (state.where === "root" && (state.covered || state.hidden)) {
      await page.waitForTimeout(600);
      state = await probe();
    }

    if (state.where === "after") {
      escaped = true;
      break;
    }
    if (state.where !== "root") continue;
    last = state.desc;
    if (!state.k) continue; // focusable we did not expect (e.g. a native control part)
    if (reached.has(state.k)) continue;
    reached.add(state.k);
    const exp = byK.get(state.k)!;
    if (exp.sig === state.sig) add("focus-not-visible", "2.4.7", "Il focus da tastiera non cambia l'aspetto dell'elemento né del suo contenitore", exp.label);
    if (state.covered) add("focus-obscured", "2.4.11", "L'elemento con il focus è coperto da altro contenuto", exp.label, `al centro c'è ${state.hit}`);
    else if (state.hidden) add("focus-obscured", "2.4.11", "L'elemento con il focus resta fuori dall'area visibile", exp.label);
  }

  if (!escaped) add("keyboard-trap", "2.1.2", "Con Tab il focus non esce dall'esempio (trappola da tastiera)", last || "#root", `dopo ${limit} pressioni di Tab`);
  for (const e of expected) if (!reached.has(e.k) && escaped) add("not-reachable", "2.1.1", "Elemento interattivo visibile non raggiungibile con Tab", e.label);

  // 3. Shift+Tab back from the "after" sentinel.
  await page.focus("#a11y-after");
  let back = false;
  for (let i = 0; i < limit; i++) {
    await page.keyboard.press("Shift+Tab");
    if (await page.evaluate(() => document.activeElement?.id === "a11y-before")) {
      back = true;
      break;
    }
  }
  if (!back && escaped) add("keyboard-trap", "2.1.2", "Con Maiusc+Tab il focus non esce dall'esempio (trappola da tastiera)", "#root");
}
