// Hero.test.jsx
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Hero from "./Hero";
import styles from "./Hero.module.css";

// Mock hooks
vi.mock("../../hooks/useMobile");

// Mock Button component
vi.mock("../common/Button/Button", () => ({
  default: ({ text, link, className, ...props }) => (
    <a href={link} className={className} {...props}>
      {text}
    </a>
  ),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  BookOpen: (props) => (
    <span data-testid="book-open-icon" {...props}>
      📖
    </span>
  ),
  Star: (props) => (
    <span data-testid="star-icon" {...props}>
      ⭐
    </span>
  ),
  Bookmark: (props) => (
    <span data-testid="bookmark-icon" {...props}>
      🔖
    </span>
  ),
}));

import useMobile from "../../hooks/useMobile";

describe("Hero component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    useMobile.mockReturnValue(false);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderHero = () => {
    return render(
      <BrowserRouter>
        <Hero />
      </BrowserRouter>
    );
  };

  it("renders hero title", () => {
    renderHero();

    expect(screen.getByText("Track Your Reading Universe")).toBeInTheDocument();
  });

  it("renders desktop subtitle when not on mobile", () => {
    useMobile.mockReturnValue(false);
    renderHero();

    expect(
      screen.getByText(
        "Discover, organize, and celebrate your literary journey with the ultimate book tracking experience"
      )
    ).toBeInTheDocument();
  });

  it("renders mobile subtitle when on mobile", () => {
    useMobile.mockReturnValue(true);
    renderHero();

    expect(
      screen.getByText(
        "Discover, organize, and celebrate your literary journey"
      )
    ).toBeInTheDocument();
  });

  it("renders all three feature items", () => {
    renderHero();

    expect(screen.getByText("Track Books")).toBeInTheDocument();
    expect(screen.getByText("Save Favorites")).toBeInTheDocument();
    expect(screen.getByText("Find new books")).toBeInTheDocument();
  });

  it("renders feature icons", () => {
    renderHero();

    expect(screen.getByTestId("book-open-icon")).toBeInTheDocument();
    expect(screen.getByTestId("star-icon")).toBeInTheDocument();
    expect(screen.getByTestId("bookmark-icon")).toBeInTheDocument();
  });

  it("renders View My Library button", () => {
    renderHero();

    const libraryButton = screen.getByText("View My Library");
    expect(libraryButton).toBeInTheDocument();
    expect(libraryButton).toHaveAttribute("href", "/my-library");
  });

  it("renders Start Exploring button on desktop", () => {
    useMobile.mockReturnValue(false);
    renderHero();

    const exploreButton = screen.getByText("Start Exploring");
    expect(exploreButton).toBeInTheDocument();
    expect(exploreButton).toHaveAttribute("href", "/search");
  });

  it("does not render Start Exploring button on mobile", () => {
    useMobile.mockReturnValue(true);
    renderHero();

    expect(screen.queryByText("Start Exploring")).not.toBeInTheDocument();
  });

  it("applies visible class after animation delay", async () => {
    const { container } = renderHero();

    const content = container.querySelector(`.${styles.content}`);

    // Should not have visible class initially
    expect(content).not.toHaveClass(styles.visible);

    // Run all pending timers
    await act(async () => {
      vi.runAllTimers();
    });

    // Check if visible class is applied
    expect(content).toHaveClass(styles.visible);
  });

  it("has proper ARIA attributes", () => {
    renderHero();

    const banner = screen.getByRole("banner");
    expect(banner).toHaveAttribute("aria-labelledby", "hero-title");

    const title = screen.getByText("Track Your Reading Universe");
    expect(title).toHaveAttribute("id", "hero-title");

    const features = screen.getByLabelText("Key features");
    expect(features).toBeInTheDocument();
  });

  it("renders overlay with aria-hidden", () => {
    const { container } = renderHero();

    const overlay = container.querySelector(`.${styles.overlay}`);
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveAttribute("aria-hidden", "true");
  });

  it("feature icons have aria-hidden attribute", () => {
    renderHero();

    const bookIcon = screen.getByTestId("book-open-icon");
    const starIcon = screen.getByTestId("star-icon");
    const bookmarkIcon = screen.getByTestId("bookmark-icon");

    expect(bookIcon).toHaveAttribute("aria-hidden", "true");
    expect(starIcon).toHaveAttribute("aria-hidden", "true");
    expect(bookmarkIcon).toHaveAttribute("aria-hidden", "true");
  });

  it("renders as a section element", () => {
    const { container } = renderHero();

    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass(styles.hero);
  });

  it("renders with correct hero class", () => {
    const { container } = renderHero();

    const hero = container.querySelector(`.${styles.hero}`);
    expect(hero).toBeInTheDocument();
  });

  it("renders title as h1 element", () => {
    renderHero();

    const heading = screen.getByRole("heading", {
      name: "Track Your Reading Universe",
      level: 1,
    });
    expect(heading).toBeInTheDocument();
  });

  it("renders all action buttons in actions section", () => {
    useMobile.mockReturnValue(false);
    const { container } = renderHero();

    const actions = container.querySelector(`.${styles.actions}`);
    expect(actions).toBeInTheDocument();

    const buttons = actions.querySelectorAll("a");
    expect(buttons).toHaveLength(2);
  });

  it("renders only one button on mobile", () => {
    useMobile.mockReturnValue(true);
    const { container } = renderHero();

    const actions = container.querySelector(`.${styles.actions}`);
    const buttons = actions.querySelectorAll("a");
    expect(buttons).toHaveLength(1);
  });

  it("renders features in correct order", () => {
    renderHero();

    const featureTexts = screen.getAllByText(
      /Track Books|Save Favorites|Find new books/
    );

    expect(featureTexts[0]).toHaveTextContent("Track Books");
    expect(featureTexts[1]).toHaveTextContent("Save Favorites");
    expect(featureTexts[2]).toHaveTextContent("Find new books");
  });

  it("has proper structure with content wrapper", () => {
    const { container } = renderHero();

    const content = container.querySelector(`.${styles.content}`);
    expect(content).toBeInTheDocument();

    // Check that content contains title, subtitle, features, and actions
    expect(content.querySelector(`.${styles.title}`)).toBeInTheDocument();
    expect(content.querySelector(`.${styles.subtitle}`)).toBeInTheDocument();
    expect(content.querySelector(`.${styles.features}`)).toBeInTheDocument();
    expect(content.querySelector(`.${styles.actions}`)).toBeInTheDocument();
  });

  it("button aria-labels are descriptive", () => {
    renderHero();

    const libraryButton = screen.getByLabelText("Go to my personal library");
    expect(libraryButton).toBeInTheDocument();
  });

  it("renders Start Exploring button with correct aria-label on desktop", () => {
    useMobile.mockReturnValue(false);
    renderHero();

    const exploreButton = screen.getByLabelText("Start searching for books");
    expect(exploreButton).toBeInTheDocument();
  });
});
