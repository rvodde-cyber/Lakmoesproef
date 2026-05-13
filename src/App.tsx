import { useEffect, useMemo, useRef, useState } from "react";
import { QuestionCard } from "./components/QuestionCard";
import {
  COPY_INTRO_PERSOONLIJK,
  COPY_INTRO_VERTRAULIJK,
  COPY_SCORE_SCHAAL_UITLEG,
  COPY_STELLINGEN_INTRO,
} from "./data/instrumentCopy";
import {
  INSTRUMENT_VERSION,
  PAGE_CAPTIONS,
  PAGE_IMAGE_PATHS,
  QUESTIONS_PER_PAGE,
  questions,
} from "./data/questions";
import { LitmusTube } from "./LitmusTube";
import { PageIllustration } from "./PageIllustration";
import { calculateLitmus, chunkQuestions, clearSession, loadSession, saveSession } from "./utils/assessment";

type AppProps = {
  onOpenResults?: () => void;
};

export default function App({ onOpenResults = () => {} }: AppProps) {
  const [organization, setOrganization] = useState("");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [notes, setNotes] = useState("");
  const [started, setStarted] = useState(false);
  const [questionPageIndex, setQuestionPageIndex] = useState(0);
  const questionnaireRef = useRef<HTMLElement>(null);
  const isRestoringRef = useRef(true);

  const questionPages = useMemo(() => chunkQuestions(questions, QUESTIONS_PER_PAGE), []);

  const totalQuestionPages = questionPages.length;
  const currentQuestions = questionPages[questionPageIndex] ?? [];

  useEffect(() => {
    if (!started) return;
    questionnaireRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [questionPageIndex, started]);

  const completed = Object.keys(answers).length;
  const hasProgress = completed > 0;
  const isDone = completed === questions.length;
  const litmus = useMemo(() => calculateLitmus(answers, completed, questions.length), [answers, completed]);

  const handleReset = () => {
    setAnswers({});
    setNotes("");
    setOrganization("");
    setQuestionPageIndex(0);
    clearSession();
  };

  useEffect(() => {
    const saved = loadSession();
    if (saved) {
      setOrganization(saved.organization ?? "");
      setAnswers(saved.answers ?? {});
      setNotes(saved.notes ?? "");
      setQuestionPageIndex(saved.questionPageIndex ?? 0);
      if (Object.keys(saved.answers ?? {}).length > 0) {
        setStarted(true);
      }
    }
    isRestoringRef.current = false;
  }, []);

  useEffect(() => {
    if (isRestoringRef.current) return;
    saveSession({ organization, answers, notes, questionPageIndex });
  }, [organization, answers, notes, questionPageIndex]);

  return (
    <main className="min-h-screen bg-[#f1f3f4] text-slate-900">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <header className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:hidden">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">Organisatiescan</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">De Morele Lakmoesproef</h1>
          <p className="mt-2 text-sm text-slate-600">
            Scan uw organisatie en leg de basis voor een verbeterplan. Het gaat om uw persoonlijke inschatting van de
            morele gesteldheid van de organisatie; alleen u bepaalt of anderen het overzicht te zien krijgen. Deze
            meting is geïnspireerd op o.a. <em>De voorbeeldige organisatie</em> en inzichten uit ethisch
            organisatieonderzoek.
          </p>
          <input className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none md:max-w-md" placeholder="Organisatienaam (optioneel)" value={organization} onChange={(e) => setOrganization(e.target.value)} />
        </header>

        {!started && (
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:hidden">
            <div className="grid gap-8 md:grid-cols-[1.15fr_1fr]">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">De Morele Lakmoesproef</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Scan uw organisatie, visualiseer uw ethische landschap en vertaal inzichten direct naar verbeteracties.
                </p>
                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                  <p className="font-medium text-slate-800">Persoonlijk en vertrouwelijk</p>
                  <p className="mt-2">
                    <span className="font-semibold text-slate-800">a) </span>
                    {COPY_INTRO_PERSOONLIJK}
                  </p>
                  <p className="mt-2">
                    <span className="font-semibold text-slate-800">b) </span>
                    {COPY_INTRO_VERTRAULIJK}
                  </p>
                  <p className="mt-4 font-medium text-slate-800">Over de stellingen</p>
                  <p className="mt-2">{COPY_STELLINGEN_INTRO}</p>
                  <p className="mt-3 font-medium text-slate-800">De score 1 t/m 5</p>
                  <p className="mt-2">{COPY_SCORE_SCHAAL_UITLEG}</p>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-2xl text-violet-600">⚖️</p>
                    <p className="mt-1 text-sm font-semibold">7 dimensies</p>
                    <p className="mt-1 text-xs text-slate-500">Volledige analyse</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-2xl text-violet-600">🧠</p>
                    <p className="mt-1 text-sm font-semibold">Actieplan</p>
                    <p className="mt-1 text-xs text-slate-500">Van inzicht naar stap</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-2xl text-violet-600">📈</p>
                    <p className="mt-1 text-sm font-semibold">Visueel Inzicht</p>
                    <p className="mt-1 text-xs text-slate-500">Helder scorebeeld</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setQuestionPageIndex(0);
                    setStarted(true);
                  }}
                  className="mt-7 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95"
                >
                  Start inschatting
                </button>
                <p className="mt-5 text-xs text-slate-500">
                  Het Fontys lectoraat Ethisch Werken volgt de ontwikkeling van dit instrument en denkt graag mee over verbeterstappen.
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Bronvermelding volgens APA7 is opgenomen op de eindpagina.
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Instrumentversie: <span className="font-semibold">{INSTRUMENT_VERSION}</span>
                </p>
              </div>
              <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-gradient-to-b from-[#eef2f7] to-white p-4">
                <img
                  src="/organisatie-lakmoesproef-hero.jpg"
                  alt="Organisatie Lakmoesproef preview"
                  className="w-full max-w-[360px] rounded-2xl border border-slate-200 object-cover shadow-[0_14px_30px_rgba(15,23,42,0.14)]"
                />
              </div>
            </div>
          </section>
        )}

        {started && (
          <section ref={questionnaireRef} className="print:hidden">
            <details className="mb-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm print:hidden">
              <summary className="cursor-pointer font-semibold text-slate-800">
                Hoe de stellingen en scores werken
              </summary>
              <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 text-slate-600">
                <p>
                  <span className="font-semibold text-slate-800">a) </span>
                  {COPY_INTRO_PERSOONLIJK}
                </p>
                <p>
                  <span className="font-semibold text-slate-800">b) </span>
                  {COPY_INTRO_VERTRAULIJK}
                </p>
                <p>{COPY_STELLINGEN_INTRO}</p>
                <p>{COPY_SCORE_SCHAAL_UITLEG}</p>
              </div>
            </details>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
              <div className="space-y-3">
                {currentQuestions.map((question) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    selected={answers[question.id]}
                    onSelect={(value) => setAnswers((prev) => ({ ...prev, [question.id]: value }))}
                  />
                ))}
              </div>
              <aside className="space-y-4 lg:sticky lg:top-6">
                <LitmusTube
                  fillRatio={litmus.fillRatio}
                  liquidColor={litmus.liquidColor}
                  statusLabel={litmus.statusLabel}
                />
                <PageIllustration
                  imagePath={PAGE_IMAGE_PATHS[questionPageIndex] ?? PAGE_IMAGE_PATHS[0]}
                  caption={PAGE_CAPTIONS[questionPageIndex] ?? PAGE_CAPTIONS[0]}
                />
              </aside>
            </div>

            <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Vragenblok</p>
                <p className="text-sm font-semibold text-slate-900">
                  {questionPageIndex + 1} / {totalQuestionPages}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setQuestionPageIndex((p) => Math.max(0, p - 1))}
                  disabled={questionPageIndex === 0}
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 disabled:cursor-not-allowed disabled:opacity-40 hover:border-slate-400"
                >
                  Vorige
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setQuestionPageIndex((p) => Math.min(totalQuestionPages - 1, p + 1))
                  }
                  disabled={questionPageIndex >= totalQuestionPages - 1}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-800"
                >
                  Volgende
                </button>
              </div>
            </div>
          </section>
        )}

        {started && hasProgress && (
        <section className="report-section mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-600">Voortgang: {completed}/{questions.length}</p>
          <label className="mt-4 block text-sm font-medium print:hidden">Kernobservaties en verbeteracties</label>
          <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Welke 2-3 interventies hebben volgens u nu prioriteit?" className="mt-2 w-full resize-y rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none print:hidden" />
          <div className="mt-3 flex flex-wrap items-center gap-3 print:hidden">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:border-slate-400"
            >
              Sessie wissen
            </button>
            <p className="text-xs text-slate-500">
              Privacy: antwoorden worden lokaal in deze browser opgeslagen voor hervatten; er is geen serveropslag.
              Alleen u ziet dit rapport, tenzij u het zelf deelt of erover afspreekt.
            </p>
          </div>
          {isDone && (
            <div className="mt-6 rounded-2xl border border-violet-100 bg-violet-50/80 p-5 print:hidden">
              <p className="text-sm font-semibold text-slate-900">Klaar voor het overzicht</p>
              <p className="mt-1 text-sm text-slate-600">
                Scorecard, overzicht met <strong>verbeterpunten</strong> (scores 1–3) en vervolgadvies vindt u op de
                resultatenpagina.
              </p>
              <button
                type="button"
                onClick={onOpenResults}
                className="mt-4 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                Bekijk uw resultaten
              </button>
            </div>
          )}
        </section>
        )}
      </div>
    </main>
  );
}
