// Header.test.jsx
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Header from "./Header";
import styles from "./Header.module.css";

// Mock SearchBar component
vi.mock("../SearchBar/SearchBar", () => ({
  default: () => <div data-testid="search-bar">SearchBar</div>,
}));

// Mock the griffin icon import
vi.mock("../../../assets/griffin.png", () => ({
  default: "mocked-griffin-icon.png",
}));

describe("Header component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderHeader = () => {
    return render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
  };

  it("renders header with banner role", () => {
    renderHeader();

    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
  });

  it("renders logo image with correct attributes", () => {
    renderHeader();

    const logo = screen.getByAltText("Libraea Griffin Logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "mocked-griffin-icon.png");
    expect(logo).toHaveAttribute("height", "40");
  });

  it("renders Libraea title as heading", () => {
    renderHeader();

    const heading = screen.getByRole("heading", { name: "Libraea", level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it("renders logo link to home page", () => {
    renderHeader();

    const logoLink = screen.getByRole("link", { name: "Libraea" });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute("href", "/");
  });

  it("renders SearchBar component", () => {
    renderHeader();

    expect(screen.getByTestId("search-bar")).toBeInTheDocument();
  });

  it("renders navigation with proper ARIA label", () => {
    renderHeader();

    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    expect(nav).toBeInTheDocument();
  });

  it("renders My Library link", () => {
    renderHeader();

    const libraryLink = screen.getByRole("link", { name: "My Library" });
    expect(libraryLink).toBeInTheDocument();
    expect(libraryLink).toHaveAttribute("href", "/my-library");
  });

  it("renders with correct header class", () => {
    const { container } = renderHeader();

    const header = container.querySelector(`.${styles.header}`);
    expect(header).toBeInTheDocument();
  });

  it("renders logo with correct classes", () => {
    const { container } = renderHeader();

    const logoDiv = container.querySelector(`.${styles.logo}`);
    expect(logoDiv).toBeInTheDocument();

    const logoIcon = container.querySelector(`.${styles.logoIcon}`);
    expect(logoIcon).toBeInTheDocument();

    const logoLink = container.querySelector(`.${styles.logoLink}`);
    expect(logoLink).toBeInTheDocument();

    const logoText = container.querySelector(`.${styles.logoText}`);
    expect(logoText).toBeInTheDocument();
  });

  it("renders navigation with correct classes", () => {
    const { container } = renderHeader();

    const navigation = container.querySelector(`.${styles.navigation}`);
    expect(navigation).toBeInTheDocument();

    const libraryLink = container.querySelector(`.${styles.library}`);
    expect(libraryLink).toBeInTheDocument();
  });

  it("has all required links in correct order", () => {
    renderHeader();

    const links = screen.getAllByRole("link");

    // Should have 2 links: logo link and My Library link
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "/");
    expect(links[1]).toHaveAttribute("href", "/my-library");
  });

  it("renders all main sections (logo, search, navigation)", () => {
    const { container } = renderHeader();

    expect(container.querySelector(`.${styles.logo}`)).toBeInTheDocument();
    expect(screen.getByTestId("search-bar")).toBeInTheDocument();
    expect(
      container.querySelector(`.${styles.navigation}`)
    ).toBeInTheDocument();
  });

  it("logo image has proper accessibility attributes", () => {
    renderHeader();

    const logo = screen.getByAltText("Libraea Griffin Logo");
    expect(logo).toHaveAttribute("alt");
    expect(logo.getAttribute("alt")).not.toBe("");
  });

  it("maintains semantic HTML structure", () => {
    const { container } = renderHeader();

    // Check for proper semantic elements
    expect(container.querySelector("header")).toBeInTheDocument();
    expect(container.querySelector("nav")).toBeInTheDocument();
    expect(container.querySelector("h1")).toBeInTheDocument();
    expect(container.querySelector("img")).toBeInTheDocument();
  });

  it("renders logo link as first interactive element", () => {
    renderHeader();

    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveTextContent("Libraea");
  });

  it("navigation section contains correct number of links", () => {
    renderHeader();

    const nav = screen.getByRole("navigation");
    const linksInNav = nav.querySelectorAll("a");

    expect(linksInNav).toHaveLength(1);
  });

  it("all links are keyboard accessible", () => {
    renderHeader();

    const links = screen.getAllByRole("link");

    links.forEach((link) => {
      // Links should be focusable
      expect(link).not.toHaveAttribute("tabindex", "-1");
    });
  });
});
