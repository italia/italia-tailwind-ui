/**
 * Shared pieces of the accessibility suite: arguments, the page that examples
 * are rendered into, the findings store and the report.
 */
import type { Browser, BrowserContext, Page } from "playwright";
import { chromium } from "playwright";
import { components, themes, type ComponentDoc, type Example } from "../../packages/recipes/src/index.ts";

export type Severity = "error" | "warning";
export type CheckName = "axe" | "keyboard" | "interactions" | "reflow" | "html" | "aria";

export interface Finding {
  check: CheckName;
  severity: Severity;
  /** Component slug, or the page path in the site check. */
  component: string;
  example: string;
  rule: string;
  /** WCAG success criterion, when there is one ("2.1.1"). */
  wcag?: string;
  help: string;
  helpUrl?: string;
  target: string;
  detail: string;
  themes: string[];
}

export interface Job {
  doc: ComponentDoc;
  ex: Example;
  theme: string;
}

// --- arguments ---------------------------------------------------------------
const argv = process.argv.slice(2);
export const args = {
  many: (flag: string) => argv.flatMap((a, i) => (a === flag && argv[i + 1] ? argv[i + 1].split(",") : [])),
  one: (flag: string) => argv.flatMap((a, i) => (a === flag && argv[i + 1] ? [argv[i + 1]] : []))[0],
  has: (flag: string) => argv.includes(flag),
};

/** Themes to test: --theme, or the italia-* themes (all themes with --all-themes). */
export function selectedThemes(): string[] {
  const only = args.many("--theme");
  for (const id of only) if (!themes.some((t) => t.id === id)) throw new Error(`Unknown theme "${id}"`);
  if (only.length) return only;
  return themes.map((t) => t.id).filter((id) => args.has("--all-themes") || id.startsWith("italia"));
}

export function selectedDocs(): ComponentDoc[] {
  const only = args.many("--component");
  for (const slug of only) if (!components.some((d) => d.slug === slug)) throw new Error(`Unknown component "${slug}"`);
  return components.filter((d) => !only.length || only.includes(d.slug));
}

// --- browser -----------------------------------------------------------------
const CSS_PATH = new URL("../../packages/css/dist/italia-daisy.css", import.meta.url);

export async function loadCss(): Promise<string> {
  const file = Bun.file(CSS_PATH);
  if (!(await file.exists())) throw new Error("packages/css/dist/italia-daisy.css is missing: run `bun run build:css` first.");
  return file.text();
}

/**
 * The page every example is rendered into. The two sentinel buttons around
 * #root give the keyboard check a known start and end for Tab / Shift+Tab.
 */
export const shell = (css: string) => `<!doctype html><html lang="it"><head><meta charset="utf-8"><title>a11y</title><style>${css}</style></head>
<body class="bg-base-100 p-4 font-sans text-base-content">
<button type="button" id="a11y-before">inizio</button>
<main id="root"></main>
<button type="button" id="a11y-after">fine</button>
</body></html>`;

export async function launch(viewport = { width: 1280, height: 900 }): Promise<{ browser: Browser; context: BrowserContext }> {
  const browser = await chromium.launch();
  const context = await browser.newContext({ reducedMotion: "reduce", viewport });
  // Offline and fast: remote images, fonts and embeds are not needed to audit the markup.
  await context.route(/^https?:/, (route) => route.abort());
  return { browser, context };
}

/** Puts one example into #root under the given theme, with a fresh focus and scroll state. */
export async function render(page: Page, job: Job): Promise<void> {
  await page.evaluate(
    ({ html, theme, title }) => {
      (document.activeElement as HTMLElement | null)?.blur();
      document.documentElement.dataset.theme = theme;
      document.getElementById("root")!.innerHTML = `<h1 class="sr-only">${title}</h1>${html}`;
      window.scrollTo(0, 0);
      return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    },
    { html: job.ex.html, theme: job.theme, title: `${job.doc.name}: ${job.ex.title}` },
  );
}

/** Runs `fn` over the jobs on `n` pages in parallel. */
export async function pool<T>(
  context: BrowserContext,
  html: string,
  items: T[],
  fn: (page: Page, item: T) => Promise<void>,
  n = 4,
): Promise<void> {
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      const page = await context.newPage();
      await page.setContent(html);
      while (next < items.length) {
        const item = items[next++];
        await fn(page, item);
        progress.tick();
      }
      await page.close();
    }),
  );
}

