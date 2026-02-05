import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import ExecutiveOrdersPage from "./page";

// Mock fetch globally
global.fetch = vi.fn();

const mockExecutiveOrders = {
  results: [
    {
      document_number: "2025-00123",
      title: "Executive Order on Border Security",
      executive_order_number: 14001,
      signing_date: "2025-01-20",
      abstract: "This order enhances border security measures and enforcement.",
      html_url: "https://www.federalregister.gov/documents/2025/01/20/2025-00123/executive-order-on-border-security",
      pdf_url: "https://www.federalregister.gov/documents/2025/01/20/2025-00123/executive-order-on-border-security.pdf"
    },
    {
      document_number: "2025-00124",
      title: "Executive Order on Energy Independence",
      executive_order_number: 14002,
      signing_date: "2025-01-21",
      abstract: "This order promotes domestic energy production and reduces regulatory barriers.",
      html_url: "https://www.federalregister.gov/documents/2025/01/21/2025-00124/executive-order-on-energy-independence",
      pdf_url: "https://www.federalregister.gov/documents/2025/01/21/2025-00124/executive-order-on-energy-independence.pdf"
    },
    {
      document_number: "2025-00125",
      title: "Executive Order on Federal Workforce",
      executive_order_number: 14003,
      signing_date: "2025-01-22",
      abstract: "This order restructures federal workforce policies and remote work guidelines.",
      html_url: "https://www.federalregister.gov/documents/2025/01/22/2025-00125/executive-order-on-federal-workforce",
      pdf_url: "https://www.federalregister.gov/documents/2025/01/22/2025-00125/executive-order-on-federal-workforce.pdf"
    }
  ],
  count: 3,
  total_pages: 1
};

describe("ExecutiveOrdersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockExecutiveOrders,
    });
  });

  it("renders executive order list", async () => {
    render(await ExecutiveOrdersPage());
    
    await waitFor(() => {
      expect(screen.getByText("Executive Order on Border Security")).toBeDefined();
      expect(screen.getByText("Executive Order on Energy Independence")).toBeDefined();
      expect(screen.getByText("Executive Order on Federal Workforce")).toBeDefined();
    });
  });

  it("shows EO number and title", async () => {
    render(await ExecutiveOrdersPage());
    
    await waitFor(() => {
      expect(screen.getByText("EO 14001")).toBeDefined();
      expect(screen.getByText("Executive Order on Border Security")).toBeDefined();
    });
  });

  it("displays signing dates", async () => {
    render(await ExecutiveOrdersPage());
    
    await waitFor(() => {
      expect(screen.getByText("January 20, 2025")).toBeDefined();
      expect(screen.getByText("January 21, 2025")).toBeDefined();
    });
  });

  it("shows executive order summaries", async () => {
    render(await ExecutiveOrdersPage());
    
    await waitFor(() => {
      expect(screen.getByText("This order enhances border security measures and enforcement.")).toBeDefined();
    });
  });

  it("links to Federal Register", async () => {
    render(await ExecutiveOrdersPage());
    
    await waitFor(() => {
      const links = screen.getAllByText("Read Full Text →");
      expect(links.length).toBeGreaterThan(0);
      
      const firstLink = links[0] as HTMLAnchorElement;
      expect(firstLink.href).toContain("federalregister.gov");
    });
  });

  it("displays page heading", async () => {
    render(await ExecutiveOrdersPage());
    
    expect(screen.getByText("Executive Orders")).toBeDefined();
  });

  it("shows total count", async () => {
    render(await ExecutiveOrdersPage());
    
    await waitFor(() => {
      expect(screen.getByText(/3\s+Executive Orders/i)).toBeDefined();
    });
  });

  it("handles API errors gracefully", async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
    });

    render(await ExecutiveOrdersPage());
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load/i)).toBeDefined();
    });
  });

  it("has back navigation link", async () => {
    render(await ExecutiveOrdersPage());
    
    const backLink = screen.getByText("← Back to President");
    expect(backLink).toBeDefined();
  });
});
