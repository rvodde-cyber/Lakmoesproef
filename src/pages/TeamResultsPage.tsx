import { useCallback, useEffect, useMemo, useState } from "react";
import { RadarChart } from "../components/RadarChart";
import { PageShell } from "../components/PageShell";
import {
  averagesToPillars,
  getTeamResults,
  teamScorePercent,
  type TeamResults,
} from "../lib/teamSession";

type TeamResultsPageProps = {
  code: string;
  onBack: () => void;
};

const SESSION_GONE =
  "Deze sessie bestaat niet (meer). Sessies worden na 30 dagen automatisch verwijderd.";

export function TeamResultsPage({ code, onBack }: TeamResultsPageProps) {
  const [results, setResults] = useState<TeamResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const data = await getTeamResults(code);
      setResults(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kon teamresultaten niet laden.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [code]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const data = await getTeamResults(code);
        if (cancelled) return;
        setResults(data);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Kon teamresultaten niet laden.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code]);

  const pillars = useMemo(() => {
    if (!results?.averages) return [];
    return averagesToPillars(results.averages);
  }, [results]);
  const teamScore = useMemo(() => teamScorePercent(pillars), [pillars]);

  const showAverages = Boolean(results?.exists && results.averages);

  return (
    <PageShell
      eyebrow="Teamsessie"
      title="Teamresultaten"
      subtitle={`Sessie ${code} — alleen groepsgemiddelden per pijler, vanaf minimaal ${results?.minimum ?? 5} deelnemers.`}
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
      ) : results && !results.exists ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
          {SESSION_GONE}
        </div>
      ) : results && !showAverages ? (
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-800">Deelnemers</p>
            <p className="mt-2 text-3xl font-bold text-sky-700">{results.participants}</p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50/80 p-6 text-sm leading-relaxed text-slate-700">
            <p>
              Er zijn nu {results.participants} van de minimaal {results.minimum} deelnemers. Zodra er{" "}
              {results.minimum} deelnemers zijn, verschijnt het teamresultaat. Dit waarborgt dat niemands
              individuele antwoorden herleidbaar zijn.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void refresh(true)}
            disabled={refreshing}
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {refreshing ? "Vernieuwen…" : "Vernieuwen"}
          </button>
        </div>
      ) : results && showAverages ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-700">Teamscore</p>
              <p className="mt-2 text-4xl font-bold text-sky-700">{teamScore}%</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-700">Deelnemers</p>
              <p className="mt-2 text-4xl font-bold text-slate-900">{results.participants}</p>
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

          <button
            type="button"
            onClick={() => void refresh(true)}
            disabled={refreshing}
            className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:border-slate-400 disabled:opacity-60"
          >
            {refreshing ? "Vernieuwen…" : "Vernieuwen"}
          </button>
        </div>
      ) : null}
    </PageShell>
  );
}
