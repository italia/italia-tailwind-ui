import { icons, type IconName } from "./icons";

export { icons, type IconName };

/**
 * Inline SVG for a bootstrap-italia icon. Colour comes from `currentColor`
 * (use Tailwind text-* classes, e.g. text-primary), size from Tailwind
 * size-* classes (size-4 = 16px xs, size-6 = 24px sm, size-8 = 32px default).
 */
export function icon(name: IconName, className = "size-6", label?: string): string {
  const a11y = label ? `role="img" aria-label="${label}"` : `aria-hidden="true" focusable="false"`;
  return `<svg class="${className ? `${className} ` : ""}shrink-0 fill-current" viewBox="0 0 24 24" ${a11y}>${icons[name]}</svg>`;
}
