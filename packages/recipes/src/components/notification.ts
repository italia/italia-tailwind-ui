import { icon, type IconName } from "../icons";
import { cx, type ComponentDoc } from "../types";
import { buttonClass } from "./button";

export type NotificationVariant = "default" | "success" | "error" | "info" | "warning";
export type NotificationPosition = "top-start" | "top-center" | "top-end" | "bottom-start" | "bottom-center" | "bottom-end";

export interface NotificationArgs {
  id?: string;
  title?: string;
  /** Optional line under the title. */
  text?: string;
  variant?: NotificationVariant;
  /** Icon before the title; defaults per variant, false for none. */
  icon?: IconName | false;
  dismissible?: boolean;
  closeLabel?: string;
  /**
   * Where it opens. Without a position the notification is rendered in place;
   * with one it is a manual popover shown by `notificationTrigger()`.
   */
  position?: NotificationPosition;
}

// Literal class maps: Tailwind only sees classes written out in full.
const bar: Record<NotificationVariant, string> = {
  default: "border-s-primary",
  success: "border-s-success",
  error: "border-s-error",
  info: "border-s-info",
  warning: "border-s-warning",
};
const tint: Record<NotificationVariant, string> = {
  default: "text-primary",
  success: "text-success",
  error: "text-error",
  info: "text-info",
  warning: "text-warning",
};
const defaultIcon: Record<NotificationVariant, IconName | undefined> = {
  default: undefined,
  success: "it-check-circle",
  error: "it-close-circle",
  info: "it-info-circle",
  warning: "it-warning-circle",
};
const positions: Record<NotificationPosition, string> = {
  "top-start": "toast-top toast-start",
  "top-center": "toast-top toast-center",
  "top-end": "toast-top toast-end",
  "bottom-start": "toast-bottom toast-start",
  "bottom-center": "toast-bottom toast-center",
  "bottom-end": "toast-bottom toast-end",
};

let counter = 0;

export function notification(a: NotificationArgs = {}): string {
  const { title = "Notifica", variant = "default", closeLabel = "Chiudi notifica" } = a;
  const id = a.id ?? `notification-${++counter}`;
  const ic = a.icon === false ? undefined : (a.icon ?? defaultIcon[variant]);
  const titleId = `${id}-title`;
  const popover = Boolean(a.position);

  // In place: a checkbox hides it (has-checked:hidden). As a popover: a
  // button with popovertargetaction="hide".
  const close = !a.dismissible
    ? ""
    : popover
      ? `<button type="button" class="btn btn-ghost btn-sm btn-square text-base-content/70 hover:text-base-content" popovertarget="${id}" popovertargetaction="hide" aria-label="${closeLabel}">${icon("it-close", "size-6")}</button>`
      : `<label class="btn btn-ghost btn-sm btn-square text-base-content/70 hover:text-base-content has-focus-visible:ring-2 has-focus-visible:ring-base-content has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-base-100"><input type="checkbox" class="sr-only"><span class="sr-only">${closeLabel}</span>${icon("it-close", "size-6")}</label>`;

  const card = cx(
    "alert w-full max-w-sm grid-cols-[1fr_auto] items-start gap-2 rounded-sm border-0 border-s-4 bg-base-100 p-4 text-start text-base-content shadow-[0_8px_24px_rgb(0_0_0/0.15)] sm:grid-cols-[1fr_auto]",
    bar[variant],
    !popover && a.dismissible && "has-checked:hidden",
  );
  const body = `<div class="flex flex-col gap-1">
    <p id="${titleId}" class="flex items-center gap-2 text-lg font-semibold leading-tight">${ic ? icon(ic, cx("size-6 shrink-0", tint[variant])) : ""}<span>${title}</span></p>${
      a.text ? `\n    <p class="text-sm text-base-content/75">${a.text}</p>` : ""
    }
  </div>`;
  const role = variant === "error" || variant === "warning" ? "alert" : "status";

  if (!popover)
    return `<div role="${role}" aria-labelledby="${titleId}" class="${card}">
  ${body}${close ? `\n  ${close}` : ""}
</div>`;

  // The toast is the popover itself; daisyUI toast places it, and the
  // :not(:popover-open) rule restores the hidden state toast's display:flex overrides.
  return `<div id="${id}" popover="manual" role="${role}" aria-labelledby="${titleId}" class="${cx(
    "toast m-0 overflow-visible border-0 p-0 [&:not(:popover-open)]:hidden",
    positions[a.position!],
  )}">
  <div class="${card}">
  ${body}${close ? `\n  ${close}` : ""}
  </div>
</div>`;
}

/** The button that shows a positioned notification. */
export const notificationTrigger = (id: string, label: string) =>
  `<button type="button" class="${buttonClass({ outline: true, size: "xs" })}" popovertarget="${id}" popovertargetaction="show">${label}</button>`;

