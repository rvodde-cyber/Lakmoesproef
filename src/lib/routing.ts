export function normalizeAppPath(pathname: string): string {
  return pathname.replace(/\/+$/, "") || "/";
}

/**
 * Zonder Supabase: geen teamsessie-routes; /keuze zonder voortgang gaat naar /scan.
 * Retourneert doelpad of null als er geen redirect nodig is.
 */
export function redirectTargetWithoutSupabase(
  pathname: string,
  supabaseConfigured: boolean,
  hasIndividualProgress: boolean,
): "/" | "/scan" | null {
  if (supabaseConfigured) return null;

  const path = normalizeAppPath(pathname);
  if (path === "/teamsessie" || path.startsWith("/teamsessie/")) return "/";
  if (path === "/keuze" && !hasIndividualProgress) return "/scan";
  return null;
}
