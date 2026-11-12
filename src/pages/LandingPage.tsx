import { useEffect } from "react";

const HERO_SRC = "/organisatie-lakmoesproef-hero.jpg";
const HERO_ALT =
  "Teststrip in een reageerbuis, als symbool voor het meten van ethische cultuur";

export function LandingPage() {
  useEffect(() => {
    document.title = "De Morele Lakmoesproef";
    return () => {
      document.title = "Organisatie Lakmoesproef";
    };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-[#f8f9fc] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-10 sm:px-8 lg:grid lg:max-w-none lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-12 lg:py-16">
        <div className="landing-enter order-2 flex flex-col items-start lg:order-1 lg:max-w-xl lg:justify-center xl:max-w-[36rem]">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">
            ORGANISATIESCAN
          </p>
          <h1 className="mt-3 text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-tight tracking-tight text-slate-900">
            De Morele Lakmoesproef
          </h1>
          <p className="mt-5 max-w-prose text-lg leading-relaxed text-slate-600 sm:text-[1.125rem]">
            Meet hoe de medewerkers van uw organisatie de ethische cultuur ervaren in ongeveer 10
            minuten.
          </p>
          <a
            href="/keuze"
            className="group mt-10 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-3 text-base font-semibold text-white shadow-sm transition hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            Start
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </a>
        </div>

        <div className="landing-enter order-1 mb-10 w-full lg:order-2 lg:mb-0">
          <div className="mx-auto w-full max-w-md lg:max-w-none">
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-2 shadow-[0_14px_30px_rgba(15,23,42,0.08)] sm:p-3">
              <img
                src={HERO_SRC}
                alt={HERO_ALT}
                width={1024}
                height={1024}
                loading="eager"
                className="max-h-[40vh] w-full rounded-xl object-cover object-center lg:max-h-[min(32rem,70vh)]"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