// --- findings ----------------------------------------------------------------
export class Findings {
  private map = new Map<string, Finding>();

  add(f: Omit<Finding, "themes">, theme: string): void {
    // The same problem in several themes is one finding with a theme list;
    // contrast ratios differ per theme, so those stay separate.
    const key = [f.check, f.component, f.example, f.rule, f.target, f.rule === "color-contrast" ? theme : ""].join("|");
    const existing = this.map.get(key);
    if (existing) {
      if (!existing.themes.includes(theme)) existing.themes.push(theme);
    } else this.map.set(key, { ...f, themes: [theme] });
  }

  list(): Finding[] {
    const rank = { error: 0, warning: 1 };
    return [...this.map.values()].sort(
      (a, b) =>
        a.component.localeCompare(b.component) ||
        a.example.localeCompare(b.example) ||
        rank[a.severity] - rank[b.severity] ||
        a.check.localeCompare(b.check),
    );
  }
}

// --- output ------------------------------------------------------------------
const tty = process.stdout.isTTY;
const color = (code: number) => (s: string) => (tty ? `\x1b[${code}m${s}\x1b[0m` : s);
export const bold = color(1);
const red = color(31);
const yellow = color(33);
const dim = color(2);

export const progress = {
  total: 0,
  done: 0,
  label: "",
  start(label: string, total: number) {
    Object.assign(this, { label, total, done: 0 });
  },
  tick() {
    this.done++;
    if (tty) process.stdout.write(`\r  ${this.label}: ${this.done}/${this.total}   `);
  },
  end() {
    if (tty) process.stdout.write("\r" + " ".repeat(60) + "\r");
  },
};

export function report(list: Finding[], themeIds: string[], summary: string): { errors: number; warnings: number } {
  const all = (t: string[]) => (t.length === themeIds.length && themeIds.length > 1 ? "tutti i temi" : t.join(", "));
  let heading = "";
  for (const f of list) {
    const h = `${f.component} › ${f.example}`;
    if (h !== heading) console.log(`\n${bold(h)}`);
    heading = h;
    const mark = f.severity === "error" ? red("✗") : yellow("⚠");
    const wcag = f.wcag ? ` WCAG ${f.wcag}` : "";
    console.log(`  ${mark} ${f.check}/${f.rule}${wcag} — ${f.help}  ${dim(`[${all(f.themes)}]`)}`);
    if (f.target) console.log(dim(`      ${f.target}`));
    if (f.detail) console.log(dim(`      ${f.detail}`));
  }

  const errors = list.filter((f) => f.severity === "error").length;
  const warnings = list.length - errors;
  console.log(`\n${bold("Accessibilità")}: ${summary}`);
  if (!list.length) console.log("✓ Nessun problema trovato.");
  else {
    console.log(`${errors ? red(`✗ ${errors} errori`) : "✓ 0 errori"}, ${warnings ? yellow(`⚠ ${warnings} avvisi`) : "0 avvisi"}`);
    const byRule = new Map<string, { n: number; f: Finding }>();
    for (const f of list) {
      const k = `${f.check}/${f.rule}`;
      byRule.set(k, { n: (byRule.get(k)?.n ?? 0) + 1, f });
    }
    for (const [k, { n, f }] of [...byRule].sort((a, b) => b[1].n - a[1].n))
      console.log(`  ${String(n).padStart(4)}  ${f.severity === "error" ? red(k) : yellow(k)}${f.helpUrl ? dim(`  ${f.helpUrl}`) : ""}`);
  }
  return { errors, warnings };
}

export async function finish(list: Finding[], themeIds: string[], counts: { errors: number; warnings: number }) {
  const jsonPath = args.one("--json");
  if (jsonPath) {
    await Bun.write(jsonPath, JSON.stringify({ themes: themeIds, findings: list }, null, 2));
    console.log(`Report scritto in ${jsonPath}`);
  }
  const fail = !args.has("--no-fail") && (counts.errors > 0 || (args.has("--strict") && counts.warnings > 0));
  process.exit(fail ? 1 : 0);
}
