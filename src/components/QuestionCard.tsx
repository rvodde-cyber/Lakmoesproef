import type { Question } from "../data/questions";

type QuestionCardProps = {
  question: Question;
  selected?: number;
  onSelect: (value: number) => void;
};

export function QuestionCard({ question, selected, onSelect }: QuestionCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Vraag {question.id}</p>
      <h2 className="mt-1 text-xl font-semibold">{question.title}</h2>
      <p className="text-sm font-medium text-teal-700">{question.subtitle}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{question.explanation}</p>

      <div className="mt-4" role="radiogroup" aria-label={`Score voor vraag ${question.id}: ${question.title}`}>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((n) => {
            const isSelected = selected === n;
            return (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onSelect(n)}
                className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${isSelected ? "border-teal-600 bg-teal-50 text-teal-900" : "border-slate-300 bg-white hover:border-slate-400"}`}
              >
                {n}
              </button>
            );
          })}
        </div>
      </div>
    </article>
  );
}
