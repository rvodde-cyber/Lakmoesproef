import { afterEach, describe, expect, it, vi } from "vitest";
import { getSupabase, isSupabaseConfigured, resetSupabaseClientForTests } from "./supabase";

afterEach(() => {
  vi.unstubAllEnvs();
  resetSupabaseClientForTests();
});

describe("isSupabaseConfigured", () => {
  it("is false when env vars are missing", () => {
    vi.stubEnv("VITE_SUPABASE_URL", "");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "");
    expect(isSupabaseConfigured()).toBe(false);
  });

  it("is false when values contain example placeholder text", () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://your-project-ref.supabase.co");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "your-anon-key-here");
    expect(isSupabaseConfigured()).toBe(false);
  });

  it("is true when real-looking values are set", () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://abc123.supabase.co");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test");
    expect(isSupabaseConfigured()).toBe(true);
  });
});

describe("getSupabase", () => {
  it("throws without crashing the module when not configured", () => {
    vi.stubEnv("VITE_SUPABASE_URL", "");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "");
    expect(() => getSupabase()).toThrow(/niet geconfigureerd/i);
  });
});
