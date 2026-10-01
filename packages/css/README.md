# @italia-tailwind/css

The look of the .italia design system (dev-kit-italia, bootstrap-italia 3) for Tailwind CSS 4: daisyUI 5 themes, the
Titillium Sans Pro typeface and the `ita-*` component classes. CSS only, no JavaScript.

```sh
npm install @italia-tailwind/css tailwindcss daisyui
```

## With Tailwind 4

```css
@import "tailwindcss";
@import "@italia-tailwind/css";
```

```html
<html data-theme="italia-original">
  <button class="ita-btn ita-btn-primary">Invia</button>

  <!-- themes nest -->
  <section data-theme="italia-dark">…</section>
</html>
```

Themes: `italia-original` (the default), `italia-custom`, `italia-dark`, `italia-darker` (used when the system asks
for dark), plus every daisyUI built-in theme (`light`, `dark`, `dracula`, `dim`…).

Do not add `@plugin "daisyui"` to your stylesheet: `@italia-tailwind/css` loads daisyUI for you, and declaring it
again would load it twice. `daisyui` must still be installed, as a dependency. Your own `@plugin "daisyui/theme"`
blocks are fine, after the import.

The fonts ship with the package and are resolved by Vite, Astro and the Tailwind CLI.

For ready-made markup of every component, and the icons, add
[`@italia-tailwind/recipes`](https://www.npmjs.com/package/@italia-tailwind/recipes).

## Without Tailwind

Link the prebuilt stylesheet, which contains every class:

```html
<link rel="stylesheet" href="node_modules/@italia-tailwind/css/dist/italia-tailwind.css" />
```

Keep the `fonts/` folder next to `dist/`, as in the package.

## Single parts

```css
@import "@italia-tailwind/css/themes.css";
@import "@italia-tailwind/css/fonts.css";
```

Documentation and live examples: https://italia-tailwind-ui.vercel.app/docs/

## License

BSD-3-Clause. Titillium Sans Pro is under the SIL Open Font License (see `fonts/`).
