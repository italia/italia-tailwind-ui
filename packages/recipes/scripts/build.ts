/**
 * Builds the publishable package into dist/: JavaScript, type declarations, the
 * icons as SVG files and a package.json of its own. Inside the monorepo the apps keep importing the
 * TypeScript sources (see ../package.json), so nothing here runs in dev.
 *
 *   bun run --cwd packages/recipes build
 *   npm publish packages/recipes/dist
 */
import { $, Glob } from "bun";
import { cp, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { icons } from "../src/icons/icons";

const root = join(import.meta.dir, "..");
const src = join(root, "src");
const dist = join(root, "dist");
const pkg = await Bun.file(join(root, "package.json")).json();

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

const components = [...new Glob("components/*.ts").scanSync(src)].map((f) => join(src, f));
const result = await Bun.build({
  entrypoints: [join(src, "index.ts"), join(src, "icons/index.ts"), ...components],
  outdir: dist,
  root: src,
  format: "esm",
  splitting: true,
  // Not minified: Tailwind reads the class names out of these files (@source).
  minify: false,
});
if (!result.success) {
  for (const log of result.logs) console.error(log);
  process.exit(1);
}

await $`bunx tsc -p ${join(root, "tsconfig.build.json")}`;

// The icons as files too, for pages that write the <svg> themselves:
// one file per icon (svg/it-search.svg) and a sprite with all of them.
const svgDir = join(dist, "svg");
await mkdir(svgDir, { recursive: true });
const xmlns = `xmlns="http://www.w3.org/2000/svg"`;
for (const [name, inner] of Object.entries(icons)) {
  await Bun.write(join(svgDir, `${name}.svg`), `<svg ${xmlns} width="24" height="24" viewBox="0 0 24 24">${inner}</svg>\n`);
}
const symbols = Object.entries(icons).map(([name, inner]) => `<symbol id="${name}" viewBox="0 0 24 24">${inner}</symbol>`);
await Bun.write(join(svgDir, "sprites.svg"), `<svg ${xmlns}>${symbols.join("")}</svg>\n`);

const published = {
  name: pkg.name,
  version: pkg.version,
  description: pkg.description,
  license: pkg.license,
  keywords: pkg.keywords,
  repository: pkg.repository,
  homepage: pkg.homepage,
  bugs: pkg.bugs,
  type: "module",
  sideEffects: false,
  main: "./index.js",
  types: "./index.d.ts",
  exports: {
    ".": { types: "./index.d.ts", default: "./index.js" },
    "./icons": { types: "./icons/index.d.ts", default: "./icons/index.js" },
    "./components/*": { types: "./components/*.d.ts", default: "./components/*.js" },
    "./svg/*": "./svg/*",
    "./package.json": "./package.json",
  },
  publishConfig: { access: "public" },
};
await Bun.write(join(dist, "package.json"), `${JSON.stringify(published, null, 2)}\n`);
await cp(join(root, "README.md"), join(dist, "README.md"));
await cp(join(root, "../../LICENSE"), join(dist, "LICENSE"));

console.log(`${pkg.name}@${pkg.version} ready in packages/recipes/dist`);
