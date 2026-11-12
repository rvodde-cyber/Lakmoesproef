import { useEffect, useMemo, useRef, useState } from "react";

import { QuestionCard } from "./components/QuestionCard";
import {
  PAGE_CAPTIONS,
  PAGE_IMAGE_PATHS,
  QUESTIONS_PER_PAGE,
  questions,
} from "./data/questions";
import {
  COPY_INTRO_PERSOONLIJK,
  COPY_INTRO_VERTRAULIJK,
  COPY_INTRO_WAT_IS_HET,
  COPY_NOTES_PLACEHOLDER,
  COPY_SCORE_SCHAAL_UITLEG,
  COPY_STELLINGEN_INTRO,
} from "./data/instrumentCopy";

import { LitmusTube } from "./LitmusTube";
import { PageIllustration } from "./PageIllustration";

import {
  calculateLitmus,
  calculatePillars,
  chunkQuestions,
  loadSession,
  saveSession,
} from "./utils/assessment";
import { pillarsToScores, saveTeamContext, submitPillarScores } from "./lib/teamSession";

type AppProps = {
  mode?: "individual" | "team";
  teamCode?: string;
  onOpenResults?: () => void;
};

export default function App({
  mode = "individual",
  teamCode,
  onOpenResults = () => {},
}: AppProps) {
  const [restoredSession] = useState(() => loadSession());
  const [organization, setOrganization] = useState(() => restoredSession?.organization ?? "");
  const [answers, setAnswers] = useState<Record<number, number>>(() => restoredSession?.answers ?? {});
  const [notes, setNotes] = useState(() => restoredSession?.notes ?? "");
  const [started, setStarted] = useState(
    () => Object.keys(restoredSession?.answers ?? {}).length > 0,
  );
  const [questionPageIndex, setQuestionPageIndex] = useState(() => restoredSession?.questionPageIndex ?? 0);
  const [teamSubmitting, setTeamSubmitting] = useState(false);
  const [teamSubmitError, setTeamSubmitError] = useState<string | null>(null);

  const isTeamMode = mode === "team" && Boolean(teamCode);

  const questionnaireRef = useRef<HTMLElement>(null);
  const isRestoringRef = useRef(true);

  const questionPages = useMemo(
    () => chunkQuestions(questions, QUESTIONS_PER_PAGE),
    []
  );

  const currentQuestions = questionPages[questionPageIndex] ?? [];
  const totalPages = questionPages.length;

  useEffect(() => {
    if (!started) return;
    questionnaireRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [questionPageIndex, started]);

  const completed = Object.keys(answers).length;
  const hasProgress = completed > 0;
  const isDone = completed === questions.length;

  const litmus = useMemo(
    () => calculateLitmus(answers, completed, questions.length),
    [answers, completed],
  );

  const handleTeamSubmit = async () => {
    if (!teamCode || teamSubmitting) return;

    setTeamSubmitting(true);
    setTeamSubmitError(null);

    try {
      const pillars = calculatePillars(answers);
      const scores = pillarsToScores(pillars);
      await submitPillarScores(teamCode, scores);
      saveTeamContext({ code: teamCode, submitted: true });
      onOpenResults();
    } catch (err) {
      setTeamSubmitError(err instanceof Error ? err.message : "Indienen mislukt. Probeer opnieuw.");
    } finally {
      setTeamSubmitting(false);
    }
  };

  useEffect(() => {
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
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">
            Organisatiescan
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            De Morele Lakmoesproef
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {isTeamMode
              ? `Teamsessie ${teamCode} — vul de scan individueel in. Alleen uw zeven pijlerscores worden anoniem verstuurd; het teamresultaat is vanaf vijf deelnemers zichtbaar.`
              : COPY_INTRO_WAT_IS_HET}
          </p>

          <input
            className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none"
            placeholder="Organisatienaam (optioneel, voor uw rapport)"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
          />
        </header>

        {!started && (
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:hidden">
            <p className="text-sm leading-relaxed text-slate-700">{COPY_STELLINGEN_INTRO}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{COPY_INTRO_PERSOONLIJK}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{COPY_SCORE_SCHAAL_UITLEG}</p>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">{COPY_INTRO_VERTRAULIJK}</p>

            <button
              type="button"
              onClick={() => {
                setQuestionPageIndex(0);
                setStarted(true);
              }}
              className="mt-7 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white hover:opacity-95"
            >
              Start de scan
            </button>
          </section>
        )}

        {started && (
          <section ref={questionnaireRef} className="print:hidden">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
              <p className="font-medium text-slate-800">
                Blok {questionPageIndex + 1} van {totalPages}
                <span className="ml-2 font-normal text-slate-500">
                  — {PAGE_CAPTIONS[questionPageIndex]}
                </span>
              </p>
              <p className="text-slate-600">
                {completed}/{questions.length} ingevuld
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <div className="space-y-3">
                {currentQuestions.map((question) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    selected={answers[question.id]}
                    onSelect={(value) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [question.id]: value,
                      }))
                    }
                  />
                ))}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    disabled={questionPageIndex === 0}
                    onClick={() => setQuestionPageIndex((i) => i - 1)}
                    className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 disabled:cursor-not-allowed disabled:opacity-40 hover:border-slate-400"
                  >
                    ← Vorige
                  </button>
                  {questionPageIndex < totalPages - 1 ? (
                    <button
                      type="button"
                      onClick={() => setQuestionPageIndex((i) => i + 1)}
                      className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Volgende →
                    </button>
                  ) : (
                    <p className="text-xs text-slate-500">
                      {isDone
                        ? "Alle stellingen ingevuld — bekijk hieronder uw resultaat."
                        : "Vul alle stellingen in om uw overzicht te zien."}
                    </p>
                  )}
                </div>
              </div>

              <aside className="space-y-4 lg:sticky lg:top-6">
                <LitmusTube
                  fillRatio={litmus.fillRatio}
                  liquidColor={litmus.liquidColor}
                  statusLabel={litmus.statusLabel}
                />

                <PageIllustration
                  imagePath={
                    PAGE_IMAGE_PATHS[questionPageIndex] ??
                    PAGE_IMAGE_PATHS[0]
                  }
                  caption={
                    PAGE_CAPTIONS[questionPageIndex] ??
                    PAGE_CAPTIONS[0]
                  }
                />
              </aside>
            </div>
          </section>
        )}

        {started && hasProgress && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm print:hidden">
            <label className="block text-sm font-medium text-slate-800">
              Eigen notities
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-2 w-full resize-y rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none"
              placeholder={COPY_NOTES_PLACEHOLDER}
            />

            {isDone && (
              <>
                {isTeamMode ? (
                  <>
                    <button
                      type="button"
                      onClick={() => void handleTeamSubmit()}
                      disabled={teamSubmitting}
                      className="mt-4 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {teamSubmitting ? "Scores worden ingediend…" : "Dien anonieme scores in"}
                    </button>
                    {teamSubmitError ? (
                      <p role="alert" className="mt-3 text-sm text-red-700">
                        {teamSubmitError}
                      </p>
                    ) : null}
                    <p className="mt-3 text-xs leading-relaxed text-slate-500">
                      U ontvangt geen individueel rapport. Alleen pijlergemiddelden gaan naar de begeleider — bespreek
                      het teambeeld plenair wanneer iedereen klaar is.
                    </p>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenResults}
                    className="mt-4 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white hover:opacity-95"
                  >
                    Bekijk uw overzicht
                  </button>
                )}
              </>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
