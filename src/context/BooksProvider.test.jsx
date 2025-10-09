// BooksProvider.test.jsx
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { BooksProvider } from "./BooksProvider";
import { useBooks } from "../hooks/useBooks";

describe("BooksProvider", () => {
  const STORAGE_KEY = "libraea_saved_books";

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Suppress console.error for tests
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  const wrapper = ({ children }) => <BooksProvider>{children}</BooksProvider>;

  const mockBook = {
    key: "/works/OL123W",
    title: "Test Book",
    author_name: ["Test Author"],
    first_publish_year: 2020,
    cover_edition_key: "OL123M",
    cover_i: 12345,
  };

  const mockSearchQuery = {
    id: "search-123",
    query: "javascript",
    timestamp: "2024-01-01T00:00:00.000Z",
    type: "search",
  };

  it("provides initial empty state", () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    expect(result.current.favorites).toEqual([]);
    expect(result.current.wantToRead).toEqual([]);
    expect(result.current.recentlySearched).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it("sets isLoaded to true after initialization", async () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });
  });

  it("adds book to favorites", async () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.addToFavorites(mockBook);
    });

    await waitFor(() => {
      expect(result.current.favorites).toHaveLength(1);
      expect(result.current.favorites[0].key).toBe(mockBook.key);
    });
  });

  it("removes book from favorites", async () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.addToFavorites(mockBook);
    });

    await waitFor(() => {
      expect(result.current.favorites).toHaveLength(1);
    });

    act(() => {
      result.current.removeFromFavorites(mockBook.key);
    });

    await waitFor(() => {
      expect(result.current.favorites).toHaveLength(0);
    });
  });

  it("does not add duplicate favorites", async () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.addToFavorites(mockBook);
      result.current.addToFavorites(mockBook);
    });

    await waitFor(() => {
      expect(result.current.favorites).toHaveLength(1);
    });
  });

  it("adds book to want to read", async () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.addToWantToRead(mockBook);
    });

    await waitFor(() => {
      expect(result.current.wantToRead).toHaveLength(1);
      expect(result.current.wantToRead[0].key).toBe(mockBook.key);
    });
  });

  it("removes book from want to read", async () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.addToWantToRead(mockBook);
    });

    await waitFor(() => {
      expect(result.current.wantToRead).toHaveLength(1);
    });

    act(() => {
      result.current.removeFromWantToRead(mockBook.key);
    });

    await waitFor(() => {
      expect(result.current.wantToRead).toHaveLength(0);
    });
  });

  it("does not add duplicate want to read books", async () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.addToWantToRead(mockBook);
      result.current.addToWantToRead(mockBook);
    });

    await waitFor(() => {
      expect(result.current.wantToRead).toHaveLength(1);
    });
  });

  it("checks if book is in favorites", async () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    expect(result.current.isFavorite(mockBook.key)).toBe(false);

    act(() => {
      result.current.addToFavorites(mockBook);
    });

    await waitFor(() => {
      expect(result.current.isFavorite(mockBook.key)).toBe(true);
    });
  });

  it("checks if book is in want to read", async () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    expect(result.current.isInWantToRead(mockBook.key)).toBe(false);

    act(() => {
      result.current.addToWantToRead(mockBook);
    });

    await waitFor(() => {
      expect(result.current.isInWantToRead(mockBook.key)).toBe(true);
    });
  });

  it("adds to recently searched", async () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.addToRecentlySearched(mockSearchQuery);
    });

    await waitFor(() => {
      expect(result.current.recentlySearched).toHaveLength(1);
      expect(result.current.recentlySearched[0].query).toBe("javascript");
    });
  });

  it("limits recently searched to 5 items", async () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      for (let i = 0; i < 7; i++) {
        result.current.addToRecentlySearched({
          id: `search-${i}`,
          query: `query-${i}`,
          timestamp: new Date().toISOString(),
          type: "search",
        });
      }
    });

    await waitFor(() => {
      expect(result.current.recentlySearched).toHaveLength(5);
    });
  });

  it("adds most recent search to beginning of list", async () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    const firstQuery = {
      id: "search-1",
      query: "first",
      timestamp: "2024-01-01",
      type: "search",
    };

    const secondQuery = {
      id: "search-2",
      query: "second",
      timestamp: "2024-01-02",
      type: "search",
    };

    act(() => {
      result.current.addToRecentlySearched(firstQuery);
      result.current.addToRecentlySearched(secondQuery);
    });

    await waitFor(() => {
      expect(result.current.recentlySearched[0].query).toBe("second");
      expect(result.current.recentlySearched[1].query).toBe("first");
    });
  });

  it("persists data to localStorage", async () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.addToFavorites(mockBook);
    });

    await waitFor(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored);
      expect(parsed.favorites).toHaveLength(1);
    });
  });

  it("loads data from localStorage on mount", async () => {
    const initialData = {
      favorites: [mockBook],
      wantToRead: [],
      recentlySearched: [],
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));

    const { result } = renderHook(() => useBooks(), { wrapper });

    await waitFor(() => {
      expect(result.current.favorites).toHaveLength(1);
      expect(result.current.favorites[0].key).toBe(mockBook.key);
    });
  });

  it("sanitizes book data before storing", async () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    const unsanitizedBook = {
      ...mockBook,
      extraField: "should be removed",
      anotherField: "also removed",
    };

    act(() => {
      result.current.addToFavorites(unsanitizedBook);
    });

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored.favorites[0]).not.toHaveProperty("extraField");
      expect(stored.favorites[0]).toHaveProperty("key");
      expect(stored.favorites[0]).toHaveProperty("title");
    });
  });

  it("handles missing book data gracefully", async () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    const incompleteBook = {
      key: "/works/incomplete",
    };

    act(() => {
      result.current.addToFavorites(incompleteBook);
    });

    await waitFor(() => {
      expect(result.current.favorites[0].title).toBe("Unknown Title");
      expect(result.current.favorites[0].author_name).toEqual([
        "Unknown Author",
      ]);
    });
  });

  it("sets error when adding book without key", async () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.addToFavorites({ title: "No Key" });
    });

    await waitFor(() => {
      expect(result.current.error).toBe("Invalid book data");
    });
  });

  it("clears favorites list", async () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.addToFavorites(mockBook);
    });

    await waitFor(() => {
      expect(result.current.favorites).toHaveLength(1);
    });

    act(() => {
      result.current.clearList("favorites");
    });

    await waitFor(() => {
      expect(result.current.favorites).toHaveLength(0);
    });
  });

  it("sets error when clearing invalid list", async () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.clearList("invalidList");
    });

    await waitFor(() => {
      expect(result.current.error).toBe("Invalid list name");
    });
  });

  it("handles localStorage errors gracefully", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Mock localStorage to throw error
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Storage error");
    });

    const { result } = renderHook(() => useBooks(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  it("ignores recently searched without id", async () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.addToRecentlySearched({ query: "no id" });
    });

    await waitFor(() => {
      expect(result.current.recentlySearched).toHaveLength(0);
    });
  });

  it("ignores remove operations with no key", async () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.addToFavorites(mockBook);
    });

    await waitFor(() => {
      expect(result.current.favorites).toHaveLength(1);
    });

    act(() => {
      result.current.removeFromFavorites(null);
    });

    await waitFor(() => {
      expect(result.current.favorites).toHaveLength(1);
    });
  });

  it("checks if query is in recently searched", async () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    expect(result.current.isInRecentlySearched(mockSearchQuery.id)).toBe(false);

    act(() => {
      result.current.addToRecentlySearched(mockSearchQuery);
    });

    await waitFor(() => {
      expect(result.current.isInRecentlySearched(mockSearchQuery.id)).toBe(
        true
      );
    });
  });
});
