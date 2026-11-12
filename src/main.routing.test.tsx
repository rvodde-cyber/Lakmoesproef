import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AppRoot } from "./AppRoot.tsx";
import { clearSession } from "./utils/assessment.ts";

function setPath(pathname: string) {
  window.history.replaceState({}, "", pathname);
}

describe("AppRoot routing", () => {
  beforeEach(() => {
    clearSession();
    vi.unstubAllEnvs();
    vi.stubEnv("VITE_SUPABASE_URL", "");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "");
    setPath("/");
  });

  afterEach(() => {
    clearSession();
    vi.unstubAllEnvs();
    setPath("/");
  });

  it("toont LandingPage op /", () => {
    render(<AppRoot />);

    expect(screen.getByRole("link", { name: /Start/i })).toHaveAttribute("href", "/keuze");
    expect(
      screen.getByText(
        "Meet hoe de medewerkers van uw organisatie de ethische cultuur ervaren in ongeveer 10 minuten.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText("Individueel")).not.toBeInTheDocument();
  });

  it("toont ModeChoicePage op /keuze met Supabase", () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://abc123.supabase.co");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test");
    setPath("/keuze");

    render(<AppRoot />);

    expect(screen.getByText("Individueel")).toBeInTheDocument();
    expect(screen.getByText("Teamsessie")).toBeInTheDocument();
  });

  it("stuurt /keuze door naar /scan zonder Supabase en zonder voortgang", async () => {
    setPath("/keuze");

    render(<AppRoot />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Start de scan/i })).toBeInTheDocument();
    });
    expect(window.location.pathname).toBe("/scan");
  });
});
