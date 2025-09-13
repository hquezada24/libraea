import { useState } from "react";
import { SearchContext } from "./SearchContext";

export const SearchProvider = ({ children }) => {
  const RESULTS_PER_PAGE = 10;
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [more, setMore] = useState(false);

  const searchBooks = async (searchQuery, pageNum = 1) => {
    setLoading(true);
    try {
      const offset = (pageNum - 1) * RESULTS_PER_PAGE;
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(
          searchQuery
        )}&limit=${RESULTS_PER_PAGE}&offset=${offset}`
      );

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const BookData = await response.json();

      // If it's the first page, replace the results. If it's a subsequent page, append them.
      if (pageNum === 1) {
        setSearchResults(BookData.docs);
      } else {
        setSearchResults((prevResults) => [...prevResults, ...BookData.docs]);
      }

      // Check if there are more results to load
      // numFound is the total number of matches found
      setMore(BookData.offset + BookData.docs.length < BookData.numFound);

      console.log(BookData);
      setError(null); // Clear any previous errors
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const value = {
    searchResults,
    loading,
    error,
    more,
    searchBooks,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};
