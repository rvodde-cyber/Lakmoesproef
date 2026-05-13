export function ReportSources() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm font-semibold text-slate-800">Bronnenlijst (APA7)</p>
      <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
        <li>
          Ellemers, N., &amp; De Gilder, D. (2022). <em>De voorbeeldige organisatie: Een bereikbaar ideaal</em>. Managementboek.
        </li>
        <li>
          Fontys Hogeschool. (z.d.). <em>Lectoraat Ethisch werken</em>.
          <a
            href="https://www.fontys.nl/Onderzoek/Ethisch-werken.htm"
            target="_blank"
            rel="noreferrer"
            className="ml-1 underline"
          >
            https://www.fontys.nl/Onderzoek/Ethisch-werken.htm
          </a>
        </li>
        <li>
          Waterman, R. H., Peters, T. J., &amp; Phillips, J. R. (1980). Structure is not organization.{" "}
          <em>Business Horizons, 23</em>(3), 14-26.
        </li>
        <li>
          Peters, T. J., &amp; Waterman, R. H. (1982). <em>In search of excellence</em>. Harper &amp; Row.
        </li>
        <li>
          Edmondson, A. C. (2019). <em>The fearless organization: Creating psychological safety in the workplace for learning, innovation, and growth</em>. Wiley.
        </li>
        <li>
          Trevino, L. K., &amp; Nelson, K. A. (2021). <em>Managing business ethics: Straight talk about how to do it right</em> (8th ed.). Wiley.
        </li>
        <li>
          Kaptein, M. (2011). Toward effective codes: Testing the relationship with unethical behavior.{" "}
          <em>Journal of Business Ethics, 99</em>(2), 233-251.
        </li>
        <li>
          Schein, E. H., &amp; Schein, P. A. (2017). <em>Organizational culture and leadership</em> (5th ed.). Wiley.
        </li>
      </ul>
    </div>
  );
}
