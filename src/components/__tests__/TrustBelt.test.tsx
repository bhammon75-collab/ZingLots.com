import { render, screen } from "@testing-library/react";
import { TrustBelt } from "../TrustBelt";

test("renders default trust items and links", () => {
  render(<TrustBelt />);
  expect(screen.getByText(/Verified Sellers/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Verified Sellers/i })).toHaveAttribute("href", "/verify-sellers");
  expect(screen.getByText(/Secure Payments/i)).toBeInTheDocument();
  expect(screen.getByText(/Buyer Protection/i)).toBeInTheDocument();
  expect(screen.getByText(/Tax-ready Receipts/i)).toBeInTheDocument();
});

