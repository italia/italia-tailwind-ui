/**
 * Zoom and text spacing, automating the designers.italia.it zoom checks:
 * - 1.4.10 at 320 CSS px (1280px at 400% zoom) nothing scrolls sideways,
 *          except inside containers meant to scroll (carousels, tables)
 * - 1.4.12 with the WCAG text-spacing overrides no text gets clipped
 */
import type { Page } from "playwright";
import type { Findings } from "../shared.ts";

type Where = { component: string; example: string; theme: string };

const textSpacing = (root: string) => `${root} * { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
${root} p { margin-bottom: 2em !important; }`;

/** `root` is the container to inspect: #root for an example, main for a whole page. */
export async function runReflow(page: Page, findings: Findings, where: Where, root = "#root"): Promise<void> {
  const add = (rule: string, wcag: string, help: string, target: string, detail = "") =>
    findings.add({ check: "reflow", severity: "error", component: where.component, example: where.example, rule, wcag, help, target, detail }, where.theme);

  // 1.4.10 — the page is 320px wide here.
  const wide = await page.evaluate((sel) => {
    const root = document.querySelector(sel)!;
    const vw = document.documentElement.clientWidth;
    if (document.documentElement.scrollWidth <= vw + 1) return [];
    const scrolls = (el: Element) => ["auto", "scroll", "hidden", "clip"].includes(getComputedStyle(el).overflowX);
    const out: { desc: string; right: number }[] = [];
    const offending = new Set<Element>();
    for (const el of root.querySelectorAll("*")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || (r.right <= vw + 1 && r.left >= -1)) continue;
      // Inside a container that scrolls or clips horizontally: allowed.
      let a = el.parentElement;
      let contained = false;
      while (a && a !== root) {
        if (scrolls(a)) contained = true;
        a = a.parentElement;
      }
      if (contained) continue;
      offending.add(el);
      if (el.parentElement && offending.has(el.parentElement)) continue; // report the outermost only
      const cls = typeof el.className === "string" ? el.className.trim().split(/\s+/).slice(0, 4).join(".") : "";
      out.push({ desc: `<${el.tagName.toLowerCase()}${cls ? `.${cls}` : ""}>`, right: Math.round(r.right) });
    }
    return out.slice(0, 5);
  }, root);
  for (const w of wide)
    add("reflow-320", "1.4.10", "A 320px di larghezza (zoom 400%) il contenuto esce dallo schermo e serve lo scorrimento orizzontale", w.desc, `arriva a ${w.right}px`);

  // 1.4.12 — back to desktop width, compare clipping before and after the overrides.
  await page.setViewportSize({ width: 1280, height: 900 });
  const clipped = await page.evaluate(({ css, sel }) => {
    const root = document.querySelector(sel)!;
    const measure = () => {
      const set = new Map<Element, string>();
      for (const el of root.querySelectorAll<HTMLElement>("*")) {
        const cs = getComputedStyle(el);
        const clips = [cs.overflowX, cs.overflowY].some((o) => o === "hidden" || o === "clip");
        if (!clips || !el.textContent?.trim() || !el.checkVisibility()) continue;
        if (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1) {
          const cls = el.className.trim().split(/\s+/).slice(0, 4).join(".");
          set.set(el, `<${el.tagName.toLowerCase()}${cls ? `.${cls}` : ""}> "${el.textContent.trim().replace(/\s+/g, " ").slice(0, 40)}"`);
        }
      }
      return set;
    };
    const before = measure();
    const style = document.createElement("style");
    style.textContent = css;
    document.head.append(style);
    const after = measure();
    style.remove();
    return [...after].filter(([el]) => !before.has(el)).map(([, d]) => d).slice(0, 5);
  }, { css: textSpacing(root), sel: root });
  for (const c of clipped)
    add("text-spacing", "1.4.12", "Con la spaziatura del testo aumentata (interlinea 1,5, spaziature WCAG) il testo viene tagliato", c);
}
