#!/usr/bin/env bun
/**
 * Page-level accessibility check of the built docs site (apps/docs/dist):
 * the same idea as dev-kit-italia's `pa11y-ci --runner axe --standard WCAG2AA`,
 * with the axe engine driven by Playwright. On whole pages the rules that make
 * no sense on isolated examples apply too: page title, lang, landmarks,
 * heading order, a skip link reached with the first Tab.
 *
 *   bun run a11y:site                        every page, default theme
 *   bun run a11y:site --component tabs       some pages
 *   bun run a11y:site --all-themes | --theme italia-darker
 *   bun run a11y:site --json site-report.json --no-fail
 */
import { themes } from "../../packages/recipes/src/index.ts";
import { runAxe } from "./checks/axe.ts";
import { runReflow } from "./checks/reflow.ts";
import { args, finish, Findings, launch, progress, report, selectedDocs } from "./shared.ts";

const DIST = new URL("../../apps/docs/dist/", import.meta.url);
if (!(await Bun.file(new URL("index.html", DIST)).exists()))
  throw new Error("apps/docs/dist is missing: run `bun run docs:build` first (with the default DOCS_BASE=/).");

const themeIds = args.has("--all-themes") || args.many("--theme").length
  ? (args.many("--theme").length ? args.many("--theme") : themes.map((t) => t.id).filter((id) => id.startsWith("italia")))
  : [themes[0].id];
const docs = selectedDocs();
const paths = [...(args.many("--component").length ? [] : ["/", "/accessibilita/"]), ...docs.map((d) => `/components/${d.slug}/`)];

// A tiny static server for the built site.
const server = Bun.serve({
  port: 0,
  async fetch(req) {
    let path = decodeURIComponent(new URL(req.url).pathname);
    if (path.endsWith("/")) path += "index.html";
    const file = Bun.file(new URL(`.${path}`, DIST));
    return (await file.exists()) ? new Response(file) : new Response("Not found", { status: 404 });
  },
});
const origin = `http://localhost:${server.port}`;

const started = performance.now();
const findings = new Findings();
const { browser } = await launch();
const jobs = themeIds.flatMap((theme) => paths.map((path) => ({ theme, path })));
progress.start("pagine", jobs.length);

let next = 0;
await Promise.all(
  Array.from({ length: 3 }, async () => {
    // One context per worker, so each can preset its theme in localStorage.
    while (next < jobs.length) {
      const { theme, path } = jobs[next++];
      const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1280, height: 900 } });
      await context.route((url) => url.origin !== origin && url.protocol.startsWith("http"), (r) => r.abort());
      await context.addInitScript((t) => localStorage.setItem("italia-daisy-theme", t), theme);
      const page = await context.newPage();
      await page.goto(origin + path, { waitUntil: "load" });
      const where = { component: path, example: "pagina", theme };

      await runAxe(page, findings, where);

      // The first Tab must reach a visible skip link to the main content.
      await page.keyboard.press("Tab");
      const skip = await page.evaluate(() => {
        const el = document.activeElement as HTMLAnchorElement | null;
        const r = el?.getBoundingClientRect();
        const target = el?.hash ? document.querySelector(el.hash) : null;
        return { isLink: el?.tagName === "A" && !!el.hash, target: !!target, visible: !!r && r.width > 20 && r.height > 10, text: el?.textContent?.trim() ?? "" };
      });
      if (!skip.isLink || !skip.target || !skip.visible)
        findings.add(
          {
            check: "keyboard", severity: "error", component: path, example: "pagina", rule: "skip-link", wcag: "2.4.1",
            help: "Il primo Tab non porta a un link visibile che salta al contenuto principale", target: skip.text || "(nessun link)", detail: "",
          },
          theme,
        );

      await page.setViewportSize({ width: 320, height: 640 });
      await runReflow(page, findings, where, "body");
      await context.close();
      progress.tick();
    }
  }),
);
progress.end();
await browser.close();
server.stop();

const list = findings.list();
const seconds = ((performance.now() - started) / 1000).toFixed(0);
const counts = report(list, themeIds, `${paths.length} pagine, temi ${themeIds.join(", ")}; ${seconds}s`);
await finish(list, themeIds, counts);
