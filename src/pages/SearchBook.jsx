import { useSearch } from "../hooks/useSearch";
import BookCard from "../components/common/BookCard/BookCard";

const SearchBook = () => {
  const { searchResults, loading, error } = useSearch();
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (searchResults.length === 0) return <div>No books found.</div>;

  console.log(searchResults);

  return (
    <div className="">
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
