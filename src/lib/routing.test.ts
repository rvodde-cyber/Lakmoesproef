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

  it("laat de landingspagina op / staan zonder Supabase", () => {
    expect(redirectTargetWithoutSupabase("/", false, false)).toBeNull();
    expect(redirectTargetWithoutSupabase("/", false, true)).toBeNull();
  });

  it("stuurt /keuze naar /scan wanneer niet geconfigureerd en geen voortgang", () => {
    expect(redirectTargetWithoutSupabase("/keuze", false, false)).toBe("/scan");
  });

  it("houdt /keuze bij individuele voortgang", () => {
    expect(redirectTargetWithoutSupabase("/keuze", false, true)).toBeNull();
  });
});
