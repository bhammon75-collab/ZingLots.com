import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Header from "../Header";

describe("Header", () => {
  it("renders brand text", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByText(/ZingLots.com/i)).toBeInTheDocument();
  });

  it("shows Sign In and Start Selling links", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByRole("link", { name: /Sign In/i })).toHaveAttribute("href", "/login");
    expect(screen.getByRole("link", { name: /Start Selling/i })).toHaveAttribute("href", "/seller/apply");
  });

  it("renders search box when showSearch=true", () => {
    render(
      <MemoryRouter>
        <Header showSearch />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText(/Search auctions/i)).toBeInTheDocument();
  });

  it("does not render search box when showSearch=false", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(screen.queryByPlaceholderText(/Search auctions/i)).toBeNull();
  });
});

