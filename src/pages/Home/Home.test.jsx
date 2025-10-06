// Home.test.jsx
// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./Home";
import styles from "./Home.module.css";

// Mock child components
vi.mock("../../components/Hero/Hero", () => ({
  default: () => <div data-testid="hero">Hero</div>,
}));

vi.mock("../../components/Dashboard/Dashboard", () => ({
  default: () => <div data-testid="dashboard">Dashboard</div>,
}));

describe("Home component", () => {
  it("renders Hero and Dashboard components", () => {
    render(<Home />);

    // Check that Hero is rendered
    expect(screen.getByTestId("hero")).toBeInTheDocument();

    // Check that Dashboard is rendered
    expect(screen.getByTestId("dashboard")).toBeInTheDocument();
  });

  it("renders with correct container class", () => {
    const { container } = render(<Home />);

    // Check that the home container div has the CSS module class
    const homeDiv = container.firstChild;
    expect(homeDiv).toHaveClass(styles.home);
  });
});
