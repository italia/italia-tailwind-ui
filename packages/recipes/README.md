# @italia-tailwind/recipes

HTML recipes for the components of the .italia design system (dev-kit-italia), plus the bootstrap-italia icon set.
Each recipe is a function that returns an HTML string with `ita-*`, daisyUI and Tailwind classes. No JavaScript runs
in the browser.

The styles are in [`@italia-tailwind/css`](https://www.npmjs.com/package/@italia-tailwind/css): install both.

```sh
npm install @italia-tailwind/css @italia-tailwind/recipes tailwindcss daisyui
```

## Setup

In the stylesheet of your project (Tailwind 4):

```css
@import "tailwindcss";
@import "@italia-tailwind/css";
/* lets Tailwind see the daisyUI and utility classes the recipes use */
@source "../node_modules/@italia-tailwind/recipes";
```

The `@source` path is relative to the stylesheet: adjust it to reach `node_modules`.

## Use

```ts
import { button, alert, icon } from "@italia-tailwind/recipes";

button({ label: "Invia", variant: "primary" });
alert({ variant: "success", content: "Domanda inviata correttamente." });
icon("it-arrow-right", "size-5");
```

In Astro:

```astro
---
import { button, icon } from "@italia-tailwind/recipes";
---
<html data-theme="italia-original">
  <Fragment set:html={button({ label: "Invia" })} />
  <Fragment set:html={icon("it-search")} />
</html>
```

A single component can be imported on its own:

```ts
import { button } from "@italia-tailwind/recipes/components/button";
import { icon } from "@italia-tailwind/recipes/icons";
```

## Icons without the `icon()` helper

`icon()` only returns an inline `<svg>`, so you can write that markup yourself. The same icons ship as SVG files in
`@italia-tailwind/recipes/svg/`: one file per icon and a sprite with all of them.

In Astro, import an SVG file and use it as a component:

```astro
---
import Search from "@italia-tailwind/recipes/svg/it-search.svg";
---
<a href="/cerca" class="ita-btn ita-btn-primary">
  Cerca <Search class="size-5 shrink-0 fill-current" aria-hidden="true" />
</a>
```

Or reference the sprite, which holds every icon in one file:

```astro
---
import sprites from "@italia-tailwind/recipes/svg/sprites.svg?url";
---
<svg class="size-5 shrink-0 fill-current" aria-hidden="true"><use href={`${sprites}#it-search`} /></svg>
```

In plain HTML, copy `node_modules/@italia-tailwind/recipes/svg/sprites.svg` next to your pages and point `<use>` at
it:

```html
<svg class="size-5 shrink-0 fill-current" aria-hidden="true"><use href="/sprites.svg#it-search"></use></svg>
```

`fill-current` makes the icon take the text colour, and `size-*` sets its size (`size-4` 16px, `size-6` 24px,
`size-8` 32px). For an icon that carries meaning on its own, replace `aria-hidden="true"` with `role="img"` and an
`aria-label`.

The recipes do not escape their arguments: pass trusted text, or escape user input first.

Documentation and live examples: https://italia-tailwind-ui.vercel.app/docs/

## License

BSD-3-Clause. The icons come from bootstrap-italia (BSD-3-Clause).
