import type { Preview } from "@storybook/html-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import { italiaThemes, daisyThemes, defaultTheme, type Theme } from "@italia-tailwind/recipes";

// Toolbar names: the .italia themes first, with the two defaults marked, then daisyUI's.
const themeName = (t: Theme) =>
  t.default === "light" ? `${t.label} (predefinito)` : t.default === "dark" ? `${t.label} (predefinito scuro)` : t.label;
const themeOptions = {
  ...Object.fromEntries(italiaThemes.map((t) => [themeName(t), t.id])),
  // The addon's menu has no dividers: this entry only separates the two groups, and picks the default theme.
  "──── daisyUI ────": defaultTheme.id,
  ...Object.fromEntries(daisyThemes.map((t) => [themeName(t), t.id])),
};
import "./preview.css";

const preview: Preview = {
  parameters: {
    layout: "padded",
    controls: { expanded: true },
    backgrounds: { disable: true },
    a11y: { test: "todo" },
    options: { storySort: { order: ["Introduzione", "Componenti"] } },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: themeOptions,
      defaultTheme: themeName(defaultTheme),
      attributeName: "data-theme",
    }),
    // Paint the story surface with the active theme's base colour.
    (story) => {
      const out = story();
      const wrap = document.createElement("div");
      wrap.className = "bg-base-100 text-base-content font-sans p-4 min-h-24";
      if (typeof out === "string") wrap.innerHTML = out;
      else wrap.append(out as Node);
      return wrap;
    },
  ],
};
export default preview;
