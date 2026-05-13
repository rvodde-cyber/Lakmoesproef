import type { Question } from "../data/questions";

export type Pillar = {
  label: string;
  avg: number;
};

const STORAGE_KEY = "organisatie-lakmoesproef-session-v1";

/**
 * Antwoorden op schaal 1–5. Scores **3 of lager** zijn expliciet **verbeterpunten**
 * (niet alleen “zwak”): ruimte om te versterken. Als referentie: ruwweg het gebied
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
  const labels = ["Shared Values", "Strategy", "Structure", "Systems", "Staff", "Style", "Skills"];
  return labels.map((label, index) => {
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
    if (item.label === "Shared Values") return "Plan een teamsessie waarin waarden worden vertaald naar concreet gedrag en besluitcriteria.";
    if (item.label === "Strategy") return "Toets lopende strategische keuzes op maatschappelijke impact en lange-termijn effecten.";
    if (item.label === "Structure") return "Herijk rollen en verantwoordelijkheden rond ethische besluitvorming in elke laag.";
    if (item.label === "Systems") return "Bouw een vaste cyclus voor signaleren, evalueren en opvolgen van ethische risico's.";
    if (item.label === "Staff") return "Start gerichte ontwikkeling op morele oordeelsvorming voor sleutelrollen.";
    if (item.label === "Style") return "Versterk psychologische veiligheid door structurele dialoog en zichtbaar voorbeeldgedrag.";
    return "Ontwikkel trainingsmodules op integriteit, aanspreekcultuur en professionele reflectie.";
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

  // Alleen scores 1 en 2 bepalen de kleurintensiteit.
  const lowShare = values.filter((v) => v === 1 || v === 2).length / n;
  const health = Math.max(0, Math.min(1, 1 - lowShare));
  const hue = 6 + health * 142;
  const sat = 58 + health * 22;
  const light = 34 + health * 16;
  const liquidColor = `hsl(${Math.round(hue)}, ${Math.round(sat)}%, ${Math.round(light)}%)`;
  let statusLabel = "Enkele scores 1 of 2 tussen de andere antwoorden — het buisje is een momentopname, geen eindoordeel.";
  if (lowShare === 0) {
    statusLabel = "Nog geen scores 1 of 2 — het buisje blijft in het gunstige groene gebied (alleen 1 en 2 beïnvloeden de kleur).";
  } else if (lowShare >= 0.35) {
    statusLabel = "Relatief veel antwoorden 1 of 2 — het buisje kleurt roder (alleen deze scores tellen mee voor de lakmoeskleur).";
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
