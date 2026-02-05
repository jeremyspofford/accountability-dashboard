import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CabinetPage from "./page";

describe("CabinetPage", () => {
  it("renders cabinet grid", () => {
    render(<CabinetPage />);
    expect(screen.getByText("Cabinet Members")).toBeDefined();
  });

  it("shows member name and role", () => {
    render(<CabinetPage />);
    // Check for Secretary of State
    expect(screen.getByText("Marco Rubio")).toBeDefined();
    expect(screen.getByText("Secretary of State")).toBeDefined();
  });

  it("shows multiple cabinet members", () => {
    render(<CabinetPage />);
    // Check for several members
    expect(screen.getByText("Marco Rubio")).toBeDefined();
    expect(screen.getByText("Pete Hegseth")).toBeDefined();
    expect(screen.getByText("Pam Bondi")).toBeDefined();
  });

  it("links to individual pages", () => {
    render(<CabinetPage />);
    const links = screen.getAllByRole("link");
    // Should have links for each cabinet member
    expect(links.length).toBeGreaterThan(0);
  });

  it("displays on mobile responsive grid (2 cols)", () => {
    render(<CabinetPage />);
    const grid = screen.getByTestId("cabinet-grid");
    expect(grid.className).toContain("grid-cols-2");
  });

  it("displays on desktop responsive grid (4 cols)", () => {
    render(<CabinetPage />);
    const grid = screen.getByTestId("cabinet-grid");
    expect(grid.className).toContain("md:grid-cols-4");
  });

  it("shows department information", () => {
    render(<CabinetPage />);
    expect(screen.getByText("Department of State")).toBeDefined();
  });

  it("displays cabinet member photos", () => {
    render(<CabinetPage />);
    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThan(0);
  });
});
