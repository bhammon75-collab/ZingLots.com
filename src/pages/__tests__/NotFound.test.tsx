import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import * as analyticsModule from "@/lib/analytics";
import NotFound from "@/pages/NotFound";

describe("NotFound telemetry", () => {
  it("tracks route_404 on mount", () => {
    const spy = vi.spyOn(analyticsModule.analytics, "track").mockImplementation(() => { return undefined as unknown as void; });
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={["/does-not-exist"]}>
          <Routes>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ action: "route_404" })
    );
  });
});

