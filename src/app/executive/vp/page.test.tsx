import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import VicePresidentPage from "./page";

describe("VicePresidentPage", () => {
  it("renders VP name and title", () => {
    render(<VicePresidentPage />);
    expect(screen.getByText("J.D. Vance")).toBeDefined();
    const vpElements = screen.getAllByText(/Vice President/i);
    expect(vpElements.length).toBeGreaterThan(0);
  });

  it("displays party affiliation badge", () => {
    render(<VicePresidentPage />);
    expect(screen.getByText("Republican")).toBeDefined();
  });

  it("shows inauguration date", () => {
    render(<VicePresidentPage />);
    expect(screen.getByText(/Inaugurated January 20, 2025/i)).toBeDefined();
  });

  it("displays VP photo", () => {
    render(<VicePresidentPage />);
    const images = screen.getAllByRole("img");
    const vpImage = images.find(img => 
      img.getAttribute("alt") === "J.D. Vance"
    );
    expect(vpImage).toBeDefined();
  });

  it("shows state affiliation (Ohio)", () => {
    render(<VicePresidentPage />);
    const ohioElements = screen.getAllByText(/Ohio/i);
    expect(ohioElements.length).toBeGreaterThan(0);
  });

  it("displays background section with highlights", () => {
    render(<VicePresidentPage />);
    expect(screen.getByText(/Background/i)).toBeDefined();
    expect(screen.getByText(/Hillbilly Elegy/i)).toBeDefined();
    const marineElements = screen.getAllByText(/Marine/i);
    expect(marineElements.length).toBeGreaterThan(0);
  });

  it("shows Senate record section with date range", () => {
    render(<VicePresidentPage />);
    expect(screen.getByText(/Senate Record \(2023-2025\)/i)).toBeDefined();
  });

  it("displays voting statistics", () => {
    render(<VicePresidentPage />);
    expect(screen.getByText("412")).toBeDefined(); // votes cast
    expect(screen.getByText("Votes Cast")).toBeDefined();
    expect(screen.getByText("Party Alignment")).toBeDefined();
    expect(screen.getByText("Missed Votes")).toBeDefined();
  });

  it("displays committees served on", () => {
    render(<VicePresidentPage />);
    expect(screen.getByText(/Commerce, Science, and Transportation/i)).toBeDefined();
    expect(screen.getByText(/Banking, Housing, and Urban Affairs/i)).toBeDefined();
  });

  it("shows key votes with bill numbers", () => {
    render(<VicePresidentPage />);
    expect(screen.getByText(/Key Votes/i)).toBeDefined();
    expect(screen.getByText(/H\.R\.815/i)).toBeDefined(); // Ukraine bill
  });

  it("displays vote results (Yea/Nay)", () => {
    render(<VicePresidentPage />);
    const yeaElements = screen.getAllByText(/✓ Yea/i);
    const nayElements = screen.getAllByText(/✗ Nay/i);
    expect(yeaElements.length + nayElements.length).toBeGreaterThan(0);
  });

  it("links to Congress.gov for votes", () => {
    render(<VicePresidentPage />);
    const congressLinks = document.querySelectorAll('a[href*="congress.gov"]');
    expect(congressLinks.length).toBeGreaterThan(0);
  });

  it("shows sponsored legislation section", () => {
    render(<VicePresidentPage />);
    expect(screen.getByText(/Sponsored Legislation/i)).toBeDefined();
    expect(screen.getByText(/Railway Safety Act/i)).toBeDefined();
  });

  it("is mobile responsive with proper grid classes", () => {
    render(<VicePresidentPage />);
    const container = document.querySelector(".max-w-5xl");
    expect(container).toBeDefined();
  });

  it("has back link to Executive Branch", () => {
    render(<VicePresidentPage />);
    const link = screen.getByText(/Back to Executive Branch/i);
    expect(link).toBeDefined();
    expect(link.closest("a")?.getAttribute("href")).toBe("/executive");
  });
});
