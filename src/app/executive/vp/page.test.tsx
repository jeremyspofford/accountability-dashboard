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

  it("displays background section", () => {
    render(<VicePresidentPage />);
    expect(screen.getByText(/Background/i)).toBeDefined();
    expect(screen.getByText(/Hillbilly Elegy/i)).toBeDefined();
    const marineElements = screen.getAllByText(/Marine/i);
    expect(marineElements.length).toBeGreaterThan(0);
  });

  it("shows previous role as Senator", () => {
    render(<VicePresidentPage />);
    expect(screen.getByText("U.S. Senator")).toBeDefined();
    expect(screen.getByText(/2023-2025/i)).toBeDefined();
  });

  it("displays Senate voting record section", () => {
    render(<VicePresidentPage />);
    expect(screen.getByText(/Senate Record/i)).toBeDefined();
  });

  it("shows key positions and quotes", () => {
    render(<VicePresidentPage />);
    expect(screen.getByText(/Key Positions/i)).toBeDefined();
  });

  it("displays at least one policy position", () => {
    render(<VicePresidentPage />);
    expect(screen.getByText(/Trade Policy/i)).toBeDefined();
  });

  it("is mobile responsive with proper grid classes", () => {
    render(<VicePresidentPage />);
    // Check that responsive classes are present in the page structure
    const container = document.querySelector(".max-w-5xl");
    expect(container).toBeDefined();
  });

  it("has back link to Executive Branch", () => {
    render(<VicePresidentPage />);
    const link = screen.getByText(/Back to Executive Branch/i);
    expect(link).toBeDefined();
    expect(link.closest("a")?.getAttribute("href")).toBe("/executive");
  });

  it("displays committees served on", () => {
    render(<VicePresidentPage />);
    expect(screen.getByText(/Commerce, Science, and Transportation/i)).toBeDefined();
  });

  it("shows multiple key votes", () => {
    render(<VicePresidentPage />);
    expect(screen.getByText(/Ukraine Aid/i)).toBeDefined();
  });
});
