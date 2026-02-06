import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import WealthTracker from "./WealthTracker";

const mockDisclosures = [
  {
    bioguide_id: "P000197",
    name: "Nancy Pelosi",
    year: 2023,
    filing_date: "2024-05-15",
    chamber: "House" as const,
    assets: [
      {
        description: "Apple Inc Stock",
        type: "Stock",
        valueRange: { min: 1000001, max: 5000000 },
        incomeType: "Dividends",
        incomeRange: { min: 15001, max: 50000 },
      },
      {
        description: "Commercial Real Estate - SF",
        type: "Real Estate",
        valueRange: { min: 5000001, max: 25000000 },
        incomeType: "Rent",
        incomeRange: { min: 100001, max: 250000 },
      },
    ],
    liabilities: [],
    estimated_net_worth: { min: 6000002, max: 30000000 },
  },
  {
    bioguide_id: "P000197",
    name: "Nancy Pelosi",
    year: 2022,
    filing_date: "2023-05-15",
    chamber: "House" as const,
    assets: [
      {
        description: "Apple Inc Stock",
        type: "Stock",
        valueRange: { min: 500001, max: 1000000 },
        incomeType: "Dividends",
        incomeRange: { min: 15001, max: 50000 },
      },
    ],
    liabilities: [],
    estimated_net_worth: { min: 500001, max: 1000000 },
  },
];

describe("WealthTracker", () => {
  it("renders the section title", () => {
    render(<WealthTracker disclosures={mockDisclosures} memberName="Nancy Pelosi" />);
    expect(screen.getByText("💵 Wealth Tracking")).toBeInTheDocument();
  });

  it("shows number of years of disclosures", () => {
    render(<WealthTracker disclosures={mockDisclosures} memberName="Nancy Pelosi" />);
    expect(screen.getByText(/2 years of financial disclosures/)).toBeInTheDocument();
  });

  it("displays estimated net worth for latest year", () => {
    render(<WealthTracker disclosures={mockDisclosures} memberName="Nancy Pelosi" />);
    expect(screen.getByText(/Est\. Net Worth \(2023\)/)).toBeInTheDocument();
  });

  it("shows wealth change over time", () => {
    render(<WealthTracker disclosures={mockDisclosures} memberName="Nancy Pelosi" />);
    expect(screen.getByText(/Change \(1yr\)/)).toBeInTheDocument();
    expect(screen.getByText(/% Change/)).toBeInTheDocument();
  });

  it("displays asset breakdown by type", () => {
    render(<WealthTracker disclosures={mockDisclosures} memberName="Nancy Pelosi" />);
    expect(screen.getByText("Asset Breakdown")).toBeInTheDocument();
    expect(screen.getByText("Stock")).toBeInTheDocument();
    expect(screen.getByText("Real Estate")).toBeInTheDocument();
  });

  it("shows filing history", () => {
    render(<WealthTracker disclosures={mockDisclosures} memberName="Nancy Pelosi" />);
    expect(screen.getByText("Filing History")).toBeInTheDocument();
    expect(screen.getByText("2023")).toBeInTheDocument();
    expect(screen.getByText("2022")).toBeInTheDocument();
  });

  it("handles empty disclosures gracefully", () => {
    render(<WealthTracker disclosures={[]} memberName="John Doe" />);
    expect(screen.getByText(/Financial disclosure data not yet available/)).toBeInTheDocument();
  });

  it("handles single year disclosure (no change calculation)", () => {
    render(<WealthTracker disclosures={[mockDisclosures[0]]} memberName="Nancy Pelosi" />);
    expect(screen.getByText("💵 Wealth Tracking")).toBeInTheDocument();
    expect(screen.queryByText(/Change/)).not.toBeInTheDocument();
  });
});
