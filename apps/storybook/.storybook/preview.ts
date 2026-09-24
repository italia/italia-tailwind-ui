import type { Preview } from "@storybook/html-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import { themes, defaultTheme } from "@italia-daisy/recipes";
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
      themes: Object.fromEntries(themes.map((t) => [t.label, t.id])),
      defaultTheme: defaultTheme.label,
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
