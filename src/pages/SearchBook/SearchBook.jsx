import { useSearch } from "../../hooks/useSearch";
import { useState, useCallback, useMemo } from "react";
import styles from "./SearchBook.module.css";
import BookCard from "../../components/common/BookCard/BookCard";
import { ScrollRestoration } from "react-router-dom";
import { ChevronDown, RefreshCw } from "lucide-react";
import Button from "../../components/common/Button/Button";

const SearchBook = () => {
  const {
    searchResults,
    loading,
    error,
    hasSearched,
    more,
    currentQuery,
    searchBooks,
    retrySearch,
  } = useSearch();

  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate current page from results length
  const resultsPerPage = 10; // Should match your provider constant
  const totalResults = searchResults.length;
  const estimatedCurrentPage = Math.ceil(totalResults / resultsPerPage);

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !more || !currentQuery) return;

    setLoadingMore(true);
    try {
      const nextPage = estimatedCurrentPage + 1;
      await searchBooks(currentQuery, nextPage);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error("Failed to load more results:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, more, currentQuery, searchBooks, estimatedCurrentPage]);

  // Memoize search stats for performance
  const searchStats = useMemo(() => {
    if (!hasSearched || !searchResults.length) return null;

    return {
      showing: totalResults,
      hasMore: more,
      query: currentQuery,
    };
  }, [hasSearched, totalResults, more, currentQuery, searchResults.length]);

  // Loading state
  if (loading && totalResults === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.loading} role="status" aria-live="polite">
          <div className={styles.loadingSpinner}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p className={styles.loadingText}>Searching for books...</p>
        </div>
      </div>
    );
  }
  // Error state
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error} role="alert">
          <h2 className={styles.errorTitle}>Search Failed</h2>
          <p className={styles.errorMessage}>{error}</p>
          {retrySearch && (
            <button
              onClick={retrySearch}
              className={styles.retryButton}
              type="button"
            >
              <RefreshCw className={styles.retryIcon} />
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }
  // No search performed yet
  if (!hasSearched) {
    return (
      <div className={styles.container}>
        <div className={styles.prompt}>
          <h2 className={styles.promptTitle}>Ready to Explore?</h2>
          <p className={styles.promptText}>
            Use the search bar above to discover your next great read
          </p>
          <div className={styles.searchTips}>
            <h3 className={styles.tipsTitle}>Search Tips:</h3>
            <ul className={styles.tipsList}>
              <li>Try book titles, author names, or subjects</li>
              <li>Use quotes for exact phrases</li>
              <li>Search by ISBN for specific editions</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  // No results found
  if (searchResults.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h2 className={styles.notFoundTitle}>No Books Found</h2>
          <p className={styles.notFoundText}>
            We couldn't find any books matching "{currentQuery}"
          </p>
          <div className={styles.searchSuggestions}>
            <h3 className={styles.suggestionsTitle}>Try:</h3>
            <ul className={styles.suggestionsList}>
              <li>Checking your spelling</li>
              <li>Using fewer or different keywords</li>
              <li>Searching for author names instead of titles</li>
              <li>Using more general terms</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ScrollRestoration />

      {/* Search Results Header */}
      {searchStats && (
        <div className={styles.searchHeader}>
          <h1 className={styles.resultsTitle}>
            Search Results for "{searchStats.query}"
          </h1>
          <p className={styles.resultsSummary}>
            Showing {searchStats.showing} results
            {searchStats.hasMore && " (more available)"}
          </p>
        </div>
      )}
      {/* Results Grid */}
      <div className={styles.results} role="grid" aria-label="Search results">
        {searchResults.map((book, index) => (
          <BookCard
            key={`${book.key}-${index}`} // More stable key
            book={book}
          />
        ))}
      </div>
      {/* Load More Section */}
      {more && (
        <div className={styles.loadMoreSection}>
          <Button
            onClick={handleLoadMore}
            type="button"
            aria-label={
              loadingMore ? "Loading more results..." : "Load more results"
            }
            text={
              loadingMore ? (
                <>
                  <div className={styles.buttonSpinner}></div>
                  Loading More...
                </>
              ) : (
                <>
                  <ChevronDown className={styles.loadMoreIcon} />
                  Load More Results
                </>
              )
            }
          />

          <p className={styles.loadMoreHint}>
            {loadingMore
              ? "Finding more books for you..."
              : "Click to see more results"}
          </p>
        </div>
      )}

      {/* End of Results Message */}
      {!more && searchResults.length > resultsPerPage && (
        <div className={styles.endMessage}>
          <p>You've reached the end of the search results</p>
          <p className={styles.endMessageHint}>
            Try a different search to discover more books
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBook;
