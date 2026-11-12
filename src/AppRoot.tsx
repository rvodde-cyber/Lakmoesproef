import { useCallback, useEffect, useState } from "react";
import App from "./App.tsx";
import { ResultsPage } from "./ResultsPage.tsx";
import { LandingPage } from "./pages/LandingPage.tsx";
import { ModeChoicePage } from "./pages/ModeChoicePage.tsx";
import { TeamFacilitatorPage } from "./pages/TeamFacilitatorPage.tsx";
import { TeamJoinPage } from "./pages/TeamJoinPage.tsx";
import { TeamResultsPage } from "./pages/TeamResultsPage.tsx";
import { TeamSubmitDonePage } from "./pages/TeamSubmitDonePage.tsx";
import { clearSession, loadSession } from "./utils/assessment.ts";
import { clearTeamContext, loadTeamContext } from "./lib/teamSession.ts";
import { isSupabaseConfigured } from "./lib/supabase.ts";
import { normalizeAppPath, redirectTargetWithoutSupabase } from "./lib/routing.ts";

function teamResultsCode(path: string): string | null {
  const match = path.match(/^\/teamsessie\/resultaten\/(\d{4})$/);
  return match?.[1] ?? null;
}

function RouteRedirect({
  to,
  navigate,
}: {
  to: string;
  navigate: (to: string) => void;
}) {
  useEffect(() => {
    navigate(to);
  }, [to, navigate]);
  return null;
}

export function AppRoot() {
  const [path, setPath] = useState(() => normalizeAppPath(window.location.pathname));

  useEffect(() => {
    const onPop = () => setPath(normalizeAppPath(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((to: string) => {
    window.history.pushState({}, "", to);
    setPath(normalizeAppPath(to));
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const supabaseReady = isSupabaseConfigured();
  const saved = loadSession();
  const hasIndividualProgress = Boolean(saved?.answers && Object.keys(saved.answers).length > 0);

  const redirectTarget = redirectTargetWithoutSupabase(path, supabaseReady, hasIndividualProgress);
  if (redirectTarget) {
    return <RouteRedirect to={redirectTarget} navigate={navigate} />;
  }

  const resultsCode = teamResultsCode(path);

  if (path === "/resultaten") {
    return <ResultsPage onBack={() => navigate("/scan")} />;
  }

  if (supabaseReady && path === "/teamsessie/begeleider") {
    return (
      <TeamFacilitatorPage
        onBack={() => navigate("/keuze")}
        onOpenResults={(code) => navigate(`/teamsessie/resultaten/${code}`)}
      />
    );
  }

  if (supabaseReady && path === "/teamsessie/deelnemen") {
    return (
      <TeamJoinPage
        onBack={() => navigate("/keuze")}
        onJoined={() => navigate("/teamsessie/scan")}
      />
    );
  }

  if (supabaseReady && path === "/teamsessie/klaar") {
    const team = loadTeamContext();
    return (
      <TeamSubmitDonePage
        code={team?.code ?? "----"}
        onHome={() => {
          clearSession();
          clearTeamContext();
          navigate("/");
        }}
      />
    );
  }

  if (supabaseReady && resultsCode) {
    return (
      <TeamResultsPage
        code={resultsCode}
        onBack={() => navigate("/teamsessie/begeleider")}
      />
    );
  }

  if (supabaseReady && path === "/teamsessie/scan") {
    const team = loadTeamContext();
    if (!team || team.submitted) {
      return (
        <ModeChoicePage
          onIndividual={() => navigate("/scan")}
          onTeamFacilitator={() => navigate("/teamsessie/begeleider")}
          onTeamJoin={() => navigate("/teamsessie/deelnemen")}
        />
      );
    }

    return (
      <App
        mode="team"
        teamCode={team.code}
        onOpenResults={() => navigate("/teamsessie/klaar")}
      />
    );
  }

  if (path === "/scan") {
    return <App mode="individual" onOpenResults={() => navigate("/resultaten")} />;
  }

  if (path === "/") {
    return <LandingPage />;
  }

  if (path === "/keuze" && hasIndividualProgress) {
    return <App mode="individual" onOpenResults={() => navigate("/resultaten")} />;
  }

  if (path === "/keuze") {
    return (
      <ModeChoicePage
        onIndividual={() => navigate("/scan")}
        onTeamFacilitator={() => navigate("/teamsessie/begeleider")}
        onTeamJoin={() => navigate("/teamsessie/deelnemen")}
      />
    );
  }

  return <LandingPage />;
}
