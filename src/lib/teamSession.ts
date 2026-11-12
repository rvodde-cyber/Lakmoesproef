import type { Pillar } from "../utils/assessment";
import { PILLAR_LABELS_NL } from "../utils/assessment";
import { getSupabase, isSupabaseConfigured } from "./supabase";

export const PILLAR_LABELS = PILLAR_LABELS_NL;

export const TEAM_RESULTS_MINIMUM = 5;

export type TeamResults = {
  exists: boolean;
  participants: number;
  minimum: number;
  averages: number[] | null;
};

const TEAM_CONTEXT_KEY = "lakmoesproef-team-context-v1";

export type TeamContext = {
  code: string;
  submitted: boolean;
};

export function loadTeamContext(): TeamContext | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(TEAM_CONTEXT_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as TeamContext;
    if (!parsed?.code || typeof parsed.code !== "string") return null;
    return { code: parsed.code, submitted: Boolean(parsed.submitted) };
  } catch {
    return null;
  }
}

export function saveTeamContext(context: TeamContext): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TEAM_CONTEXT_KEY, JSON.stringify(context));
}

export function clearTeamContext(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TEAM_CONTEXT_KEY);
}

export function pillarsToScores(pillars: Pillar[]): number[] {
  return pillars.map((p) => Math.round(p.avg * 100) / 100);
}

export function averagesToPillars(averages: number[]): Pillar[] {
  return PILLAR_LABELS.map((label, index) => {
    const raw = averages[index];
    const avg = typeof raw === "number" && !Number.isNaN(raw) ? raw : 0;
    return { label, avg: Math.round(avg * 100) / 100 };
  });
}

export function teamScorePercent(pillars: Pillar[]): number {
  if (pillars.length === 0) return 0;
  const avg = pillars.reduce((sum, p) => sum + p.avg, 0) / pillars.length;
  return Math.round((avg / 5) * 100);
}

function mapRpcError(message: string): string {
  const m = message.trim();
  if (/sessie niet gevonden/i.test(m)) return "Deze sessiecode bestaat niet.";
  if (/ongeldige code/i.test(m)) return "Voer een geldige 4-cijferige sessiecode in.";
  if (/niet 7 scores/i.test(m)) return "Er moeten precies 7 pijlerscores worden ingediend.";
  if (/buiten\s*1\s*[-–]\s*5|score buiten/i.test(m)) {
    return "Elke pijlerscore moet tussen 1 en 5 liggen.";
  }
  if (/maximum aantal deelnemers/i.test(m)) {
    return "Er zijn al te veel deelnemers in deze sessie.";
  }
  return "Er ging iets mis, probeer het opnieuw.";
}

function parseTeamResultsPayload(data: unknown): TeamResults {
  const fallback: TeamResults = {
    exists: false,
    participants: 0,
    minimum: TEAM_RESULTS_MINIMUM,
    averages: null,
  };
  if (!data || typeof data !== "object") return fallback;

  const row = data as Record<string, unknown>;
  const averagesRaw = row.averages;
  let averages: number[] | null = null;
  if (Array.isArray(averagesRaw)) {
    averages = averagesRaw.map((v) => Number(v));
  }

  return {
    exists: Boolean(row.exists),
    participants: typeof row.participants === "number" ? row.participants : Number(row.participants) || 0,
    minimum: typeof row.minimum === "number" ? row.minimum : TEAM_RESULTS_MINIMUM,
    averages,
  };
}

export async function createTeamSession(): Promise<string> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is niet geconfigureerd");
  }

  const supabase = getSupabase();
  const { data, error } = await supabase.rpc("create_team_session");

  if (error) throw new Error(mapRpcError(error.message));

  const code = String(data ?? "").trim();
  if (!/^\d{4}$/.test(code)) {
    throw new Error("Er ging iets mis, probeer het opnieuw.");
  }
  return code;
}

export async function getTeamResults(code: string): Promise<TeamResults> {
  const missing: TeamResults = {
    exists: false,
    participants: 0,
    minimum: TEAM_RESULTS_MINIMUM,
    averages: null,
  };

  if (!isSupabaseConfigured()) return missing;
  if (!/^\d{4}$/.test(code)) return missing;

  const supabase = getSupabase();
  const { data, error } = await supabase.rpc("get_team_results", { session_code: code });

  if (error) throw new Error(mapRpcError(error.message));
  return parseTeamResultsPayload(data);
}

export async function sessionExists(code: string): Promise<boolean> {
  const results = await getTeamResults(code);
  return results.exists;
}

export async function submitPillarScores(code: string, scores: number[]): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is niet geconfigureerd");
  }
  if (!/^\d{4}$/.test(code)) {
    throw new Error("Voer een geldige 4-cijferige sessiecode in.");
  }
  if (scores.length !== 7) {
    throw new Error("Er moeten precies 7 pijlerscores worden ingediend.");
  }
  if (scores.some((s) => s < 1 || s > 5 || Number.isNaN(s))) {
    throw new Error("Elke pijlerscore moet tussen 1 en 5 liggen.");
  }

  const supabase = getSupabase();
  const { error } = await supabase.rpc("submit_team_scores", {
    session_code: code,
    scores,
  });

  if (error) throw new Error(mapRpcError(error.message));
}
