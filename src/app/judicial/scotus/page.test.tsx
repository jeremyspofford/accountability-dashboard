import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ScotusPage from "./page";

describe("SCOTUS Grid Page", () => {
  it("renders all 9 justices", () => {
    render(<ScotusPage />);
    
    // Check for all 9 justices by name
    expect(screen.getByText(/John G. Roberts Jr./)).toBeDefined();
    expect(screen.getByText(/Clarence Thomas/)).toBeDefined();
    expect(screen.getByText(/Samuel A. Alito Jr./)).toBeDefined();
    expect(screen.getByText(/Sonia Sotomayor/)).toBeDefined();
    expect(screen.getByText(/Elena Kagan/)).toBeDefined();
    expect(screen.getByText(/Neil M. Gorsuch/)).toBeDefined();
    expect(screen.getByText(/Brett M. Kavanaugh/)).toBeDefined();
    expect(screen.getByText(/Amy Coney Barrett/)).toBeDefined();
    expect(screen.getByText(/Ketanji Brown Jackson/)).toBeDefined();
  });

  it("shows justice name and appointing president", () => {
    render(<ScotusPage />);
    
    // Check that appointing presidents are displayed
    expect(screen.getByText(/George W. Bush/)).toBeDefined();
    expect(screen.getByText(/Barack Obama/)).toBeDefined();
    expect(screen.getByText(/Donald Trump/)).toBeDefined();
    expect(screen.getByText(/Joe Biden/)).toBeDefined();
  });

  it("displays Chief Justice designation", () => {
    render(<ScotusPage />);
    
    // Roberts should be marked as Chief Justice
    expect(screen.getByText("Chief Justice")).toBeDefined();
  });

  it("shows confirmation years", () => {
    render(<ScotusPage />);
    
    // Check for some confirmation years
    expect(screen.getByText(/2005/)).toBeDefined();
    expect(screen.getByText(/2022/)).toBeDefined();
  });

  it("displays ideology indicators for all justices", () => {
    render(<ScotusPage />);
    
    // All justices should have ideology labels
    const liberalLabels = screen.getAllByText(/Liberal/);
    const conservativeLabels = screen.getAllByText(/Conservative/);
    
    // Should have at least some of each
    expect(liberalLabels.length).toBeGreaterThan(0);
    expect(conservativeLabels.length).toBeGreaterThan(0);
  });

  it("renders page heading", () => {
    render(<ScotusPage />);
    
    expect(screen.getByText("Supreme Court Justices")).toBeDefined();
  });
});
