// useSearch.test.jsx
// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useSearch } from "./useSearch";
import { SearchContext } from "../context/SearchContext";

describe("useSearch hook", () => {
  it("returns context value when used within SearchProvider", () => {
    const mockContextValue = {
      searchResults: [],
      loading: false,
      error: null,
      hasSearched: false,
      more: false,
      currentQuery: "",
      searchBooks: vi.fn(),
      retrySearch: vi.fn(),
      fetchBookCover: vi.fn(),
    };

    const wrapper = ({ children }) => (
      <SearchContext.Provider value={mockContextValue}>
        {children}
      </SearchContext.Provider>
    );

    const { result } = renderHook(() => useSearch(), { wrapper });

    expect(result.current).toBeDefined();
    expect(result.current).toEqual(mockContextValue);
  });

  it("returns all expected properties from context", () => {
    const mockContextValue = {
      searchResults: [{ key: "book1", title: "Test Book" }],
      loading: false,
      error: null,
      hasSearched: true,
      more: true,
      currentQuery: "javascript",
      searchBooks: vi.fn(),
      retrySearch: vi.fn(),
      fetchBookCover: vi.fn(),
    };

    const wrapper = ({ children }) => (
      <SearchContext.Provider value={mockContextValue}>
        {children}
      </SearchContext.Provider>
    );

    const { result } = renderHook(() => useSearch(), { wrapper });

    expect(result.current.searchResults).toEqual(
      mockContextValue.searchResults
    );
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.hasSearched).toBe(true);
    expect(result.current.more).toBe(true);
    expect(result.current.currentQuery).toBe("javascript");
    expect(result.current.searchBooks).toBe(mockContextValue.searchBooks);
    expect(result.current.retrySearch).toBe(mockContextValue.retrySearch);
    expect(result.current.fetchBookCover).toBe(mockContextValue.fetchBookCover);
  });

  it("throws error when used outside SearchProvider", () => {
    // Suppress console.error for this test
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => {
      renderHook(() => useSearch());
    }).toThrow("useSearch must be used within a SearchProvider");

    consoleErrorSpy.mockRestore();
  });

  it("throws correct error message", () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    try {
      renderHook(() => useSearch());
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toBe(
        "useSearch must be used within a SearchProvider"
      );
    }

    consoleErrorSpy.mockRestore();
  });

  it("throws error when context value is null", () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const wrapper = ({ children }) => (
      <SearchContext.Provider value={null}>{children}</SearchContext.Provider>
    );

    expect(() => {
      renderHook(() => useSearch(), { wrapper });
    }).toThrow("useSearch must be used within a SearchProvider");

    consoleErrorSpy.mockRestore();
  });

  it("throws error when context value is undefined", () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const wrapper = ({ children }) => (
      <SearchContext.Provider value={undefined}>
        {children}
      </SearchContext.Provider>
    );

    expect(() => {
      renderHook(() => useSearch(), { wrapper });
    }).toThrow("useSearch must be used within a SearchProvider");

    consoleErrorSpy.mockRestore();
  });

  it("returns context with loading state", () => {
    const mockContextValue = {
      searchResults: [],
      loading: true,
      error: null,
      hasSearched: true,
      more: false,
      currentQuery: "react",
      searchBooks: vi.fn(),
      retrySearch: vi.fn(),
      fetchBookCover: vi.fn(),
    };

    const wrapper = ({ children }) => (
      <SearchContext.Provider value={mockContextValue}>
        {children}
      </SearchContext.Provider>
    );

    const { result } = renderHook(() => useSearch(), { wrapper });

    expect(result.current.loading).toBe(true);
  });

  it("returns context with error state", () => {
    const errorMessage = "Failed to fetch books";
    const mockContextValue = {
      searchResults: [],
      loading: false,
      error: errorMessage,
      hasSearched: true,
      more: false,
      currentQuery: "test",
      searchBooks: vi.fn(),
      retrySearch: vi.fn(),
      fetchBookCover: vi.fn(),
    };

    const wrapper = ({ children }) => (
      <SearchContext.Provider value={mockContextValue}>
        {children}
      </SearchContext.Provider>
    );

    const { result } = renderHook(() => useSearch(), { wrapper });

    expect(result.current.error).toBe(errorMessage);
  });

  it("returns context with search results", () => {
    const mockBooks = [
      { key: "book1", title: "Book One" },
      { key: "book2", title: "Book Two" },
    ];

    const mockContextValue = {
      searchResults: mockBooks,
      loading: false,
      error: null,
      hasSearched: true,
      more: false,
      currentQuery: "books",
      searchBooks: vi.fn(),
      retrySearch: vi.fn(),
      fetchBookCover: vi.fn(),
    };

    const wrapper = ({ children }) => (
      <SearchContext.Provider value={mockContextValue}>
        {children}
      </SearchContext.Provider>
    );

    const { result } = renderHook(() => useSearch(), { wrapper });

    expect(result.current.searchResults).toHaveLength(2);
    expect(result.current.searchResults[0].title).toBe("Book One");
  });

  it("provides searchBooks function", () => {
    const mockSearchBooks = vi.fn();
    const mockContextValue = {
      searchResults: [],
      loading: false,
      error: null,
      hasSearched: false,
      more: false,
      currentQuery: "",
      searchBooks: mockSearchBooks,
      retrySearch: vi.fn(),
      fetchBookCover: vi.fn(),
    };

    const wrapper = ({ children }) => (
      <SearchContext.Provider value={mockContextValue}>
        {children}
      </SearchContext.Provider>
    );

    const { result } = renderHook(() => useSearch(), { wrapper });

    expect(typeof result.current.searchBooks).toBe("function");
    expect(result.current.searchBooks).toBe(mockSearchBooks);
  });

  it("provides fetchBookCover function", () => {
    const mockFetchBookCover = vi.fn();
    const mockContextValue = {
      searchResults: [],
      loading: false,
      error: null,
      hasSearched: false,
      more: false,
      currentQuery: "",
      searchBooks: vi.fn(),
      retrySearch: vi.fn(),
      fetchBookCover: mockFetchBookCover,
    };

    const wrapper = ({ children }) => (
      <SearchContext.Provider value={mockContextValue}>
        {children}
      </SearchContext.Provider>
    );

    const { result } = renderHook(() => useSearch(), { wrapper });

    expect(typeof result.current.fetchBookCover).toBe("function");
    expect(result.current.fetchBookCover).toBe(mockFetchBookCover);
  });
});
