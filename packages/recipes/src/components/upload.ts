import { icon, type IconName } from "../icons";
import { cx, type ComponentDoc } from "../types";
import { fieldHint, fieldLabel, describedBy } from "./input";

export interface UploadArgs {
  id?: string;
  name?: string;
  label?: string;
  hint?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  size?: "sm" | "default" | "lg";
}

export interface UploadedFile {
  name: string;
  /** Human-readable size, e.g. "1,2 MB". */
  size: string;
  status?: "uploading" | "success" | "error";
  /** 0–100, for "uploading". */
  progress?: number;
  /** Error message, for "error". */
  message?: string;
}

// Literal class maps: Tailwind only sees classes written out in full.
const sizes = { sm: "file-input-sm", default: "", lg: "file-input-lg" } as const;

let counter = 0;

/** The native file input, styled by daisyUI file-input. */
export function upload(a: UploadArgs = {}): string {
  const { label = "Allega un documento", size = "default" } = a;
  const id = a.id ?? `upload-${++counter}`;
  const hintId = a.hint && `${id}-hint`;
  const attrs = cx(
    a.name && `name="${a.name}"`,
    a.accept && `accept="${a.accept}"`,
    a.multiple && "multiple",
    a.required && "required",
    a.disabled && "disabled",
  );
  return `<div class="w-full max-w-md">
  ${fieldLabel(id, label, { required: a.required })}
  <input type="file" id="${id}" class="${cx("file-input file-input-primary w-full", sizes[size])}"${attrs ? ` ${attrs}` : ""}${describedBy(hintId)}>${
    hintId ? `\n  ${fieldHint(hintId, a.hint!)}` : ""
  }
</div>`;
}

/**
 * Drag & drop area: the file input is stretched, transparent, over the whole
 * zone, so dropping a file anywhere on it is a native drop on the input. With
 * `required`, :valid tells CSS a file was chosen and the zone turns green.
 */
export function uploadDropzone(a: UploadArgs = {}): string {
  const { label = "Trascina qui i file", hint = "PDF o immagini, massimo 10 MB ciascuno" } = a;
  const id = a.id ?? `dropzone-${++counter}`;
  const attrs = cx(
    a.name && `name="${a.name}"`,
    a.accept && `accept="${a.accept}"`,
    a.multiple !== false && "multiple",
    a.required && "required",
    a.disabled && "disabled",
  );
  return `<div class="${cx(
    "group relative flex w-full max-w-xl flex-col items-center gap-2 rounded-box border-2 border-dashed border-base-content/30 bg-base-200 px-6 py-10 text-center transition-colors",
    "hover:border-primary hover:bg-primary/5 has-focus-visible:border-primary has-focus-visible:ring-2 has-focus-visible:ring-base-content has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-base-100",
    a.required && "has-valid:border-solid has-valid:border-success has-valid:bg-success/5",
    a.disabled && "pointer-events-none opacity-50",
  )}">
  ${icon("it-upload", cx("size-10 text-primary", a.required && "group-has-valid:hidden"))}${a.required ? icon("it-check-circle", "hidden size-10 text-success group-has-valid:block") : ""}
  <p class="text-lg font-semibold">${label}${a.required ? `<span class="hidden text-success group-has-valid:inline"> — file selezionato</span>` : ""}</p>
  <p class="text-base-content/80">oppure <span class="font-semibold text-primary underline underline-offset-2">selezionali dal dispositivo</span></p>
  <p id="${id}-hint" class="text-sm text-base-content/70">${hint}</p>
  <input type="file" id="${id}" class="absolute inset-0 cursor-pointer opacity-0" aria-label="${label}, oppure selezionali dal dispositivo" aria-describedby="${id}-hint"${attrs ? ` ${attrs}` : ""}>
</div>`;
}

