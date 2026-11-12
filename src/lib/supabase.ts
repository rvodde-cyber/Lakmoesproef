import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const PLACEHOLDER_FRAGMENTS = ["your-project-ref", "your-anon-key-here"] as const;

function readEnv() {
  const url = String(import.meta.env.VITE_SUPABASE_URL ?? "").trim();
  const anonKey = String(import.meta.env.VITE_SUPABASE_ANON_KEY ?? "").trim();
  return { url, anonKey };
}

function containsPlaceholder(value: string): boolean {
  const lower = value.toLowerCase();
  return PLACEHOLDER_FRAGMENTS.some((fragment) => lower.includes(fragment));
}

/** True alleen als URL en anon key gezet zijn en geen .env-voorbeeldtekst bevatten. */
export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = readEnv();
  if (!url || !anonKey) return false;
  if (containsPlaceholder(url) || containsPlaceholder(anonKey)) return false;
  return true;
}

let cachedClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is niet geconfigureerd. Zet VITE_SUPABASE_URL en VITE_SUPABASE_ANON_KEY in .env",
    );
  }
  if (!cachedClient) {
    const { url, anonKey } = readEnv();
    cachedClient = createClient(url, anonKey);
  }
  return cachedClient;
}

/** Alleen voor tests — reset singleton na env-stubs. */
export function resetSupabaseClientForTests(): void {
  cachedClient = null;
}
