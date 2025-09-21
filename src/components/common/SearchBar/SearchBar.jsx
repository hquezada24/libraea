import styles from "./SearchBar.module.css";
import { useState, useCallback, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useSearch } from "../../../hooks/useSearch";
import useMobile from "../../../hooks/useMobile";
import { useNavigate, useLocation } from "react-router-dom";
import { useBooks } from "../../../hooks/useBooks";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);

  const { searchBooks, loading, error } = useSearch();
  const isMobile = useMobile(768);
  const navigate = useNavigate();
  const location = useLocation();
  const { addToRecentlySearched } = useBooks();

  useEffect(() => {
    // Clear search input when navigating away from search page
    if (location.pathname !== "/search") {
      setQuery("");
    }
  }, [location.pathname]);

  // Auto-focus on search input with keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl/Cmd + K to focus search
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }

      // Escape to blur search
      if (
        event.key === "Escape" &&
        document.activeElement === inputRef.current
      ) {
        inputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleChange = useCallback((e) => {
    setQuery(e.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setQuery("");
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const trimmedQuery = query.trim();
      if (!trimmedQuery) {
        inputRef.current?.focus();
        return;
      }

      if (trimmedQuery.length < 2) {
        // Could show a toast/error message here
        inputRef.current?.focus();
        return;
      }

      setIsSearching(true);

      try {
        // Add to recently searched before searching
        const searchEntry = {
          type: "search",
          query: trimmedQuery,
          timestamp: new Date().toISOString(),
          id: `search-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };

        addToRecentlySearched(searchEntry);

        // Perform search
        await searchBooks(trimmedQuery);

        // Navigate to search results
        navigate("/search");

        // Blur input on mobile to hide keyboard
        if (isMobile) {
          inputRef.current?.blur();
        }
      } catch (error) {
        console.error("Search failed:", error);
        // Keep focus on input for retry
        inputRef.current?.focus();
      } finally {
        setIsSearching(false);
      }
    },
    [query, searchBooks, navigate, addToRecentlySearched, isMobile]
  );

  const isLoading = loading || isSearching;
  const placeholder = isMobile
    ? "Search books..."
    : "Search for your next adventure... (Ctrl+K)";

  return (
    <div className={styles.search} role="search">
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <div className={styles.inputContainer}>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={handleChange}
            placeholder={placeholder}
            className={`${styles.searchInput} ${
              error ? styles.errorInput : ""
            }`}
            disabled={isLoading}
            aria-label="Search for books"
            aria-describedby={error ? "search-error" : undefined}
            autoComplete="off"
            spellCheck="false"
            maxLength={200}
          />

          {query && (
            <button
              type="button"
              onClick={handleClearSearch}
              className={styles.clearButton}
              aria-label="Clear search"
              disabled={isLoading}
            >
              <X className={styles.clearIcon} aria-hidden="true" />
            </button>
          )}
        </div>

        <button
          type="submit"
          className={`${styles.searchButton} ${
            isLoading ? styles.searching : ""
          }`}
          disabled={isLoading || !query.trim()}
          aria-label={isLoading ? "Searching..." : "Search books"}
        >
          {isLoading ? (
            <div className={styles.spinner} aria-hidden="true"></div>
          ) : (
            <Search className={styles.searchIcon} aria-hidden="true" />
          )}
        </button>
      </form>

      {error && (
        <div
          id="search-error"
          className={styles.errorMessage}
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
