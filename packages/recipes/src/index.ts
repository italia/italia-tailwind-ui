export * from "./types";
export * from "./icons";

import { doc as accordionDoc } from "./components/accordion";
import { doc as alertDoc } from "./components/alert";
import { doc as badgeDoc } from "./components/badge";
import { doc as breadcrumbsDoc } from "./components/breadcrumbs";
import { doc as buttonDoc } from "./components/button";
import { doc as calloutDoc } from "./components/callout";
import { doc as cardDoc } from "./components/card";
import { doc as chipDoc } from "./components/chip";
import { doc as dropdownDoc } from "./components/dropdown";
import { doc as footerDoc } from "./components/footer";
import { doc as headerDoc } from "./components/header";
import { doc as heroDoc } from "./components/hero";
import { doc as megamenuDoc } from "./components/megamenu";
import { doc as modalDoc } from "./components/modal";
import { doc as overlayDoc } from "./components/overlay";
import { doc as paginationDoc } from "./components/pagination";
import { doc as tooltipDoc } from "./components/tooltip";

export { accordion } from "./components/accordion";
export { alert } from "./components/alert";
export { badge } from "./components/badge";
export { breadcrumbs } from "./components/breadcrumbs";
export { button } from "./components/button";
export { callout, calloutMore } from "./components/callout";
export { card, profileCard, bannerCard } from "./components/card";
export { chip } from "./components/chip";
export { dropdown, dropdownMenu, chevron } from "./components/dropdown";
export { footer, footerCompact } from "./components/footer";
export { header, headerSlim, headerCenter, headerNav } from "./components/header";
export { hero } from "./components/hero";
export { megamenu, megamenuPanel } from "./components/megamenu";
export { modal } from "./components/modal";
export { overlay, dimmer, dimmerAction } from "./components/overlay";
export { pagination, paginationSimple, pageWindow } from "./components/pagination";
export { tooltip, tooltipDescribed } from "./components/tooltip";

/** All documented components, alphabetical. */
export const components = [accordionDoc, alertDoc, badgeDoc, breadcrumbsDoc, buttonDoc, calloutDoc, cardDoc, chipDoc, dropdownDoc, footerDoc, headerDoc, heroDoc, megamenuDoc, modalDoc, overlayDoc, paginationDoc, tooltipDoc];
export { accordionDoc, alertDoc, badgeDoc, breadcrumbsDoc, buttonDoc, calloutDoc, cardDoc, chipDoc, dropdownDoc, footerDoc, headerDoc, heroDoc, megamenuDoc, modalDoc, overlayDoc, paginationDoc, tooltipDoc };

/** Themes shipped by @italia-daisy/css, in switcher order. */
export const themes = [
  { id: "italia", label: "Italia" },
  { id: "italia-v3", label: "Italia v3" },
  { id: "italia-dark", label: "Italia dark" },
  { id: "light", label: "daisyUI light" },
  { id: "dark", label: "daisyUI dark" },
  { id: "dracula", label: "dracula" },
  { id: "lofi", label: "lofi" },
] as const;
