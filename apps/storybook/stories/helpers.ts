import type { ComponentDoc } from "@italia-daisy/recipes";

/**
 * Prose from the recipe metadata mentions tags ("un <form>", "<details>").
 * Storybook renders descriptions as markdown, which would turn them into real
 * elements, so escape "<" outside code.
 */
const prose = (s: string) => s.replace(/</g, "&lt;");

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
        description: ex.description ? { story: prose(ex.description) } : undefined,
      },
    },
  };
}

/** Component-level docs description built from the recipe metadata. */
export function describe(doc: ComponentDoc): string {
  const parts = [
    prose(doc.summary),
    `**Sostituisce:** \`${doc.replaces}\``,
    doc.daisy.length ? `**Classi daisyUI:** ${doc.daisy.map((c) => `\`${c}\``).join(", ")}` : "",
    doc.extensions?.length ? `**Estensioni @italia-daisy/css:** ${doc.extensions.map((c) => `\`${c}\``).join(", ")}` : "",
    doc.cssOnly ? `**Solo CSS:** ${prose(doc.cssOnly)}` : "",
    ...(doc.snippets?.length
      ? [
          "### Con JavaScript (opzionale)",
          "La ricetta è solo CSS. Questi frammenti aggiungono il comportamento che richiede uno script.",
          ...doc.snippets.map(
            (s) => `#### ${s.title}\n\n${s.description ? `${prose(s.description)}\n\n` : ""}\`\`\`${s.lang}\n${s.code.trim()}\n\`\`\``,
          ),
        ]
      : []),
  ];
  return parts.filter(Boolean).join("\n\n");
}
