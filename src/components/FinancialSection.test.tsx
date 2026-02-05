import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FinancialSection from "./FinancialSection";

describe("FinancialSection", () => {
  const mockStockTrades = [
    {
      date: "2024-03-15",
      ticker: "NVDA",
      company: "NVIDIA Corporation",
      type: "Sell" as const,
      amount: "$100,001-$250,000",
      daysBeforeEvent: {
        days: 3,
        event: "AI Safety Committee meeting",
      },
    },
    {
      date: "2024-03-10",
      ticker: "AAPL",
      company: "Apple Inc.",
      type: "Buy" as const,
      amount: "$15,001-$50,000",
    },
  ];

  it("renders financial disclosures title", () => {
    render(
      <FinancialSection
        netWorth={2500000}
        netWorthChange={500000}
        netWorthChangePercent={25}
        stockTrades={mockStockTrades}
      />
    );

    expect(screen.getByText("Financial Disclosures")).toBeInTheDocument();
  });

  it("displays net worth when provided", () => {
    render(
      <FinancialSection
        netWorth={2500000}
        netWorthChange={500000}
        netWorthChangePercent={25}
        stockTrades={mockStockTrades}
      />
    );

    expect(screen.getByText("$2.5M")).toBeInTheDocument();
  });

  it("shows net worth change with correct styling", () => {
    render(
      <FinancialSection
        netWorth={2500000}
        netWorthChange={500000}
        netWorthChangePercent={25}
        stockTrades={mockStockTrades}
      />
    );

    // Should show increase indicator
    expect(screen.getByText(/↑/)).toBeInTheDocument();
    expect(screen.getByText(/\$500K/)).toBeInTheDocument();
  });

  it("displays stock trades", () => {
    render(
      <FinancialSection
        netWorth={2500000}
        netWorthChange={500000}
        netWorthChangePercent={25}
        stockTrades={mockStockTrades}
      />
    );

    expect(screen.getByText(/Sold NVDA/)).toBeInTheDocument();
    expect(screen.getByText("NVIDIA Corporation")).toBeInTheDocument();
    expect(screen.getByText(/Bought AAPL/)).toBeInTheDocument();
    expect(screen.getByText("Apple Inc.")).toBeInTheDocument();
  });

  it("shows conflict warnings for suspicious trades", () => {
    render(
      <FinancialSection
        netWorth={2500000}
        netWorthChange={500000}
        netWorthChangePercent={25}
        stockTrades={mockStockTrades}
      />
    );

    expect(screen.getByText(/Potential conflict/)).toBeInTheDocument();
    expect(
      screen.getByText(/3 days before AI Safety Committee meeting/)
    ).toBeInTheDocument();
  });

  it("shows placeholder when no net worth data", () => {
    render(
      <FinancialSection
        netWorth={null}
        netWorthChange={null}
        netWorthChangePercent={null}
        stockTrades={[]}
      />
    );

    expect(screen.getByText(/Net worth data coming soon/)).toBeInTheDocument();
  });

  it("shows placeholder when no stock trades", () => {
    render(
      <FinancialSection
        netWorth={2500000}
        netWorthChange={500000}
        netWorthChangePercent={25}
        stockTrades={[]}
      />
    );

    expect(
      screen.getByText(/Stock trading data coming soon/)
    ).toBeInTheDocument();
  });

  it("limits display to 10 trades maximum", () => {
    const manyTrades = Array(15)
      .fill(null)
      .map((_, i) => ({
        date: "2024-03-15",
        ticker: `TICK${i}`,
        company: `Company ${i}`,
        type: "Buy" as const,
        amount: "$1,001-$15,000",
      }));

    const { container } = render(
      <FinancialSection
        netWorth={2500000}
        netWorthChange={500000}
        netWorthChangePercent={25}
        stockTrades={manyTrades}
      />
    );

    // Should only show 10 trades
    const tradeElements = container.querySelectorAll(".border-l-4");
    expect(tradeElements.length).toBe(10);
  });
});
