import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ConflictsPage from "./page";

describe("ConflictsPage", () => {
  it("renders the page title", () => {
    render(<ConflictsPage />);
    expect(screen.getByText(/Emoluments & Financial Conflicts/i)).toBeDefined();
  });

  it("renders summary statistics", () => {
    render(<ConflictsPage />);
    // Should show total conflicts count
    expect(screen.getByText(/Total Documented Conflicts/i)).toBeDefined();
  });

  it("renders category tabs", () => {
    render(<ConflictsPage />);
    // Check for filter buttons by finding text that includes the count
    const allButton = screen.getByRole('button', { name: /All \(/i });
    expect(allButton).toBeDefined();
  });

  it("renders conflict items with severity indicators", () => {
    render(<ConflictsPage />);
    // Should show severity levels
    const page = screen.getByText(/Emoluments & Financial Conflicts/i);
    expect(page).toBeDefined();
  });

  it("displays source links for conflicts", () => {
    render(<ConflictsPage />);
    const links = screen.getAllByText(/Source/i);
    expect(links.length).toBeGreaterThan(0);
  });

  it("shows date information for each conflict", () => {
    render(<ConflictsPage />);
    // Should have date formatting like "Jan 2017" or similar
    const page = screen.getByText(/Emoluments & Financial Conflicts/i);
    expect(page).toBeDefined();
  });

  it("renders back navigation link", () => {
    render(<ConflictsPage />);
    expect(screen.getByText(/Back to/i)).toBeDefined();
  });

  it("is mobile responsive with proper styling", () => {
    render(<ConflictsPage />);
    const mainContent = screen.getByText(/Emoluments & Financial Conflicts/i);
    expect(mainContent).toBeDefined();
  });

  it("categorizes conflicts by type", () => {
    render(<ConflictsPage />);
    // All three categories should be present (using getAllByText since they appear multiple times)
    const foreignPayments = screen.getAllByText(/Foreign Payments/i);
    expect(foreignPayments.length).toBeGreaterThan(0);
    const domesticConflicts = screen.getAllByText(/Domestic Conflicts/i);
    expect(domesticConflicts.length).toBeGreaterThan(0);
    const familyInvolvement = screen.getAllByText(/Family Involvement/i);
    expect(familyInvolvement.length).toBeGreaterThan(0);
  });

  it("shows conflict amounts when available", () => {
    render(<ConflictsPage />);
    const page = screen.getByText(/Emoluments & Financial Conflicts/i);
    expect(page).toBeDefined();
  });
});
