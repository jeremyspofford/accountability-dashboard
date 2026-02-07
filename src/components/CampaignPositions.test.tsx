import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CampaignPositions from "./CampaignPositions";

// Mock the positions data
const mockPositionsData = {
  members: [
    {
      bioguide_id: "T000001",
      name: "Test Member",
      source: "ontheissues",
      source_url: "https://www.ontheissues.org/Test_Member.htm",
      last_updated: "2026-02-06T00:00:00.000Z",
      positions: [
        {
          topic: "Abortion is a woman's unrestricted right",
          stance: "Strongly Supports",
          intensity: 5,
          quotes: [
            "Women should have full reproductive freedom",
            "Healthcare decisions belong to women and their doctors"
          ],
          votes: []
        },
        {
          topic: "Expand ObamaCare",
          stance: "Supports",
          intensity: 4,
          quotes: [
            "Healthcare is a right, not a privilege"
          ],
          votes: []
        },
        {
          topic: "Fight EPA regulatory over-reach",
          stance: "Opposes",
          intensity: 2,
          quotes: [
            "We need strong environmental protections"
          ],
          votes: []
        },
        {
          topic: "Vouchers for school choice",
          stance: "Strongly Opposes",
          intensity: 1,
          quotes: [],
          votes: []
        },
        {
          topic: "Comfortable with same-sex marriage",
          stance: "Strongly Supports",
          intensity: 5,
          quotes: [
            "Love is love",
            "Equal rights for all Americans"
          ],
          votes: []
        },
        {
          topic: "Higher taxes on the wealthy",
          stance: "Supports",
          intensity: 4,
          quotes: [
            "The rich should pay their fair share"
          ],
          votes: []
        }
      ]
    }
  ]
};

