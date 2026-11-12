import type { Pillar } from "../utils/assessment";
import { PILLAR_LABELS_NL } from "../utils/assessment";
import { getSupabase, isSupabaseConfigured } from "./supabase";

export const PILLAR_LABELS = PILLAR_LABELS_NL;

export type TeamSessionRow = {
  id: string;
  created_at: string;
  pillar_scores: number[][];
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

function randomSessionCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export function pillarsToScores(pillars: Pillar[]): number[] {
  return pillars.map((p) => Math.round(p.avg * 100) / 100);
}

export function aggregateTeamPillars(submissions: number[][]): Pillar[] {
  if (submissions.length === 0) {
    return PILLAR_LABELS.map((label) => ({ label, avg: 0 }));
  }

  return PILLAR_LABELS.map((label, index) => {
    const values = submissions
      .map((row) => row[index])
      .filter((v): v is number => typeof v === "number" && !Number.isNaN(v));
    const avg = values.length
      ? values.reduce((sum, v) => sum + v, 0) / values.length
      : 0;
    return { label, avg: Math.round(avg * 100) / 100 };
  });
}

export function teamScorePercent(pillars: Pillar[]): number {
  if (pillars.length === 0) return 0;
  const avg = pillars.reduce((sum, p) => sum + p.avg, 0) / pillars.length;
  return Math.round((avg / 5) * 100);
}

export async function createTeamSession(): Promise<string> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is niet geconfigureerd");
  }

  const supabase = getSupabase();

  for (let attempt = 0; attempt < 12; attempt++) {
    const code = randomSessionCode();
    const { error } = await supabase.from("team_sessions").insert({ id: code });

    if (!error) return code;
    if (error.code !== "23505") {
      throw new Error(error.message);
    }
  }

  throw new Error("Kon geen unieke sessiecode maken. Probeer opnieuw.");
}

export async function fetchTeamSession(code: string): Promise<TeamSessionRow | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("team_sessions")
    .select("id, created_at, pillar_scores")
    .eq("id", code)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const scores = Array.isArray(data.pillar_scores)
    ? (data.pillar_scores as unknown[]).filter(Array.isArray).map((row) =>
        (row as unknown[]).map((v) => Number(v)),
      )
    : [];

  return {
    id: data.id,
    created_at: data.created_at,
    pillar_scores: scores,
  };
}

export async function sessionExists(code: string): Promise<boolean> {
  const session = await fetchTeamSession(code);
  return session !== null;
}

export async function submitPillarScores(code: string, scores: number[]): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is niet geconfigureerd");
  }
  if (scores.length !== 7) {
    throw new Error("Verwacht 7 pijlerscores");
  }

  const supabase = getSupabase();
  const { error } = await supabase.rpc("append_pillar_score", {
    session_code: code,
    scores,
  });

  if (error) throw new Error(error.message);
}
