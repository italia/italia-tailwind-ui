# Italia daisy

A **CSS-only** alternative to [dev-kit-italia](https://github.com/italia/dev-kit-italia): the components of the
.italia design system rewritten as plain HTML **recipes**, with semantic `ita-*` classes built on **daisyUI 5** and
**Tailwind CSS 4**. It has no web components and no Bootstrap. Every colour comes from a daisyUI theme token, so changing
`data-theme` re-themes every component.

```
italia-daisy/
├─ packages/
│  ├─ css/        @italia-daisy/css      daisyUI themes + foundations + ita-* components + it-* extensions
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

## Build and deploy

Both apps build to plain static files, with no server-side code, so any static host works: GitHub Pages, Netlify,
Cloudflare Pages, S3, nginx…

**Requirements:** [bun](https://bun.sh) 1.x and Node.js 22.12 or later (Astro 7 needs it; the Storybook CLI runs on
Node too).

### What each build produces

| Command | Output | Contents |
|---|---|---|
| `bun run build:css` | `packages/css/dist/italia-daisy.css` | The prebuilt stylesheet, for pages without Tailwind |
| `bun run docs:build` | `apps/docs/dist/` | The Astro docs site |
| `bun run storybook:build` | `apps/storybook/storybook-static/` | The static Storybook |
| `bun run build` | `apps/docs/dist/` | All three, with Storybook copied into `apps/docs/dist/storybook/` |

Check the result locally before you deploy:

```sh
bun run build
bunx serve apps/docs/dist          # any static file server works
```

(`bun run --cwd apps/docs preview` serves the docs alone, without the copied Storybook.)

### Environment variables

| Variable | Read by | Default | Use |
|---|---|---|---|
| `DOCS_SITE` | docs build | – | Full origin of the site, e.g. `https://italia.github.io` |
| `DOCS_BASE` | docs build | `/` | Path the docs live under, e.g. `/italia-daisy/`. Every link and asset gets this prefix |
| `PUBLIC_STORYBOOK_URL` | docs build | `<DOCS_BASE>storybook/` | Where the "Storybook" links point, when Storybook is hosted somewhere else |

They are read when you build, not when the page is served: change one and you must rebuild. Pass `DOCS_SITE` and
`DOCS_BASE` on the command line, because the Astro config is loaded before `.env` files. `PUBLIC_STORYBOOK_URL`
also works from `apps/docs/.env` (see `apps/docs/.env.example`).

Storybook needs no base-path setting: its build uses relative paths, so it works in any folder.

### Option A: one site (docs with Storybook inside)

The simplest option. The docs link to Storybook at `/storybook/` on the same host.

```sh
bun install --frozen-lockfile
bun run build                      # upload apps/docs/dist
```

On a host with a build step (Netlify, Cloudflare Pages, Vercel…) set:
- **Build command:** `bun install --frozen-lockfile && bun run build`
- **Output directory:** `apps/docs/dist`

Under a subpath (for example a GitHub Pages project site at `https://<user>.github.io/italia-daisy/`):

```sh
DOCS_SITE=https://<user>.github.io DOCS_BASE=/italia-daisy/ bun run build
```

### Option B: docs and Storybook on separate hosts

Build and upload each app on its own, and point the docs at Storybook:

```sh
bun install --frozen-lockfile
bun run build:css
PUBLIC_STORYBOOK_URL=https://storybook.example.org/ bun run docs:build   # upload apps/docs/dist
bun run storybook:build                                                  # upload apps/storybook/storybook-static
```

Skip `bun run build` here: it also runs the `site` step, which copies Storybook into the docs output.

### Example: GitHub Pages with GitHub Actions

Save this as `.github/workflows/pages.yml`, then pick "GitHub Actions" as the source under
*Settings → Pages*:

```yaml
name: Deploy docs
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bun run build
        env:
          DOCS_SITE: https://${{ github.repository_owner }}.github.io
          DOCS_BASE: /${{ github.event.repository.name }}/
      - uses: actions/upload-pages-artifact@v3
        with:
          path: apps/docs/dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

## Accessibility checks

The suite follows the [designers.italia.it accessibility foundation](https://designers.italia.it/design-system/fondamenti/accessibilita/)
(EN 301 549, WCAG 2.1 AA and 2.2) and the [dev-kit-italia accessibility guide](https://italia.github.io/dev-kit-italia/?path=/docs/accessibilit%C3%A0--documentazione).
It automates what those guides check by hand where a script can do it. The docs site has the full list, with the
manual checklist, at `/accessibilita/`.

```sh
bunx playwright install --only-shell chromium   # once: the browser the checks drive
bun run a11y                                     # components: every check, italia-* themes (~80 s)
bun run a11y --check axe,keyboard --component tabs,input
bun run a11y --update-snapshots                  # accept accessibility-tree changes
bun run docs:build && bun run a11y:site          # whole docs pages, like pa11y-ci --runner axe
```

`bun run a11y` renders every documented example in headless Chromium, offline, and runs:

| Check | What it verifies | WCAG |
|---|---|---|
| `axe` | axe-core WCAG 2.2 A/AA rules in every theme (errors). axe best practices, such as empty headings or labels, are warnings | automatic rules (1.4.3, 2.5.8, 4.1.2…) |
| `keyboard` | Tab and Shift+Tab through each example: no trap, every visible control reached, focus visibly changes and is not covered | 2.1.1, 2.1.2, 2.4.7, 2.4.11 |
| `interactions` | Per-component keyboard scenarios (`scripts/a11y/checks/interactions.ts`): Enter/Space open disclosures, Esc closes modal and popover and focus returns, arrows move tabs/radio/rating, a focus tooltip closes with Esc | 2.1.1, 2.4.3, 1.4.13, 3.3.1 |
| `reflow` | No horizontal scroll at 320px (400% zoom), no clipped text with the WCAG text-spacing overrides | 1.4.10, 1.4.12 |
| `html` | html-validate, `standard` and `a11y` presets: content model, nesting, duplicate ids | 1.3.1 |
| `aria` | Accessibility-tree snapshot of each example in `tests/a11y-snapshots/`: a change fails until accepted | regressions |

`bun run a11y:site` serves `apps/docs/dist` and checks each whole page: axe including page-level rules (title,
`lang`, landmarks, heading order), a visible skip link on the first Tab, and reflow. Build the docs with the default
`DOCS_BASE=/` first.

Common options: `--theme`, `--all-themes` (adds daisyUI's own themes), `--json report.json`, `--no-fail`, and
`--strict` (warnings fail too). Errors make the command exit with code 1. `.github/workflows/a11y.yml` runs both
commands on every push and pull request, and uploads the JSON reports.

Automated checks find only part of the problems. Screen readers (JAWS or NVDA with Chrome as the reference,
VoiceOver, TalkBack), focus order and real use still need people. The Storybook "Accessibility" panel runs axe on the
story you are looking at.

## Using the CSS in another project

With Tailwind 4:

```css
@import "tailwindcss";
@import "@italia-daisy/css";
/* only if you call the recipe helpers, so Tailwind sees the daisyUI and utility classes they still use: */
@source "../node_modules/@italia-daisy/recipes/src";
```

Without Tailwind, link the prebuilt `packages/css/dist/italia-daisy.css` (about 490 KB minified, 56 KB gzipped). It
contains every `ita-*` class and every class the recipes use. The `ita-*` classes need no `@source`: they are plain
CSS, always in the stylesheet.

Fonts:
- **Titillium Sans Pro**, the typeface of dev-kit-italia and bootstrap-italia 3, ships with the package:
  `packages/css/fonts/` holds the woff2 files (SIL Open Font License) and `src/fonts.css` the `@font-face` rules.
  Vite (Astro, Storybook) copies the files when you import `@italia-daisy/css`. With the prebuilt stylesheet, keep
  `fonts/` next to `dist/`, as in the package.
- **Lora and Roboto Mono** come from Google Fonts. The `<link>` tag is in `packages/css/src/base.css`.
- The stack is `"Titillium Sans Pro", "Titillium Web", system-ui…`, so a page that loads Titillium Web instead still
  gets it.

## Themes

| `data-theme`  | What it is |
|---------------|------------|
| `italia-original` (default) | Exact bootstrap-italia v3 / design-tokens-italia values: slate secondary `#5c6f82`, AA-safe status colours (`#008055`, `#995c00`, `#cc334d`), 4px radii, flat |
| `italia-custom` | The theme from your daisyUI design system: `#0066cc` primary, navy secondary, radii 0.25/0.5/1rem, depth on. Status colours keep the Bootstrap hues, darkened to pass WCAG AA (info `#00798b`, success `#00812b`, warning `#9a6400`, error `#d32b3e`) |
| `italia-dark` | Dark companion from the design-tokens-italia blue and slate scales |
| `italia-darker` | Neutral near-black dark theme (`#1f2126` base). The .italia hues are lightened to pass WCAG AA on every base colour (primary `#4a99fe`, dark text on coloured fills), 0.5rem radii, depth on. It is the `prefersdark` theme: pages without a `data-theme` use it when the OS is in dark mode |
| `light`, `dark` | daisyUI built-ins, kept to show the recipes follow any theme |

Themes nest: `<section data-theme="italia-dark">` inside an `italia-original` page works. To add a theme, write one more
`@plugin "daisyui/theme" { … }` block in `packages/css/src/themes.css`.

`accent` is the deep blue band: the slim header and the footer's small prints use it, the header centre, the nav
and the footer's main block use `primary`. In `italia-custom` it is design-tokens-italia blue-30 (`#004d99`), in
`italia-original` primary-deep (`#003366`). In `italia-dark` `accent` is lighter than `primary`, so the two bands swap
weight but stay distinct.

### Type scale and control sizes

The sizes follow bootstrap-italia 3 (design-tokens-italia), not Tailwind's and daisyUI's defaults:

- **Text:** body 16px, 18px from 576px up. Headings are 40/32/28/24/20/16px, then 48/40/32/28/24/18px. They come
  from `--it-font-size-body`, `--it-font-size-h1`…`h6` and `--it-font-size-lead` in `base.css`, set in the lowest
  layer, so a theme block can redefine them. The base styles only reach text without a class: utilities and
  daisyUI components keep their own sizes.
- **Components:** daisyUI starts buttons, fields, tabs, badges and alerts at 14px. Here the default is 16px
  (buttons, badges, alerts) or the body size (fields, tabs). The override sits in daisyUI's innermost sub-layer
  (`extensions.css`), so `btn-sm`, `input-lg`, `tabs-xs` and the other size modifiers keep daisyUI's values.
- **Heights:** `--size-field: 0.275rem` in the `italia-*` themes makes buttons, fields and tabs 44px high (daisyUI's
  0.25rem gives 40px; bootstrap-italia buttons are 45px). It is a regular daisyUI theme variable: set it back to
  0.25rem in a theme for daisyUI's sizes.

### Surfaces, not "light" and "dark"

A variant that changes the background is named after the daisyUI token it uses, never "light" or "dark": the
real colour depends on the theme (in `italia-dark` the "base" surface is navy).

| Where | Option | Values |
|---|---|---|
| Header, Footer | `surface` | `"primary"` (default, the blue bands), `"base"` (page background, primary text) |
| Dropdown | `surface` | `"base"` (default), `"accent"` |
| Breadcrumbs | `surface` | `"base"` (default), `"neutral"` |
| Hero | `overlay` | `"none"`, `"neutral"`, `"primary"`, `"filter"` |
| Overlay, Dimmer | `tone` / `variant` | `"primary"`, `"neutral"` |
| Any component that sits on the page | wrap it in `<div class="it-surface-primary">` | |

The old names still work as deprecated aliases: `theme: "light"`, `dark: true`, `overlay: "dark"`, `tone: "black"`,
`variant: "dark"`, and `inverse` on Back to top and Forward.

## The `ita-*` classes

Every component is written with its own semantic classes, prefixed `ita-`: `ita-btn ita-btn-primary`,
`ita-alert ita-alert-success`, `ita-card`, `ita-header-nav`… They are built on daisyUI with `@apply`, one file per
component in `packages/css/src/components/`. Three reasons:

1. **The markup says where it comes from.** A page built with italia-daisy is recognisable from its classes
   (`ita-*`), distinct from dev-kit-italia (`it-*` web components) and bootstrap-italia.
2. **daisyUI updates still arrive.** The classes `@apply` daisyUI's own components, so a new daisyUI version flows
   through without touching the markup.
3. **Shorter HTML.** Across the 241 documented examples the HTML is 28% smaller and the `class` attributes 71%
   smaller than with daisyUI classes plus utilities.

The `ita-*` classes are plain CSS, not Tailwind utilities: they are always in the stylesheet, whatever Tailwind
scans. Each component page (and each Storybook story) lists them under **Classi**.

### Two kinds of component

- **Atomic** (button, alert, chip, badge, form fields, pagination, progress, section, avatar, toolbar,
  notification, upload…): the markup carries only `ita-*` classes (plus layout helpers such as `join`, `join-item`,
  `sr-only`). The rules live in `@layer components`.
  ```html
  <a href="#" class="ita-btn ita-btn-primary ita-btn-outline">Scopri</a>
  ```
- **Structural** (tabs, dropdown and menu, accordion and collapse, card, modal, hero, header, footer, megamenu,
  steps, timeline, bottom navigation, carousel, tooltip, popover, rating): daisyUI's structure classes stay in the
  markup (`tabs`/`tab`/`tab-content`, `dropdown`/`dropdown-content`/`menu`, `card`/`card-body`/`card-title`,
  `modal`/`modal-box`…), because daisyUI's behaviour depends on them. An `ita-*` class on the root adds the .italia
  look. These rules live in `@layer utilities`, so they win over daisyUI's own.
  ```html
  <article class="card ita-card ita-card-primary">
    <div class="card-body"><h3 class="card-title"><a href="#">Titolo</a></h3>…</div>
  </article>
  ```

### Writing one: the traps

- **daisyUI's nested layers.** `@apply btn` copies daisyUI's rules inside its nested layers
  (`daisyui.l1.l2.l3`…), where a value the component sets directly beats them. When a base class sets something
  directly (`--fontsize` on `ita-btn`), every modifier must set it directly too. And inside a daisyUI sub-layer,
  never rely on source order: the minifier merges blocks of the same layer and may reorder them, so use
  specificity (`:root .ita-btn-ghost { … }`), as `button.css` and `input.css` do.
- **daisyUI selectors on its own class names** (`:not(.btn-link, .btn-ghost)`, `fieldset:disabled .input`,
  `.validator:user-invalid ~ .validator-hint`) no longer match `ita-*` markup: mirror them explicitly.
- **Classless links** get the base style (`a:not([class])`: primary, underlined). A component that styles the links
  inside it sets `color` and `text-decoration` itself.
- **Muted text** uses `it-muted-{n}` (`@apply it-muted-70`), not `text-base-content/70`: `it-surface-primary`
  brings it back to full strength through `--it-muted`, whatever the class names in the markup. Disabled states
  keep `text-base-content/{n}`, so they stay faded on the band.
- **Behaviour is native HTML**: `<details>`/`<summary>`, the `name` attribute for exclusive accordions, a checkbox
  and `:has(:checked)` for dismissible alerts and chips, the popover API, `command`/`commandfor` for dialogs, real
  links for pagination.

### `it-*` extensions

When CSS needs something daisyUI and Tailwind do not have, it is an `it-*` extension in
`packages/css/src/extensions.css`. They work on daisyUI's raw classes too:
- `it-fold-corner`: the callout's folded corner
- `it-plus-minus`: the +/– glyph
- `it-slash`: the "/" separator for daisyUI's `breadcrumbs` (`ita-breadcrumbs` has it built in)
- `it-scroll-reveal`: fades the back-to-top button in after scrolling (scroll-driven animation)
- `it-scroll-progress`: the navscroll reading-progress bar (scroll-driven animation)
- `it-carousel`: CSS carousel buttons and dots (`::scroll-button`, `::scroll-marker`)
- `it-surface-primary`: a band in the primary colour. Inside it the tokens swap (base becomes primary, primary
  and accent become primary-content), so any component works on it with no option, and muted text goes back to
  full strength to keep 4.5:1
- `it-muted-{n}`: base-content text at n%, the muted text that `it-surface-primary` restores

extensions.css also gives daisyUI's raw classes the .italia defaults (1rem text on `btn`, `badge`, `alert`,
`file-input`; the field border), so raw daisyUI markup next to `ita-*` markup matches it.

