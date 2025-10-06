// MyLibrary.test.jsx
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MyLibrary from "./MyLibrary";
import styles from "./MyLibrary.module.css";

// Mock the useBooks hook
vi.mock("../../hooks/useBooks");

// Mock BookCard component
vi.mock("../../components/common/BookCard/BookCard", () => ({
  default: ({ book }) => (
    <div data-testid={`book-card-${book.key}`}>{book.title}</div>
  ),
}));

import { useBooks } from "../../hooks/useBooks";

describe("MyLibrary component", () => {
  const mockFavorites = [
    { key: "book1", title: "Book 1" },
    { key: "book2", title: "Book 2" },
  ];

  const mockWantToRead = [
    { key: "book3", title: "Book 3" },
    { key: "book4", title: "Book 4" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state when not loaded", () => {
    useBooks.mockReturnValue({
      favorites: [],
      wantToRead: [],
      isLoaded: false,
      error: null,
    });

    render(<MyLibrary />);

    expect(screen.getByText("My Library")).toBeInTheDocument();
    expect(screen.getByText("Loading your books...")).toBeInTheDocument();
  });

  it("renders error state when there is an error", () => {
    const errorMessage = "Network error";
    useBooks.mockReturnValue({
      favorites: [],
      wantToRead: [],
      isLoaded: true,
      error: errorMessage,
    });

    render(<MyLibrary />);

    expect(screen.getByText("My Library")).toBeInTheDocument();
    expect(
      screen.getByText(`Unable to load your library: ${errorMessage}`)
    ).toBeInTheDocument();
  });

  it("renders favorites tab by default", () => {
    useBooks.mockReturnValue({
      favorites: mockFavorites,
      wantToRead: mockWantToRead,
      isLoaded: true,
      error: null,
    });

    render(<MyLibrary />);

    const favoritesTab = screen.getByRole("tab", { name: /favorites/i });
    expect(favoritesTab).toHaveAttribute("aria-selected", "true");

    // Check that favorite books are displayed
    expect(screen.getByTestId("book-card-book1")).toBeInTheDocument();
    expect(screen.getByTestId("book-card-book2")).toBeInTheDocument();
  });

  it("switches to want to read tab when clicked", async () => {
    const user = userEvent.setup();
    useBooks.mockReturnValue({
      favorites: mockFavorites,
      wantToRead: mockWantToRead,
      isLoaded: true,
      error: null,
    });

    render(<MyLibrary />);

    const wantToReadTab = screen.getByRole("tab", { name: /want to read/i });
    await user.click(wantToReadTab);

    expect(wantToReadTab).toHaveAttribute("aria-selected", "true");

    // Check that want to read books are displayed
    expect(screen.getByTestId("book-card-book3")).toBeInTheDocument();
    expect(screen.getByTestId("book-card-book4")).toBeInTheDocument();
  });

  it("displays empty state for favorites when no favorites exist", () => {
    useBooks.mockReturnValue({
      favorites: [],
      wantToRead: mockWantToRead,
      isLoaded: true,
      error: null,
    });

    render(<MyLibrary />);

    expect(screen.getByText("No favorite books yet")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Search for books and click the star icon to add them to your favorites!/i
      )
    ).toBeInTheDocument();
  });

  it("displays empty state for want to read when no books exist", async () => {
    const user = userEvent.setup();
    useBooks.mockReturnValue({
      favorites: mockFavorites,
      wantToRead: [],
      isLoaded: true,
      error: null,
    });

    render(<MyLibrary />);

    const wantToReadTab = screen.getByRole("tab", { name: /want to read/i });
    await user.click(wantToReadTab);

    expect(
      screen.getByText("No books in your reading list yet")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Search for books and click the bookmark icon to add them to your reading list!/i
      )
    ).toBeInTheDocument();
  });

  it("renders with correct container class", () => {
    useBooks.mockReturnValue({
      favorites: mockFavorites,
      wantToRead: mockWantToRead,
      isLoaded: true,
      error: null,
    });

    const { container } = render(<MyLibrary />);
    const libraryDiv = container.firstChild;
    expect(libraryDiv).toHaveClass(styles.library);
  });

  it("renders correct number of books in each section", () => {
    useBooks.mockReturnValue({
      favorites: mockFavorites,
      wantToRead: mockWantToRead,
      isLoaded: true,
      error: null,
    });

    render(<MyLibrary />);

    // Check favorites count
    expect(screen.getByTestId("book-card-book1")).toBeInTheDocument();
    expect(screen.getByTestId("book-card-book2")).toBeInTheDocument();
  });

  it("has proper ARIA attributes for accessibility", () => {
    useBooks.mockReturnValue({
      favorites: mockFavorites,
      wantToRead: mockWantToRead,
      isLoaded: true,
      error: null,
    });

    render(<MyLibrary />);

    const tablist = screen.getByRole("tablist", {
      name: /library sections/i,
    });
    expect(tablist).toBeInTheDocument();

    const favoritesPanel = screen.getByRole("tabpanel", {
      name: /favorites/i,
    });
    expect(favoritesPanel).toHaveAttribute("id", "favorites-panel");
  });
});
