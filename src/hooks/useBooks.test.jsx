// useBooks.test.jsx
// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useBooks } from "./useBooks";
import { BooksContext } from "../context/BooksContext";

describe("useBooks hook", () => {
  it("returns context value when used within BooksProvider", () => {
    const mockContextValue = {
      favorites: [],
      wantToRead: [],
      recentlySearched: [],
      addToFavorites: vi.fn(),
      removeFromFavorites: vi.fn(),
      addToWantToRead: vi.fn(),
      removeFromWantToRead: vi.fn(),
      isFavorite: vi.fn(),
      isInWantToRead: vi.fn(),
      addToRecentlySearched: vi.fn(),
      isLoaded: true,
      error: null,
    };

    const wrapper = ({ children }) => (
      <BooksContext.Provider value={mockContextValue}>
        {children}
      </BooksContext.Provider>
    );

    const { result } = renderHook(() => useBooks(), { wrapper });

    expect(result.current).toBeDefined();
    expect(result.current).toEqual(mockContextValue);
    expect(result.current).toHaveProperty("favorites");
    expect(result.current).toHaveProperty("wantToRead");
    expect(result.current).toHaveProperty("addToFavorites");
  });

  it("throws error when used outside BooksProvider", () => {
    // Suppress console.error for this test
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => {
      renderHook(() => useBooks());
    }).toThrow("useBooks must be used within a BooksProvider");

    consoleErrorSpy.mockRestore();
  });

  it("throws error when context value is null", () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const wrapper = ({ children }) => (
      <BooksContext.Provider value={null}>{children}</BooksContext.Provider>
    );

    expect(() => {
      renderHook(() => useBooks(), { wrapper });
    }).toThrow("useBooks must be used within a BooksProvider");

    consoleErrorSpy.mockRestore();
  });

  it("throws error when context value is undefined", () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const wrapper = ({ children }) => (
      <BooksContext.Provider value={undefined}>
        {children}
      </BooksContext.Provider>
    );

    expect(() => {
      renderHook(() => useBooks(), { wrapper });
    }).toThrow("useBooks must be used within a BooksProvider");

    consoleErrorSpy.mockRestore();
  });

  it("returns all expected properties from context", () => {
    const mockContextValue = {
      favorites: [{ key: "book1", title: "Test Book" }],
      wantToRead: [{ key: "book2", title: "Another Book" }],
      recentlySearched: [{ query: "test", timestamp: "2024-01-01" }],
      addToFavorites: vi.fn(),
      removeFromFavorites: vi.fn(),
      addToWantToRead: vi.fn(),
      removeFromWantToRead: vi.fn(),
      isFavorite: vi.fn(),
      isInWantToRead: vi.fn(),
      addToRecentlySearched: vi.fn(),
      isLoaded: true,
      error: null,
    };

    const wrapper = ({ children }) => (
      <BooksContext.Provider value={mockContextValue}>
        {children}
      </BooksContext.Provider>
    );

    const { result } = renderHook(() => useBooks(), { wrapper });

    expect(result.current.favorites).toEqual(mockContextValue.favorites);
    expect(result.current.wantToRead).toEqual(mockContextValue.wantToRead);
    expect(result.current.recentlySearched).toEqual(
      mockContextValue.recentlySearched
    );
    expect(result.current.addToFavorites).toBe(mockContextValue.addToFavorites);
    expect(result.current.isLoaded).toBe(true);
    expect(result.current.error).toBe(null);
  });
});
