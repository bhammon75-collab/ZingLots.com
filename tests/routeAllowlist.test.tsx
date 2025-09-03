import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { MemoryRouter } from "react-router-dom";

// Guardrail test: update this allowlist when adding new routes or footer links.
const ALLOWLIST = new RegExp(
  // eslint-disable-next-line no-useless-escape
  '^\/(|login|seller\/apply|browse|auctions|regions|help|pricing|legal\/(terms|privacy|disputes|logistics)|trust\/(payments|verified-auctioneers|live-auctions)|auction\/active|sitemap)$'
);

describe("route allowlist", () => {
  it("header and global footer anchors match the allowed routes", () => {
    const { container } = render(
      <MemoryRouter>
        <Header />
        <Footer />
      </MemoryRouter>
    );

    const header = container.querySelector("header");
    const footerNav = container.querySelector("footer nav");
    const anchors = [
      ...(header ? Array.from(header.querySelectorAll<HTMLAnchorElement>('a[href]')) : []),
      ...(footerNav ? Array.from(footerNav.querySelectorAll<HTMLAnchorElement>('a[href]')) : []),
    ];
    const offending: string[] = [];
    for (const a of anchors) {
      const href = a.getAttribute("href") || "";
      // Ignore external links and hash/mailto/tel
      if (href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
      if (!ALLOWLIST.test(href)) offending.push(href);
    }

    if (offending.length) {
      // Helpful output
      // If this fails due to a legitimate new route, update ALLOWLIST above.
      throw new Error(`Found non-allowlisted hrefs:\n${offending.join("\n")}`);
    }
    expect(offending.length).toBe(0);
  });
});

