import { useState, type FormEvent } from "react";
import { PageShell } from "../components/PageShell";
import { saveTeamContext, sessionExists } from "../lib/teamSession";

type TeamJoinPageProps = {
  onBack: () => void;
  onJoined: (code: string) => void;
};

export function TeamJoinPage({ onBack, onJoined }: TeamJoinPageProps) {
  const [digits, setDigits] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const code = digits.trim();

    if (!/^\d{4}$/.test(code)) {
      setError("Voer een geldige 4-cijferige code in.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const exists = await sessionExists(code);
      if (!exists) {
        setError("Deze sessiecode bestaat niet. Controleer de code bij uw begeleider.");
        return;
      }

      saveTeamContext({ code, submitted: false });
      onJoined(code);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kon niet verbinden met de sessie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      eyebrow="Teamsessie"
      title="Deelnemen"
      subtitle="Voer de 4-cijferige code in die de begeleider op het bord heeft gezet. U vult daarna de scan individueel in."
    >
      <button
        type="button"
        onClick={onBack}
        className="mb-6 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:border-slate-400"
      >
        ← Terug
      </button>

      <form onSubmit={(e) => void handleSubmit(e)} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <label htmlFor="team-code" className="block text-sm font-medium text-slate-800">
          Sessiecode
        </label>
        <input
          id="team-code"
          inputMode="numeric"
          pattern="\d{4}"
          maxLength={4}
          value={digits}
          onChange={(e) => setDigits(e.target.value.replace(/\D/g, "").slice(0, 4))}
          placeholder="bijv. 4829"
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-center font-mono text-3xl tracking-[0.3em] focus:border-violet-500 focus:outline-none"
          autoComplete="off"
        />

        {error ? (
          <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading || digits.length !== 4}
          className="mt-6 w-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Controleren…" : "Start scan"}
        </button>

        <p className="mt-4 text-xs leading-relaxed text-slate-500">
          Privacy: bij voltooiing worden alleen uw 7 pijlergemiddelden anoniem gedeeld. Individuele antwoorden blijven
          op uw apparaat en zijn niet zichtbaar voor de begeleider.
        </p>
      </form>
    </PageShell>
  );
}
