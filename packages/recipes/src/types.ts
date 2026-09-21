/** One documented example of a component, as ready-to-paste HTML. */
export interface Example {
  /** Stable id, used for Storybook story names and anchors. */
  id: string;
  /** Title shown in docs (Italian, mirroring dev-kit-italia's stories). */
  title: string;
  description?: string;
  html: string;
  /** Full-bleed preview: the docs drop the padding around it (header, hero, footer). */
  fullBleed?: boolean;
}

/** Documentation for one component recipe. */
export interface ComponentDoc {
  slug: string;
  name: string;
  /** The dev-kit-italia web component this recipe replaces. */
  replaces: string;
  summary: string;
  /** daisyUI component classes the recipe is built on. */
  daisy: string[];
  /** it-* extension classes it needs from @italia-daisy/css, if any. */
  extensions?: string[];
  /** Notes on how JS behaviour of the web component is handled CSS-only. */
  cssOnly?: string;
  examples: Example[];
}

/** Joins class names, skipping falsy values. */
export const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");
