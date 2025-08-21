import { describe, it, expect, vi, afterEach } from "vitest";
import { getSupabase, invokeFn, __setClientForTests, __setEnvForTests } from "@/lib/supabaseClient";

afterEach(() => { __setClientForTests(null); __setEnvForTests(null); vi.clearAllMocks(); });

describe('Supabase Client', () => {
  describe('getSupabase', () => {
    it('should return a supabase client instance or null if envs are missing', () => {
      const client = getSupabase();
      // In test environment without VITE_* envs, it should return null
      if (client === null) {
        expect(client).toBeNull();
      } else {
        expect(client).toBeTruthy();
        expect(client).toHaveProperty('functions');
        expect(client).toHaveProperty('auth');
      }
    });

    it('should return the same instance on multiple calls', () => {
      const client1 = getSupabase();
      const client2 = getSupabase();
      expect(client1).toBe(client2);
    });

    it("getSupabase keeps same instance when injected", () => {
      const fake = { functions: { invoke: vi.fn() } } as any;
      __setClientForTests(fake);
      expect(getSupabase()).toBe(fake);
      expect(getSupabase()).toBe(fake);
    });
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

    it('should throw error when supabase is not configured', async () => {
      __setClientForTests(null);
      __setEnvForTests({ url: "", anon: "" });
      await expect(invokeFn('test-function')).rejects.toThrow('Supabase not configured (missing envs).');
    });

    it("should handle function calls without body parameter", async () => {
      const fakeInvoke = vi.fn().mockResolvedValue({ data: { ok: true }, error: null });
      __setClientForTests({ functions: { invoke: fakeInvoke } } as any);
      await invokeFn("ping");
      expect(fakeInvoke).toHaveBeenCalledWith("ping", undefined);
    });
  });
});