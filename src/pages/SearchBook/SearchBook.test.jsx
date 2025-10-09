// SearchBook.test.jsx
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import SearchBook from "./SearchBook";
import styles from "./SearchBook.module.css";

// Mock the useSearch hook
vi.mock("../../hooks/useSearch");

// Mock BookCard component
vi.mock("../../components/common/BookCard/BookCard", () => ({
  default: ({ book }) => (
    <div data-testid={`book-card-${book.key}`}>{book.title}</div>
  ),
}));

// Mock Button component
vi.mock("../../components/common/Button/Button", () => ({
  default: ({ onClick, text, type, ...props }) => (
    <button onClick={onClick} type={type} {...props}>
      {text}
    </button>
  ),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  ChevronDown: () => <span data-testid="chevron-down-icon">▼</span>,
  RefreshCw: () => <span data-testid="refresh-icon">↻</span>,
}));

// Mock ScrollRestoration
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    ScrollRestoration: () => null,
  };
});

import { useSearch } from "../../hooks/useSearch";

describe("SearchBook component", () => {
  const mockSearchBooks = vi.fn();
  const mockRetrySearch = vi.fn();

  const mockBooks = [
    { key: "/works/1", title: "Book 1" },
    { key: "/works/2", title: "Book 2" },
    { key: "/works/3", title: "Book 3" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderSearchBook = () => {
    return render(
      <BrowserRouter>
        <SearchBook />
      </BrowserRouter>
    );
  };

  it("renders loading state when searching", () => {
    useSearch.mockReturnValue({
      searchResults: [],
      loading: true,
      error: null,
      hasSearched: true,
      more: false,
      currentQuery: "test",
      searchBooks: mockSearchBooks,
      retrySearch: mockRetrySearch,
    });

    renderSearchBook();

    expect(screen.getByText("Searching for books...")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders error state with retry button", () => {
    const errorMessage = "Failed to fetch results";
    useSearch.mockReturnValue({
      searchResults: [],
      loading: false,
      error: errorMessage,
      hasSearched: true,
      more: false,
      currentQuery: "test",
      searchBooks: mockSearchBooks,
      retrySearch: mockRetrySearch,
    });

    renderSearchBook();

    expect(screen.getByText("Search Failed")).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText("Try Again")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("calls retrySearch when retry button is clicked", async () => {
    const user = userEvent.setup();
    useSearch.mockReturnValue({
      searchResults: [],
      loading: false,
      error: "Network error",
      hasSearched: true,
      more: false,
      currentQuery: "test",
      searchBooks: mockSearchBooks,
      retrySearch: mockRetrySearch,
    });

    renderSearchBook();

    const retryButton = screen.getByText("Try Again");
    await user.click(retryButton);

    expect(mockRetrySearch).toHaveBeenCalledTimes(1);
  });

  it("renders prompt when no search has been performed", () => {
    useSearch.mockReturnValue({
      searchResults: [],
      loading: false,
      error: null,
      hasSearched: false,
      more: false,
      currentQuery: "",
      searchBooks: mockSearchBooks,
      retrySearch: mockRetrySearch,
    });

    renderSearchBook();

    expect(screen.getByText("Ready to Explore?")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Use the search bar above to discover your next great read"
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Search Tips:")).toBeInTheDocument();
  });

  it("renders no results message when search returns empty", () => {
    const query = "nonexistent book";
    useSearch.mockReturnValue({
      searchResults: [],
      loading: false,
      error: null,
      hasSearched: true,
      more: false,
      currentQuery: query,
      searchBooks: mockSearchBooks,
      retrySearch: mockRetrySearch,
    });

    renderSearchBook();

    expect(screen.getByText("No Books Found")).toBeInTheDocument();
    expect(
      screen.getByText(`We couldn't find any books matching "${query}"`)
    ).toBeInTheDocument();
    expect(screen.getByText("Try:")).toBeInTheDocument();
  });

  it("renders search results with header", () => {
    const query = "javascript";
    useSearch.mockReturnValue({
      searchResults: mockBooks,
      loading: false,
      error: null,
      hasSearched: true,
      more: false,
      currentQuery: query,
      searchBooks: mockSearchBooks,
      retrySearch: mockRetrySearch,
    });

    renderSearchBook();

    expect(
      screen.getByText(`Search Results for "${query}"`)
    ).toBeInTheDocument();
    expect(screen.getByText("Showing 3 results")).toBeInTheDocument();

    // Check that all books are rendered
    expect(screen.getByTestId("book-card-/works/1")).toBeInTheDocument();
    expect(screen.getByTestId("book-card-/works/2")).toBeInTheDocument();
    expect(screen.getByTestId("book-card-/works/3")).toBeInTheDocument();
  });

  it("shows load more button when more results are available", () => {
    useSearch.mockReturnValue({
      searchResults: mockBooks,
      loading: false,
      error: null,
      hasSearched: true,
      more: true,
      currentQuery: "test",
      searchBooks: mockSearchBooks,
      retrySearch: mockRetrySearch,
    });

    renderSearchBook();

    expect(screen.getByText("Load More Results")).toBeInTheDocument();
    expect(screen.getByText("Click to see more results")).toBeInTheDocument();
  });

  it("calls searchBooks with next page when load more is clicked", async () => {
    const user = userEvent.setup();
    useSearch.mockReturnValue({
      searchResults: mockBooks,
      loading: false,
      error: null,
      hasSearched: true,
      more: true,
      currentQuery: "test",
      searchBooks: mockSearchBooks,
      retrySearch: mockRetrySearch,
    });

    renderSearchBook();

    const loadMoreButton = screen.getByText("Load More Results");
    await user.click(loadMoreButton);

    await waitFor(() => {
      expect(mockSearchBooks).toHaveBeenCalledWith("test", 2);
    });
  });

  it("shows loading state when loading more results", async () => {
    const user = userEvent.setup();
    mockSearchBooks.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    useSearch.mockReturnValue({
      searchResults: mockBooks,
      loading: false,
      error: null,
      hasSearched: true,
      more: true,
      currentQuery: "test",
      searchBooks: mockSearchBooks,
      retrySearch: mockRetrySearch,
    });

    renderSearchBook();

    const loadMoreButton = screen.getByText("Load More Results");
    await user.click(loadMoreButton);

    expect(screen.getByText("Loading More...")).toBeInTheDocument();
    expect(
      screen.getByText("Finding more books for you...")
    ).toBeInTheDocument();
  });

  it("shows end message when all results are loaded", () => {
    const manyBooks = Array.from({ length: 15 }, (_, i) => ({
      key: `/works/${i}`,
      title: `Book ${i}`,
    }));

    useSearch.mockReturnValue({
      searchResults: manyBooks,
      loading: false,
      error: null,
      hasSearched: true,
      more: false,
      currentQuery: "test",
      searchBooks: mockSearchBooks,
      retrySearch: mockRetrySearch,
    });

    renderSearchBook();

    expect(
      screen.getByText("You've reached the end of the search results")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Try a different search to discover more books")
    ).toBeInTheDocument();
  });

  it("displays correct result count with more available", () => {
    useSearch.mockReturnValue({
      searchResults: mockBooks,
      loading: false,
      error: null,
      hasSearched: true,
      more: true,
      currentQuery: "test",
      searchBooks: mockSearchBooks,
      retrySearch: mockRetrySearch,
    });

    renderSearchBook();

    expect(
      screen.getByText("Showing 3 results (more available)")
    ).toBeInTheDocument();
  });

  it("has proper ARIA attributes for search results", () => {
    useSearch.mockReturnValue({
      searchResults: mockBooks,
      loading: false,
      error: null,
      hasSearched: true,
      more: false,
      currentQuery: "test",
      searchBooks: mockSearchBooks,
      retrySearch: mockRetrySearch,
    });

    renderSearchBook();

    const resultsGrid = screen.getByRole("grid", { name: /search results/i });
    expect(resultsGrid).toBeInTheDocument();
  });

  it("renders with correct container class", () => {
    useSearch.mockReturnValue({
      searchResults: [],
      loading: false,
      error: null,
      hasSearched: false,
      more: false,
      currentQuery: "",
      searchBooks: mockSearchBooks,
      retrySearch: mockRetrySearch,
    });

    const { container } = renderSearchBook();
    const containerDiv = container.querySelector(`.${styles.container}`);
    expect(containerDiv).toBeInTheDocument();
  });

  it("does not call searchBooks when load more is clicked without currentQuery", async () => {
    const user = userEvent.setup();
    useSearch.mockReturnValue({
      searchResults: mockBooks,
      loading: false,
      error: null,
      hasSearched: true,
      more: true,
      currentQuery: "",
      searchBooks: mockSearchBooks,
      retrySearch: mockRetrySearch,
    });

    renderSearchBook();

    const loadMoreButton = screen.getByText("Load More Results");
    await user.click(loadMoreButton);

    expect(mockSearchBooks).not.toHaveBeenCalled();
  });

  it("prevents multiple simultaneous load more requests", async () => {
    const user = userEvent.setup();
    mockSearchBooks.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    useSearch.mockReturnValue({
      searchResults: mockBooks,
      loading: false,
      error: null,
      hasSearched: true,
      more: true,
      currentQuery: "test",
      searchBooks: mockSearchBooks,
      retrySearch: mockRetrySearch,
    });

    renderSearchBook();

    const loadMoreButton = screen.getByText("Load More Results");

    // Click multiple times rapidly
    await user.click(loadMoreButton);
    await user.click(loadMoreButton);
    await user.click(loadMoreButton);

    // Should only be called once
    await waitFor(() => {
      expect(mockSearchBooks).toHaveBeenCalledTimes(1);
    });
  });
});
