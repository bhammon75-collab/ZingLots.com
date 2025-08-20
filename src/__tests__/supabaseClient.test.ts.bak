import { describe, it, expect, vi } from "vitest";
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
    it("should successfully invoke a function with data", async () => {
      const client = getSupabase();
      const mockData = { ok: true, ping: "pong" };

      const spy = vi
        .spyOn((client as any).functions, "invoke")
        .mockResolvedValueOnce({ data: mockData, error: null } as any);

      const res = await invokeFn<typeof mockData>("ping", { a: 1 });
      expect(res).toEqual(mockData);
      expect(spy).toHaveBeenCalledWith("ping", { body: { a: 1 } });

      spy.mockRestore();
    });

    it("should throw error when function invocation fails", async () => {
      const client = getSupabase();
      const boom = new Error("boom");

      const spy = vi
        .spyOn((client as any).functions, "invoke")
        .mockResolvedValueOnce({ data: null, error: boom } as any);

      await expect(invokeFn("ping", { a: 1 })).rejects.toThrow("boom");

      spy.mockRestore();
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
      const client = getSupabase();
      const mockData = { ok: true };

      const spy = vi
        .spyOn((client as any).functions, "invoke")
        .mockResolvedValueOnce({ data: mockData, error: null } as any);

      const res = await invokeFn("no-body");
      expect(res).toEqual(mockData);
      // When no body is given, the second arg should be undefined
      expect(spy).toHaveBeenCalledWith("no-body", undefined);

      spy.mockRestore();
    });
  });
});