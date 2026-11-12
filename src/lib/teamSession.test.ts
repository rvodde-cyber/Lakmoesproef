import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const rpcMock = vi.fn();

vi.mock("./supabase", () => ({
  isSupabaseConfigured: vi.fn(() => true),
  getSupabase: vi.fn(() => ({ rpc: rpcMock })),
  TEAMS_UNAVAILABLE_USER_MESSAGE:
    "Teamsessies zijn nu niet beschikbaar. Probeer het later opnieuw of gebruik de individuele scan.",
}));

import {
  createTeamSession,
  getTeamResults,
  sessionExists,
  submitPillarScores,
} from "./teamSession";

const validScores = [3, 4, 2, 5, 3, 4, 2];

beforeEach(() => {
  rpcMock.mockReset();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("createTeamSession", () => {
  it("roept create_team_session aan en retourneert de code", async () => {
    rpcMock.mockResolvedValueOnce({ data: "0427", error: null });

    await expect(createTeamSession()).resolves.toBe("0427");
    expect(rpcMock).toHaveBeenCalledWith("create_team_session");
  });

  it("vertaalt technische rpc-fouten", async () => {
    rpcMock.mockResolvedValueOnce({ data: null, error: { message: "Failed to fetch" } });

    await expect(createTeamSession()).rejects.toThrow(/Teamsessies zijn nu niet beschikbaar/);
  });

  it("vertaalt Invalid supabaseUrl via rpc naar nette melding", async () => {
    rpcMock.mockResolvedValueOnce({
      data: null,
      error: { message: "Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL." },
    });

    await expect(createTeamSession()).rejects.toThrow(/Teamsessies zijn nu niet beschikbaar/);
  });
});

describe("submitPillarScores", () => {
  it("stuurt geldige scores via submit_team_scores", async () => {
    rpcMock.mockResolvedValueOnce({ data: null, error: null });

    await submitPillarScores("1234", validScores);

    expect(rpcMock).toHaveBeenCalledWith("submit_team_scores", {
      session_code: "1234",
      scores: validScores,
    });
  });

  it("weigert 6 scores", async () => {
    await expect(submitPillarScores("1234", [1, 2, 3, 4, 5, 6])).rejects.toThrow(/7 pijlerscores/);
    expect(rpcMock).not.toHaveBeenCalled();
  });

  it("weigert score 0", async () => {
    await expect(submitPillarScores("1234", [0, 2, 3, 4, 5, 4, 3])).rejects.toThrow(/tussen 1 en 5/);
    expect(rpcMock).not.toHaveBeenCalled();
  });

  it("weigert score 6", async () => {
    await expect(submitPillarScores("1234", [6, 2, 3, 4, 5, 4, 3])).rejects.toThrow(/tussen 1 en 5/);
    expect(rpcMock).not.toHaveBeenCalled();
  });

  it("weigert ongeldige sessiecode", async () => {
    await expect(submitPillarScores("12a4", validScores)).rejects.toThrow(/4-cijferige/);
    expect(rpcMock).not.toHaveBeenCalled();
  });

  it("vertaalt maximum deelnemers", async () => {
    rpcMock.mockResolvedValueOnce({
      data: null,
      error: { message: "Maximum aantal deelnemers bereikt" },
    });

    await expect(submitPillarScores("1234", validScores)).rejects.toThrow(/te veel deelnemers/);
  });
});

describe("getTeamResults", () => {
  it("retourneert null averages bij weinig deelnemers", async () => {
    rpcMock.mockResolvedValueOnce({
      data: { exists: true, participants: 3, minimum: 5, averages: null },
      error: null,
    });

    const results = await getTeamResults("1234");
    expect(results).toMatchObject({ exists: true, participants: 3, averages: null });
    expect(rpcMock).toHaveBeenCalledWith("get_team_results", { session_code: "1234" });
  });

  it("retourneert gevulde averages", async () => {
    const averages = [3.1, 2.8, 4, 3.5, 2.2, 4.4, 3.9];
    rpcMock.mockResolvedValueOnce({
      data: { exists: true, participants: 6, minimum: 5, averages },
      error: null,
    });

    const results = await getTeamResults("5678");
    expect(results.averages).toEqual(averages);
    expect(results.participants).toBe(6);
  });

  it("exists=false zonder rpc bij ongeldige code", async () => {
    const results = await getTeamResults("12a4");
    expect(results.exists).toBe(false);
    expect(rpcMock).not.toHaveBeenCalled();
  });

  it("exists=false uit backend", async () => {
    rpcMock.mockResolvedValueOnce({
      data: { exists: false, participants: 0, minimum: 5, averages: null },
      error: null,
    });

    const results = await getTeamResults("0000");
    expect(results.exists).toBe(false);
  });

  it("vertaalt Sessie niet gevonden", async () => {
    rpcMock.mockResolvedValueOnce({
      data: null,
      error: { message: "Sessie niet gevonden" },
    });

    await expect(getTeamResults("9999")).rejects.toThrow(/sessiecode bestaat niet/i);
  });
});

describe("sessionExists", () => {
  it("is true wanneer exists in results", async () => {
    rpcMock.mockResolvedValueOnce({
      data: { exists: true, participants: 1, minimum: 5, averages: null },
      error: null,
    });

    await expect(sessionExists("1111")).resolves.toBe(true);
  });
});
