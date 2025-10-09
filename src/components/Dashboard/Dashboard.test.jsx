// Dashboard.test.jsx
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Dashboard from "./Dashboard";
import styles from "./Dashboard.module.css";

// Mock hooks
vi.mock("../../hooks/useBooks");

// Mock child components
vi.mock("../common/BookCard/BookCard", () => ({
  default: ({ book }) => (
    <div data-testid={`book-card-${book.key}`}>{book.title}</div>
  ),
}));

vi.mock("../common/Button/Button", () => ({
  default: ({ text, link }) => (
    <a href={link} data-testid="view-all-button">
      {text}
    </a>
  ),
}));

vi.mock("../common/Searches/Searches", () => ({
  default: ({ text }) => <button data-testid={`search-${text}`}>{text}</button>,
}));

// Mock uuid
vi.mock("uuid", () => ({
  v4: () => "mock-uuid-" + Math.random(),
}));

import { useBooks } from "../../hooks/useBooks";

describe("Dashboard component", () => {
  const mockBooks = [
    { key: "/works/1", title: "Book 1" },
    { key: "/works/2", title: "Book 2" },
    { key: "/works/3", title: "Book 3" },
    { key: "/works/4", title: "Book 4" },
    { key: "/works/5", title: "Book 5" },
    { key: "/works/6", title: "Book 6" },
  ];

  const mockSearches = [
    { query: "JavaScript", timestamp: "2024-01-01" },
    { query: "React", timestamp: "2024-01-02" },
    { query: "TypeScript", timestamp: "2024-01-03" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Suppress console.log for tests
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  const renderDashboard = () => {
    return render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
  };

  it("renders all three sections", () => {
    useBooks.mockReturnValue({
      favorites: [],
      wantToRead: [],
      recentlySearched: [],
    });

    renderDashboard();

    expect(screen.getByText("Your Favorites")).toBeInTheDocument();
    expect(screen.getByText("Up next")).toBeInTheDocument();
    expect(screen.getByText("Recently searched")).toBeInTheDocument();
  });

  it("displays favorite books when they exist", () => {
    useBooks.mockReturnValue({
      favorites: mockBooks.slice(0, 3),
      wantToRead: [],
      recentlySearched: [],
    });

    renderDashboard();

    expect(screen.getByTestId("book-card-/works/1")).toBeInTheDocument();
    expect(screen.getByTestId("book-card-/works/2")).toBeInTheDocument();
    expect(screen.getByTestId("book-card-/works/3")).toBeInTheDocument();
  });

  it("displays only first 5 favorites when more exist", () => {
    useBooks.mockReturnValue({
      favorites: mockBooks,
      wantToRead: [],
      recentlySearched: [],
    });

    renderDashboard();

    // Should show first 5
    expect(screen.getByTestId("book-card-/works/1")).toBeInTheDocument();
    expect(screen.getByTestId("book-card-/works/5")).toBeInTheDocument();
    // Should not show 6th
    expect(screen.queryByTestId("book-card-/works/6")).not.toBeInTheDocument();
  });

  it("shows View All button when favorites exist", () => {
    useBooks.mockReturnValue({
      favorites: mockBooks.slice(0, 3),
      wantToRead: [],
      recentlySearched: [],
    });

    renderDashboard();

    const viewAllButtons = screen.getAllByTestId("view-all-button");
    expect(viewAllButtons.length).toBeGreaterThan(0);
    expect(viewAllButtons[0]).toHaveAttribute("href", "/my-library");
  });

  it("does not show View All button when no favorites exist", () => {
    useBooks.mockReturnValue({
      favorites: [],
      wantToRead: mockBooks.slice(0, 3),
      recentlySearched: [],
    });

    renderDashboard();

    const viewAllButtons = screen.getAllByTestId("view-all-button");
    // Should only have 1 button (for wantToRead section)
    expect(viewAllButtons).toHaveLength(1);
  });

  it("displays want to read books when they exist", () => {
    useBooks.mockReturnValue({
      favorites: [],
      wantToRead: mockBooks.slice(0, 2),
      recentlySearched: [],
    });

    renderDashboard();

    expect(screen.getByTestId("book-card-/works/1")).toBeInTheDocument();
    expect(screen.getByTestId("book-card-/works/2")).toBeInTheDocument();
  });

  it("displays only first 5 want to read books when more exist", () => {
    useBooks.mockReturnValue({
      favorites: [],
      wantToRead: mockBooks,
      recentlySearched: [],
    });

    renderDashboard();

    // Should show first 5
    expect(screen.getByTestId("book-card-/works/1")).toBeInTheDocument();
    expect(screen.getByTestId("book-card-/works/5")).toBeInTheDocument();
    // Should not show 6th
    expect(screen.queryByTestId("book-card-/works/6")).not.toBeInTheDocument();
  });

  it("displays empty state for favorites when none exist", () => {
    useBooks.mockReturnValue({
      favorites: [],
      wantToRead: [],
      recentlySearched: [],
    });

    renderDashboard();

    const statusElements = screen.getAllByRole("status");
    expect(statusElements[0]).toHaveTextContent(/favorite books yet/);
  });

  it("displays empty state for want to read when none exist", () => {
    useBooks.mockReturnValue({
      favorites: [],
      wantToRead: [],
      recentlySearched: [],
    });

    renderDashboard();

    const statusElements = screen.getAllByRole("status");
    expect(statusElements[1]).toHaveTextContent(/saved books yet/);
  });

  it("shows View All button when want to read books exist", () => {
    useBooks.mockReturnValue({
      favorites: [],
      wantToRead: mockBooks.slice(0, 3),
      recentlySearched: [],
    });

    renderDashboard();

    const viewAllButtons = screen.getAllByTestId("view-all-button");
    expect(viewAllButtons).toHaveLength(1);
    expect(viewAllButtons[0]).toHaveAttribute("href", "/my-library");
  });

  it("displays recently searched queries when they exist", () => {
    useBooks.mockReturnValue({
      favorites: [],
      wantToRead: [],
      recentlySearched: mockSearches,
    });

    renderDashboard();

    expect(screen.getByTestId("search-JavaScript")).toBeInTheDocument();
    expect(screen.getByTestId("search-React")).toBeInTheDocument();
    expect(screen.getByTestId("search-TypeScript")).toBeInTheDocument();
  });

  it("displays only first 5 recently searched queries when more exist", () => {
    const manySearches = [
      { query: "Search 1" },
      { query: "Search 2" },
      { query: "Search 3" },
      { query: "Search 4" },
      { query: "Search 5" },
      { query: "Search 6" },
    ];

    useBooks.mockReturnValue({
      favorites: [],
      wantToRead: [],
      recentlySearched: manySearches,
    });

    renderDashboard();

    expect(screen.getByTestId("search-Search 1")).toBeInTheDocument();
    expect(screen.getByTestId("search-Search 5")).toBeInTheDocument();
    expect(screen.queryByTestId("search-Search 6")).not.toBeInTheDocument();
  });

  it("displays empty state for recently searched when none exist", () => {
    useBooks.mockReturnValue({
      favorites: [],
      wantToRead: [],
      recentlySearched: [],
    });

    renderDashboard();

    expect(
      screen.getByText("Search. Use the bar at the top.")
    ).toBeInTheDocument();
  });

  it("renders with correct section classes", () => {
    useBooks.mockReturnValue({
      favorites: [],
      wantToRead: [],
      recentlySearched: [],
    });

    const { container } = renderDashboard();

    expect(container.querySelector(`.${styles.dashboard}`)).toBeInTheDocument();
    expect(container.querySelector(`.${styles.favorites}`)).toBeInTheDocument();
    expect(
      container.querySelector(`.${styles.wantToRead}`)
    ).toBeInTheDocument();
    expect(
      container.querySelector(`.${styles.recentlySearched}`)
    ).toBeInTheDocument();
  });

  it("applies grid class when favorites exist", () => {
    useBooks.mockReturnValue({
      favorites: mockBooks.slice(0, 3),
      wantToRead: [],
      recentlySearched: [],
    });

    const { container } = renderDashboard();

    const favoritesSection = container.querySelector(`.${styles.favorites}`);
    const gridDiv = favoritesSection.querySelector(`.${styles.grid}`);
    expect(gridDiv).toBeInTheDocument();
  });

  it("applies flex class when no favorites exist", () => {
    useBooks.mockReturnValue({
      favorites: [],
      wantToRead: [],
      recentlySearched: [],
    });

    const { container } = renderDashboard();

    const favoritesSection = container.querySelector(`.${styles.favorites}`);
    const flexDiv = favoritesSection.querySelector(`.${styles.flex}`);
    expect(flexDiv).toBeInTheDocument();
  });

  it("has proper ARIA labels for favorites section", () => {
    useBooks.mockReturnValue({
      favorites: [],
      wantToRead: [],
      recentlySearched: [],
    });

    renderDashboard();

    const favoritesSection = screen.getByText("Your Favorites").closest("div");
    expect(favoritesSection).toHaveAttribute(
      "aria-labelledby",
      "favorites-heading"
    );

    const heading = screen.getByText("Your Favorites");
    expect(heading).toHaveAttribute("id", "favorites-heading");
  });

  it("has proper role attributes for empty states", () => {
    useBooks.mockReturnValue({
      favorites: [],
      wantToRead: [],
      recentlySearched: [],
    });

    renderDashboard();

    const emptyStates = screen.getAllByRole("status");
    expect(emptyStates).toHaveLength(2); // favorites and wantToRead
  });

  it("renders all sections with data simultaneously", () => {
    useBooks.mockReturnValue({
      favorites: mockBooks.slice(0, 2),
      wantToRead: mockBooks.slice(2, 4),
      recentlySearched: mockSearches,
    });

    renderDashboard();

    // Check all sections have content
    expect(screen.getByTestId("book-card-/works/1")).toBeInTheDocument();
    expect(screen.getByTestId("book-card-/works/3")).toBeInTheDocument();
    expect(screen.getByTestId("search-JavaScript")).toBeInTheDocument();
  });

  it("renders as a section element", () => {
    useBooks.mockReturnValue({
      favorites: [],
      wantToRead: [],
      recentlySearched: [],
    });

    const { container } = renderDashboard();

    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass(styles.dashboard);
  });
});
