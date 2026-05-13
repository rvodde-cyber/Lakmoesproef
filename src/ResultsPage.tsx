import { useEffect, useMemo, useRef, useState } from "react";
import { RadarChart } from "./components/RadarChart";
import { ReportSources } from "./components/ReportSources";
import { INSTRUMENT_VERSION, questions } from "./data/questions";
import { COPY_RESULTATEN_KADER } from "./data/instrumentCopy";
import {
  calculatePillars,
  calculateQuickActions,
  calculateScore,
  clearSession,
  getLowScoringQuestionEntries,
  loadSession,
  LOW_SCORE_MAX_ON_SCALE_5,
  saveSession,
} from "./utils/assessment";

type ResultsPageProps = {
  onBack: () => void;
};

function preparePdfClone(clonedDoc: Document) {
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
}

export function ResultsPage({ onBack }: ResultsPageProps) {
  const [hydrated, setHydrated] = useState(false);
  const [organization, setOrganization] = useState("");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [notes, setNotes] = useState("");
  const [questionPageIndex, setQuestionPageIndex] = useState(0);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const pdfExportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = loadSession();
    if (saved) {
      setOrganization(saved.organization ?? "");
      setAnswers(saved.answers ?? {});
      setNotes(saved.notes ?? "");
      setQuestionPageIndex(saved.questionPageIndex ?? 0);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveSession({ organization, answers, notes, questionPageIndex });
  }, [hydrated, organization, answers, notes, questionPageIndex]);

  const completed = Object.keys(answers).length;
  const isComplete = completed === questions.length;
  const score = useMemo(() => calculateScore(answers, questions.length), [answers]);
  const pillars = useMemo(() => calculatePillars(answers), [answers]);
  const quickActions = useMemo(() => (isComplete ? calculateQuickActions(pillars) : []), [isComplete, pillars]);
  const lowScores = useMemo(
    () => (isComplete ? getLowScoringQuestionEntries(answers, questions) : []),
    [answers, isComplete],
  );

  const printDate = useMemo(
    () =>
      new Intl.DateTimeFormat("nl-NL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date()),
    [],
  );

  const handlePrint = () => {
    window.print();
  };

  const handleSavePdf = async () => {
    const root = pdfExportRef.current;
    if (!root || pdfBusy) return;
    setPdfBusy(true);
    setPdfError(null);
    try {
      const { default: html2pdf } = await import("html2pdf.js");
      const safeDate = printDate.replace(/\//g, "-").replace(/\s/g, "");
      const filename = `Morele-Lakmoesproef-resultaten-${safeDate}.pdf`;
      await html2pdf()
        .set({
          margin: [12, 12, 16, 12],
          filename,
          image: { type: "jpeg", quality: 0.93 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false,
            onclone: (clonedDoc) => preparePdfClone(clonedDoc),
          },
          pagebreak: { mode: ["css", "legacy"] },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(root)
        .save();
    } catch (err) {
      console.error(err);
      setPdfError(
        "PDF maken mislukt in de browser. Gebruik dan ‘Print resultaten’ en kies bij de printer ‘Opslaan als PDF’.",
      );
    } finally {
      setPdfBusy(false);
    }
  };

  const handleReset = () => {
    clearSession();
    setAnswers({});
    setNotes("");
    setOrganization("");
    setQuestionPageIndex(0);
    onBack();
  };

  if (!isComplete) {
    return (
      <main className="min-h-screen bg-[#f1f3f4] text-slate-900 print:hidden">
        <div className="mx-auto max-w-lg px-6 py-16 text-center">
          <h1 className="text-xl font-semibold text-slate-900">Resultaten nog niet beschikbaar</h1>
          <p className="mt-3 text-sm text-slate-600">
            Vul eerst alle {questions.length} vragen in. Daarna kunt u hier uw scorecard en advies bekijken.
          </p>
          <button
            type="button"
            onClick={onBack}
            className="mt-8 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Terug naar de scan
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f1f3f4] text-slate-900">
      <div className="report-section mx-auto max-w-5xl px-6 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <button
            type="button"
            onClick={onBack}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:border-slate-400"
          >
            ← Terug naar de scan
          </button>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:border-slate-400"
            >
              Print resultaten
            </button>
            <button
              type="button"
              onClick={() => void handleSavePdf()}
              disabled={pdfBusy}
              className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pdfBusy ? "PDF wordt gemaakt…" : "Opslaan als PDF"}
            </button>
          </div>
        </div>
        {pdfError ? (
          <p role="alert" className="mb-4 text-sm text-red-700 print:hidden">
            {pdfError}
          </p>
        ) : null}
        <p className="mb-4 max-w-2xl text-xs leading-relaxed text-slate-500 print:hidden">
          <span className="font-semibold text-slate-700">PDF:</span> het bestand wordt in uw browser gemaakt en
          gedownload (niets wordt naar een server gestuurd). Bij een vol scherm kan dat enkele seconden duren.
        </p>

        <div ref={pdfExportRef} id="pdf-export-root" className="space-y-6">
          <div
            data-pdf-cover
            className="mb-6 hidden rounded-2xl border border-slate-300 bg-white p-6 print:block"
          >
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Rapport Morele Lakmoesproef</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            {organization.trim().length > 0 ? organization : "Organisatie (niet ingevuld)"}
          </h1>
          <div className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-4">
            <p>
              <span className="font-semibold">Datum:</span> {printDate}
            </p>
            <p>
              <span className="font-semibold">Versie:</span> {INSTRUMENT_VERSION}
            </p>
            <p>
              <span className="font-semibold">Score:</span> {score}%
            </p>
            <p>
              <span className="font-semibold">Voortgang:</span> {completed}/{questions.length}
            </p>
          </div>
        </div>

        <header className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:hidden">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">Resultaten</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Uw Lakmoes-overzicht</h1>
          <p className="mt-2 text-sm text-slate-600">
            Scorecard, verbeterpunten op basis van uw antwoorden, en concrete vervolgstappen.
          </p>
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
            <p className="font-medium text-slate-800">Wat zegt dit overzicht?</p>
            <p className="mt-2">{COPY_RESULTATEN_KADER}</p>
            <p className="mt-3 text-xs text-slate-500">
              Herhaling schaal: 1 = in uw ogen weinig aanwezig · 5 = sterk tot (bijna) ideaal — zo heeft u elke stelling
              beoordeeld; het totaalpercentage weegt al uw keuzes samen.
            </p>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-sky-50 to-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-700">Jouw Lakmoes Scorecard</p>
            <p className="mt-1 text-4xl font-bold text-sky-700">{score}%</p>
            <div className="mt-4 flex justify-center">
              <RadarChart pillars={pillars} size={400} />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-800">Verbeterpunten</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Vragen met score <strong>1, 2 of 3</strong> op de schaal 1–5: kansen om te versterken. Ter vergelijking:
              dat komt ruwweg overeen met <strong>7 of lager op 10</strong> bij een tiendelige schaal.
            </p>
            {lowScores.length === 0 ? (
              <p className="mt-4 text-sm text-slate-600">
                Geen verbeterpunten in dit overzicht: al uw scores liggen boven {LOW_SCORE_MAX_ON_SCALE_5}.
              </p>
            ) : (
              <ul
                data-pdf-expand
                className="mt-4 max-h-[min(520px,70vh)] space-y-3 overflow-y-auto pr-1"
              >
                {lowScores.map(({ question, value }) => (
                  <li
                    key={question.id}
                    className="rounded-xl border border-sky-200/90 bg-sky-50/70 px-4 py-3 text-sm text-slate-800"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-sky-900/85">
                      Verbeterpunt — vraag {question.id} (score {value}/5)
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">{question.title}</p>
                    <p className="mt-0.5 text-xs text-slate-600">{question.subtitle}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-700">Welke acties kun je nu meteen doen?</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
            {quickActions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
          <div className="mt-5 rounded-xl border border-violet-200 bg-violet-50 p-4 text-sm text-violet-900 print:hidden">
            <p className="font-semibold">Advies en ondersteuning</p>
            <p className="mt-1">
              Neem contact op met het Lectoraat Ethisch Werken van Fontys voor begeleiding bij het verbeteren van uw
              score.
            </p>
            <a
              href="https://www.fontys.nl/Onderzoek/Ethisch-werken.htm"
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block font-semibold underline"
            >
              Naar Fontys Lectoraat Ethisch Werken
            </a>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="block text-sm font-medium print:hidden">Kernobservaties en verbeteracties</label>
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Welke 2-3 interventies hebben volgens u nu prioriteit?"
            className="mt-2 w-full resize-y rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none print:hidden"
          />
          <div className="hidden print:block">
            <p className="text-sm font-semibold text-slate-700">Ingevulde interventies</p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
              {notes.trim().length > 0 ? notes : "Geen interventies ingevuld."}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4 print:hidden" data-pdf-hide>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:border-slate-400"
          >
            Sessie wissen
          </button>
          <p className="text-xs text-slate-500">
            Privacy: antwoorden worden lokaal in deze browser opgeslagen; er is geen serveropslag. Alleen u ziet dit
            rapport, tenzij u het zelf deelt of erover afspreekt.
          </p>
        </div>

        <div className="mt-8 print:mt-4">
          <ReportSources />
        </div>
        </div>
      </div>
    </main>
  );
}
