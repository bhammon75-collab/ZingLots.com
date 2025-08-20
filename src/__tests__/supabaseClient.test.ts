import { describe, it, expect, vi, afterEach } from "vitest";
import { getSupabase, invokeFn } from "@/lib/supabaseClient";

describe("Supabase Client", () => {
  it("getSupabase returns a client", () => {
    const client = getSupabase();
    expect(client).toBeTruthy();
    expect(typeof client.from).toBe("function");
  });

  it("getSupabase keeps same instance", () => {
    expect(getSupabase()).toBe(getSupabase());
  });

  describe("invokeFn", () => {
    const originalGet = (globalThis as any).getSupabase;

    afterEach(() => {
      (globalThis as any).getSupabase = originalGet;
      vi.restoreAllMocks();
    });

    it("should successfully invoke a function with data", async () => {
      const mockData = { ok: true, ping: "pong" };
      const fakeInvoke = vi.fn().mockResolvedValue({ data: mockData, error: null });
      (globalThis as any).getSupabase = () =>
        ({ functions: { invoke: fakeInvoke } } as any);

      const out = await invokeFn<typeof mockData>("ping", { a: 1 });

      expect(out).toEqual(mockData);
      expect(fakeInvoke).toHaveBeenCalledWith("ping", { body: { a: 1 } });
    });

    it("should throw error when function invocation fails", async () => {
      const boom = new Error("boom");
      const fakeInvoke = vi.fn().mockResolvedValue({ data: null, error: boom });
      (globalThis as any).getSupabase = () =>
        ({ functions: { invoke: fakeInvoke } } as any);

      await expect(invokeFn("ping", { a: 1 })).rejects.toThrow("boom");
    });

    it("should throw error when supabase is not configured", async () => {
      const original = (globalThis as any).getSupabase;
      try {
        (globalThis as any).getSupabase = () => null;
        await expect(invokeFn("some-fn")).rejects.toThrow("Supabase not configured");
      } finally {
        (globalThis as any).getSupabase = original;
      }
    });

    it("should handle function calls without body parameter", async () => {
      const mockData = { ok: true };
      const fakeInvoke = vi.fn().mockResolvedValue({ data: mockData, error: null });
      (globalThis as any).getSupabase = () =>
        ({ functions: { invoke: fakeInvoke } } as any);

      const out = await invokeFn("no-body");

      expect(out).toEqual(mockData);
      expect(fakeInvoke).toHaveBeenCalledWith("no-body", undefined);
    });
  });
});