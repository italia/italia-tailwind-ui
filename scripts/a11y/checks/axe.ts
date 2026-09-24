/**
 * axe-core, the engine dev-kit-italia recommends (also behind `pa11y --runner axe`).
 * WCAG 2.x A/AA rules are errors; axe "best practices" (empty headings and
 * labels, landmarks…) are warnings, as dev-kit-italia suggests running them too.
 */
import { AxeBuilder } from "@axe-core/playwright";
import type { Page } from "playwright";
import type { Findings } from "../shared.ts";

export const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22a", "wcag22aa"];

/** Page-level rules that make no sense on an isolated example (they run in the site check). */
export const FRAGMENT_EXCLUDED = ["region", "landmark-one-main", "page-has-heading-one", "heading-order", "landmark-unique"];

/** axe tags criteria as "wcag143" / "wcag1410"; turn them into "1.4.3" / "1.4.10". */
const wcagOf = (tags: string[]) =>
  tags
    .map((t) => /^wcag(\d)(\d)(\d+)$/.exec(t))
    .filter((m): m is RegExpExecArray => m !== null)
    .map((m) => `${m[1]}.${m[2]}.${m[3]}`)
    .join(", ") || undefined;

export async function runAxe(
  page: Page,
  findings: Findings,
  where: { component: string; example: string; theme: string },
  opts: { include?: string; exclude?: string[] } = {},
): Promise<void> {
  let builder = new AxeBuilder({ page }).withTags([...WCAG_TAGS, "best-practice"]);
  if (opts.include) builder = builder.include(opts.include);
  if (opts.exclude?.length) builder = builder.disableRules(opts.exclude);
  const result = await builder.analyze();
  for (const v of result.violations) {
    const isWcag = v.tags.some((t) => WCAG_TAGS.includes(t));
    for (const node of v.nodes) {
      findings.add(
        {
          check: "axe",
          severity: isWcag ? "error" : "warning",
          component: where.component,
          example: where.example,
          rule: v.id,
          wcag: wcagOf(v.tags),
          help: v.help,
          helpUrl: v.helpUrl.replace(/\?.*$/, ""),
          target: node.target.join(" "),
          detail: (node.failureSummary ?? "").split("\n").slice(1).join(" ").trim(),
        },
        where.theme,
      );
    }
  }
}
