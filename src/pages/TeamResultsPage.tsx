import { useEffect, useMemo, useState } from "react";
import { RadarChart } from "../components/RadarChart";
import { PageShell } from "../components/PageShell";
import {
  aggregateTeamPillars,
  fetchTeamSession,
  teamScorePercent,
} from "../lib/teamSession";

type TeamResultsPageProps = {
  code: string;
  onBack: () => void;
};

export function TeamResultsPage({ code, onBack }: TeamResultsPageProps) {
  const [participantCount, setParticipantCount] = useState(0);
  const [submissions, setSubmissions] = useState<number[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      const session = await fetchTeamSession(code);
      if (!session) {
        setError("Sessie niet gevonden.");
        return;
      }
      setSubmissions(session.pillar_scores);
      setParticipantCount(session.pillar_scores.length);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kon teamresultaten niet laden.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
    const interval = window.setInterval(() => {
      void refresh();
    }, 4000);
    return () => window.clearInterval(interval);
  }, [code]);

  const pillars = useMemo(() => aggregateTeamPillars(submissions), [submissions]);
  const teamScore = useMemo(() => teamScorePercent(pillars), [pillars]);

  return (
    <PageShell
      eyebrow="Teamsessie"
      title="Teamresultaten"
      subtitle={`Sessie ${code} — gemiddelde pijlerscores van het team. Individuele scores zijn niet zichtbaar.`}
    >
      <button
        type="button"
        onClick={onBack}
        className="mb-6 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:border-slate-400"
      >
        ← Terug naar begeleider
      </button>

      {loading ? (
        <p className="text-sm text-slate-600">Teamresultaten laden…</p>
      ) : error ? (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : participantCount === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Nog geen deelnemers klaar. Wacht tot iemand de scan heeft afgerond.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-700">Teamscore</p>
              <p className="mt-2 text-4xl font-bold text-sky-700">{teamScore}%</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-700">Deelnemers</p>
              <p className="mt-2 text-4xl font-bold text-slate-900">{participantCount}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-sky-50 to-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-800">Teamprofiel (spinneweb)</p>
            <div className="mt-4 flex justify-center">
              <RadarChart pillars={pillars} size={400} />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-800">Gemiddelde per pijler</p>
            <ul className="mt-4 space-y-2">
              {pillars.map((pillar) => (
                <li
                  key={pillar.label}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm"
                >
                  <span className="font-medium text-slate-800">{pillar.label}</span>
                  <span className="font-semibold text-sky-800">{pillar.avg.toFixed(1)} / 5</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </PageShell>
  );
}
