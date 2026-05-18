import type { Html2PdfOptions } from "html2pdf.js";

type Html2PdfChain = {
  set: (opt: Html2PdfOptions) => Html2PdfChain;
  from: (element: HTMLElement) => Html2PdfChain;
  save: () => Promise<void>;
};

type Html2PdfFactory = () => Html2PdfChain;

/** html2pdf.js exporteert per bundler anders (default vs. genest). */
async function loadHtml2Pdf(): Promise<Html2PdfFactory> {
  const mod = await import("html2pdf.js");
  const candidate: unknown = mod.default ?? mod;
  if (typeof candidate === "function") return candidate as Html2PdfFactory;
  if (candidate && typeof candidate === "object" && "default" in candidate) {
    const nested = (candidate as { default: unknown }).default;
    if (typeof nested === "function") return nested as Html2PdfFactory;
  }
  throw new Error("html2pdf-module niet beschikbaar");
}

export function preparePdfClone(clonedDoc: Document) {
  clonedDoc.querySelectorAll("[data-pdf-cover]").forEach((node) => {
    const el = node as HTMLElement;
    el.style.setProperty("display", "block", "important");
    el.style.visibility = "visible";
  });
  clonedDoc.querySelectorAll("[data-pdf-hide]").forEach((node) => {
    (node as HTMLElement).style.setProperty("display", "none", "important");
  });
  clonedDoc.querySelectorAll("[data-pdf-expand]").forEach((node) => {
    const el = node as HTMLElement;
    el.style.maxHeight = "none";
    el.style.overflow = "visible";
  });
  clonedDoc.querySelectorAll("[data-pdf-print-only]").forEach((node) => {
    const el = node as HTMLElement;
    el.style.setProperty("display", "block", "important");
  });
  clonedDoc.querySelectorAll("[data-pdf-screen-only]").forEach((node) => {
    (node as HTMLElement).style.setProperty("display", "none", "important");
  });
}

function pickCanvasScale(element: HTMLElement): number {
  const height = element.scrollHeight || element.offsetHeight;
  // Browsers falen vaak boven ~16k px canvas; scale conservatief houden.
  if (height > 9000) return 1;
  if (height > 5500) return 1.25;
  return 1.5;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error("PDF-timeout")), ms);
    promise
      .then((value) => {
        window.clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        window.clearTimeout(timer);
        reject(err);
      });
  });
}

export type ExportPdfResult = { ok: true } | { ok: false; message: string };

export async function exportResultsPdf(
  root: HTMLElement,
  filename: string,
): Promise<ExportPdfResult> {
  const html2pdf = await loadHtml2Pdf();
  const scale = pickCanvasScale(root);

  await withTimeout(
    html2pdf()
      .set({
        margin: [10, 10, 14, 10],
        filename,
        image: { type: "jpeg", quality: 0.92 },
        html2canvas: {
          scale,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: "#ffffff",
          scrollX: 0,
          scrollY: -window.scrollY,
          windowWidth: root.scrollWidth,
          onclone: (clonedDoc) => preparePdfClone(clonedDoc),
        },
        pagebreak: { mode: ["css", "legacy"] },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(root)
      .save(),
    90_000,
  );

  return { ok: true };
}
