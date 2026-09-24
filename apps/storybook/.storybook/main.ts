import type { StorybookConfig } from "@storybook/html-vite";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.ts"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-themes"],
  framework: { name: "@storybook/html-vite", options: {} },
  async viteFinal(config) {
    config.plugins = [...(config.plugins ?? []), tailwindcss()];
    // The docs addon renders MDX with React, which this html framework does not
    // use itself. Pre-bundle React up front and dedupe it: otherwise Vite can
    // discover it mid-load, re-optimise and reload, leaving two React copies in
    // the page ("Cannot read properties of null (reading 'useContext')").
    config.resolve = { ...config.resolve, dedupe: [...(config.resolve?.dedupe ?? []), "react", "react-dom"] };
    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: [
        ...(config.optimizeDeps?.include ?? []),
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
    };
    return config;
  },
};
export default config;