const fileIcon = (name: string): IconName => {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "it-file-pdf";
  if (ext && ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "it-file-image";
  if (ext && ["doc", "docx", "odt"].includes(ext)) return "it-file-docx";
  if (ext && ["xls", "xlsx", "ods", "csv"].includes(ext)) return "it-file-xlsx";
  return "it-file";
};

/** The list of files already sent (or being sent), rendered by the server. */
export function uploadList(files: UploadedFile[], o: { formAction?: string } = {}): string {
  const row = (f: UploadedFile, i: number) => {
    const status = f.status ?? "success";
    const tail =
      status === "uploading"
        ? `<span class="text-sm text-base-content/70">${f.progress ?? 0}%</span>`
        : status === "success"
          ? `${icon("it-check-circle", "size-6 text-success")}<span class="sr-only">Caricato</span>`
          : `${icon("it-error", "size-6 text-error")}<span class="sr-only">Errore</span>`;
    const remove = `<button type="submit" name="elimina" value="${i}" formaction="${o.formAction ?? "#"}" class="btn btn-ghost btn-sm btn-square text-base-content/70 hover:text-error" aria-label="Elimina ${f.name}">${icon("it-delete", "size-5")}</button>`;
    return `<li class="${cx("flex flex-col gap-2 border-b border-base-content/15 py-3", status === "error" && "text-error")}">
      <div class="flex items-center gap-3">
        ${icon(fileIcon(f.name), cx("size-8 shrink-0", status === "error" ? "text-error" : "text-primary"))}
        <div class="min-w-0 flex-1">
          <p class="truncate font-semibold">${f.name}</p>
          <p class="${cx("text-sm", status === "error" ? "text-error" : "text-base-content/70")}">${status === "error" ? (f.message ?? "Caricamento non riuscito") : f.size}</p>
        </div>
        ${tail}
        ${remove}
      </div>${
        status === "uploading"
          ? `\n      <progress class="progress progress-primary h-1 w-full bg-base-300" value="${f.progress ?? 0}" max="100" aria-label="Caricamento di ${f.name}"></progress>`
          : ""
      }
    </li>`;
  };
  return `<ul class="w-full max-w-xl border-t border-base-content/15" aria-label="File allegati">
    ${files.map(row).join("\n    ")}
  </ul>`;
}

/** Avatar photo with a "change" button that is the file input's label. */
export function uploadAvatar(o: { src?: string; id?: string } = {}): string {
  const id = o.id ?? `avatar-upload-${++counter}`;
  return `<div class="flex items-center gap-4">
  <span class="avatar"><span class="block size-20 overflow-hidden rounded-full bg-base-200">${
    o.src ? `<img src="${o.src}" alt="Foto del profilo attuale">` : icon("it-user", "m-5 size-10 text-base-content/50")
  }</span></span>
  <div class="flex flex-col gap-1">
    <label class="btn btn-outline btn-primary btn-sm border-2 font-semibold has-focus-visible:ring-2 has-focus-visible:ring-base-content has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-base-100"><input type="file" id="${id}" accept="image/*" class="sr-only">${icon("it-camera", "size-5")}Cambia foto</label>
    <p class="text-sm text-base-content/70">JPG o PNG, almeno 200×200 px</p>
  </div>
</div>`;
}

const listJs = `// Show the chosen files (name, size, image preview) under a file input or dropzone.
const fmt = (b) => (b < 1024 * 1024 ? \`\${Math.round(b / 1024)} KB\` : \`\${(b / 1024 / 1024).toFixed(1).replace(".", ",")} MB\`);
document.querySelectorAll("input[type=file][data-list]").forEach((input) => {
  const out = document.querySelector(input.dataset.list); // e.g. data-list="#chosen"
  input.addEventListener("change", () => {
    out.replaceChildren(...[...input.files].map((f) => {
      const li = document.createElement("li");
      li.className = "flex items-center gap-3 border-b border-base-content/15 py-3";
      if (f.type.startsWith("image/")) {
        const img = Object.assign(document.createElement("img"), { src: URL.createObjectURL(f), alt: "" });
        img.className = "size-12 rounded-sm object-cover";
        img.onload = () => URL.revokeObjectURL(img.src);
        li.append(img);
      }
      li.append(Object.assign(document.createElement("span"), { className: "flex-1 truncate font-semibold", textContent: f.name }));
      li.append(Object.assign(document.createElement("span"), { className: "text-sm text-base-content/70", textContent: fmt(f.size) }));
      return li;
    }));
  });
});`;

const dragJs = `// Highlight the dropzone while a file is dragged over it
// (CSS cannot see a drag in progress).
document.querySelectorAll("input[type=file].absolute").forEach((input) => {
  const zone = input.parentElement;
  const on = () => zone.classList.add("border-primary", "bg-primary/10");
  const off = () => zone.classList.remove("border-primary", "bg-primary/10");
  input.addEventListener("dragenter", on);
  input.addEventListener("dragleave", off);
  input.addEventListener("drop", off);
});`;

const progressJs = `// Upload with a real progress bar: fetch() has no upload progress, XHR does.
function uploadFile(file, url, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const body = new FormData();
    body.append("file", file);
    xhr.upload.addEventListener("progress", (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100)));
    xhr.addEventListener("load", () => (xhr.status < 300 ? resolve(xhr.response) : reject(new Error(xhr.statusText))));
    xhr.addEventListener("error", () => reject(new Error("Errore di rete")));
    xhr.open("POST", url);
    xhr.send(body);
  });
}
// usage: uploadFile(file, "/api/allegati", (p) => (progressEl.value = p));`;

const reactTsx = `import { useState, type DragEvent } from "react";

type Row = { file: File; progress: number; error?: string };

export function FileUpload({ url, accept }: { url: string; accept?: string }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [over, setOver] = useState(false);

  const send = (files: FileList | null) => {
    for (const file of files ?? []) {
      setRows((r) => [...r, { file, progress: 0 }]);
      const xhr = new XMLHttpRequest();
      const update = (patch: Partial<Row>) => setRows((r) => r.map((x) => (x.file === file ? { ...x, ...patch } : x)));
      xhr.upload.onprogress = (e) => update({ progress: Math.round((e.loaded / e.total) * 100) });
      xhr.onload = () => update(xhr.status < 300 ? { progress: 100 } : { error: "Caricamento non riuscito" });
      xhr.onerror = () => update({ error: "Errore di rete" });
      const body = new FormData();
      body.append("file", file);
      xhr.open("POST", url);
      xhr.send(body);
    }
  };
  const drag = (e: DragEvent, on: boolean) => { e.preventDefault(); setOver(on); };

  return (
    <div className="flex max-w-xl flex-col gap-4">
      <div onDragOver={(e) => drag(e, true)} onDragLeave={(e) => drag(e, false)}
           onDrop={(e) => { drag(e, false); send(e.dataTransfer.files); }}
           className={\`relative flex flex-col items-center gap-2 rounded-box border-2 border-dashed px-6 py-10 text-center \${over ? "border-primary bg-primary/10" : "border-base-content/30 bg-base-200"}\`}>
        <p className="text-lg font-semibold">Trascina qui i file</p>
        <p>oppure <span className="font-semibold text-primary underline">selezionali dal dispositivo</span></p>
        <input type="file" multiple accept={accept} aria-label="Scegli i file" className="absolute inset-0 cursor-pointer opacity-0"
               onChange={(e) => send(e.currentTarget.files)} />
      </div>
      <ul aria-label="File allegati" aria-live="polite">
        {rows.map(({ file, progress, error }) => (
          <li key={file.name + file.lastModified} className="border-b border-base-content/15 py-3">
            <p className="font-semibold">{file.name}</p>
            {error ? <p className="text-sm text-error">{error}</p>
                   : <progress className="progress progress-primary h-1 w-full" value={progress} max={100} aria-label={\`Caricamento di \${file.name}\`} />}
          </li>
        ))}
      </ul>
    </div>
  );
}`;

export const doc: ComponentDoc = {
  slug: "upload",
  name: "Upload",
  replaces: "<it-upload>",
  summary:
    "Caricamento di file: daisyUI file-input, un'area di trascinamento dove si rilasciano i file direttamente sul campo nativo, l'elenco dei file allegati con stato e avanzamento, e il cambio della foto profilo.",
  daisy: ["file-input", "file-input-primary", "progress", "avatar", "btn"],
  cssOnly:
    "L'area di trascinamento è il campo file stesso, trasparente e steso su tutta l'area: il rilascio di un file è un rilascio nativo sul campo, senza script. Con required, :valid dice al CSS che un file è stato scelto e l'area diventa verde. Elenco dei file scelti, anteprime, evidenziazione durante il trascinamento e invio con barra di avanzamento richiedono JavaScript: vedi sotto. L'elenco dei file già caricati è HTML reso dal server, e il cestino è un pulsante di invio.",
  examples: [
    {
      id: "base",
      title: "Campo file",
      html: `<div class="flex flex-col gap-6">
${upload({ hint: "Formato PDF, massimo 5 MB.", accept: ".pdf" })}
${upload({ label: "Allega più documenti", multiple: true, size: "sm" })}
${upload({ label: "Campo disabilitato", disabled: true })}
</div>`,
    },
    {
      id: "trascinamento",
      title: "Area di trascinamento",
      description: "Trascina un file sull'area o cliccala. La seconda è obbligatoria: dopo la scelta diventa verde, solo con CSS.",
      html: `<div class="flex flex-col gap-6">
${uploadDropzone()}
${uploadDropzone({ label: "Trascina qui il documento d'identità", hint: "Obbligatorio. PDF o JPG, massimo 5 MB", required: true, multiple: false, accept: ".pdf,.jpg,.jpeg" })}
</div>`,
    },
    {
      id: "elenco",
      title: "Elenco dei file",
      html: uploadList([
        { name: "carta-identita.pdf", size: "1,2 MB" },
        { name: "planimetria.png", size: "3,4 MB", status: "uploading", progress: 64 },
        { name: "delega-firmata.docx", size: "250 KB", status: "error", message: "Formato non ammesso: usa PDF" },
        { name: "ricevuta-pagamento.pdf", size: "180 KB" },
      ]),
    },
    { id: "avatar", title: "Foto del profilo", html: uploadAvatar({ src: "https://picsum.photos/id/64/200/200" }) },
  ],
  snippets: [
    { title: "Elenco e anteprime dei file scelti", lang: "js", description: 'Aggiungi data-list="#id-della-lista" al campo file.', code: listJs },
    { title: "Evidenziare l'area durante il trascinamento", lang: "js", code: dragJs },
    { title: "Invio con barra di avanzamento", lang: "js", code: progressJs },
    { title: "Componente React", lang: "tsx", code: reactTsx },
  ],
};
