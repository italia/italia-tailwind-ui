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

/**
 * Code the recipe does NOT ship: the few lines of JavaScript (or a React
 * component) needed for behaviour CSS cannot provide. Shown in the docs only.
 */
export interface Snippet {
  title: string;
  lang: "js" | "ts" | "tsx" | "html" | "css";
  code: string;
  description?: string;
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
  /** Optional JS / React snippets for behaviour that needs a script. */
  snippets?: Snippet[];
}

/** Joins class names, skipping falsy values. */
export const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");
