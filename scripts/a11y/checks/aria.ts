/**
 * Accessibility-tree snapshots, like dev-kit-italia's a11ySnapshot tests: the
 * roles, names and states a screen reader gets for each example, saved as YAML
 * in tests/a11y-snapshots/. A change fails the check until it is reviewed and
 * accepted with --update-snapshots. The files are also a readable record of
 * what assistive technology receives.
 */
import type { Page } from "playwright";
import type { Findings } from "../shared.ts";

const DIR = new URL("../../../tests/a11y-snapshots/", import.meta.url);

export const snapshotStats = { created: 0, updated: 0, same: 0 };

export async function runAria(page: Page, findings: Findings, where: { component: string; example: string; theme: string }, update: boolean) {
  const actual = (await page.locator("#root").ariaSnapshot()) + "\n";
  const file = Bun.file(new URL(`${where.component}/${where.example}.aria.yml`, DIR));
  const exists = await file.exists();
  const expected = exists ? await file.text() : "";

  if (exists && expected === actual) {
    snapshotStats.same++;
    return;
  }
  if (!exists || update) {
    await Bun.write(file, actual);
    snapshotStats[exists ? "updated" : "created"]++;
    return;
  }
  // Show the first lines that differ.
  const a = expected.split("\n");
  const b = actual.split("\n");
  const diff: string[] = [];
  for (let i = 0; i < Math.max(a.length, b.length) && diff.length < 6; i++)
    if (a[i] !== b[i]) diff.push(`riga ${i + 1}: -${(a[i] ?? "").trim()} / +${(b[i] ?? "").trim()}`);
  findings.add(
    {
      check: "aria",
      severity: "error",
      component: where.component,
      example: where.example,
      rule: "snapshot-changed",
      help: "L'albero di accessibilità è cambiato: controlla e accetta con --update-snapshots",
      target: `tests/a11y-snapshots/${where.component}/${where.example}.aria.yml`,
      detail: diff.join("  ·  "),
    },
    where.theme,
  );
}
