import { describe, expect, it } from "vitest";

describe("Supabase environment", () => {
  it("can authenticate a lightweight settings request", async () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    expect(url, "NEXT_PUBLIC_SUPABASE_URL is required").toMatch(/^https:\/\//);
    expect(anonKey, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required").toBeTruthy();

    const response = await fetch(`${url}/auth/v1/settings`, {
      headers: { apikey: anonKey! },
    });

    expect(response.ok, `Supabase returned ${response.status}`).toBe(true);
  }, 15_000);
});
