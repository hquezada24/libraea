import { useSearch } from "../../hooks/useSearch";
import styles from "./SearchBook.module.css";
import BookCard from "../../components/common/BookCard/BookCard";

const SearchBook = () => {
  const { searchResults, loading, error } = useSearch();
  if (loading)
    return (
      <div className={styles.loading}>
        <span></span>
      </div>
    );
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (searchResults.length === 0)
    return <div className={styles.notFound}>No books found.</div>;

  return (
    <div className={styles.results}>
      {searchResults.map((book) => {
        return (
          <BookCard
            key={book.key}
            title={book.title}
            author={book.author_name}
            year={book.first_publish_year}
          />
        );
      })}
    </div>
  );
};

export default SearchBook;
