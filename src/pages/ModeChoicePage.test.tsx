import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ModeChoicePage } from "./ModeChoicePage";

const noop = () => {};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("ModeChoicePage", () => {
  it("verbergt teamsessie wanneer Supabase niet is geconfigureerd", () => {
    vi.stubEnv("VITE_SUPABASE_URL", "");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "");

    render(
      <ModeChoicePage onIndividual={noop} onTeamFacilitator={noop} onTeamJoin={noop} />,
    );

    expect(screen.queryByText("Teamsessie")).not.toBeInTheDocument();
    expect(screen.queryByText(/begeleider/i)).not.toBeInTheDocument();
    expect(screen.getByText("Individueel")).toBeInTheDocument();
    expect(screen.getByText("Antwoorden blijven lokaal in uw browser.")).toBeInTheDocument();
  });

  it("toont teamsessie wanneer Supabase is geconfigureerd", () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://abc123.supabase.co");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test");

    render(
      <ModeChoicePage onIndividual={noop} onTeamFacilitator={noop} onTeamJoin={noop} />,
    );

    expect(screen.getByText("Teamsessie")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Ik ben begeleider/i })).toBeInTheDocument();
  });
});
