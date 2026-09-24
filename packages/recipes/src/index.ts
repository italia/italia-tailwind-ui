export * from "./types";
export * from "./icons";

import { doc as accordionDoc } from "./components/accordion";
import { doc as alertDoc } from "./components/alert";
import { doc as autocompleteDoc } from "./components/autocomplete";
import { doc as avatarDoc } from "./components/avatar";
import { doc as backDoc } from "./components/back";
import { doc as backToTopDoc } from "./components/back-to-top";
import { doc as badgeDoc } from "./components/badge";
import { doc as bottomNavDoc } from "./components/bottom-nav";
import { doc as breadcrumbsDoc } from "./components/breadcrumbs";
import { doc as buttonDoc } from "./components/button";
import { doc as calloutDoc } from "./components/callout";
import { doc as cardDoc } from "./components/card";
import { doc as carouselDoc } from "./components/carousel";
import { doc as checkboxDoc } from "./components/checkbox";
import { doc as chipDoc } from "./components/chip";
import { doc as collapseDoc } from "./components/collapse";
import { doc as dropdownDoc } from "./components/dropdown";
import { doc as footerDoc } from "./components/footer";
import { doc as forwardDoc } from "./components/forward";
import { doc as headerDoc } from "./components/header";
import { doc as heroDoc } from "./components/hero";
import { doc as inputDoc } from "./components/input";
import { doc as megamenuDoc } from "./components/megamenu";
import { doc as modalDoc } from "./components/modal";
import { doc as navscrollDoc } from "./components/navscroll";
import { doc as notificationDoc } from "./components/notification";
import { doc as overlayDoc } from "./components/overlay";
import { doc as paginationDoc } from "./components/pagination";
import { doc as popoverDoc } from "./components/popover";
import { doc as progressDoc } from "./components/progress";
import { doc as radioDoc } from "./components/radio";
import { doc as ratingDoc } from "./components/rating";
import { doc as sectionDoc } from "./components/section";
import { doc as selectDoc } from "./components/select";
import { doc as skiplinksDoc } from "./components/skiplinks";
import { doc as stepperDoc } from "./components/stepper";
import { doc as stickyDoc } from "./components/sticky";
import { doc as tabsDoc } from "./components/tabs";
import { doc as thumbnavDoc } from "./components/thumbnav";
import { doc as timelineDoc } from "./components/timeline";
import { doc as toggleDoc } from "./components/toggle";
import { doc as toolbarDoc } from "./components/toolbar";
import { doc as tooltipDoc } from "./components/tooltip";
import { doc as transferDoc } from "./components/transfer";
import { doc as uploadDoc } from "./components/upload";
import { doc as videoDoc } from "./components/video";

export { accordion } from "./components/accordion";
export { alert } from "./components/alert";
export { autocomplete } from "./components/autocomplete";
export { avatar, avatarGroup, avatarWithText, avatarDropdown } from "./components/avatar";
export { back } from "./components/back";
export { backToTop } from "./components/back-to-top";
export { badge } from "./components/badge";
export { bottomNav } from "./components/bottom-nav";
export { breadcrumbs } from "./components/breadcrumbs";
export { button } from "./components/button";
export { callout, calloutMore } from "./components/callout";
export { card, profileCard, bannerCard } from "./components/card";
export { carousel } from "./components/carousel";
export { checkbox, checkboxGroup, choice, choiceGroup } from "./components/checkbox";
export { chip } from "./components/chip";
export { collapse } from "./components/collapse";
export { dropdown, dropdownMenu, chevron } from "./components/dropdown";
export { footer, footerCompact } from "./components/footer";
export { forward } from "./components/forward";
export { header, headerSlim, headerCenter, headerNav } from "./components/header";
export { hero } from "./components/hero";
export { input, fieldLabel, fieldHint, fieldFeedback } from "./components/input";
export { megamenu, megamenuPanel } from "./components/megamenu";
export { modal } from "./components/modal";
export { navscroll } from "./components/navscroll";
export { notification, notificationTrigger } from "./components/notification";
export { overlay, dimmer, dimmerAction } from "./components/overlay";
export { pagination, paginationSimple, pageWindow } from "./components/pagination";
export { popover } from "./components/popover";
export { progress, progressDonut, spinner, progressButton } from "./components/progress";
export { radio, radioGroup } from "./components/radio";
export { rating } from "./components/rating";
export { section } from "./components/section";
export { select } from "./components/select";
export { skiplinks } from "./components/skiplinks";
export { stepper } from "./components/stepper";
export { sticky } from "./components/sticky";
export { tabs, tabsNav } from "./components/tabs";
export { thumbnav, thumbnavGallery } from "./components/thumbnav";
export { timeline } from "./components/timeline";
export { toggle, toggleGroup } from "./components/toggle";
export { toolbar } from "./components/toolbar";
export { tooltip, tooltipDescribed } from "./components/tooltip";
export { transfer, transferForm } from "./components/transfer";
export { upload, uploadDropzone, uploadList, uploadAvatar } from "./components/upload";
export { video, videoEmbed } from "./components/video";

/** All documented components, alphabetical. */
export const components = [accordionDoc, alertDoc, autocompleteDoc, avatarDoc, backDoc, backToTopDoc, badgeDoc, bottomNavDoc, breadcrumbsDoc, buttonDoc, calloutDoc, cardDoc, carouselDoc, checkboxDoc, chipDoc, collapseDoc, dropdownDoc, footerDoc, forwardDoc, headerDoc, heroDoc, inputDoc, megamenuDoc, modalDoc, navscrollDoc, notificationDoc, overlayDoc, paginationDoc, popoverDoc, progressDoc, radioDoc, ratingDoc, sectionDoc, selectDoc, skiplinksDoc, stepperDoc, stickyDoc, tabsDoc, thumbnavDoc, timelineDoc, toggleDoc, toolbarDoc, tooltipDoc, transferDoc, uploadDoc, videoDoc];
export { accordionDoc, alertDoc, autocompleteDoc, avatarDoc, backDoc, backToTopDoc, badgeDoc, bottomNavDoc, breadcrumbsDoc, buttonDoc, calloutDoc, cardDoc, carouselDoc, checkboxDoc, chipDoc, collapseDoc, dropdownDoc, footerDoc, forwardDoc, headerDoc, heroDoc, inputDoc, megamenuDoc, modalDoc, navscrollDoc, notificationDoc, overlayDoc, paginationDoc, popoverDoc, progressDoc, radioDoc, ratingDoc, sectionDoc, selectDoc, skiplinksDoc, stepperDoc, stickyDoc, tabsDoc, thumbnavDoc, timelineDoc, toggleDoc, toolbarDoc, tooltipDoc, transferDoc, uploadDoc, videoDoc };

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
