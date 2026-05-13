declare module "html2pdf.js" {
  export type Html2PdfOptions = {
    margin?: number | [number, number, number, number];
    filename?: string;
    image?: { type?: string; quality?: number };
    html2canvas?: {
      scale?: number;
      useCORS?: boolean;
      logging?: boolean;
      onclone?: (clonedDoc: Document) => void;
    };
    jsPDF?: { unit?: string; format?: string | [number, number]; orientation?: string };
    pagebreak?: { mode?: string | string[] };
  };

  type Html2PdfChain = {
    set: (opt: Html2PdfOptions) => Html2PdfChain;
    from: (element: HTMLElement) => Html2PdfChain;
    save: () => Promise<void>;
  };

  function html2pdf(): Html2PdfChain;
  export default html2pdf;
}
