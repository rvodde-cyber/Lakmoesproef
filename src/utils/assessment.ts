import type { Question } from "../data/questions";

export type Pillar = {
  label: string;
  avg: number;
};

/** Leesbare clusternamen — geen 7S-jargon voor deelnemers. */
export const PILLAR_LABELS_NL = [
  "Waarden & visie",
  "Strategie & richting",
  "Structuur & rollen",
  "Systemen & opvolging",
  "Mensen & ontwikkeling",
  "Cultuur & veiligheid",
  "Moreel vakmanschap",
] as const;

const STORAGE_KEY = "organisatie-lakmoesproef-session-v1";

/**
 * Antwoorden op schaal 1–5. Scores **3 of lager** zijn expliciet **verbeterpunten**
 * (niet alleen "zwak"): ruimte om te versterken. Als referentie: ruwweg het gebied
 * tot en met **7 op 10** bij een tiendelige schaal.
 */
export const LOW_SCORE_MAX_ON_SCALE_5 = 3;

export type LowScoreEntry = { question: Question; value: number };

export function getLowScoringQuestionEntries(
  answers: Record<number, number>,
  allQuestions: Question[],
  maxInclusive: number = LOW_SCORE_MAX_ON_SCALE_5,
): LowScoreEntry[] {
  return allQuestions
    .map((q) => ({ question: q, value: answers[q.id] }))
    .filter((row): row is LowScoreEntry => typeof row.value === "number" && row.value <= maxInclusive)
    .sort((a, b) => a.value - b.value || a.question.id - b.question.id);
}

export function chunkQuestions(items: Question[], pageSize: number): Question[][] {
  const pages: Question[][] = [];
  for (let i = 0; i < items.length; i += pageSize) {
    pages.push(items.slice(i, i + pageSize));
  }
  return pages;
}

export function calculateScore(answers: Record<number, number>, totalQuestions: number): number {
  const values = Object.values(answers);
  if (values.length !== totalQuestions) return 0;
  const total = values.reduce((sum, current) => sum + current, 0);
  return Math.round((total / (totalQuestions * 5)) * 100);
}

export function calculatePillars(answers: Record<number, number>): Pillar[] {
  return PILLAR_LABELS_NL.map((label, index) => {
    const start = index * 3 + 1;
    const ids = [start, start + 1, start + 2];
    const values = ids.map((id) => answers[id]).filter((v): v is number => typeof v === "number");
    const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    return { label, avg };
  });
}

export function calculateQuickActions(pillars: Pillar[]): string[] {
  const lowest = [...pillars].sort((a, b) => a.avg - b.avg).slice(0, 3);
  return lowest.map((item) => {
    if (item.label === "Waarden & visie")
      return "Waarden & visie — bespreek: welke waarden zijn in de praktijk zichtbaar, en waar wringt het?";
    if (item.label === "Strategie & richting")
      return "Strategie & richting — bespreek: welke keuzes wegen maatschappelijke impact écht mee?";
    if (item.label === "Structuur & rollen")
      return "Structuur & rollen — bespreek: wie draagt verantwoordelijkheid voor ethische kwaliteit, en is dat helder?";
    if (item.label === "Systemen & opvolging")
      return "Systemen & opvolging — bespreek: wat gebeurt er met signalen en meldingen in de praktijk?";
    if (item.label === "Mensen & ontwikkeling")
      return "Mensen & ontwikkeling — bespreek: waar is ruimte om moreel oordeelsvermogen te oefenen?";
    if (item.label === "Cultuur & veiligheid")
      return "Cultuur & veiligheid — bespreek: voelen mensen zich vrij genoeg om twijfel en zorgen te benoemen?";
    return "Moreel vakmanschap — bespreek: hoe wordt ethisch handelen geleerd, geoefend en voorgeleefd?";
  });
}

export function calculateLitmus(
  answers: Record<number, number>,
  completed: number,
  totalQuestions: number,
): { fillRatio: number; liquidColor: string; statusLabel: string } {
  const values = Object.values(answers);
  const n = values.length;
  const fillRatio = completed / totalQuestions;

  if (n === 0) {
    return {
      fillRatio,
      liquidColor: "hsl(265, 16%, 90%)",
      statusLabel: "Nog geen antwoorden — de vloeistof vult en kleurt mee terwijl u invult.",
    };
  }

  const avg = values.reduce((a, b) => a + b, 0) / n;
  const health = (avg - 1) / 4;
  const hue = Math.round(6 + health * 142);
  const sat = Math.round(65 + health * 15);
  const light = Math.round(36 + health * 14);
  const liquidColor = `hsl(${hue}, ${sat}%, ${light}%)`;
  const avgLabel = avg.toFixed(1);
  let statusLabel: string;
  if (avg <= 2.0) {
    statusLabel = `Gemiddelde ${avgLabel}/5 — rood: u ziet op meerdere punten weinig van wat beschreven staat.`;
  } else if (avg <= 3.0) {
    statusLabel = `Gemiddelde ${avgLabel}/5 — oranje: deels aanwezig, met duidelijke aandachtspunten.`;
  } else if (avg <= 4.0) {
    statusLabel = `Gemiddelde ${avgLabel}/5 — geel-groen: veel herkenbaar, met enkele kansen om te versterken.`;
  } else {
    statusLabel = `Gemiddelde ${avgLabel}/5 — groen: u ervaart veel van wat beschreven staat als sterk aanwezig.`;
  }

  return { fillRatio, liquidColor, statusLabel };
}

type SavedSession = {
  organization: string;
  answers: Record<number, number>;
  notes: string;
  questionPageIndex: number;
};

export function loadSession(): SavedSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SavedSession;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveSession(session: SavedSession): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

