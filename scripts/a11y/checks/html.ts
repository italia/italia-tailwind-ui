/**
 * HTML validation of each example (designers.italia.it lists HTML validation,
 * HTMLProofer, among the automatic checks): content model, nesting, duplicate
 * ids and html-validate's accessibility rules. Theme-independent, so it runs once.
 */
import { HtmlValidate } from "html-validate";
import type { Findings } from "../shared.ts";

const validator = new HtmlValidate({
  extends: ["html-validate:standard", "html-validate:a11y"],
  rules: {
    // Labels that both wrap the control and point at it with `for` are valid;
    // the recipes do it on purpose so the pairing survives copy-paste.
    "no-redundant-for": "off",
    // Advisory rather than conformance problems: reported as warnings.
    "no-implicit-button-type": "warn",
    "no-redundant-aria-label": "warn",
    "prefer-native-element": "warn",
    // Examples often show several variants side by side (three breadcrumbs, two
    // navs); on a real page each needs its own label, which a warning reminds.
    "unique-landmark": "warn",
  },
});

export async function runHtml(findings: Findings, where: { component: string; example: string; theme: string }, html: string): Promise<void> {
  const report = await validator.validateString(html);
  for (const result of report.results)
    for (const m of result.messages)
      findings.add(
        {
          check: "html",
          severity: m.severity === 2 ? "error" : "warning",
          component: where.component,
          example: where.example,
          rule: m.ruleId,
          help: m.message,
          helpUrl: m.ruleUrl,
          target: m.selector ?? "",
          detail: `riga ${m.line}, colonna ${m.column}`,
        },
        where.theme,
      );
}
