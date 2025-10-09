// SearchProvider.test.jsx
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import React from "react";
import { SearchProvider } from "./SearchProvider";
import { SearchContext } from "./SearchContext";

const renderSearchHook = () =>
  renderHook(() => React.useContext(SearchContext), {
    wrapper: ({ children }) => <SearchProvider>{children}</SearchProvider>,
  });

describe("SearchProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("provides default values", () => {
    const { result } = renderSearchHook();

    expect(result.current.searchResults).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.more).toBe(false);
    expect(result.current.hasSearched).toBe(false);
    expect(result.current.currentQuery).toBe("");
    expect(result.current.RESULTS_PER_PAGE).toBe(10);
  });

  it("sets error if query is empty", async () => {
    const { result } = renderSearchHook();

    act(() => {
      result.current.searchBooks("");
    });

    await waitFor(() => {
      expect(result.current.error).toBe("Please enter a search query");
    });
  });

  it("fetches and sets search results on success", async () => {
    const mockData = {
      docs: [{ key: "OL1", title: "Book 1", author_name: ["Author"] }],
      numFound: 1,
      start: 0,
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderSearchHook();

    await act(async () => {
      await result.current.searchBooks("harry potter");
    });

    await waitFor(() => {
      expect(result.current.searchResults).toHaveLength(1);
      expect(result.current.searchResults[0].title).toBe("Book 1");
      expect(result.current.error).toBe(null);
      expect(result.current.hasSearched).toBe(true);
    });
  });

  it("handles failed fetch", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });

    const { result } = renderSearchHook();

    await act(async () => {
      await result.current.searchBooks("harry potter");
    });

    await waitFor(() => {
      expect(result.current.error).toMatch(/Search failed/);
      expect(result.current.searchResults).toEqual([]);
    });
  });

  it("clears state with clearSearch", async () => {
    const { result } = renderSearchHook();

    act(() => {
      result.current.clearSearch();
    });

    expect(result.current.searchResults).toEqual([]);
    expect(result.current.error).toBe(null);
    expect(result.current.more).toBe(false);
    expect(result.current.hasSearched).toBe(false);
    expect(result.current.currentQuery).toBe("");
  });

  it("retries last search query", async () => {
    const mockData = {
      docs: [{ key: "OL2", title: "Retry Book" }],
      numFound: 1,
      start: 0,
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderSearchHook();

    // Run initial search
    await act(async () => {
      await result.current.searchBooks("retry-test");
    });

    // Retry the search
    await act(async () => {
      await result.current.retrySearch();
    });

    await waitFor(() => {
      expect(result.current.searchResults[0].title).toBe("Retry Book");
    });
  });

  it("fetchBookCover returns valid URL if image exists", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true });

    const { result } = renderSearchHook();

    const url = await result.current.fetchBookCover("OL123M", "M");
    expect(url).toContain("covers.openlibrary.org");
  });

  it("fetchBookCover returns null if image not found", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false });

    const { result } = renderSearchHook();

    const url = await result.current.fetchBookCover("OL123M", "M");
    expect(url).toBeNull();
  });
});
