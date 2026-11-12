import { PageShell } from "../components/PageShell";

type TeamSubmitDonePageProps = {
  code: string;
  onHome: () => void;
};

export function TeamSubmitDonePage({ code, onHome }: TeamSubmitDonePageProps) {
  return (
    <PageShell
      eyebrow="Teamsessie"
      title="Bedankt — scores ingediend"
      subtitle="Uw anonieme pijlergemiddelden zijn toegevoegd aan de teamsessie. De begeleider kan nu het gecombineerde teamprofiel bekijken."
    >
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-900">
        <p>
          Sessie <span className="font-mono font-semibold">{code}</span> — u ziet geen individueel rapport in
          teamsessie-modus. Bespreek de uitkomsten samen wanneer de begeleider het teamresultaat opent.
        </p>
      </div>

      <button
        type="button"
        onClick={onHome}
        className="mt-6 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
      >
        Terug naar start
      </button>
    </PageShell>
  );
}
