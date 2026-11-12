import { describe, expect, it } from "vitest";
import { redirectTargetWithoutSupabase } from "./routing";

describe("redirectTargetWithoutSupabase", () => {
  it("does nothing when Supabase is configured", () => {
    expect(redirectTargetWithoutSupabase("/teamsessie/begeleider", true, false)).toBeNull();
    expect(redirectTargetWithoutSupabase("/", true, false)).toBeNull();
  });

  it("sends team paths to home when not configured", () => {
    expect(redirectTargetWithoutSupabase("/teamsessie", false, false)).toBe("/");
    expect(redirectTargetWithoutSupabase("/teamsessie/scan", false, false)).toBe("/");
    expect(redirectTargetWithoutSupabase("/teamsessie/resultaten/1234", false, false)).toBe("/");
  });

  it("sends bare home to /scan when not configured and no progress", () => {
    expect(redirectTargetWithoutSupabase("/", false, false)).toBe("/scan");
  });

  it("keeps home when individual progress exists", () => {
    expect(redirectTargetWithoutSupabase("/", false, true)).toBeNull();
  });
});
