import type { ComponentDoc } from "@italia-daisy/recipes";

/** Story rendering one documented example, with its HTML shown in the Docs "Show code" panel. */
export function example(doc: ComponentDoc, id: string) {
  const ex = doc.examples.find((e) => e.id === id);
  if (!ex) throw new Error(`No example "${id}" in ${doc.slug}`);
  return {
    name: ex.title,
    render: () => ex.html,
    parameters: {
      docs: {
        source: { code: ex.html, language: "html" },
        description: ex.description ? { story: ex.description } : undefined,
      },
    },
  };
}

/** Component-level docs description built from the recipe metadata. */
export function describe(doc: ComponentDoc): string {
  const parts = [
    doc.summary,
    `**Sostituisce:** \`${doc.replaces}\``,
    doc.daisy.length ? `**Classi daisyUI:** ${doc.daisy.map((c) => `\`${c}\``).join(", ")}` : "",
    doc.extensions?.length ? `**Estensioni @italia-daisy/css:** ${doc.extensions.map((c) => `\`${c}\``).join(", ")}` : "",
    doc.cssOnly ? `**Solo CSS:** ${doc.cssOnly}` : "",
  ];
  return parts.filter(Boolean).join("\n\n");
}