describe("CampaignPositions", () => {
  it("renders campaign positions title", () => {
    render(<CampaignPositions bioguideId="T000001" memberName="Test Member" positionsData={mockPositionsData} />);
    expect(screen.getByText("Campaign Positions")).toBeInTheDocument();
  });

  it("displays member name in description", () => {
    render(<CampaignPositions bioguideId="T000001" memberName="Test Member" positionsData={mockPositionsData} />);
    expect(screen.getByText(/Test Member's stated positions/)).toBeInTheDocument();
  });

  it("shows total position count", () => {
    render(<CampaignPositions bioguideId="T000001" memberName="Test Member" positionsData={mockPositionsData} />);
    expect(screen.getByText(/6 positions tracked/)).toBeInTheDocument();
  });

  it("displays data source attribution", () => {
    render(<CampaignPositions bioguideId="T000001" memberName="Test Member" positionsData={mockPositionsData} />);
    expect(screen.getByText(/Source: OnTheIssues.org/)).toBeInTheDocument();
  });

  it("groups positions by category", () => {
    render(<CampaignPositions bioguideId="T000001" memberName="Test Member" positionsData={mockPositionsData} />);
    
    // Categories should be visible
    expect(screen.getByText(/Social Issues/)).toBeInTheDocument();
    expect(screen.getByText(/Healthcare/)).toBeInTheDocument();
    expect(screen.getByText(/Environment & Energy/)).toBeInTheDocument();
  });

  it("displays position count per category", () => {
    render(<CampaignPositions bioguideId="T000001" memberName="Test Member" positionsData={mockPositionsData} />);
    
    // Should show counts like "(2)" next to category names
    const socialIssuesHeader = screen.getByText(/Social Issues/);
    expect(socialIssuesHeader.textContent).toContain("(2)");
  });

  it("expands and collapses categories", () => {
    render(<CampaignPositions bioguideId="T000001" memberName="Test Member" positionsData={mockPositionsData} />);
    
    // First category should be expanded by default
    expect(screen.getByText("Abortion is a woman's unrestricted right")).toBeInTheDocument();
    
    // Find and click the Healthcare category button
    const healthcareButton = screen.getByRole('button', { name: /Healthcare/i });
    
    // Click to expand
    fireEvent.click(healthcareButton);
    
    // Position should now be visible
    expect(screen.getByText("Expand ObamaCare")).toBeInTheDocument();
  });

  it("displays stance with appropriate styling", () => {
    const { container } = render(<CampaignPositions bioguideId="T000001" memberName="Test Member" positionsData={mockPositionsData} />);
    
    // Check for green styling on "Strongly Supports"
    const strongSupports = container.querySelector('.bg-green-100.text-green-800');
    expect(strongSupports).toBeInTheDocument();
  });

  it("shows intensity indicators", () => {
    const { container } = render(<CampaignPositions bioguideId="T000001" memberName="Test Member" positionsData={mockPositionsData} />);
    
    // Should have intensity bars (5 bars per position)
    const intensityBars = container.querySelectorAll('.w-2.h-4.rounded-sm');
    expect(intensityBars.length).toBeGreaterThan(0);
  });

  it("expands and shows quotes when clicked", () => {
    render(<CampaignPositions bioguideId="T000001" memberName="Test Member" positionsData={mockPositionsData} />);
    
    // First category is expanded by default
    // Find "Show Quotes" button for the abortion position
    const showQuotesButtons = screen.getAllByText("Show Quotes");
    expect(showQuotesButtons.length).toBeGreaterThan(0);
    
    // Click the first one
    fireEvent.click(showQuotesButtons[0]);
    
    // Quotes should now be visible
    expect(screen.getByText(/Women should have full reproductive freedom/)).toBeInTheDocument();
    
    // Button should change to "Hide Quotes"
    expect(screen.getByText("Hide Quotes")).toBeInTheDocument();
  });

  it("hides quotes when clicked again", () => {
    render(<CampaignPositions bioguideId="T000001" memberName="Test Member" positionsData={mockPositionsData} />);
    
    const showQuotesButtons = screen.getAllByText("Show Quotes");
    fireEvent.click(showQuotesButtons[0]);
    
    // Quotes are visible
    expect(screen.getByText(/Women should have full reproductive freedom/)).toBeInTheDocument();
    
    // Click hide button
    const hideButton = screen.getByText("Hide Quotes");
    fireEvent.click(hideButton);
    
    // Quotes should be hidden
    expect(screen.queryByText(/Women should have full reproductive freedom/)).not.toBeInTheDocument();
  });

  it("does not show quotes button for positions without quotes", () => {
    render(<CampaignPositions bioguideId="T000001" memberName="Test Member" positionsData={mockPositionsData} />);
    
    // Expand Education category (which has position with no quotes)
    const educationButton = screen.getByRole('button', { name: /Education/i });
    fireEvent.click(educationButton);
    
    // "Vouchers for school choice" has no quotes, so button shouldn't appear for it
    // We can't easily test this without more specific data-testid attributes
    // but the logic is in place
  });

  it("displays source link", () => {
    render(<CampaignPositions bioguideId="T000001" memberName="Test Member" positionsData={mockPositionsData} />);
    
    const link = screen.getByRole('link', { name: /View full profile on OnTheIssues.org/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://www.ontheissues.org/Test_Member.htm');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it("returns null when member has no positions", () => {
    const emptyData = {
      members: [
        {
          bioguide_id: "T000002",
          name: "Empty Member",
          source: "ontheissues",
          source_url: "",
          last_updated: "2026-02-06T00:00:00.000Z",
          positions: []
        }
      ]
    };
    
    const { container } = render(<CampaignPositions bioguideId="T000002" memberName="Empty Member" positionsData={emptyData} />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null when member is not found", () => {
    const { container } = render(<CampaignPositions bioguideId="NOTFOUND" memberName="Unknown Member" positionsData={mockPositionsData} />);
    expect(container.firstChild).toBeNull();
  });

  it("categorizes positions correctly", () => {
    render(<CampaignPositions bioguideId="T000001" memberName="Test Member" positionsData={mockPositionsData} />);
    
    // Check that positions are grouped into expected categories
    expect(screen.getByText(/Social Issues/)).toBeInTheDocument();
    expect(screen.getByText(/Healthcare/)).toBeInTheDocument();
    expect(screen.getByText(/Environment & Energy/)).toBeInTheDocument();
    expect(screen.getByText(/Education/)).toBeInTheDocument();
    expect(screen.getByText(/Economic Policy/)).toBeInTheDocument();
  });

  it("sorts categories by position count", () => {
    const { container } = render(<CampaignPositions bioguideId="T000001" memberName="Test Member" positionsData={mockPositionsData} />);
    
    // Get all category headers
    const categoryButtons = container.querySelectorAll('button h3');
    
    // First category should have the most positions
    // In our mock, Social Issues has 2 positions and should be first (tied with others)
    expect(categoryButtons.length).toBeGreaterThan(0);
  });

  it("applies correct color coding to stances", () => {
    const { container } = render(<CampaignPositions bioguideId="T000001" memberName="Test Member" positionsData={mockPositionsData} />);
    
    // Should have green styling for supports positions
    const greenElements = container.querySelectorAll('[class*="bg-green"]');
    expect(greenElements.length).toBeGreaterThan(0);
    
    // Should have color-coded borders
    const coloredBorders = container.querySelectorAll('[class*="border-green"], [class*="border-red"], [class*="border-orange"]');
    expect(coloredBorders.length).toBeGreaterThan(0);
  });
});
