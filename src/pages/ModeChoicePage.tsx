import { PageShell } from "../components/PageShell";
import { isSupabaseConfigured } from "../lib/supabase";
import {
  COPY_INTRO_VERTRAULIJK,
  COPY_INTRO_WAT_IS_HET,
  COPY_LEERGANG_TITEL,
  COPY_LEERGANG_UITLEG,
} from "../data/instrumentCopy";

const COPY_MODE_CHOICE_SUBTITLE =
  "Meet hoe de medewerkers van uw organisatie de ethische cultuur ervaren in ongeveer 10 minuten.";

type ModeChoicePageProps = {
  onIndividual: () => void;
  onTeamFacilitator: () => void;
  onTeamJoin: () => void;
};

export function ModeChoicePage({ onIndividual, onTeamFacilitator, onTeamJoin }: ModeChoicePageProps) {
  const supabaseReady = isSupabaseConfigured();

  return (
    <PageShell
      eyebrow="Organisatiescan"
      title="De Morele Lakmoesproef"
      subtitle={COPY_MODE_CHOICE_SUBTITLE}
    >
      <div className="mb-6 rounded-2xl border border-violet-100 bg-violet-50/60 p-5 text-sm leading-relaxed text-slate-700">
        <p>{COPY_INTRO_WAT_IS_HET}</p>
        <p className="mt-3 text-xs text-slate-500">{COPY_INTRO_VERTRAULIJK}</p>
      </div>

      <details className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <summary className="cursor-pointer text-sm font-semibold text-slate-800">{COPY_LEERGANG_TITEL}</summary>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{COPY_LEERGANG_UITLEG}</p>
      </details>

      <div className="space-y-4">
        <button
          type="button"
          onClick={onIndividual}
          className="w-full rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-violet-300 hover:shadow-md"
        >
          <p className="text-lg font-semibold text-slate-900">Individueel</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Vul de scan alleen in en ontvang een persoonlijk overzicht — integriteitsscore, radar over zeven
            clusters en drie prioriteiten voor gesprek. Ideaal om uitkomsten met collega's te vergelijken.
          </p>
        </button>

        {supabaseReady ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-lg font-semibold text-slate-900">Teamsessie</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Iedereen vult individueel in; alleen zeven pijlerscores worden gedeeld. De begeleider ziet pas vanaf
              vijf deelnemers anonieme groepsgemiddelden — geen namen en geen antwoorden per stelling.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={onTeamFacilitator}
                className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white"
              >
                Ik ben begeleider
              </button>
              <button
                type="button"
                onClick={onTeamJoin}
                className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:border-slate-400"
              >
                Deelnemen aan teamsessie
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </PageShell>
  );
}
