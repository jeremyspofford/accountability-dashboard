import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ScoreBreakdownCard from "./ScoreBreakdownCard";

describe("ScoreBreakdownCard", () => {
  const mockProps = {
    donorScore: 85,
    votingScore: 90,
    transparencyScore: 75,
    financialScore: 80,
  };

  it("renders all four scoring factors", () => {
    render(<ScoreBreakdownCard {...mockProps} />);

    expect(screen.getByText("Donor Transparency")).toBeInTheDocument();
    expect(screen.getByText("Voting Alignment")).toBeInTheDocument();
    expect(screen.getByText("Disclosure")).toBeInTheDocument();
    expect(screen.getByText("Financial Ethics")).toBeInTheDocument();
  });

  it("displays correct scores", () => {
    render(<ScoreBreakdownCard {...mockProps} />);

    expect(screen.getByText("85")).toBeInTheDocument();
    expect(screen.getByText("90")).toBeInTheDocument();
    expect(screen.getByText("75")).toBeInTheDocument();
    expect(screen.getByText("80")).toBeInTheDocument();
  });

  it("shows descriptions for each factor", () => {
    render(<ScoreBreakdownCard {...mockProps} />);

    expect(
      screen.getByText("Sources of campaign funding and PAC influence")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Consistency between public statements and votes")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Timely financial disclosures and reporting")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Stock trading practices and conflict of interest")
    ).toBeInTheDocument();
  });

  it("renders progress bars for each score", () => {
    const { container } = render(<ScoreBreakdownCard {...mockProps} />);

    // Should have 4 progress bars (one for each factor)
    const progressBars = container.querySelectorAll(".h-4.bg-slate-100");
    expect(progressBars).toHaveLength(4);
  });
});