### Recipes

Each file in `packages/recipes/src/components/` exports:
- a builder (`button(args)`), whose output is an HTML string
- `doc` (`ComponentDoc`): the summary, the `ita-*` classes (`classes`), the daisyUI classes underneath (`daisy`),
  CSS-only notes, the examples and the JS/React snippets

Class maps are written out literally (`{ danger: "ita-btn-danger" }`, never `` `ita-btn-${v}` ``), so the classes
can be found by searching the source. The Astro pages and the Storybook stories are both generated from `doc`, so a
recipe is documented in one place.

## Components

Done (pilot batch): **Accordion, Alert, Badge, Breadcrumbs, Button, Callout, Card, Chip, Pagination**.

Done (page frame): **Header, Hero, Footer**. dev-kit-italia has no footer package — the footer follows
bootstrap-italia's `.it-footer`, which is what the web-component kit still expects you to write by hand.

Done (overlays and menus): **Dropdown, Megamenu, Modal, Tooltip, Overlay**. The header's megamenu nav item and the
standalone Megamenu are the same recipe. Overlay covers both bootstrap-italia's `.overlay-panel` and `<it-dimmer>`.

Done (forms): **Input, Select, Autocomplete, Checkbox, Radio, Toggle**. Labels sit above the field. A rule in
`extensions.css`, placed in daisyUI's own innermost sub-layer, darkens the field border to 60% base-content (3:1
contrast); daisyUI's `input-error`, `validator` and `:focus` states still override it. Native validation uses daisyUI
`validator` (`:user-invalid`), and autocomplete is an `<input list>` + `<datalist>`.

