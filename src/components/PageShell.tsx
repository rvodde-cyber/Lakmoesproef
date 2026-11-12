import type { ReactNode } from "react";
import { isSupabaseConfigured } from "../lib/supabase";

type PageShellProps = {
  children: ReactNode;
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export function PageShell({ children, eyebrow, title, subtitle }: PageShellProps) {
  const supabaseReady = isSupabaseConfigured();

  return (
    <main className="min-h-screen bg-[#f1f3f4] text-slate-900">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <header className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">{eyebrow}</p>
          ) : null}
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">{title}</h1>
          {subtitle ? <p className="mt-3 text-sm leading-relaxed text-slate-600">{subtitle}</p> : null}
        </header>
        {children}
        <footer className="mt-10 text-center text-xs leading-relaxed text-slate-500">
          {supabaseReady
            ? "Individuele antwoorden blijven lokaal in uw browser. In teamsessies worden alleen geaggregeerde pijlerscores gedeeld via de beveiligde backend."
            : "Antwoorden blijven lokaal in uw browser."}
        </footer>
      </div>
    </main>
  );
}