const stack = (items: string[]) => `<div class="flex flex-col gap-4">\n${items.join("\n")}\n</div>`;
const allPositions: NotificationPosition[] = ["top-start", "top-center", "top-end", "bottom-start", "bottom-center", "bottom-end"];

export const doc: ComponentDoc = {
  slug: "notification",
  name: "Notification",
  replaces: "<it-notification>",
  summary:
    "Notifiche brevi con titolo, icona e barra laterale colorata. Nel flusso della pagina, oppure in un angolo dello schermo come popover nativo posizionato da daisyUI toast.",
  daisy: ["alert", "toast", "toast-top", "toast-bottom", "toast-start", "toast-center", "toast-end", "btn-ghost", "btn-square"],
  cssOnly:
    "Le notifiche posizionate sono popover=\"manual\": le mostra un pulsante con popovertarget e le chiude un pulsante con popovertargetaction=\"hide\", senza script. La chiusura automatica dopo qualche secondo richiede JavaScript. Errori e avvisi usano role=alert, gli altri role=status.",
  examples: [
    {
      id: "varianti",
      title: "Varianti",
      html: stack([
        notification({ title: "Notifica di esempio", text: "Testo della notifica." }),
        notification({ variant: "success", title: "Domanda inviata", text: "Riceverai una conferma via email." }),
        notification({ variant: "error", title: "Pagamento non riuscito", text: "Controlla i dati della carta e riprova." }),
        notification({ variant: "info", title: "Manutenzione programmata", text: "Il servizio non sarà disponibile domenica dalle 8 alle 12." }),
        notification({ variant: "warning", title: "Sessione in scadenza", text: "Salva il modulo entro 5 minuti." }),
      ]),
    },
    {
      id: "solo-titolo",
      title: "Solo titolo",
      html: stack([
        notification({ variant: "success", title: "Modifiche salvate" }),
        notification({ title: "Senza icona", icon: false }),
      ]),
    },
    {
      id: "chiusura",
      title: "Con chiusura",
      description: "Premi la X: la notifica si nasconde solo con CSS.",
      html: stack([
        notification({ variant: "info", title: "Nuovo messaggio", text: "Hai un nuovo messaggio dall'ufficio tributi.", dismissible: true }),
        notification({ variant: "warning", title: "Documento in scadenza", dismissible: true }),
      ]),
    },
    {
      id: "posizioni",
      title: "Posizioni sullo schermo",
      description: "Ogni pulsante apre una notifica popover nell'angolo indicato; chiudila con la X.",
      html: `<div class="flex flex-wrap gap-3">
  ${allPositions.map((p) => notificationTrigger(`notifica-${p}`, p)).join("\n  ")}
</div>
${allPositions
  .map((p, i) =>
    notification({
      id: `notifica-${p}`,
      position: p,
      dismissible: true,
      variant: (["default", "success", "info", "warning", "error", "default"] as NotificationVariant[])[i],
      title: `Notifica ${p}`,
      text: "Aperta con popovertarget, senza JavaScript.",
    }),
  )
  .join("\n")}`,
    },
  ],
  snippets: [
    { title: "Chiusura automatica", lang: "js", description: "Mostra la notifica popover e la chiude dopo qualche secondo; il timer si ferma al passaggio del mouse e al focus.", code: `function notify(id, ms = 6000) {
  const el = document.getElementById(id);
  el.showPopover();
  let timer = setTimeout(() => el.hidePopover(), ms);
  const pause = () => clearTimeout(timer);
  const resume = () => (timer = setTimeout(() => el.hidePopover(), ms));
  el.addEventListener("mouseenter", pause);
  el.addEventListener("mouseleave", resume);
  el.addEventListener("focusin", pause);
  el.addEventListener("focusout", resume);
}
// notify("notifica-bottom-end");` },
    { title: "Notifiche in React", lang: "tsx", description: "Una coda di notifiche in una regione aria-live, con chiusura automatica.", code: `import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type Toast = { id: number; title: string; variant?: "success" | "error" | "info" | "warning" };
const Ctx = createContext<(t: Omit<Toast, "id">) => void>(() => {});
export const useNotify = () => useContext(Ctx);
const bar = { success: "border-s-success", error: "border-s-error", info: "border-s-info", warning: "border-s-warning" };

export function Notifications({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const notify = useCallback((t: Omit<Toast, "id">) => {
    const id = Date.now();
    setItems((xs) => [...xs, { ...t, id }]);
    setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 6000);
  }, []);
  return (
    <Ctx.Provider value={notify}>
      {children}
      <div className="toast toast-end" role="status" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={"alert w-full max-w-sm rounded-sm border-0 border-s-4 bg-base-100 shadow-lg " + (bar[t.variant ?? "info"])}>
            <p className="font-semibold">{t.title}</p>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}` },
  ],
};
