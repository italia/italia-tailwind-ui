# Italia daisy

A **CSS-only** alternative to [dev-kit-italia](https://github.com/italia/dev-kit-italia): the components of the
.italia design system rewritten as plain HTML **recipes** built from **daisyUI 5** classes and **Tailwind CSS 4**
utilities. It has no web components and no Bootstrap. Every colour comes from a daisyUI theme token, so changing
`data-theme` re-themes every component.

```
italia-daisy/
├─ packages/
│  ├─ css/        @italia-daisy/css      daisyUI themes + foundations + a thin it-* extension layer
│  └─ recipes/    @italia-daisy/recipes  HTML recipe functions, docs metadata, bootstrap-italia icons
└─ apps/
   ├─ docs/       Astro site: one page per component, live preview and code, theme switcher
   └─ storybook/  Storybook 10 (html-vite): Playground with controls + one story per example
```

## Quick start (bun)

```sh
bun install
bun run dev              # Astro docs  → http://localhost:4321
bun run storybook        # Storybook   → http://localhost:6006
bun run build            # prebuilt CSS + docs + storybook, merged into apps/docs/dist
bun run typecheck
```

## Using the CSS in another project

With Tailwind 4:

```css
@import "tailwindcss";
@import "@italia-daisy/css";
/* only if you call the recipe helpers, so Tailwind sees their classes: */
@source "../node_modules/@italia-daisy/recipes/src";
```

Without Tailwind, link the prebuilt `packages/css/dist/italia-daisy.css` (about 140 KB minified). It contains every
class the recipes use.

Load the fonts (Titillium Web, Lora, Roboto Mono) from Google Fonts. The `<link>` tag is in
`packages/css/src/base.css`.

## Themes

| `data-theme`  | What it is |
|---------------|------------|
| `italia` (default) | The theme from your daisyUI design system: `#0066cc` primary, navy secondary, Bootstrap-style status colours, radii 0.25/0.5/1rem, depth on |
| `italia-v3`   | Exact bootstrap-italia v3 / design-tokens-italia values: slate secondary `#5c6f82`, AA-safe status colours (`#008055`, `#995c00`, `#cc334d`), 4px radii, flat |
| `italia-dark` | Dark companion from the design-tokens-italia blue and slate scales |
| `light`, `dark` | daisyUI built-ins, kept to show the recipes follow any theme |

Themes nest: `<section data-theme="italia-dark">` inside an `italia` page works. To add a theme, write one more
`@plugin "daisyui/theme" { … }` block in `packages/css/src/themes.css`.

`accent` is the deep blue band: the slim header and the footer's small prints use it, the header centre, the nav
and the footer's main block use `primary`. In `italia` it is design-tokens-italia blue-30 (`#004d99`), in
`italia-v3` primary-deep (`#003366`). In a dark theme `accent` is lighter than `primary`, so the two bands swap
weight but stay distinct.

## How a recipe is written

The rules:

1. **Start from daisyUI.** Use the closest daisyUI component (`btn`, `alert`, `badge`, `card`, `collapse`,
   `breadcrumbs`…).
2. **Add the .italia look with Tailwind utilities on theme tokens.** For example `border-l-8 border-l-success` gives
   the alert its bar, and `font-semibold` gives buttons their weight.
3. **Never use a literal palette colour.** Borders and muted text use `base-content/20`, `base-content/70` and so on,
   so they work in dark themes.
4. **Behaviour is native HTML.**
   - `<details>`/`<summary>` for accordion and "Leggi tutto".
   - The shared `name` attribute for exclusive accordions.
   - A checkbox plus `has-checked:hidden` for dismissible alerts and chips.
   - Real links for pagination.
5. **Use an `it-*` extension class only when utilities cannot do it.** There are three today, all in
   `packages/css/src/extensions.css`:
   - `it-fold-corner`: the callout's folded corner
   - `it-plus-minus`: the +/– glyph
   - `it-slash`: the "/" breadcrumb separator
6. **Write class maps out literally** (`{ danger: "btn-error" }`, never `` `btn-${v}` ``). Tailwind only generates
   classes it can read in the source.

Each file in `packages/recipes/src/components/` exports:
- a builder (`button(args)`), whose output is an HTML string
- `doc` (`ComponentDoc`): the summary, the daisyUI classes used, CSS-only notes and the examples

The Astro pages and the Storybook stories are both generated from `doc`, so a recipe is documented in one place.

## Components

Done (pilot batch): **Accordion, Alert, Badge, Breadcrumbs, Button, Callout, Card, Chip, Pagination**.

Done (page frame): **Header, Hero, Footer**. dev-kit-italia has no footer package — the footer follows
bootstrap-italia's `.it-footer`, which is what the web-component kit still expects you to write by hand.

Done (overlays and menus): **Dropdown, Megamenu, Modal, Tooltip, Overlay**. The header's megamenu nav item and the
standalone Megamenu are the same recipe. Overlay covers both bootstrap-italia's `.overlay-panel` and `<it-dimmer>`.

Remaining dev-kit-italia packages, with the daisyUI starting point for each:

| dev-kit-italia | daisyUI base | CSS-only approach |
|---|---|---|
| avatar | `avatar`, `avatar-group` | – |
| back, forward, back-to-top | `btn`, `link` | `href="#top"` + `scroll-behavior` |
| bottom-nav | `dock` | – |
| carousel, thumbnav | `carousel` | scroll-snap + anchor links |
| checkbox, radio, toggle | `checkbox`, `radio`, `toggle`, `fieldset` | native inputs |
| input, select, autocomplete | `input`, `select`, `validator` | `<datalist>` for autocomplete |
| collapse | `collapse` | `<details>` |
| navscroll, sticky | `menu` + `sticky` utilities | anchor links |
| notification | `toast` + `alert` | checkbox dismiss |
| popover | `dropdown` | popover API |
| progress | `progress`, `radial-progress`, `loading` | – |
| rating | `rating` | radio group |
| section | utilities on `base-200`/`neutral` | – |
| skiplinks | `sr-only focus:not-sr-only` | – |
| stepper | `steps` | – |
| tabs | `tabs`, `tab-content` | radio tabs |
| timeline | `timeline` | – |
| toolbar | `join`, `btn` | – |
| transfer | two `menu` lists + `join` | form submit |
| upload | `file-input` | – |
| video | `aspect-video` utilities | native `<video>` |

## Credits

Look, content and icons come from [dev-kit-italia](https://github.com/italia/dev-kit-italia),
[bootstrap-italia](https://github.com/italia/bootstrap-italia) and design-tokens-italia (BSD-3-Clause). The 179 SVG
icons are regenerated with `bun run icons`. Built with [daisyUI](https://daisyui.com) (MIT) and
[Tailwind CSS](https://tailwindcss.com) (MIT).
