import { describe, it, expect, vi, afterEach } from "vitest";
import { getSupabase, invokeFn, __setClientForTests, __setEnvForTests } from "@/lib/supabaseClient";

afterEach(() => { __setClientForTests(null); __setEnvForTests(null); vi.clearAllMocks(); });

describe("Supabase Client", () => {
  it("getSupabase returns a client (when env present) or null", () => {
    const c = getSupabase();
    expect(c === null || typeof c === "object").toBe(true);
  });

  it("getSupabase keeps same instance when injected", () => {
    const fake = { functions: { invoke: vi.fn() } } as any;
    __setClientForTests(fake);
    expect(getSupabase()).toBe(fake);
    expect(getSupabase()).toBe(fake);
  });

  describe("invokeFn", () => {
    it("should successfully invoke a function with data", async () => {
      const payload = { ok: true, pong: "ping" };
      const fakeInvoke = vi.fn().mockResolvedValue({ data: payload, error: null });
      __setClientForTests({ functions: { invoke: fakeInvoke } } as any);
      const res = await invokeFn<typeof payload>("ping", { a: 1 });
      expect(res).toEqual(payload);
      expect(fakeInvoke).toHaveBeenCalledWith("ping", { body: { a: 1 } });
    });

    it("should throw error when function invocation fails", async () => {
      const boom = new Error("boom");
      const fakeInvoke = vi.fn().mockResolvedValue({ data: null, error: boom });
      __setClientForTests({ functions: { invoke: fakeInvoke } } as any);
      await expect(invokeFn("ping", { a: 1 })).rejects.toThrow("boom");
    });

    it("should throw error when supabase is not configured", async () => {
      __setClientForTests(null);
      __setEnvForTests({ url: "", anon: "" });
      await expect(invokeFn("some-fn")).rejects.toThrow("Supabase not configured");
    });

    it("should handle function calls without body parameter", async () => {
      const fakeInvoke = vi.fn().mockResolvedValue({ data: { ok: true }, error: null });
      __setClientForTests({ functions: { invoke: fakeInvoke } } as any);
      await invokeFn("ping");
      expect(fakeInvoke).toHaveBeenCalledWith("ping", undefined);
    });
  });
});
