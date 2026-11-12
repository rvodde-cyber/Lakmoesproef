import { useCallback, useEffect, useState } from "react";
import { PageShell } from "../components/PageShell";
import { createTeamSession, getTeamResults, TEAM_RESULTS_MINIMUM } from "../lib/teamSession";

type TeamFacilitatorPageProps = {
  onBack: () => void;
  onOpenResults: (code: string) => void;
};

export function TeamFacilitatorPage({ onBack, onOpenResults }: TeamFacilitatorPageProps) {
  const [code, setCode] = useState<string | null>(null);
  const [participantCount, setParticipantCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCount = useCallback(async (sessionCode: string) => {
    try {
      const results = await getTeamResults(sessionCode);
      if (results.exists) {
        setParticipantCount(results.participants);
      }
    } catch {
      /* voortgangspolling mag stil falen */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const sessionCode = await createTeamSession();
        if (cancelled) return;
        setCode(sessionCode);
        await refreshCount(sessionCode);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Sessie aanmaken mislukt");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [refreshCount]);

  useEffect(() => {
    if (!code) return;

    const interval = window.setInterval(() => {
      void refreshCount(code);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [code, refreshCount]);

  return (
    <PageShell
      eyebrow="Teamsessie"
      title="Begeleider"
      subtitle="Noteer de sessiecode voor het bord. Deelnemers vullen de scan individueel in. Het teamresultaat (groepsgemiddelden) is pas zichtbaar vanaf vijf deelnemers."
    >
      <div className="space-y-6">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:border-slate-400"
        >
          ← Terug
        </button>

        {loading ? (
          <p className="text-sm text-slate-600">Sessie wordt aangemaakt…</p>
        ) : error ? (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        ) : code ? (
          <>
            <div className="rounded-2xl border border-violet-200 bg-gradient-to-b from-violet-50 to-white p-8 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">Sessiecode</p>
              <p className="mt-3 font-mono text-6xl font-bold tracking-[0.2em] text-slate-900">{code}</p>
              <p className="mt-4 text-sm text-slate-600">
                Deelnemers kiezen &quot;Deelnemen aan teamsessie&quot; en voeren deze code in.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-800">Voortgang</p>
              <p className="mt-2 text-3xl font-bold text-sky-700">{participantCount}</p>
              <p className="mt-1 text-sm text-slate-600">
                {participantCount === 1 ? "deelnemer ingediend" : "deelnemers ingediend"}
              </p>
              <p className="mt-3 text-sm text-slate-600">
                Teamresultaat zichtbaar vanaf {TEAM_RESULTS_MINIMUM} deelnemers (nu: {participantCount}/
                {TEAM_RESULTS_MINIMUM}).
              </p>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                Er worden alleen zeven anonieme pijlerscores per deelnemer verstuurd — geen namen en geen antwoorden
                per stelling. Sessies worden na 30 dagen automatisch verwijderd.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenResults(code)}
              className="w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Open teamresultaten
            </button>
          </>
        ) : null}
      </div>
    </PageShell>
  );
}
