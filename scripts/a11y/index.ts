#!/usr/bin/env bun
/**
 * Accessibility suite for the component recipes. Each documented example is
 * rendered in headless Chromium with the prebuilt CSS and checked by:
 *
 *   axe           axe-core, WCAG 2.2 A/AA (errors) + best practices (warnings), per theme
 *   keyboard      Tab / Shift+Tab: no traps, all controls reachable, visible and unobscured focus
 *   interactions  per-component keyboard scenarios (Enter, Space, arrows, Esc, focus return)
 *   reflow        320px width without horizontal scroll, WCAG text spacing without clipping
 *   html          HTML validation (content model, nesting, ids, html-validate a11y rules)
 *   aria          accessibility-tree snapshots in tests/a11y-snapshots/
 *
 * Only axe depends on the theme; the other checks run once, in the first theme.
 *
 *   bun run a11y                                all checks, italia-* themes
 *   bun run a11y --check axe,keyboard           some checks
 *   bun run a11y --component tabs,input         some components
 *   bun run a11y --theme italia-darker          one theme (--all-themes: also daisyUI's)
 *   bun run a11y --update-snapshots             accept accessibility-tree changes
 *   bun run a11y --json a11y-report.json        also write a JSON report
 *   bun run a11y --no-fail | --strict           never fail | fail on warnings too
 */
import { runAria, snapshotStats } from "./checks/aria.ts";
import { FRAGMENT_EXCLUDED, runAxe } from "./checks/axe.ts";
import { runHtml } from "./checks/html.ts";
import { runInteraction, specs } from "./checks/interactions.ts";
import { runKeyboard } from "./checks/keyboard.ts";
import { runReflow } from "./checks/reflow.ts";
import {
  args, finish, Findings, launch, loadCss, pool, progress, render, report, selectedDocs, selectedThemes, shell,
  type CheckName, type Job,
} from "./shared.ts";

const ALL: CheckName[] = ["axe", "keyboard", "interactions", "reflow", "html", "aria"];
const checks = (args.many("--check") as CheckName[]).filter(Boolean);
for (const c of checks) if (!ALL.includes(c)) throw new Error(`Unknown check "${c}". Available: ${ALL.join(", ")}`);
const run = (c: CheckName) => !checks.length || checks.includes(c);

const themeIds = selectedThemes();
const baseTheme = themeIds[0];
const docs = selectedDocs();
const html = shell(await loadCss());
const findings = new Findings();
const where = (j: Job) => ({ component: j.doc.slug, example: j.ex.id, theme: j.theme });
const examples = (theme: string): Job[] => docs.flatMap((doc) => doc.examples.map((ex) => ({ doc, ex, theme })));

const started = performance.now();
const { browser, context } = await launch();
const done: string[] = [];

if (run("axe")) {
  const jobs = themeIds.flatMap(examples);
  progress.start("axe", jobs.length);
  await pool(context, html, jobs, async (page, job) => {
    await render(page, job);
    await runAxe(page, findings, where(job), { include: "#root", exclude: FRAGMENT_EXCLUDED });
  });
  done.push(`axe ${jobs.length}`);
}

if (run("keyboard")) {
  const jobs = examples(baseTheme);
  progress.start("keyboard", jobs.length);
  await pool(context, html, jobs, async (page, job) => {
    await render(page, job);
    await runKeyboard(page, findings, where(job));
  });
  done.push(`tastiera ${jobs.length}`);
}

if (run("interactions")) {
  const selected = specs.filter((s) => docs.some((d) => d.slug === s.component));
  progress.start("interazioni", selected.length);
  await pool(context, html, selected, async (page, spec) => {
    const doc = docs.find((d) => d.slug === spec.component)!;
    const ex = doc.examples.find((e) => e.id === spec.example);
    if (!ex) throw new Error(`Scenario "${spec.name}": no example "${spec.example}" in ${spec.component}`);
    await render(page, { doc, ex, theme: baseTheme });
    await runInteraction(page, findings, spec, baseTheme);
  });
  done.push(`interazioni ${selected.length}`);
}

if (run("reflow")) {
  const jobs = examples(baseTheme);
  progress.start("reflow", jobs.length);
  await pool(context, html, jobs, async (page, job) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await render(page, job);
    await runReflow(page, findings, where(job));
  });
  done.push(`reflow ${jobs.length}`);
}

if (run("aria")) {
  const jobs = examples(baseTheme);
  progress.start("aria", jobs.length);
  await pool(context, html, jobs, async (page, job) => {
    await render(page, job);
    await runAria(page, findings, where(job), args.has("--update-snapshots"));
  });
  done.push(`aria ${jobs.length}`);
}

await browser.close();

if (run("html")) {
  const jobs = examples(baseTheme);
  for (const job of jobs) await runHtml(findings, where(job), job.ex.html);
  done.push(`html ${jobs.length}`);
}
progress.end();

const list = findings.list();
const seconds = ((performance.now() - started) / 1000).toFixed(0);
const counts = report(list, themeIds, `${docs.length} componenti, temi ${themeIds.join(", ")}; controlli: ${done.join(", ")}; ${seconds}s`);
if (run("aria") && (snapshotStats.created || snapshotStats.updated))
  console.log(`Snapshot ARIA: ${snapshotStats.created} creati, ${snapshotStats.updated} aggiornati, ${snapshotStats.same} invariati (tests/a11y-snapshots/)`);
await finish(list, themeIds, counts);
