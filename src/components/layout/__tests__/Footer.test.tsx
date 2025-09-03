import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Footer from "../Footer";

describe("Footer", () => {
  it("renders Pricing and Help & Contact links with correct hrefs", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(screen.getByRole("link", { name: /Pricing/i })).toHaveAttribute("href", "/pricing");
    expect(screen.getByRole("link", { name: /Help & Contact/i })).toHaveAttribute("href", "/help");
  });

  it("renders Terms and Privacy links", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(screen.getByRole("link", { name: /Terms/i })).toHaveAttribute("href", "/legal/terms");
    expect(screen.getByRole("link", { name: /Privacy/i })).toHaveAttribute("href", "/legal/privacy");
  });
});

