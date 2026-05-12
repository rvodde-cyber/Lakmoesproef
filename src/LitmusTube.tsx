import { useId } from "react";

type LitmusTubeProps = {
  /** 0–1: hoeveel van de vragenlijst is ingevuld */
  fillRatio: number;
  /** vloeistofkleur (CSS), afgeleid van scores */
  liquidColor: string;
  /** korte toelichting voor screenreaders / microcopy */
  statusLabel: string;
};

/**
 * Reageerbuis-metafoor: vloeistof stijgt mee met voortgang;
 * kleur verschuift richting rood naarmate het aandeel antwoorden **1 of 2** stijgt (3–5 tellen niet mee).
 */
export function LitmusTube({ fillRatio, liquidColor, statusLabel }: LitmusTubeProps) {
  const clipId = useId().replace(/:/g, "");
  const innerTop = 32;
  const innerH = 148;
  const fillH =
    fillRatio <= 0 ? 0 : Math.max(10, innerH * Math.min(1, Math.max(0, fillRatio)));
  const fillY = innerTop + innerH - fillH;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <p className="text-center text-xs font-semibold uppercase tracking-wide text-slate-500">Lakmoes tot nu toe</p>
      <div className="relative mx-auto mt-2 w-[100px]" role="img" aria-label={statusLabel}>
        <svg viewBox="0 0 100 200" className="mx-auto block h-[200px] w-[100px]">
          <defs>
            <clipPath id={clipId}>
              <rect x="26" y={innerTop} width="48" height={innerH} rx="22" />
            </clipPath>
          </defs>
          {/* Buis (glas) */}
          <rect
            x="24"
            y={innerTop - 2}
            width="52"
            height={innerH + 4}
            rx="24"
            fill="rgba(241,245,249,0.5)"
            stroke="#cbd5e1"
            strokeWidth="2"
          />
          {/* Vloeistof */}
          <g clipPath={`url(#${clipId})`}>
            <rect x="26" y={fillY} width="48" height={fillH} fill={liquidColor} className="transition-all duration-500 ease-out" />
            <ellipse cx="50" cy={fillY + 4} rx="20" ry="5" fill="white" opacity="0.22" />
          </g>
          {/* Strip (lakmoes): gekleurde zone volgt vloeistof */}
          <line x1="50" y1="18" x2="50" y2={innerTop + innerH - 8} stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
          {fillRatio > 0 && (
            <line
              x1="50"
              y1={Math.max(22, fillY + 6)}
              x2="50"
              y2={Math.min(fillY + fillH * 0.88, innerTop + innerH - 10)}
              stroke={liquidColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              className="transition-all duration-500"
              opacity="0.95"
            />
          )}
          {/* Mondstuk */}
          <rect x="40" y="10" width="20" height="14" rx="4" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
        </svg>
      </div>
      <p className="mt-1 text-center text-xs leading-snug text-slate-600">{statusLabel}</p>
    </div>
  );
}
