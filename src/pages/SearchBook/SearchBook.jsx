import { useSearch } from "../../hooks/useSearch";
import styles from "./SearchBook.module.css";
import BookCard from "../../components/common/BookCard/BookCard";
import { ScrollRestoration } from "react-router-dom";

const SearchBook = () => {
  const { searchResults, loading, error, hasSearched } = useSearch();
  if (loading)
    return (
      <div className={styles.loading}>
        <span></span>
      </div>
    );
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!hasSearched) {
    return (
      <div className={styles.prompt}>
        Search for books using the search bar above
      </div>
    );
  }
  if (searchResults.length === 0)
    return <div className={styles.notFound}>No books found.</div>;

  return (
    <div className={styles.results}>
      <ScrollRestoration />
      {searchResults.map((book) => {
        return <BookCard key={book.key} book={book} />;
      })}
    </div>
  );
};

export default SearchBook;
