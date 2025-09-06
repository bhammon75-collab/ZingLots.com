import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SellerBadge } from "../SellerBadge";

describe("SellerBadge", () => {
  test("renders Verified SME label and opens hover content", async () => {
    render(<SellerBadge level="verified" sellerName="Brooklyn Liquidators" cityState="Brooklyn, NY" />);
    expect(screen.getByText(/Verified SME/i)).toBeInTheDocument();

    // open the hovercard by focusing the trigger (works for keyboard + mobile tap)
    const trigger = screen.getByTestId("seller-badge");
    await userEvent.tab();
    (trigger as HTMLElement).focus();

    // link inside the card should be discoverable
    expect(await screen.findByRole("link", { name: /how we verify sellers/i })).toBeVisible();
  });

  test("shows Pro Seller when level is pro", () => {
    render(<SellerBadge level="pro" />);
    expect(screen.getByText(/Pro Seller/i)).toBeInTheDocument();
  });
});

