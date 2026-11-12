import { useEffect, useMemo, useRef, useState } from "react";
import { RadarChart } from "./components/RadarChart";
import { ReportSources } from "./components/ReportSources";
import { INSTRUMENT_VERSION, questions } from "./data/questions";
import { COPY_ADVIES_LECTORAAT, COPY_LEERGANG_TITEL, COPY_LEERGANG_UITLEG, COPY_NOTES_PLACEHOLDER, COPY_RESULTATEN_KADER, COPY_TIP_COLLEGAS } from "./data/instrumentCopy";
import {
  calculatePillars,
  calculateQuickActions,
  calculateScore,
  clearSession,
  getLowScoringQuestionEntries,
  loadSession,
  saveSession,
} from "./utils/assessment";
import { exportResultsPdf } from "./utils/exportResultsPdf";

function isSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

type ResultsPageProps = {
  onBack: () => void;
};

export function ResultsPage({ onBack }: ResultsPageProps) {
  const [restoredSession] = useState(() => loadSession());
  const isRestoringRef = useRef(true);
  const [organization, setOrganization] = useState(() => restoredSession?.organization ?? "");
  const [answers, setAnswers] = useState<Record<number, number>>(() => restoredSession?.answers ?? {});
  const [notes, setNotes] = useState(() => restoredSession?.notes ?? "");
  const [questionPageIndex, setQuestionPageIndex] = useState(() => restoredSession?.questionPageIndex ?? 0);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const pdfExportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    isRestoringRef.current = false;
  }, []);

  useEffect(() => {
    if (isRestoringRef.current) return;
    saveSession({ organization, answers, notes, questionPageIndex });
  }, [organization, answers, notes, questionPageIndex]);

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
  const safariDetected = useMemo(() => isSafari(), []);

  const handlePrint = () => {
    window.print();
  };

  const handleSavePdf = async () => {
    const root = pdfExportRef.current;
    if (!root || pdfBusy) return;
    setPdfBusy(true);
    setPdfError(null);
    try {
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const safeDate = printDate.replace(/\//g, "-").replace(/\s/g, "");
      const filename = `Morele-Lakmoesproef-resultaten-${safeDate}.pdf`;
      const result = await exportResultsPdf(root, filename);
      if (!result.ok) {
        setPdfError(result.message);
      }
    } catch (err) {
      console.error(err);
      const isTimeout = err instanceof Error && err.message === "PDF-timeout";
      setPdfError(
        isTimeout
          ? "PDF maken duurde te lang. Probeer 'Print resultaten' en kies 'Opslaan als PDF'."
          : "PDF maken mislukt in deze browser. Gebruik 'Print resultaten' → bestemming 'Opslaan als PDF'.",
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
    <main className="results-page min-h-screen bg-[#f1f3f4] text-slate-900">
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
            {!safariDetected && (
              <button
                type="button"
                onClick={() => void handleSavePdf()}
                disabled={pdfBusy}
                className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pdfBusy ? "PDF wordt gemaakt…" : "Opslaan als PDF"}
              </button>
            )}
          </div>
        </div>
        {safariDetected ? (
          <p className="mb-4 text-sm text-amber-700 print:hidden">
            <span className="font-semibold">Safari-tip:</span> gebruik{" "}
            <strong>Print resultaten</strong> → kies als printer{" "}
            <strong>Bewaar als PDF</strong> om het rapport op te slaan.
          </p>
        ) : (
          <p className="mb-4 max-w-2xl text-xs leading-relaxed text-slate-500 print:hidden">
            <span className="font-semibold text-slate-700">PDF:</span> het bestand wordt in uw browser gemaakt en
            gedownload (niets wordt naar een server gestuurd). Duurt het te lang? Gebruik dan{" "}
            <strong>Print resultaten</strong> en kies als printer <strong>Opslaan als PDF</strong>.
          </p>
        )}
        {pdfError ? (
          <p role="alert" className="mb-4 text-sm text-red-700 print:hidden">
            {pdfError}
          </p>
        ) : null}

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
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Uw overzicht</h1>
          <p className="mt-2 text-sm text-slate-600">
            Een momentopname van uw inschatting — bedoeld om over te praten, niet om te oordelen.
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
            <p className="text-sm font-semibold text-slate-700">Integriteitsscore</p>
            <p className="mt-1 text-xs text-slate-500">Samenvatting van uw 21 inschattingen (geen cijfer voor uw organisatie)</p>
            <p className="mt-1 text-4xl font-bold text-sky-700">{score}%</p>
            <div className="mt-4 flex justify-center">
              <RadarChart pillars={pillars} size={400} />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-800">Aandachtspunten voor gesprek</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Stellingen waar u 1, 2 of 3 scoorde — kansen om samen scherper te kijken, niet om te veroordelen.
            </p>
            {lowScores.length === 0 ? (
              <p className="mt-4 text-sm text-slate-600">
                Geen lage scores in dit overzicht — al uw stellingen scoren 4 of 5. Bespreek desondanks waar u
                verschilt van collega's.
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
                      Aandachtspunt — stelling {question.id} (score {value}/5)
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
          <p className="text-sm font-semibold text-slate-700">Drie prioriteiten voor gesprek</p>
          <p className="mt-1 text-xs text-slate-500">Gebaseerd op uw laagst ingeschatte clusters — bespreek met collega's of in uw team.</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
            {quickActions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
          <div className="mt-5 rounded-xl border border-violet-200 bg-violet-50 p-4 text-sm text-violet-900">
            <p className="font-semibold">Duiding en begeleiding</p>
            <p className="mt-1">{COPY_ADVIES_LECTORAAT}</p>
            <a
              href="https://www.fontys.nl/Onderzoek/Ethisch-werken.htm"
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block font-semibold underline"
            >
              Naar Fontys Lectoraat Ethisch Werken
            </a>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
            <p className="font-semibold text-slate-800">Vervolg</p>
            <p className="mt-1">{COPY_TIP_COLLEGAS}</p>
          </div>

          <details className="mt-5 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-700">
            <summary className="cursor-pointer font-semibold text-slate-800">{COPY_LEERGANG_TITEL}</summary>
            <p className="mt-3">{COPY_LEERGANG_UITLEG}</p>
          </details>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="block text-sm font-medium print:hidden">Eigen notities</label>
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={COPY_NOTES_PLACEHOLDER}
            data-pdf-hide
            className="mt-2 w-full resize-y rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none print:hidden"
          />
          <div data-pdf-print-only className="hidden">
            <p className="text-sm font-semibold text-slate-700">Ingevulde notities</p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
              {notes.trim().length > 0 ? notes : "Geen notities ingevuld."}
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