Done (navigation and feedback): **Avatar, Back, Forward, Back to top, Bottom navigation, Collapse, Navscroll, Sticky,
Notification, Popover, Progress, Rating, Section, Skiplinks, Stepper, Tabs, Timeline, Toolbar**. Newer platform
features, each with a fallback:
- Popover and positioned notifications use the popover API (`popovertarget`), and popover adds CSS anchor
  positioning.
- Navscroll marks the current section with `scroll-target-group` + `:target-current`; elsewhere it falls back to
  `aria-current`.
- Sticky adds its shadow only when stuck, with `scroll-state` container queries.
- Back to top and the navscroll progress bar use scroll-driven animations (`it-scroll-reveal`,
  `it-scroll-progress`).

Done (media and data entry): **Carousel, Thumbnav, Transfer, Upload, Video**. Every dev-kit-italia package now has a
recipe.
- **Carousel:** daisyUI `carousel` (scroll-snap). The `it-carousel` extension adds prev/next buttons and dots with
  `::scroll-button` / `::scroll-marker` (Chrome 135+); other browsers keep native swiping, or you can use the
  anchor-link controls.
- **Thumbnav:** thumbnails are anchor links to the carousel's slides.
- **Transfer:** a single checkbox list on a two-column `grid-flow-dense` grid. `has-checked:col-start-2` moves a
  checked item to the "selected" column. There is also a form version where the server moves the items.
- **Upload:** the drop zone is the native file input, stretched and transparent over the whole area.
- **Video:** the native `<video>` with WebVTT captions, plus a YouTube embed behind a consent overlay.

### JavaScript and React snippets

The recipes ship no JavaScript. When a behaviour needs a script (autoplay, upload progress, video consent, a real
ARIA tablist, roving tabindex, `indeterminate`, show/hide password…), the component's `doc.snippets` holds an
optional plain-JS enhancement and a React equivalent. They appear in a "Con JavaScript" section on the docs page and
in the Storybook description. Components with snippets: back, carousel, checkbox, input, notification, tabs,
thumbnav, toolbar, transfer, upload, video.

## Credits

Look, content and icons come from [dev-kit-italia](https://github.com/italia/dev-kit-italia),
[bootstrap-italia](https://github.com/italia/bootstrap-italia) and design-tokens-italia (BSD-3-Clause). The 179 SVG
icons are regenerated with `bun run icons`. Built with [daisyUI](https://daisyui.com) (MIT) and
[Tailwind CSS](https://tailwindcss.com) (MIT).
