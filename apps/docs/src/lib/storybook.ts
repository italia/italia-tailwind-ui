/**
 * Where the docs link to Storybook.
 *
 * Set PUBLIC_STORYBOOK_URL (e.g. https://storybook.example.org/) when Storybook
 * is deployed on another host or path. Without it the links point at the
 * storybook/ folder next to the docs, which is what `bun run site` produces.
 */
const docsBase = import.meta.env.BASE_URL.replace(/\/?$/, "/");
// Read the variable as a plain member access: Astro substitutes env values in
// the build by matching `import.meta.env.NAME`, and `?.` would slip past it.
const configured = (import.meta.env.PUBLIC_STORYBOOK_URL ?? "").trim();

/** Storybook's base URL, always with a trailing slash. */
export const storybookUrl = configured ? configured.replace(/\/?$/, "/") : `${docsBase}storybook/`;

/** The autodocs page of one component. */
export const storyUrl = (slug: string) => `${storybookUrl}?path=/docs/componenti-${slug}--docs`;
