import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DonorAnalysisSection from "./DonorAnalysisSection";

describe("DonorAnalysisSection", () => {
  const mockProps = {
    pacAmount: 2800000,
    individualAmount: 910000,
    smallDonorAmount: 410000,
    topDonors: [
      { name: "Tech Industry PAC", amount: 450000, type: "PAC" as const },
      { name: "Energy Corp Alliance", amount: 380000, type: "PAC" as const },
      { name: "Finance Group", amount: 320000, type: "PAC" as const },
    ],
    industries: [
      { name: "Technology", amount: 850000 },
      { name: "Energy", amount: 720000 },
    ],
  };

  it("renders funding sources title", () => {
    render(<DonorAnalysisSection {...mockProps} />);
    expect(screen.getByText("Funding Sources")).toBeInTheDocument();
  });

  it("displays correct donor type labels", () => {
    render(<DonorAnalysisSection {...mockProps} />);

    expect(screen.getByText("Corporate PACs")).toBeInTheDocument();
    expect(screen.getByText("Large Individual Donors")).toBeInTheDocument();
    expect(screen.getByText(/Small Donors/)).toBeInTheDocument();
  });

  it("shows top contributors section", () => {
    render(<DonorAnalysisSection {...mockProps} />);

    expect(screen.getByText("Top 10 Contributors")).toBeInTheDocument();
    expect(screen.getByText(/Tech Industry PAC/)).toBeInTheDocument();
    expect(screen.getByText(/Energy Corp Alliance/)).toBeInTheDocument();
  });

  it("displays industry breakdown", () => {
    render(<DonorAnalysisSection {...mockProps} />);

    expect(screen.getByText("Top Industries")).toBeInTheDocument();
    expect(screen.getByText("Technology")).toBeInTheDocument();
    expect(screen.getByText("Energy")).toBeInTheDocument();
  });

  it("formats currency correctly", () => {
    render(<DonorAnalysisSection {...mockProps} />);

    // Check for formatted amounts
    expect(screen.getByText(/\$2\.8M/)).toBeInTheDocument();
    expect(screen.getByText(/\$910K/)).toBeInTheDocument();
  });

  it("renders stacked bar chart container", () => {
    const { container } = render(<DonorAnalysisSection {...mockProps} />);

    // Check for the stacked bar chart
    const barChart = container.querySelector(".h-20.flex.rounded-xl");
    expect(barChart).toBeInTheDocument();
  });
});
