import { useState, useCallback, useMemo } from "react";
import { SearchContext } from "./SearchContext";

export const SearchProvider = ({ children }) => {
  const RESULTS_PER_PAGE = 10;
  const BASE_URL = "https://openlibrary.org";
  const COVER_BASE_URL = "https://covers.openlibrary.org";

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [more, setMore] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");

  // Error handler utility
  const handleError = (error, context) => {
    console.error(`${context}:`, error);
    const message =
      error.message || `An error occurred during ${context.toLowerCase()}`;
    setError(message);
  };

  const searchBooks = useCallback(
    async (searchQuery, pageNum = 1) => {
      if (!searchQuery?.trim()) {
        setError("Please enter a search query");
        return;
      }

      setLoading(true);
      setHasSearched(true);
      setCurrentQuery(searchQuery);

      try {
        const offset = (pageNum - 1) * RESULTS_PER_PAGE;
        const url = `${BASE_URL}/search.json?q=${encodeURIComponent(
          searchQuery
        )}&limit=${RESULTS_PER_PAGE}&offset=${offset}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Search failed with status: ${response.status}`);
        }

        const bookData = await response.json();

        // Validate response structure
        if (!bookData.docs || !Array.isArray(bookData.docs)) {
          throw new Error("Invalid response format from API");
        }

        // Process and clean the book data
        const processedBooks = bookData.docs.map((book) => ({
          ...book,
          // Ensure consistent data structure
          title: book.title || "Unknown Title",
          author_name: book.author_name || ["Unknown Author"],
          first_publish_year: book.first_publish_year || null,
          key: book.key || `temp_${Date.now()}_${Math.random()}`,
        }));

        // Update results based on page
        if (pageNum === 1) {
          setSearchResults(processedBooks);
        } else {
          setSearchResults((prevResults) => [
            ...prevResults,
            ...processedBooks,
          ]);
        }

        // Check if there are more results
        const hasMore =
          bookData.numFound &&
          (bookData.start || 0) + processedBooks.length < bookData.numFound;
        setMore(hasMore);

        setError(null); // Clear previous errors
      } catch (err) {
        if (err.name === "AbortError") {
          handleError(new Error("Search request timed out"), "Search");
        } else {
          handleError(err, "Book search");
        }

        // On error, don't clear existing results unless it's a new search
        if (pageNum === 1) {
          setSearchResults([]);
        }
      } finally {
        setLoading(false);
      }
    },
    [RESULTS_PER_PAGE]
  );

  const fetchBookCover = useCallback(async (olid, size = "M") => {
    if (!olid) return null;

    // Validate size parameter
    const validSizes = ["S", "M", "L"];
    const coverSize = validSizes.includes(size) ? size : "M";

    try {
      const url = `${COVER_BASE_URL}/b/olid/${olid}-${coverSize}.jpg`;

      const response = await fetch(url, {
        method: "HEAD", // Only check if the image exists
      });

      if (response.ok) {
        return url;
      } else {
        // Try with cover_i if available
        return null;
      }
    } catch (error) {
      console.warn(`Cover fetch failed for OLID: ${olid}`, error);
      return null;
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setError(null);
    setMore(false);
    setHasSearched(false);
    setCurrentQuery("");
  }, []);

  const retrySearch = useCallback(() => {
    if (currentQuery) {
      searchBooks(currentQuery, 1);
    }
  }, [currentQuery, searchBooks]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      // Data
      searchResults,
      loading,
      error,
      more,
      hasSearched,
      currentQuery,

      // Actions
      searchBooks,
      fetchBookCover,
      clearSearch,
      retrySearch,

      // Constants (useful for components)
      RESULTS_PER_PAGE,
    }),
    [
      searchResults,
      loading,
      error,
      more,
      hasSearched,
      currentQuery,
      searchBooks,
      fetchBookCover,
      clearSearch,
      retrySearch,
      RESULTS_PER_PAGE,
    ]
  );

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};
